from transform import four_point_transform
from skimage.filters import threshold_local
from numpy import fromstring, uint8
from cv2 import imdecode, IMREAD_COLOR, COLOR_BGR2GRAY, cvtColor, \
    GaussianBlur, Canny, findContours, RETR_LIST, CHAIN_APPROX_SIMPLE, \
    contourArea, arcLength, approxPolyDP, imencode, copyMakeBorder, \
    BORDER_CONSTANT
import imutils
from base64 import b64encode
import logging
from sys import stdout

# Logging
logging.basicConfig(stream=stdout, format='%(asctime)s %(message)s')
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)


class Naive(object):
    def __init__(self, base64_image, factor=500, threshold=0.4):
        image = self._read_image(base64_image)
        image = self._add_border(image)
        self.original, self.image, self.ratio = self._resize_image(image,
                                                                   factor)
        self.edges = None
        self.threshold = threshold

    @staticmethod
    def _read_image(base64encoded):
        nparr = fromstring(base64encoded.decode('base64'), uint8)
        return imdecode(nparr, IMREAD_COLOR)

    @staticmethod
    def _resize_image(im, factor):
        ratio = im.shape[0] / float(factor)
        orig = im.copy()
        return orig, imutils.resize(im, height=factor), ratio

    @staticmethod
    def _add_border(im):
        return copyMakeBorder(im, 15, 15, 15, 15, BORDER_CONSTANT,
                              value=[0, 0,0])

    def _find_edges(self):
        gray = cvtColor(self.image, COLOR_BGR2GRAY)
        gray = GaussianBlur(gray, (5, 5), 0)
        return Canny(gray, 75, 200)

    @staticmethod
    def _find_contours(e):
        cnts = findContours(e.copy(), RETR_LIST, CHAIN_APPROX_SIMPLE)
        cnts = cnts[0] if imutils.is_cv2() else cnts[1]
        cnts = sorted(cnts, key=contourArea, reverse=True)[:5]

        # loop over the contours
        for c in cnts:
            # approximate the contour
            peri = arcLength(c, True)
            approx = approxPolyDP(c, 0.02 * peri, True)

            # if our approximated contour has four points, then we
            # can assume that we have found our screen
            if len(approx) == 4:
                return approx

    def _apply_transformation(self, ctr):
        wrp = four_point_transform(self.original,
                                   ctr.reshape(4, 2) * self.ratio)

        # convert the warped image to grayscale, then threshold it
        # to give it that 'black and white' paper effect
        wrp = cvtColor(wrp, COLOR_BGR2GRAY)
        t = threshold_local(wrp, 11, offset=10, method="gaussian")
        wrp = (wrp > t).astype("uint8") * 255
        return wrp

    @staticmethod
    def _get_area(array):
        return float(array.shape[0] * array.shape[1])

    def _compare_warped_to_original(self, ctr):
        original_area = self._get_area(self.original)
        transformed_area = self._get_area(ctr)
        return transformed_area / original_area

    def get_scanned_version(self):
        e = self._find_edges()
        ctr = self._find_contours(e)
        wrp = self._apply_transformation(ctr)

        if self._compare_warped_to_original(wrp) <= self.threshold:
            logger.debug("Result is too small wrp to original {}"
                         .format(self._compare_warped_to_original(wrp)))
            return None
        else:
            return wrp

    @staticmethod
    def encode_to_b64(array):
        _, im = imencode(".jpg", array)
        return b64encode(im)


if __name__ == "__main__":
    path = "/Users/adamalloul/Ed/gcp_backend/fixture/request_first_user.jpeg"

    with open(path, "rb") as f:
        im64 = b64encode(f.read())

    naive_method = Naive(im64, 500)
    # sc = naive_method.get_scanned_version()
    #
    #
    #
    # from cv2 import imshow, waitKey, destroyAllWindows, drawContours
    # if sc is not None:
    #     imshow("Scanned", imutils.resize(sc, height=650))
    #     waitKey(0)
    #     destroyAllWindows()
    #
    # edges = naive_method._find_edges()
    # contour = naive_method._find_contours(edges)
    # # warped = naive_method._apply_transformation(contour)
    # drawContours(naive_method.image, [contour], -1, (0, 255, 0), 2)
    # imshow("Outline", naive_method.image)
    # imshow("Edges", edges)
