from transform import four_point_transform
from skimage.filters import threshold_local
from numpy import fromstring, uint8, ones, int0
from cv2 import imdecode, IMREAD_COLOR, COLOR_BGR2GRAY, cvtColor, imencode, \
    GaussianBlur, Canny, findContours, RETR_LIST, CHAIN_APPROX_SIMPLE, \
    contourArea, MORPH_OPEN, morphologyEx, MORPH_CLOSE, boxPoints, \
    minAreaRect, \
    copyMakeBorder, BORDER_CONSTANT, createCLAHE
import imutils
from base64 import b64encode
import logging
from sys import stdout

# Logging
logging.basicConfig(stream=stdout, format='%(asctime)s %(message)s')
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)


class RectangleReconstruct(object):

    def __init__(self, in_image, div_image_by=500, threshold=0.4):
        image = self._add_border(in_image, 15, 15, 15, 15, [0, 0, 0])
        self.original, self.image, self.ratio = self._resize_image(image,
                                                                   div_image_by)
        self.edges = None
        self.threshold = threshold

    @staticmethod
    def _add_border(im, top, bottom, left, right, color):
        return copyMakeBorder(im, top, bottom, left, right, BORDER_CONSTANT,
                              value=color)

    @staticmethod
    def _resize_image(im, factor):
        ratio = im.shape[0] / float(factor)
        orig = im.copy()
        return orig, imutils.resize(im, height=factor), ratio

    def _dilate(self):
        kernel = ones((20, 20), uint8)
        return morphologyEx(self.image, MORPH_OPEN, kernel)

    def _close(self):
        kernel = ones((40, 40), uint8)
        return morphologyEx(self.image, MORPH_CLOSE, kernel)

    @staticmethod
    def _find_edges(im):
        gray = cvtColor(im, COLOR_BGR2GRAY)
        # Apply histogram equalization - The parameters below are good
        clahe = createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
        gray = clahe.apply(gray)
        gray = GaussianBlur(gray, (5, 5), 0)
        return Canny(gray, 75, 200)

    @staticmethod
    def _find_contours(edges):
        cnts = findContours(edges.copy(), RETR_LIST, CHAIN_APPROX_SIMPLE)
        cnts = cnts[0] if imutils.is_cv2() else cnts[1]

        def boxArea(contour):
            return contourArea(RectangleReconstruct._get_box(contour))

        cnts = sorted(cnts, key=boxArea, reverse=True)[:5]
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

    def get_scanned_version(self):
        dilated = self._dilate()
        edges = self._find_edges(dilated)
        contour = self._find_contours(edges)
        box = self._get_box(contour)
        warped = self._apply_transformation(box, blackwhite=False)

        r = float(self.original.shape[0])/self.original.shape[1]
        yp = 20
        xp = int(r*20)
        return self._add_border(warped, yp, yp, xp, xp, [0, 0, 0])


if __name__ == "__main__":
    files = ["example_02.jpg", "example_03.jpg", "example_04.jpg",
             "example_05.jpg", "example_06.jpg", "example_07.jpg",
             "example_08.jpg", "example_09.jpg", "example_10.jpg",
             "example_11.jpg"]

    path = "../fixtures/" + files[7]

    with open(path, "rb") as f:
        im64 = b64encode(f.read())

    rectangle = RectangleReconstruct(im64, 900, threshold=0.4)
    # scan = rectangle.get_scanned_version()
    # from cv2 import imshow, waitKey, destroyAllWindows, drawContours, imwrite
    # if scan is not None:
    #     imshow("Scan found",
    #            imutils.resize(rectangle.original,height=650))
    #     imshow("Scanned", imutils.resize(scan, height=650))
    #     waitKey()
    # else:
    #     imshow("No Scan found",
    #            imutils.resize(rectangle.original, height=650))
    #     waitKey()
    # destroyAllWindows()
