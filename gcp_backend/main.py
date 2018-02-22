from __future__ import print_function
from flask import Flask, request, jsonify
from request_parser.request_parser import RequestParser
from ocr.ocr import Ocr
from translator.automatic_translator import AutomaticTranslator
from email_generator.sendgrid_mailer import Sendgrid
from answer.answer import Answer
import logging
from sys import stdout
from analytics.analytics import Analytics
from time import time
from custom_exceptions.custom_exceptions import NoTextFoundException, \
    UnknownError, UnknownEmailException, GenericSmailException

# Logging
logging.basicConfig(stream=stdout, format='%(asctime)s %(message)s')
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)
DEBUG = True


def request_human_translation(parsed_request, reporter):
    start = time()

    sg = Sendgrid(parsed_request, human_translation=True)
    status_code, body, headers = sg.send()

    if 200 <= status_code < 300:
        reporter.add_event("email_sent_in_sec", round(time() - start, 3))
        return Answer(human_requested=True).get_answer()
    else:
        reporter.add_event("email_send_exception_status_code", status_code)
        reporter.add_event("email_send_exception_body", body)
        reporter.add_event("email_send_exception_headers", headers)

        logger.exception("Email not sent with status code = {}, "
                         "body = {}, "
                         "headers = {}".format(status_code, body, headers))
        raise UnknownEmailException("Something went wrong with the e-mail! "
                                    "Check logs")


def request_automatic_translation(parsed_request, reporter):
    logger.info("Call OCR service")
    start_ocr = time()

    try:
        parsed_ocr = Ocr(parsed_request.get_image(),
                         parsed_request.get_input_language()).ocr_answer
    except NoTextFoundException:
        logger.error("No text was found in the provided image")
        reporter.add_event("exception", "no_text_found_in_image")
        raise

    reporter.add_event("ocr_processing_time", round(time() - start_ocr, 3))
    reporter.add_event("n_chars_image", len(parsed_ocr.full_text))
    reporter.add_extracted_text(parsed_ocr.ocr_resp)

    logger.info("Call Translation service")
    start_translation = time()
    translator = AutomaticTranslator(parsed_request.get_input_language(),
                                     parsed_request.get_output_language(),
                                     parsed_ocr.parsed_pages)
    logger.info("About to request translation")
    translator.get_translation()

    logger.info("Translation requested")

    reporter.add_event("auto_translation_time", round(time() -
                                                      start_translation, 3))
    reporter.add_translated_text(parsed_ocr.parsed_pages)

    input_html, html_text = translator.get_html()
    reporter.add_input_html(input_html)

    email_start = time()
    sg = Sendgrid(parsed_request, html_text, parsed_ocr.parsed_pages)
    status_code, body, headers = sg.send()

    if 200 <= status_code < 300:
        reporter.add_event("email_sent_in_sec", round(time() - email_start, 3))
        return Answer(original_text=parsed_ocr.full_text,
                      translated_text=parsed_ocr.parsed_pages,
                      email_status=True).get_answer()
    else:
        reporter.add_event("email_send_exception_status_code", status_code)
        reporter.add_event("email_send_exception_body", body)
        reporter.add_event("email_send_exception_headers", headers)

        logger.exception("Email not sent with status code = {}, "
                         "body = {}, "
                         "headers = {}".format(status_code, body, headers))
        raise UnknownEmailException()


# Flask app
app = Flask(__name__)


@app.route('/request_translation', methods=['POST'])
def translate():
    logger.info("Received a request")

    try:
        parsed_request = RequestParser(request.data).parse()

        if parsed_request.version >= 0.2:
            debug = parsed_request.debug
        else:
            debug = False

        reporter = Analytics(debug)
        reporter.add_request_summary(parsed_request.get_request_summary())
        reporter.add_image(parsed_request.image)

        logger.debug("Request = {}".format(parsed_request))

        if parsed_request.get_human_translation_requested():
            logger.info("Human translation requested")
            ans = request_human_translation(parsed_request, reporter)
        else:
            logger.info("Automatic translation requested")
            ans = request_automatic_translation(parsed_request, reporter)

        logger.info("Everything went well - Sending reporting information")
        reporter.commit()
        logger.info("  -> Done")
        return ans
    except GenericSmailException as ex:
        logger.error("ex.__class__ {}".format(ex.__class__))
        logger.error("exception = {}".format(ex.message))
        return custom_error(ex)
    except Exception as ex:
        logger.error(ex)
        return custom_error(UnknownError(ex.message))


@app.errorhandler(500)
def custom_error(e):
    logger.info("e = {}".format(e))
    return jsonify(e.get_json()), 500
