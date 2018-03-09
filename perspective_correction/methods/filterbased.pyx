import numpy as np
from cv2 import Canny, findContours, RETR_LIST, CHAIN_APPROX_SIMPLE, \
    threshold, boxPoints, MORPH_OPEN, contourArea, morphologyEx, MORPH_CLOSE, \
    minAreaRect, THRESH_BINARY, copyMakeBorder, BORDER_CONSTANT, INTER_AREA, \
    resize, imdecode, IMREAD_COLOR, imencode
from methods.transformC import four_point_transform
from base64 import b64encode
import logging
from sys import stdout
from custom_exceptions.custom_exceptions import NoImprovementFound
cimport numpy as np
DTYPE = np.int
DTYPE64 = np.int64
DTYPE8 = np.int8
ctypedef np.int_t DTYPE_t
ctypedef np.int64_t DTYPE64_t
ctypedef np.int8_t DTYPE8_t


# Logging
logging.basicConfig(stream=stdout, format='%(asctime)s %(message)s')
logger = logging.getLogger(__name__)
logger.setLevel(logging.WARNING)


def resize2(np.ndarray image, int width=-1, int height=-1, int
inter=INTER_AREA):
    # initialize the dimensions of the image to be resized and
    # grab the image size
    dim = None
    cdef int h = image.shape[0]
    cdef int w = image.shape[1]
    cdef float r = 0.

    # if both the width and height are None, then return the
    # original image
    if width == -1 and height == -1:
        return image

    # check to see if the width is None
    if width == -1:
        # calculate the ratio of the height and construct the
        # dimensions
        r = height / float(h)
        dim = (int(w * r), height)

    # otherwise, the height is None
    else:
        # calculate the ratio of the width and construct the
        # dimensions
        r = width / float(w)
        dim = (width, int(h * r))

    # resize the image
    cdef np.ndarray resized = resize(image, dim, interpolation=inter)

    # return the resized image
    return resized

cdef _find_position(np.ndarray perc_vals):
    cdef int pos = 0
    cdef np.ndarray deriv_1 = np.diff(perc_vals)
    cdef int position = -1
    cdef int max_slope = np.where(deriv_1 == deriv_1.max())[0][0]
    cdef int slope = -1

    for _ in xrange(max_slope, len(deriv_1)):
        slope = deriv_1[_]
        if slope >= 2:
            pos += 1
        elif slope < 2 and pos > 1:
            position = _ + 1
            break

    if position == -1:
        raise NoImprovementFound("Could not find a good place to cut the "
                                 "percentiles")

    cdef np.ndarray second_derivative = np.diff(np.diff(perc_vals))[position -
    2:]
    cdef int deriv2_is_null = np.where(second_derivative == 0)[0][0]

    # We add `position` and substract 2 because:
    #  - the first diff, removes the 1st value in perc_vals (otherwise,
    #  it's a NaN)
    #  - For the same reason, the 2nd diff, removes the 1st in the 1st diff.
    #  - to find deriv2_is_null, we start at `position-2`
    return deriv2_is_null + position - 2

cdef _apply_threshold(np.ndarray image, int value, int replacement):
        _, th = threshold(image, value, replacement, THRESH_BINARY)
        return th

cdef open_close(np.ndarray image, int operation, int kx, int ky):
        return morphologyEx(image, operation, np.ones((kx, ky), np.uint8))


cdef zero_values(np.ndarray im):
        cdef np.ndarray out = im.copy()
        out[(out[:, :, 0] != 255) |
            (out[:, :, 1] != 255) |
            (out[:, :, 2] != 255)] = 0
        return out

def _get_box(np.ndarray contour):
        rect = minAreaRect(contour)
        cdef np.ndarray box = boxPoints(rect)
        return np.int0(box)


cdef _add_border(np.ndarray im):
        return copyMakeBorder(im, 15, 15, 15, 15, BORDER_CONSTANT,
                              value=[0, 0, 0])


cdef get_bounding_box(np.ndarray im, int add_border=0, str sortby="contourArea"):

        # cdef np.ndarray edges = np.zeros(1,1)
        if add_border:
            edges = Canny(_add_border(im), 75, 200)
        else:
            edges = Canny(im, 75, 200)

        if len(edges) == 0 or edges is None:
            raise NoImprovementFound("No edges found")

        cnts_ = findContours(edges, RETR_LIST, CHAIN_APPROX_SIMPLE)
        cnts = cnts_[1]

        boxes = map(_get_box, cnts)
        if sortby == "contourArea":
            areas = map(contourArea, cnts)
        elif sortby == "box_area":
            areas = map(contourArea, boxes)
        else:
            raise ValueError("Unknown value {} for sortby".format(sortby))
        return boxes[areas.index(max(areas))]

cdef _find_correct_threshold(np.ndarray resized):
    # Remove text with MORPH_CLOSE
    cdef np.ndarray closed_ = open_close(resized, MORPH_CLOSE, 5, 5)
    cdef double std_ = closed_.std()

    if std_ < 25:
        # If the standard deviation is so small, it means the whole
        # picture has the same color. So we assume the user made sure
        # that the page occupies more than 90% of the picture
        return -1

    # Here we compute all percentile values, then find the one where the
    # slope changes significantly.
    cdef np.ndarray perc_ = np.percentile(closed_, xrange(5, 75))
    cdef DTYPE64_t perc2_ = _find_position(perc_)

    val = np.percentile(closed_, perc2_)
    logger.debug("Found percentile value {}".format(perc2_))
    logger.debug("Threshold value = {}".format(val))
    return val

