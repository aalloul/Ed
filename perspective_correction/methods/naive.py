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
    def __init__(self, base64_image, factor=500, threshold=0.4, border=False):
        image = self._read_image(base64_image)
        if border:
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
                              value=[0, 0, 0])

    def _find_edges(self):
        gray = cvtColor(self.image, COLOR_BGR2GRAY)
        gray = GaussianBlur(gray, (5, 5), 0)
        return Canny(gray, 75, 200)

    @staticmethod
    def _find_contours(e):
        cnts = findContours(e.copy(), RETR_LIST, CHAIN_APPROX_SIMPLE)
        cnts = cnts[0] if imutils.is_cv2() else cnts[1]

        def get_area(contour):
            peri = arcLength(contour, True)
            approx = approxPolyDP(contour, 0.10 * peri, True)
            return contourArea(approx), approx

        maxarea = 0
        approx = None
        for c in cnts:
            area, approx_ = get_area(c)
            if area > maxarea and len(approx_) == 4:
                maxarea = area
                approx = approx_

        return approx

    def _apply_transformation(self, ctr, blackwhite=False):
        wrp = four_point_transform(self.original,
                                   ctr.reshape(4, 2) * self.ratio)

        # convert the warped image to grayscale, then threshold it
        # to give it that 'black and white' paper effect
        if blackwhite:
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

        if ctr is None:
            return None

        wrp = self._apply_transformation(ctr, blackwhite=False)
        area_ratio = self._compare_warped_to_original(wrp)
        if area_ratio <= self.threshold:
            logger.debug("Result is too small wrp to original {}"
                         .format(area_ratio))
            return None
        else:
            logger.debug("Area ratio = {}"
                         .format(area_ratio))
            return wrp

    @staticmethod
    def encode_to_b64(array):
        _, im = imencode(".jpg", array)
        return b64encode(im)


if __name__ == "__main__":
    files = ["example_02.jpg", "example_03.jpg", "example_04.jpg",
             "example_05.jpg", "example_06.jpg", "example_07.jpg",
             "example_08.jpg", "example_09.jpg", "example_10.jpg",
             "example_11.jpg"]

    path = "../fixtures/" + files[7]

    with open(path, "rb") as f:
        im64 = b64encode(f.read())

    naive = Naive(im64, 900, threshold=0.4, border=True)
    scan = naive.get_scanned_version()

    from cv2 import imshow, waitKey, destroyAllWindows, drawContours, imwrite

    # if scan is not None:
    #     imshow("Scan found",
    #            imutils.resize(naive.original, height=650))
    #     imshow("Scanned", imutils.resize(scan, height=650))
    #     waitKey()
    # else:
    #     imshow("No Scan found",
    #            imutils.resize(naive.original, height=650))
    #     waitKey()
    # destroyAllWindows()
    e = naive._find_edges()
    imshow("Dilated", e)
    waitKey()
    destroyAllWindows()

    ctr = naive._find_contours(e)
    drawContours(naive.image, [ctr], -1, [0, 255, 0])
    imshow("Contours", naive.image)
    waitKey()
    destroyAllWindows()