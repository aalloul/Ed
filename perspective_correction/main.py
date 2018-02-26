from __future__ import print_function
from methods.naive import Naive
from methods.rectangle_reconstruct import RectangleReconstruct
from flask import Flask, request, jsonify
import logging
from sys import stdout
from time import time
from json import loads
from custom_exceptions.custom_exceptions import *

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
    logger.info("0- Loading image")
    in_image = loads(request.data)['image']

    # Method 1: Naive. Works fine when the page is put on, e.g., a table and
    # the picture shows clearly the 4 edges
    logger.info("1- Trying Naive method with no border")
    naive_method = Naive(in_image, 500, border=False)
    scan = naive_method.get_scanned_version()
    if scan is not None:
        logger.info("Took {}s".format(time() - start))
        return jsonify({"result": naive_method.encode_to_b64(scan)})

    logger.info("2- Trying Naive method with borders")
    # Method 1.2: Same as above but works if the page fills the whole picture.
    # In this case we add a border to the page.
    naive_method = Naive(in_image, 500, border=True)
    scan = naive_method.get_scanned_version()
    if scan is not None:
        logger.info("Took {}s".format(time() - start))
        return jsonify({"result": naive_method.encode_to_b64(scan)})

    # Method 2: This method is used as a last hope. It tries to find a
    # rectangle in the picture.
    logger.info("3- Trying RectangleReconstruct method")
    rectangle_method = RectangleReconstruct(in_image, 500)
    scan = rectangle_method.get_scanned_version()
    if scan is not None:
        logger.info("Improved picture sent")
        logger.info("Took {}s".format(time() - start))
        return jsonify({"result": rectangle_method.encode_to_b64(scan)})

    # If nothing, then we can't help but return an error :/
    if scan is None:
        logger.info("No improvement could be found")
        logger.info("Took {}s".format(time() - start))
        return custom_error(NoImprovementFound("No suitable cropping found"))


@app.errorhandler(500)
def custom_error(e):
    logger.info("e = {}".format(e))
    return jsonify(e.get_json()), 500


if __name__ == "__main__":
    app.run(debug=True)
