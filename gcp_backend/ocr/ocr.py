from json import dumps
from google.appengine.api.urlfetch import fetch, POST
from ocr_text import Ocr_text
import logging
from sys import stdout

# Logging
logging.basicConfig(stream=stdout, format='%(asctime)s %(message)s')
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)


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
        self._ocr_text = self._get_ocr_answer()
        logger.debug(("OCR answer received. Text follows"))
        logger.debug(self._ocr_text.get_full_text()[0:20])

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

    def _get_fixture(self):
        logger.debug("DEBUG Mode enabled: reading ocr answer from fixture")
        with open("fixture/test_response_ocr.json", "r") as f:
            return Ocr_text(f.read())

    def _get_ocr_answer(self):
        if self.DEBUG:
            return self._get_fixture()

        response = fetch(
            "https://vision.googleapis.com/v1/images:annotate?key=" +
            self.api_key,
            payload=dumps(self._payload),
            method=POST,
            headers={"Content-Type": "application/json"}
        )

        return Ocr_text(response.content)

    def get_full_text(self):
        return self._ocr_text.get_full_text()