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
        self.html_parser_url = "http://35.230.54.110:3031"
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
                  headers={"Content-Type": "application/json"},
                  deadline=60
                  )

        if r.status_code < 200 or r.status_code > 299:
            logger.error("HTML parser Status code is {}".format(
                r.status_code))
            raise HTMLFormattingServiceException(
                "Status code = {}".format(r.status_code))

        logger.info("HTML received")
        return b, r.content


if __name__ == "__main__":
    js = {"width": 3457, "points": [{"from_y": 0, "from_x": 1778, "word": "me locations are open 40 weeks a year with the exception of the official holidays and our study day vo\nadvancement of our employees, in 2018 this Wednesday is 11 apri\nr holidays and our study day no reduction is granted. It is also not possible to exchange these days.\noverview of the closing days please refer to our website www.kinderdam.nl", "to_x": 2278, "to_y": 4637}, {"from_y": 5, "from_x": 2363, "word": "school provision with vve, but with one contract you can use the free hours and this to where\nto give.", "to_x": 2674, "to_y": 4637}, {"from_y": 8, "from_x": 2608, "word": "and you are eligible for a Target Group definition:\nBy signing this agreement, you agree to be aware of the fact that you participate in", "to_x": 2938, "to_y": 4617}, {"from_y": 10, "from_x": 2959, "word": "e rates apply to the remaining months of the current calendar year. As of January 1 of\nIn the year, the rates as applicable for that year are or will be determined", "to_x": 3315, "to_y": 4565}, {"from_y": 23, "from_x": 353, "word": "this placement agreement is the General Terms and Conditions of the Childcare Sector Organization of\npassing. The parent agrees to the General Agreement by signing this placement agreement\nor Values \u200b\u200band the rules on childcare as formulated in the booklet View in the world of KindeRdam\nyou can read them in your parent portal Mijn KindeRdam, under the tab information.", "to_x": 892, "to_y": 4586}, {"from_y": 41, "from_x": 1440, "word": "jer is known that the aforementioned day nursery / playgroup, is part of the\nand the KindeRdam policy provisions.", "to_x": 1668, "to_y": 4128}, {"from_y": 43, "from_x": 960, "word": "deRdam declares that it will treat the details provided by you in a confidential manner.\ndata will not be made available to third parties without your written consent\nexceptions provided for by law.", "to_x": 1335, "to_y": 4664}, {"from_y": 1485, "from_x": 3379, "word": "not", "to_x": 3498, "to_y": 1570}, {"from_y": 1809, "from_x": 3327, "word": "sty day 4vdo-Tba/-48a8-albe-bdc691b7f52c?fileld=9f7676b8-cdea ", "to_x": 3493, "to_y": 4638}], "height": 4609}
    from requests import post
    r = post("http://35.230.54.110:3031", json=js)
