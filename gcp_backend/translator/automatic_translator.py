from translator import Translator
from google.appengine.api.urlfetch import fetch, POST
import logging
from sys import stdout
from json import load, dumps, loads, dump

# Logging
logging.basicConfig(stream=stdout, format='%(asctime)s %(message)s')
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)


class AutomaticTranslator(Translator):
    """

    """

    def __init__(self, input_language, output_language):
        super(AutomaticTranslator, self).__init__(input_language,
                                                  output_language)

        self.input_language = input_language
        self.out_language = output_language
        logger.debug("Input language = {}, output language = {}".format(
            input_language, output_language
        ))
        self.text = ""
        self.api_key = "AIzaSyB5KLbSquVl7pYsYjVpCOhOsrqjYTbuf-8"
        self.url = "https://translation.googleapis.com/language/translate/v2" \
                   "?key={}".format(self.api_key)
        self.DEBUG = True
        logger.debug("Init done")

    def set_text(self, text):
        logger.debug("Text to translate is (50 chars): {}".format(text[0:50]))
        self.text = text

    def _fixture(self):
        logger.debug("DEBUG mode enabled. Returning translation result from "
                     "fixture")
        with open("fixture/test_translation.json", "r") as f:
            resp = load(f)
        return resp['data']['translations'][0]['translatedText'].encode("utf-8")

    def get_translation(self):
        logger.debug("Requesting translation from {} to {}".format(
            self.input_language, self.out_language))
        if self.DEBUG:
            return self._fixture()

        try:
            resp = fetch(self.url,
                         payload=dumps(self._build_payload()),
                         method=POST,
                         headers={"Content-Type": "application/json"}
                         )
        except Exception as ex:
            logger.error("Caught exception while fetching translation.")
            logger.error("Exception = {}".format(ex))
            return None

        if resp.status_code < 200 or resp.status_code > 299:
            logger.error("Status code is {}".format(resp.status_code))
            return None

        resp_json = loads(resp.content)
        logger.debug("Got an answer back")
        logger.debug("Translation received {}".format(resp_json))

        return resp_json['data']['translations'][0]['translatedText'].encode(
            "utf-8")

    def _build_payload(self):
        logger.debug("Building payload")
        logger.debug("Payload is {}".format({
            'q': self.text[0:20],
            'target': self.out_language,
            'source': self.input_language,
            'format': 'text'
        }))
        return {
            'q': self.text,
            'target': self.out_language,
            'source': self.input_language,
            'format': 'text'
        }
