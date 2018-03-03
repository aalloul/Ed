from numpy import uint8, ones, int0, array, percentile, where, diff
from cv2 import Canny, findContours, RETR_LIST, CHAIN_APPROX_SIMPLE, \
    threshold, boxPoints, MORPH_OPEN, contourArea, morphologyEx, MORPH_CLOSE, \
    minAreaRect, THRESH_BINARY, copyMakeBorder, BORDER_CONSTANT, resize, \
    INTER_AREA
from methods.transform import four_point_transform
import imutils
import logging
from sys import stdout
from custom_exceptions.custom_exceptions import NoImprovementFound

# Logging
logging.basicConfig(stream=stdout, format='%(asctime)s %(message)s')
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)


class FilterBased(object):
    def __init__(self, image):
        self.image = image
        self.resized = imutils.resize(self.image, height=500)
        self.ratio = self.image.shape[0] / float(500)
        self.center_x = self.resized.shape[0] / 2
        self.center_y = self.resized.shape[1] / 2
        self.thresold = 0

    def _find_correct_threshold(self):
        # Remove text with MORPH_CLOSE
        closed_ = self.open_close(self.resized, MORPH_CLOSE, 5, 5)

        if closed_.std() < 25:
            # If the standard deviation is so small, it means the whole
            # picture has the same color. So we assume the user made sure
            # that the page occupies more than 90% of the picture
            return None

        # Here we compute all percentile values, then find the one where the
        # slope changes significantly.
        perc_ = percentile(closed_, xrange(5, 75))
        perc_ = self._find_position(perc_)

        val = percentile(closed_.flatten(), perc_)
        logger.debug("Found percentile value {}".format(perc_))
        logger.debug("Threshold value = {}".format(val))
        return val

    @staticmethod
    def _find_position(perc_vals):
        pos = 0
        deriv_1 = diff(perc_vals)
        position = None
        max_slope = where(deriv_1 == deriv_1.max())[0][0]
        for _ in xrange(max_slope, len(deriv_1)):
            slope = deriv_1[_]
            if slope >= 2:
                pos += 1
            elif slope < 2 and pos > 1:
                position = _ + 1
                break

        if position is None:
            raise NoImprovementFound("Could not find a good place to cut the "
                                     "percentiles")

        second_derivative = diff(diff(perc_vals))[position - 2:]
        deriv2_is_null = where(second_derivative == 0)[0][0]

        # We add `position` and substract 2 because:
        #  - the first diff, removes the 1st value in perc_vals (otherwise,
        #  it's a NaN)
        #  - For the same reason, the 2nd diff, removes the 1st in the 1st diff.
        #  - to find deriv2_is_null, we start at `position-2`
        return deriv2_is_null + position - 2

    @staticmethod
    def _color_across_segment(image, length=20, x=None, y=None, st=True):
        if x is None and y is None:
            raise ValueError()

        if x is not None:
            if st:
                rng = xrange(0, length)
            else:
                rng = xrange(image.shape[1] - length, image.shape[1])

            return array([image[x, y_] for y_ in rng])

        if st:
            rng = xrange(0, length)
        else:
            rng = xrange(image.shape[0] - length, image.shape[0])
        return array([image[x_, y] for x_ in rng])

    @staticmethod
    def _apply_threshold(image, value, replacement):
        _, th = threshold(image, value, replacement, THRESH_BINARY)
        return th

    @staticmethod
    def open_close(image, operation, kx, ky):
        return morphologyEx(image, operation, ones((kx, ky), uint8))

    @staticmethod
    def zero_values(im):
        out = im.copy()
        out[(out[:, :, 0] != 255) |
            (out[:, :, 1] != 255) |
            (out[:, :, 2] != 255)] = 0
        return out

    @staticmethod
    def _get_box(contour):
        rect = minAreaRect(contour)
        box = boxPoints(rect)
        return int0(box)

    @staticmethod
    def box_area(contour):
        return contourArea(FilterBased._get_box(contour))

    @staticmethod
    def _add_border(im):
        return copyMakeBorder(im, 15, 15, 15, 15, BORDER_CONSTANT,
                              value=[0, 0, 0])

    @staticmethod
    def get_bounding_box(im, add_border=False, sortby="contourArea"):
        if add_border:
            edges = Canny(FilterBased._add_border(im), 75, 200)
        else:
            edges = Canny(im, 75, 200)

        if len(edges) == 0 or edges is None:
            raise NoImprovementFound("No edges found")

        cnts = findContours(edges, RETR_LIST, CHAIN_APPROX_SIMPLE)

        boxes = map(FilterBased._get_box, cnts[1])
        if sortby == "contourArea":
            areas = map(contourArea, cnts[1])
        elif sortby == "box_area":
            areas = map(contourArea, boxes)
        else:
            raise ValueError("Unknown value {} for sortby".format(sortby))
        return boxes[areas.index(max(areas))]

    def apply_filter(self):
        self.thresold = self._find_correct_threshold()
        if self.thresold is None:
            thebox = self.get_bounding_box(self.resized, add_border=True)
        else:
            thresholded = self._apply_threshold(self.resized, self.thresold,
                                                255)
            closed = self.open_close(thresholded, MORPH_CLOSE, 5, 5)
            zeroed = self.zero_values(closed)
            reopened = self.open_close(zeroed, MORPH_OPEN, 40, 40)
            reopened = reopened.astype(uint8)
            thebox = self.get_bounding_box(reopened,
                                           sortby="box_area")
        return four_point_transform(self.image, thebox * self.ratio)

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
# reopened = reopened.astype(uint8)
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
