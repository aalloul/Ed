from __future__ import print_function
from methods.naive import Naive
from methods.rectangle_reconstruct import RectangleReconstruct
from flask import Flask, request, jsonify
import logging
from sys import stdout
from time import time
from json import loads
from exceptions.custom_exceptions import *

# Logging
logging.basicConfig(stream=stdout, format='%(asctime)s %(message)s')
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)
DEBUG = True

# Flask app
app = Flask(__name__)


@app.route('/correct_image', methods=['POST'])
def main():
    logger.info("New image to crop!")
    start = time()
    in_image = loads(request.data)['image']
    naive_method = Naive(in_image, 500)
    sc = naive_method.get_scanned_version()

    if sc is None:
        rectangle_method = RectangleReconstruct(in_image, 500)
        scan = rectangle_method.get_scanned_version()

        if scan is None:
            logger.info("No improvement could be found")
            logger.info("Took {}s".format(time() - start))
            return NoImprovementFound("Could not find a rectangle")
        else:
            logger.info("Improved picture sent")
            logger.info("Took {}s".format(time() - start))
            return jsonify({"result": rectangle_method.encode_to_b64(scan)})
    else:
        logger.info("Took {}s".format(time() - start))
        return jsonify({"result": naive_method.encode_to_b64(sc)})


@app.errorhandler(500)
def custom_error(e):
    logger.info("e = {}".format(e))
    return jsonify(e.get_json()), 500


if __name__ == "__main__":
    app.run(debug=True)
