from transform import four_point_transform
from skimage.filters import threshold_local
from numpy import fromstring, uint8, ones, int0
from cv2 import imdecode, IMREAD_COLOR, COLOR_BGR2GRAY, cvtColor, imencode, \
    GaussianBlur, Canny, findContours, RETR_LIST, CHAIN_APPROX_SIMPLE, \
    contourArea, MORPH_OPEN, morphologyEx, MORPH_CLOSE, boxPoints, minAreaRect, \
    copyMakeBorder, BORDER_CONSTANT
import imutils
from base64 import b64encode
import logging
from sys import stdout

# Logging
logging.basicConfig(stream=stdout, format='%(asctime)s %(message)s')
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)


class RectangleReconstruct(object):

    def __init__(self, base64_image, div_image_by=500, threshold=0.4):
        image = self._read_image(base64_image)
        image = self._add_border(image)
        self.original, self.image, self.ratio = self._resize_image(image,
                                                                   div_image_by)
        self.edges = None
        self.threshold = threshold

    @staticmethod
    def _read_image(base64encoded):
        nparr = fromstring(base64encoded.decode('base64'), uint8)
        return imdecode(nparr, IMREAD_COLOR)

    @staticmethod
    def _add_border(im):
        return copyMakeBorder(im, 15, 15, 15, 15, BORDER_CONSTANT,
                              value=[0, 0, 0])

    @staticmethod
    def _resize_image(im, factor):
        ratio = im.shape[0] / float(factor)
        orig = im.copy()
        return orig, imutils.resize(im, height=factor), ratio

    def _dilate(self):
        kernel = ones((40, 40), uint8)
        return morphologyEx(self.image, MORPH_OPEN, kernel)

    def _close(self):
        kernel = ones((40, 40), uint8)
        return morphologyEx(self.image, MORPH_CLOSE, kernel)

    @staticmethod
    def _find_edges(im):
        gray = cvtColor(im, COLOR_BGR2GRAY)
        gray = GaussianBlur(gray, (5, 5), 0)
        return Canny(gray, 75, 200)

    @staticmethod
    def _find_contours(edges):
        cnts = findContours(edges.copy(), RETR_LIST, CHAIN_APPROX_SIMPLE)
        cnts = cnts[0] if imutils.is_cv2() else cnts[1]
        cnts = sorted(cnts, key=contourArea, reverse=True)[:5]
        return cnts[0]

    @staticmethod
    def _get_box(contour):
        rect = minAreaRect(contour)
        box = boxPoints(rect)
        return int0(box)

    def _apply_transformation(self, box, blackwhite=False):
        warped = four_point_transform(self.original, box * self.ratio)

        if blackwhite:
            warped = cvtColor(warped, COLOR_BGR2GRAY)
            t = threshold_local(warped, 11, offset=10, method="gaussian")
            warped = (warped > t).astype("uint8") * 255

        return warped

    @staticmethod
    def _get_area(array):
        return float(array.shape[0] * array.shape[1])

    def _compare_warped_to_original(self, contour):
        original_area = self._get_area(self.original)
        transformed_area = self._get_area(contour)
        logger.debug(
            "Area ratio is {}".format(transformed_area / original_area))
        return transformed_area / original_area

    def get_scanned_version(self):
        dilated = self._dilate()
        edges = self._find_edges(dilated)
        contour = self._find_contours(edges)
        box = self._get_box(contour)
        warped = self._apply_transformation(box)

        if self._compare_warped_to_original(warped) <= self.threshold:
            return None
        else:
            return warped

    @staticmethod
    def encode_to_b64(array):
        _, im = imencode(".jpg", array)
        return b64encode(im)


if __name__ == "__main__":
    path = "../fixtures/request_first_user.jpeg"


    with open(path, "rb") as f:
        im64 = b64encode(f.read())

    rectangle_method = RectangleReconstruct(im64, 500, threshold=0.4)
    scan = rectangle_method.get_scanned_version()


    from cv2 import imshow, waitKey, destroyAllWindows, drawContours

    imshow("Scanned", imutils.resize(scan, height=650))

    #
    dilated = rectangle_method._dilate()
    imshow("Scanned", dilated)
    waitKey()
    destroyAllWindows()

    edges = rectangle_method._find_edges(dilated)
    imshow("Edges", edges)
    waitKey()
    destroyAllWindows()

    contour = rectangle_method._find_contours(edges)
    drawContours(rectangle_method.image, [contour], -1, (0, 255, 0), 2)
    imshow("Outline", rectangle_method.image)
    waitKey()
    destroyAllWindows()

    box = rectangle_method._get_box(contour)
    warped = rectangle_method._apply_transformation(box)
    #
    # drawContours(rectangle_method.image, [contour], -1, (0, 255, 0), 2)
    # imshow("Outline", rectangle_method.image)
    #
    # waitKey()
    # destroyAllWindows()

rectangle_method = RectangleReconstruct(im64, 500, threshold=0.4)
dilated = rectangle_method._dilate()
edges = rectangle_method._find_edges(dilated)

from cv2 import HoughLines, HoughLinesP, line
from numpy import pi
lines = HoughLines(edges,1, pi/180,200)

minLineLength = 100
maxLineGap = 10
lines = HoughLinesP(edges,1,pi/180,100,minLineLength,maxLineGap)
imshow("Image with lines", rectangle_method.image)
for l in lines:
    x1,y1,x2,y2 = l[0]
    line(rectangle_method.image,(x1,y1),(x2,y2),(0,255,0),2)
imshow("Image with lines", rectangle_method.image)
waitKey()
destroyAllWindows()


cnts = findContours(edges.copy(), RETR_LIST, CHAIN_APPROX_SIMPLE)
cnts = cnts[0] if imutils.is_cv2() else cnts[1]
cnts = sorted(cnts, key=contourArea, reverse=True)[:5]
drawContours(rectangle_method.image, cnts[0], -1, (0, 255, 0), 2)
imshow("Outline", rectangle_method.image)
waitKey()
destroyAllWindows()

box = rectangle_method._get_box(cnts[0])
warped = rectangle_method._apply_transformation(box)
imshow("Scanned", imutils.resize(warped, height=650))
waitKey()
destroyAllWindows()