import logging
from sys import stdout
from json import loads

# Logging
logging.basicConfig(stream=stdout, format='%(asctime)s %(message)s')
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)


class Ocr_text(object):
    """

    """

    def __init__(self, answer_content):
        logger.debug("Parsing full text")
        self.answer_content = loads(answer_content)
        self.full_text = self._parse_full_text()
        logger.debug("Full text parsed")

    def _parse_full_text(self):
        return self.answer_content['responses'][0]['fullTextAnnotation'][
            'text']

    def get_full_text(self):
        return self.full_text