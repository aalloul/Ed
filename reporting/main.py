import logging
from flask import Flask, jsonify, request, abort
from sys import stdout
from json import loads
import importlib

app = Flask(__name__)

# Logging
logging.basicConfig(stream=stdout, format='%(asctime)s %(message)s')
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)


@app.errorhandler(404)
def page_not_found(e, req, rhead):
    return jsonify({
        "error_message": e.message,
        "received_request": req,
        "request_header": rhead
    }), 404


def check_datamodel_version(body):
    dv = []
    for rec in body:
        if "datamodel_version" not in rec.keys():
            logger.error("datamodel_version not found in at least one of the "
                         "records")
            abort(404)
        else:
            dv.append(rec["datamodel_version"])

    if len(list(set(dv))) > 1:
        logger.error("The received body has multiple datamodel_version")

    logger.debug("Received request follows data model version {}".format(dv[0]))
    return dv[0]


@app.errorhandler(404)
def key_missing(e):
    return e, 404


@app.route('/events', methods=["POST"])
def new_event():
    try:
        parsed_request = loads(request.data)
        logger.debug("Received following request {}".format(parsed_request))
        logger.info("Received request with {} rows".format(len(parsed_request)))

        version = check_datamodel_version(parsed_request)
        version = str(version).replace(".", "")

        handler = importlib.import_module(
            "data_parsers.parser_v{}".format(version))

        handler.get_class(parsed_request).upload()
        return jsonify({'ack': 200})

    except Exception as ex:
        return page_not_found(ex, request.data, str(request.headers))

@app.route('/newProspect', methods=['POST'])
def new_prospect():
    try:
        parsed_request = loads(request.data)
        logger.info("Received following request for new prospect {}".format(
            parsed_request))
        if "datamodel_version" not in parsed_request:
            raise KeyError("datamodel_version not found in request body")

        version = str(parsed_request['datamodel_version']).replace(".", "")
        handler = importlib.import_module("email_parsers.parser_v{}".format(
            version))

        handler.get_class(parsed_request).upload()
        return jsonify({"ack": 200})

    except Exception as ex:
        return page_not_found(ex, request.data, str(request.headers))
