from __future__ import print_function
import sys

sys.path.append("lib")
from flask import Flask, request, jsonify
from request_parser.request_parser import RequestParser
from ocr.ocr import Ocr
from translator.human_translator import HumanTranslator
from translator.automatic_translator import AutomaticTranslator
from answer.answer import Answer
import logging
from sys import stdout

# Logging
logging.basicConfig(stream=stdout, format='%(asctime)s %(message)s')
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)

# Flask app
app = Flask(__name__)


@app.route('/request_translation', methods=['POST'])
def translate():
    logger.info("Received a request")

    parsed_request = RequestParser(request.data)
    logger.debug("Request = {}".format(parsed_request))

    if parsed_request.get_human_translation_requested():
        logger.info("Human translation requested")
        return request_human_translation(parsed_request)
    else:
        logger.info("Automatic translation requested")
        return request_automatic_translation(parsed_request)


def request_human_translation(parsed_request):
    translator = HumanTranslator(parsed_request)
    return Answer().get_answer()


def request_automatic_translation(parsed_request):
    ocr = Ocr(parsed_request.get_image(),
              parsed_request.get_input_language(),
              parsed_request.get_output_language())
    translator = AutomaticTranslator(ocr.get_full_text())
    return Answer().get_answer()

#
# if __name__ == "__main__":
#     app.run()
