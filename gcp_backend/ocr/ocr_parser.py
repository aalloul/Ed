from json import loads
from PIL import Image, ImageDraw, ExifTags
from io import BytesIO
from base64 import b64decode
from custom_exceptions.custom_exceptions import NoTextFoundException
import logging
from sys import stdout
from re import match

# Logging
logging.basicConfig(stream=stdout, format='%(asctime)s %(message)s')
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)


class OCRParser(object):

    def __init__(self, ocr_resp, orientation):
        logger.info("Start OCRParser")

        self.ocr_resp = loads(ocr_resp)

        if self.ocr_resp['responses'][0].keys == {}:
            logger.error("No text found in image")
            self.full_text = ""
            raise NoTextFoundException("no_text_found")

        else:
            logger.info("Parsing text from OCR answer")
            self.full_text = self.ocr_resp['responses'][0][
                'fullTextAnnotation']['text']
            logger.debug("full_text done")
            self.pages = self.ocr_resp['responses'][0]['fullTextAnnotation'][
                'pages']
            logger.debug("pages done")
            self.orientation = orientation
            logger.debug("orientation done")
            self.parsed_pages = self.parse_pages()
            logger.debug("pages parsed")

    def parse_pages(self):
        out = {}
        cnt = 0
        heights = []
        widths = []
        for page in self.pages:
            cnt += 1
            page_max_y = page['height']
            page_max_x = page['width']
            out[cnt] = self._extract_blocks(page, page_max_x, page_max_y)
            out[cnt] = self._combine_words(out[cnt])
            out[cnt] = self._shift_all(out[cnt])

            if self.orientation in [0, 180]:
                widths.append(page_max_x)
                heights.append(page_max_y)
            else:
                widths.append(page_max_y)
                heights.append(page_max_x)


        out["heights"] = heights
        out["widths"] = widths

        logger.debug("Pages parsing done")
        return out

    def _extract_blocks(self, page, page_max_x, page_max_y):
        blocks = []
        for block in page['blocks']:
            blocks += self._extract_paragraphs(block, page_max_x, page_max_y)
        return blocks

    def _extract_paragraphs(self, block, page_max_x, page_max_y):
        paragraphs = []

        for paragraph in block['paragraphs']:
            p, xs, ys = self._extract_words(paragraph)
            paragraphs.append(
                self._fix_orientation(p, xs, ys, page_max_x, page_max_y))

        return paragraphs

    def _fix_orientation(self, paragraph, xs, ys, page_max_x, page_max_y):
        if self.orientation == 0:
            return {
                "from_x": min(xs),
                "to_x": max(xs),
                "from_y": min(ys),
                "to_y": max(ys),
                "word": paragraph
            }
        elif self.orientation == 90:
            return {
                "from_x": min(ys),
                "to_x": max(ys),
                "from_y": page_max_x - max(xs),
                "to_y": page_max_x - min(xs),
                "word": paragraph
            }
        elif self.orientation == 270:
            return {
                "from_x": page_max_y - max(ys),
                "to_x": page_max_y - min(ys),
                "from_y": min(xs),
                "to_y": max(xs),
                "word": paragraph
            }
        elif self.orientation == 180:
            return {
                "from_x": page_max_x - max(xs),
                "to_x": page_max_x - min(xs),
                "from_y": min(ys),
                "to_y": max(ys),
                "word": paragraph
            }

    def _shift_all(self, page):
        min_x = min([p["from_x"] for p in page])
        min_y = min([p["from_y"] for p in page])

        page_ = page
        if min_x < 0:
            for p in page_:
                p["from_x"] += abs(min_x)
                p["to_x"] += abs(min_x)

        if min_y < 0:
            for p in page_:
                p["from_y"] += abs(min_y)
                p["to_y"] += abs(min_y)

        return page_

    def _extract_words(self, paragraph):
        logger.debug("_extract_words start")
        p = ""

        logger.debug("Extracting boundingBox for paragraphs")
        tmpx = [v['x'] for v in paragraph['boundingBox']['vertices']]
        xs = [min(tmpx), max(tmpx)]
        tmpy = [v['y'] for v in paragraph['boundingBox']['vertices']]
        ys = [min(tmpy), max(tmpy)]

        for word in paragraph['words']:
            w, xmin, xmax, ymin, ymax = self._extract_symbols(word)
            p += w
            # xs += [xmin, xmax]
            # ys += [ymin, ymax]

        return p, xs, ys

    def _extract_symbols(self, word):
        w = ""
        xs = []
        ys = []

        for symbol in word['symbols']:
            w += symbol['text']
            xs += [s['x'] for s in symbol['boundingBox']['vertices']]
            ys += [s['y'] for s in symbol['boundingBox']['vertices']]

            if "detectedBreak" in symbol['property']:
                if symbol['property']['detectedBreak']['type'] == "HYPHEN":
                    w += "-"
                elif symbol['property']['detectedBreak']['type'] == "EOL_SURE_SPACE":
                    w += "\n"
                else:
                    w += " "

        return w, min(xs), max(xs), min(ys), max(ys)

    @staticmethod
    def _combine_words(words):
        """
        This method tries to combine words that were split because of line
        wrapping. An example would be:
          a piece of flat bread wrapped around a filling and eaten as a sand-
            wich.
        where we assume that "sand" reaches the end of the line and so we have
        to split the word "sandwich" using a soft hyphen.

        The assumption is if a line ends with a hyphen and the next one starts
        with a letter, then they should probably be glued back together.
        :param words: List of 'words' as generated by the :meth
        _extract_paragraphs
        :return: List of JSON object, same format as input.
        """
        tmp = sorted(words, key=lambda x: x['from_y'])

        out = [tmp[0]]
        soft_hyphen = "(.+)([a-z A-Z]-)$"
        starts_with_letters = "^[a-z A-Z](.+)"
        for ii in range(1, len(tmp)):
            if match(soft_hyphen, out[-1]['word']) and \
                    match(starts_with_letters, out[-1]['word']):
                out[-1]['word'] = out[-1]["word"][0:len(out[-1]['word']) - 1]\
                                  + tmp[ii]['word']
                out[-1]['from_x'] = min(out[-1]["from_x"], tmp[ii]["from_x"])
                out[-1]['from_y'] = min(out[-1]["from_y"], tmp[ii]["from_y"])
                out[-1]['to_x'] = max(out[-1]["to_x"], tmp[ii]["to_x"])
                out[-1]['to_x'] = max(out[-1]["to_x"], tmp[ii]["to_x"])
            else:
                out.append(tmp[ii])
        return out


