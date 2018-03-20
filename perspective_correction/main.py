from __future__ import print_function
from methods.rectangle_reconstruct import RectangleReconstruct
from methods.filter_based import FilterBased
from flask import Flask, request, jsonify
import logging
from sys import stdout
from time import time
from json import loads
from custom_exceptions.custom_exceptions import *
from numpy import frombuffer, uint8
from cv2 import imdecode, IMREAD_COLOR, imencode
from base64 import b64encode

# Logging
logging.basicConfig(stream=stdout, format='%(asctime)s %(message)s')
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)
DEBUG = True


# Some utility functions
def read_image(base64encoded):
    nparr = frombuffer(base64encoded.decode('base64'), uint8)
    return imdecode(nparr, IMREAD_COLOR)


def encode_to_b64(array):
    _, im = imencode(".jpg", array)
    return b64encode(im)


def get_area(array):
    return float(array.shape[0] * array.shape[1])


def compare_warped_to_original(original, cropped):
    original_area = get_area(original)
    transformed_area = get_area(cropped)
    return transformed_area / original_area


# Flask app
app = Flask(__name__)


@app.route('/correct_image', methods=['POST'])
def main():
    logger.info("New image to crop!")
    start = time()
    logger.info("0- Loading image")
    image_64 = loads(request.data)['image']
    image = read_image(image_64)

    # Method 1: Naive. Works fine when the page is put on, e.g., a table and
    # the picture shows clearly the 4 edges
    logger.info("1- Trying Filter based method with no border")
    filter_based = FilterBased(image)
    try:
        res = filter_based.apply_filter()
        ratio = compare_warped_to_original(image, res)
        if  ratio >= 0.7:
            logger.info("Took {}s".format(time() - start))
            logger.info("Ratio is {}".format(ratio))
            return jsonify({"result": encode_to_b64(res), "ratio": ratio})
    except Exception as ex:
        logger.warning("FilterBased method did not work")
        logger.warning("Message = {}".format(ex))
        return jsonify({"error": "No improvement found" })
    # Method 2: This method is used as a last hope. It tries to find a
    # rectangle in the picture.
    # logger.info("2- Trying RectangleReconstruct method")
    # rectangle_method = RectangleReconstruct(image, 500)
    # try:
    #     res = rectangle_method.get_scanned_version()
    #     if compare_warped_to_original(image, res) >= 0.4:
    #         logger.info("Improved picture sent")
    #         logger.info("Took {}s".format(time() - start))
    #         return jsonify({"result": encode_to_b64(res)})
    # except Exception as ex:
    #     logger.warning("RectangleReconstruct method did not work")
    #     logger.warning("Message = {}".format(ex))
    #
    # logger.info("No improvement could be found")
    # logger.info("Took {}s".format(time() - start))
    # return custom_error(NoImprovementFound("No suitable cropping found"))

    # Keep this just in case
    # naive_method = Naive(in_image, 500, border=False)
    # scan = naive_method.get_scanned_version()
    # if scan is not None:
    #     logger.info("Took {}s".format(time() - start))
    #     return jsonify({"result": naive_method.encode_to_b64(scan)})
    #
    # logger.info("2- Trying Naive method with borders")
    # # Method 1.2: Same as above but works if the page fills the whole picture.
    # # In this case we add a border to the page.
    # naive_method = Naive(in_image, 500, border=True)
    # scan = naive_method.get_scanned_version()
    # if scan is not None:
    #     logger.info("Took {}s".format(time() - start))
    #     return jsonify({"result": naive_method.encode_to_b64(scan)})


@app.errorhandler(500)
def custom_error(e):
    logger.info("e = {}".format(e))
    return jsonify(e.get_json()), 500


if __name__ == "__main__":
    app.run()
