from google.appengine.api.urlfetch import fetch, POST
import logging
from sys import stdout
from ocr_parser import OCRParser
from custom_exceptions.custom_exceptions import UnknownOCRException, \
    NoTextFoundException

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

    def ocr(self):
        try:
            return self._ocr(self.image.get_image())

        except UnknownOCRException:
            if self.image.corrected_perspective is None:
                logger.error("UnknownOCRException and perspective was not "
                             "corrected. Re-raise.")
                raise
            else:
                logger.error("UnknownOCRException and perspective was "
                             "corrected. Try again with original input")
                return self._ocr(self.image.input_b64)

        except NoTextFoundException:
            if self.image.corrected_perspective is None:
                logger.error("NoTextFoundException and perspective was not "
                             "corrected. Re-raise.")
                raise
            else:
                logger.error("NoTextFoundException and perspective was "
                             "corrected. Try again with original input")
                return self._ocr(self.image.input_b64)

        except Exception as ex:
            logger.error("Unexpected error {}. Re-raising".format(ex))
            raise

    def _ocr(self, im):
        ans = self._get_ocr_answer(
            self._get_payload(im)
        )
        return OCRParser(ans, 0)

    def _get_payload(self, image):
        return {
            "requests": [
                {
                    "image": {
                        "content": image
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

    def _get_ocr_answer(self, payload):

        logger.debug("Fetching result")
        response = fetch(
            "https://vision.googleapis.com/v1/images:annotate?key=" +
            self.api_key,
            payload=dumps(payload),
            method=POST,
            headers={"Content-Type": "application/json"}
        )

        logger.info("Response status code = {}".format(response.status_code))
        if 200 <= response.status_code < 300:
            return response.content
        else:
            logger.error("OCR answer with status "
                         "code = {}".format(response.status_code))
            logger.error(("respose = {}".format(response.content)))
            raise UnknownOCRException("OCR Error")


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