cdef read_image2(str b64):
    import pybase64
    # cdef np.ndarray nparr = np.frombuffer(pybase64.b64decode(b64), np.uint8)
    return imdecode(np.frombuffer(pybase64.b64decode(b64), np.uint8), IMREAD_COLOR)

def read_image(b64):
    return read_image2(b64)
    # import pybase64
    # cdef np.ndarray nparr = np.frombuffer(pybase64.b64decode(b64), np.uint8)
    # return imdecode(np.frombuffer(pybase64.b64decode(b64), np.uint8),
    # IMREAD_COLOR)

# def read_image(b64):
#     cdef str str_ = b64.decode('base64')
#     cdef np.ndarray nparr = np.frombuffer(str_, np.uint8)
#     return imdecode(nparr, IMREAD_COLOR)

def apply_filter(np.ndarray image):
    cdef np.ndarray resized = resize2(image, height=500)
    cdef double ratio = image.shape[0] / float(500)
    cdef int center_x = resized.shape[0] / 2
    cdef int center_y = resized.shape[1] / 2
    cdef int thresold = -1
    cdef np.ndarray thresholded = np.array(1)
    cdef np.ndarray closed = np.array(1)
    cdef np.ndarray zeroed = np.array(1)
    cdef np.ndarray reopened = np.array(1)
    cdef np.ndarray thebox = np.array(1)

    thresold = _find_correct_threshold(resized)
    if thresold==-1:
        thebox = get_bounding_box(resized, add_border=1)
    else:
        thresholded = _apply_threshold(resized, thresold, 255)
        closed = open_close(thresholded, MORPH_CLOSE, 5, 5)
        zeroed = zero_values(closed)
        reopened = open_close(zeroed, MORPH_OPEN, 40, 40)
        reopened = reopened.astype(np.uint8)
        thebox = get_bounding_box(reopened, add_border=0, sortby="box_area")
    logger.info("about to return")
    return four_point_transform(image, thebox * ratio)


cdef get_area(np.ndarray array):
    return float(array.shape[0] * array.shape[1])

def compare_warped_to_original(np.ndarray original, np.ndarray cropped):
    cdef double original_area = get_area(original)
    cdef double transformed_area = get_area(cropped)
    return transformed_area / original_area


def encode_to_b64(np.ndarray array):
    _, im = imencode(".jpg", array)
    return b64encode(im)

def profiler():
    from cv2 import imread
    original_image = imread("../fixtures/example_02.jpg")
    # filterbased = FilterBased(original_image)
    warped = apply_filter(original_image)

# if __name__ == "__main__":
#     from time import time
#     from cv2 import imshow, imread, waitKey, destroyAllWindows
#
#     # , "03", "04", "05", "06", "07", "08", "09", "10", "11"]:
#     for ii in ["02"]:
#         start = time()
#         original_image = imread("../fixtures/example_{}.jpg".format(ii))
#         print("Reading image took {}s".format(time() - start))
#         new_start = time()
#         filterbased = FilterBased(original_image)
#         print("Instantiation of class took {}s".format(time() - new_start))
#         new_start = time()
#         warped = filterbased.apply_filter()
#         print("Filter apply took {}s".format(time() - new_start))
#         print("Total duration = {}s".format(time() - start))
#         imshow("Original", imutils.resize(original_image, height=500))
#         imshow("Scanned", imutils.resize(warped, height=500))
#         waitKey()
#         destroyAllWindows()


# from time import time
#
# original_image = imread("../fixtures/example_{}.jpg".format("02"))
# start = time()
# filterbased = FilterBased(original_image)
# logger.info("Instantiated in {}".format(time() - start))
#
# start = time()
# thresold = filterbased._find_correct_threshold()
# logger.info("_find_correct_threshold in {}".format(time() - start))
#
# start = time()
# thresholded = filterbased._apply_threshold(filterbased.resized, thresold, 255)
# logger.info("_apply_threshold in {}".format(time() - start))
#
# start = time()
# closed = filterbased.open_close(thresholded, MORPH_CLOSE, 5, 5)
# logger.info("open_close in {}".format(time() - start))
#
# start = time()
# zeroed = filterbased.zero_values(closed)
# logger.info("zero_values in {}".format(time() - start))
#
# start = time()
# reopened = filterbased.open_close(zeroed, MORPH_OPEN, 40, 40)
# logger.info("open_close in {}".format(time() - start))
#
# reopened = reopened.astype(np.uint8)
#
# start = time()
# thebox = filterbased.get_bounding_box(reopened, sortby=FilterBased.box_area)
# logger.info("get_bounding_box in {}".format(time() - start))
#
# # edges = Canny(reopened, 75, 200)
# #
# #
# # cnts = findContours(edges, RETR_LIST, CHAIN_APPROX_SIMPLE)
# #
# # start = time()
# # cnts = sorted(cnts[1], key=FilterBased.box_area, reverse=True)[0]
# # box_ = FilterBased._get_box(cnts)
# # logger.info("_get_box in {}".format(time() - start))
# #
# #
# # cnts = findContours(edges, RETR_LIST, CHAIN_APPROX_SIMPLE)
# # start = time()
# # boxes = map(FilterBased._get_box, cnts[1])
# # areas = map(contourArea, boxes)
# # box_ = boxes[areas.index(max(areas))]
# # logger.info("_get_box in {}".format(time() - start))
