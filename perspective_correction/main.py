from __future__ import print_function
from methods.rectangle_reconstruct import RectangleReconstruct
# from methods.filter_based import FilterBased
from methods.filterbased import apply_filter, read_image, \
    compare_warped_to_original, encode_to_b64
from flask import Flask, request, jsonify
import logging
from sys import stdout
from time import time
from json import loads
from custom_exceptions.custom_exceptions import *

# Logging
logging.basicConfig(stream=stdout, format='%(asctime)s %(message)s')
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)
DEBUG = True

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
    try:
        logger.info("Apply filter")
        res = apply_filter(image)  # filter_based.apply_filter()
        logger.info("Compare warped to original")
        ratio = compare_warped_to_original(image, res)
        logger.info("Took {}s".format(time() - start))
        if ratio >= 0.5:
            logger.info("Ratio is {}".format(ratio))
            return jsonify({"result": encode_to_b64(res), "ratio": ratio})
        else:
            logger.info("Ratio is {} -- below threshold".format(ratio))
            raise NoImprovementFound(
                "Ratio is {} -- below threshold".format(ratio))
    except GenericImageCorrectionException as ex:
        logger.warning("FilterBased method did not work")
        logger.warning("Message = {}".format(ex))
        return jsonify({"error": "No improvement found"})
    except Exception as ex2:
        logger.warning("Unexpected exception caught ")
        logger.warning("Message = {}".format(ex2))
        return jsonify({"error": "No improvement found"})
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


if __name__ == "__main__":
    app.run(debug=True)
