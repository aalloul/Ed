# import the necessary packages
import numpy as np
from cv2 import getPerspectiveTransform, warpPerspective
cimport numpy as np
DTYPE = np.int
ctypedef np.int_t DTYPE_t


cdef order_points(np.ndarray pts):
    # initialzie a list of coordinates that will be ordered
    # such that the first entry in the list is the top-left,
    # the second entry is the top-right, the third is the
    # bottom-right, and the fourth is the bottom-left
    cdef np.ndarray rect = np.zeros((4, 2), dtype="float32")

    # the top-left point will have the smallest sum, whereas
    # the bottom-right point will have the largest sum
    cdef np.ndarray s = pts.sum(axis=1)
    rect[0] = pts[np.argmin(s)]
    rect[2] = pts[np.argmax(s)]

    # now, compute the difference between the points, the
    # top-right point will have the smallest difference,
    # whereas the bottom-left will have the largest difference
    cdef np.ndarray diff_ = np.diff(pts, axis=1)
    rect[1] = pts[np.argmin(diff_)]
    rect[3] = pts[np.argmax(diff_)]

    # return the ordered coordinates
    return rect


def four_point_transform(np.ndarray image, np.ndarray pts):
    # obtain a consistent order of the points and unpack them
    # individually
    cdef np.ndarray rect = order_points(pts)
    cdef np.ndarray tl = rect[0]
    cdef np.ndarray tr = rect[1]
    cdef np.ndarray br = rect[2]
    cdef np.ndarray bl = rect[3]
    # (tl, tr, br, bl) = rect

    # compute the width of the new image, which will be the
    # maximum distance between bottom-right and bottom-left
    # x-coordiates or the top-right and top-left x-coordinates
    cdef double widthA = np.sqrt(((br[0] - bl[0]) ** 2) + ((br[1] - bl[1]) ** 2)
    )
    cdef double widthB = np.sqrt(((tr[0] - tl[0]) ** 2) + ((tr[1] - tl[1]) ** 2))
    cdef int maxWidth = max(int(widthA), int(widthB))

    # compute the height of the new image, which will be the
    # maximum distance between the top-right and bottom-right
    # y-coordinates or the top-left and bottom-left y-coordinates
    cdef double heightA = np.sqrt(((tr[0] - br[0]) ** 2) + ((tr[1] - br[1]) **
    2)
    )
    cdef double heightB = np.sqrt(((tl[0] - bl[0]) ** 2) + ((tl[1] - bl[1]) **
    2)
    )
    cdef int maxHeight = max(int(heightA), int(heightB))

    # now that we have the dimensions of the new image, construct
    # the set of destination points to obtain a "birds eye view",
    # (i.e. top-down view) of the image, again specifying points
    # in the top-left, top-right, bottom-right, and bottom-left
    # order
    cdef np.ndarray dst = np.array([
        [0, 0],
        [maxWidth - 1, 0],
        [maxWidth - 1, maxHeight - 1],
        [0, maxHeight - 1]], dtype="float32")

    # compute the perspective transform matrix and then apply it
    cdef np.ndarray M = getPerspectiveTransform(rect, dst)

    # return the warped image
    return warpPerspective(image, M, (maxWidth, maxHeight))
