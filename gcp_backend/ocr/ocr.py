from google.appengine.api.urlfetch import fetch, POST
import logging
from sys import stdout
from PIL import Image, ExifTags
from io import BytesIO
from base64 import b64decode
from ocr_parser import OCRParser
from custom_exceptions.custom_exceptions import UnknownOCRException
from json import dumps

# Logging
logging.basicConfig(stream=stdout, format='%(asctime)s %(message)s')
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)


class Ocr(object):
    """
    Class to handle the OCR process
    """

    def __init__(self, img, in_language):
        self.DEBUG = False
        self.image = img
        self.in_language = in_language
        self.api_key = "AIzaSyB5KLbSquVl7pYsYjVpCOhOsrqjYTbuf-8"

        self._payload = self._get_payload()
        logger.debug("Payload constructed")
        self.ocr_answer = self._get_ocr_answer()
        logger.debug("OCR answer received. Text follows")
        logger.debug(self.ocr_answer.full_text[0:20])

    def _get_payload(self):
        return {
            "requests": [
                {
                    "image": {
                        "content": self.image
                    },
                    "features": [
                        {
                            "type": "DOCUMENT_TEXT_DETECTION"
                        }],
                    "imageContext": {
                        "languageHints": [self.in_language],
                    }
                }
            ]
        }

    @staticmethod
    def _get_fixture():
        logger.debug("DEBUG Mode enabled: reading ocr answer from fixture")
        pass

    def _get_ocr_answer(self):
        if self.DEBUG:
            return self._get_fixture()

        logger.debug("Fetching result")
        response = fetch(
            "https://vision.googleapis.com/v1/images:annotate?key=" +
            self.api_key,
            payload=dumps(self._payload),
            method=POST,
            headers={"Content-Type": "application/json"}
        )

        logger.info("Response status code = {}".format(response.status_code))
        if 200 <= response.status_code < 300:
            return OCRParser(response.content, self.get_orientation(self.image))
        else:
            logger.error("OCR answer with status "
                         "code = {}".format(response.status_code))
            raise UnknownOCRException("OCR Error")

    @staticmethod
    def get_orientation(im):
        image = Image.open(BytesIO(b64decode(im)))
        orientation = ""

        for orientations in ExifTags.TAGS.keys():
            if ExifTags.TAGS[orientations] == 'Orientation':
                orientation = orientations

        if image._getexif() is None:
            return 0

        exif = dict(image._getexif().items())
        if orientation not in exif:
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


if __name__ == "__main__":
    from json import load, dumps

    with open("/Users/adamalloul/TNT/downloads/translation_request.json",
              "r") as f:
        t = load(f)
    from requests import post

    payload = {
        "requests": [
            {
                "image": {
                    "content": t['image']
                },
                "features": [
                    {
                        "type": "DOCUMENT_TEXT_DETECTION"
                    }],
                "imageContext": {
                    "languageHints": ["nl"],
                }
            }
        ]
    }
    api_key = "AIzaSyB5KLbSquVl7pYsYjVpCOhOsrqjYTbuf-8"

    r = post(
        "https://vision.googleapis.com/v1/images:annotate?key=" +
        api_key,
        data=dumps(payload)
    )
