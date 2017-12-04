from __future__ import print_function
import sys

sys.path.append("lib")
from flask import Flask, request, jsonify
from request_parser.request_parser import RequestParser
from ocr.ocr import Ocr
from translator.automatic_translator import AutomaticTranslator
from email_generator.sendgrid_mailer import Sendgrid
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
    sg = Sendgrid(parsed_request, human_translation=True)
    status_code, body, headers = sg.send()

    if 200 <= status_code < 300:
        return Answer(human_requested=True).get_answer()
    else:
        logger.exception("Email not sent with status code = {}, "
                         "body = {}, "
                         "headers = {}".format(status_code, body, headers))
        raise Exception("Something went wrong with the e-mail! Check logs")


def request_automatic_translation(parsed_request):
    logger.info("Call OCR service")
    ocr = Ocr(parsed_request.get_image(), parsed_request.get_input_language())
    logger.info("Call Translation service")
    translator = AutomaticTranslator(parsed_request.get_input_language(),
                                     parsed_request.get_output_language())
    translator.set_text(ocr.get_full_text())
    translation = translator.get_translation()

    sg = Sendgrid(parsed_request, ocr.get_full_text(), translation)
    status_code, body, headers = sg.send()

    if 200 <= status_code < 300:
        return Answer(original_text=ocr.get_full_text(),
                      translated_text=translation,
                      email_status=True).get_answer()
    else:
        logger.exception("Email not sent with status code = {}, "
                         "body = {}, "
                         "headers = {}".format(status_code, body, headers))
        raise Exception("Something went wrong with the e-mail! Check logs")
