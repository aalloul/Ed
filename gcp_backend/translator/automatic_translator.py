from translator import Translator
from google.appengine.api.urlfetch import fetch, POST
import logging
from sys import stdout
from json import load, dumps, loads, dump
from custom_exceptions.custom_exceptions import UnknownTranslationError, \
    HTMLFormattingServiceException

# Logging
logging.basicConfig(stream=stdout, format='%(asctime)s %(message)s')
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)


class AutomaticTranslator(Translator):
    """

    """

    def __init__(self, input_language, output_language, pages):
        super(AutomaticTranslator, self).__init__(input_language,
                                                  output_language)

        self.input_language = input_language
        self.out_language = output_language
        logger.debug("Input language = {}, output language = {}".format(
            input_language, output_language
        ))
        self.pages = pages
        self.api_key = "AIzaSyB5KLbSquVl7pYsYjVpCOhOsrqjYTbuf-8"
        self.url = "https://translation.googleapis.com/language/translate/v2" \
                   "?key={}".format(self.api_key)
        self.DEBUG = False
        self.html_parser_url = "http://35.197.43.208:3030"
        logger.debug("Init done")

    @staticmethod
    def _fixture():
        logger.debug("DEBUG mode enabled. Returning translation result from "
                     "fixture")
        with open("fixture/test_translation.json", "r") as f:
            resp = load(f)
        return resp['data']['translations'][0]['translatedText'].encode("utf-8")

    def _translate_word(self, word):
        try:
            logger.debug("Fetch start")
            resp = fetch(self.url,
                         payload=dumps(self._build_payload(word)),
                         method=POST,
                         headers={"Content-Type": "application/json"}
                         )
            logger.debug("Fetch done")
        except Exception as ex:
            logger.error("Caught exception while fetching translation.")
            logger.error("Exception = {}".format(ex))
            raise UnknownTranslationError(ex.message)

        if resp.status_code < 200 or resp.status_code > 299:
            logger.error("Status code is {}".format(resp.status_code))
            raise UnknownTranslationError(
                "Status code = {}".format(resp.status_code))

        logger.debug("Load content of fetch result")
        resp_json = loads(resp.content)

        logger.debug("Returning translation")
        return [w['translatedText'].encode("utf-8")
                for w in resp_json['data']['translations']]

    def get_translation(self):
        logger.info("Requesting translation from {} to {}".format(
            self.input_language, self.out_language))

        if self.DEBUG:
            return self._fixture()

        logger.debug("Getting words from pages")
        words_to_translate = [word['word'] for word in self.pages[1]]
        logger.debug("Translating everyone together")
        res = self._translate_word(words_to_translate)

        logger.debug("Updating the pages")
        for ii in range(len(self.pages[1])):
            self.pages[1][ii]['translation'] = res[ii]

        logger.info(" -> Done")

    def _build_payload(self, word):
        return {
            'q': word,
            'target': self.out_language,
            'source': self.input_language,
            'format': 'text'
        }

    def get_html(self):
        out = self.pages[1]
        [e.pop('word') for e in out]
        for e in out:
            e['word'] = e['translation']
        [e.pop('translation') for e in out]

        logger.info("Renamed translation to word")
        b = {
            "points": out,
            "width": self.pages["widths"][0],
            "height": self.pages["heights"][0]
        }

        logger.info("added points level")
        r = fetch(self.html_parser_url,
                  payload=dumps(b),
                  method=POST,
                  headers={"Content-Type": "application/json"}
                  )

        if r.status_code < 200 or r.status_code > 299:
            logger.error("HTML parser Status code is {}".format(
                r.status_code))
            raise HTMLFormattingServiceException(
                "Status code = {}".format(r.status_code))

        logger.info("HTML received")
        return b, r.content
