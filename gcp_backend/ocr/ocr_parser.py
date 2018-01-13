from json import load, dump, dumps, loads
from PIL import Image, ExifTags, ImageDraw
from custom_exceptions.custom_exceptions import NoTextFoundException
from io import BytesIO
from base64 import b64decode
import logging
from sys import stdout

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

        for page in self.pages:
            cnt += 1
            page_max_y = page['height']
            page_max_x = page['width']
            out[cnt] = self._extract_blocks(page, page_max_x, page_max_y)

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
                "to_x": page_max_y - max(ys),
                "from_y": page_max_x - max(xs),
                "to_y": page_max_x - min(xs),
                "word": paragraph
            }
        elif self.orientation == 270:
            return {
                "from_x": min(ys),
                "to_x": page_max_y - max(ys),
                "from_y": min(xs),
                "to_y": page_max_x - min(xs),
                "word": paragraph
            }
        elif self.orientation == 180:
            return {
                "from_x": min(xs),
                "to_x": max(xs),
                "from_y": min(ys),
                "to_y": max(ys),
                "word": paragraph
            }

    def _extract_words(self, paragraph):
        p = ""
        xs = []
        ys = []

        for word in paragraph['words']:
            w, xmin, xmax, ymin, ymax = self._extract_symbols(word)
            p += w
            xs += [xmin, xmax]
            ys += [ymin, ymax]

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

def get_orientation(im):
    image = Image.open(BytesIO(b64decode(im)))
    orientation = ""
    logger.debug("Looking for orientation tag")
    for orientations in ExifTags.TAGS.keys():
        if ExifTags.TAGS[orientations] == 'Orientation':
            orientation = orientations

    logger.debug("Getting EXIF items from image")
    try:
        exif = dict(image._getexif().items())
        if exif[orientation] == 3:
            logger.debug("Orientation is 180")
            return 180
        elif exif[orientation] == 6:
            logger.debug("Orientation is 270")
            return 270
        elif exif[orientation] == 8:
            logger.debug("Orientation is 90")
            return 90
        else:
            logger.debug("Orientation is 0")
            return 0
    except:
        logger.info("No orientation found - Assume 0")
        return 0


if __name__ == "__main__":
    with open("../fixture/request_rotation_270.json") as f:
    # with open("../fixture/test_request.json", "r") as f:
        resp = load(f)
        orientation = get_orientation(resp['image'])

    with open("../fixture/request_rotation_270_orc.json", "r") as f:
        resp = f.read()

    ocrparser = OCRParser(resp, orientation)
    parsed_pages = ocrparser.parse_pages()
    with open("/tmp/tmp.json", "w") as f:
        dump(parsed_pages[1], f)

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
    img.save("test.png")