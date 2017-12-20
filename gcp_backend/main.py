from __future__ import print_function
from flask import Flask, request
from request_parser.request_parser import RequestParser
from ocr.ocr import Ocr
from translator.automatic_translator import AutomaticTranslator
from email_generator.sendgrid_mailer import Sendgrid
from answer.answer import Answer
import logging
from sys import stdout
from analytics.analytics import Analytics
from time import time
from custom_exceptions.custom_exceptions import NoTextFoundException

# Logging
logging.basicConfig(stream=stdout, format='%(asctime)s %(message)s')
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)


def request_human_translation(parsed_request, reporter):
    start = time()

    sg = Sendgrid(parsed_request, human_translation=True)
    status_code, body, headers = sg.send()

    if 200 <= status_code < 300:
        reporter.add_event("email_sent_in_sec", time() - start)
        return Answer(human_requested=True).get_answer()
    else:
        reporter.add_event("email_send_exception_status_code", status_code)
        reporter.add_event("email_send_exception_body", body)
        reporter.add_event("email_send_exception_headers", headers)

        logger.exception("Email not sent with status code = {}, "
                         "body = {}, "
                         "headers = {}".format(status_code, body, headers))
        raise Exception("Something went wrong with the e-mail! Check logs")


def request_automatic_translation(parsed_request, reporter):
    logger.info("Call OCR service")
    start_ocr = time()
    try:
        ocr = Ocr(parsed_request.get_image(),
                  parsed_request.get_input_language())
    except NoTextFoundException as ex:
        logger.error("No text was found in the provided image")
        reporter.add_event("exception", "no_text_found_in_image")
        return Answer(exception=ex).get_answer()

    reporter.add_event("ocr_processing_time", time() - start_ocr)
    reporter.add_event("n_chars_image", len(ocr.get_full_text()))
    reporter.add_extracted_text(ocr.get_full_text())

    logger.info("Call Translation service")
    start_translation = time()
    translator = AutomaticTranslator(parsed_request.get_input_language(),
                                     parsed_request.get_output_language())
    translator.set_text(ocr.get_full_text())
    translation = translator.get_translation()
    reporter.add_event("auto_translation_time", time() - start_translation)
    reporter.add_translated_text(translation)

    email_start = time()
    sg = Sendgrid(parsed_request, ocr.get_full_text(), translation)
    status_code, body, headers = sg.send()

    if 200 <= status_code < 300:
        reporter.add_event("email_sent_in_sec", time() - email_start)
        return Answer(original_text=ocr.get_full_text(),
                      translated_text=translation,
                      email_status=True).get_answer()
    else:
        reporter.add_event("email_send_exception_status_code", status_code)
        reporter.add_event("email_send_exception_body", body)
        reporter.add_event("email_send_exception_headers", headers)

        logger.exception("Email not sent with status code = {}, "
                         "body = {}, "
                         "headers = {}".format(status_code, body, headers))
        raise Exception("Something went wrong with the e-mail! Check logs")


# Flask app
app = Flask(__name__)


@app.route('/request_translation', methods=['POST'])
def translate():
    logger.info("Received a request")
    reporter = Analytics()

    parsed_request = RequestParser(request.data)
    reporter.add_request_summary(parsed_request.get_request_summary())
    reporter.add_image(parsed_request.image)

    logger.debug("Request = {}".format(parsed_request))

    if parsed_request.get_human_translation_requested():
        logger.info("Human translation requested")
        ans = request_human_translation(parsed_request, reporter)
    else:
        logger.info("Automatic translation requested")
        ans = request_automatic_translation(parsed_request, reporter)

    reporter.commit()
    return ans