if __name__ == "__main__":

    def get_orientation(im):
        image = Image.open(BytesIO(im))
        orientation = ""

        for orientations in ExifTags.TAGS.keys():
            if ExifTags.TAGS[orientations] == 'Orientation':
                orientation = orientations

        if image._getexif() is None:
            return 0

        exif = dict(image._getexif().items())
        if not exif.has_key(orientation):
            logger.info("Image has no orientation TAG")
            return 0

        if exif[orientation] == 3:
            logger.info("Image has an orientation of 180")
            return 180
        elif exif[orientation] == 6:
            logger.info("Image has an orientation of 270")
            return 270
        elif exif[orientation] == 8:
            logger.info("Image has an orientation of 90")
            return 90
        else:
            logger.info("Image has an orientation of 0")
            return 0

    with open("../fixture/tmp.jpeg", "rb") as f:
        im = f.read()
        orientation = get_orientation(im)

    with open("../fixture/tmp.json", "r") as f:
        resp = f.read()

    ocrparser = OCRParser(resp, orientation)
    parsed_pages = ocrparser.parse_pages()
    # parsed_pages[1] = combine_words(parsed_pages[1])

    resp = loads(resp)
    x = resp['responses'][0]['fullTextAnnotation']['pages'][0]['width']
    y = resp['responses'][0]['fullTextAnnotation']['pages'][0]['height']
    if orientation == 0:
        img=Image.new("RGB", (x,y),"white")
    elif orientation == 90:
        img = Image.new("RGB", (y, x), "white")
    elif orientation == 270:
        img = Image.new("RGB", (y, x), "white")
    draw = ImageDraw.Draw(img)
    for line in parsed_pages[1]:
        draw.text((line['from_x'], line['from_y']),line['word'].encode("utf-8"),
                  'black')

    draw = ImageDraw.Draw(img)
    img.save("../fixture/test.png")