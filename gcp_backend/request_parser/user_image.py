import base64
from correct_perspective import correct
from PIL import Image, ExifTags
from io import BytesIO
import logging
from sys import stdout

# Logging
logging.basicConfig(stream=stdout, format='%(asctime)s %(message)s')
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)


class UserImage(object):
    def __init__(self, input_b64, dryrun=False, result_=None):
        self.input_b64 = self._parse_input(input_b64)
        self.corrected_perspective = correct(self.input_b64, dryrun=dryrun,
                                             result_=result_)

    def _parse_input(self, b64):
        t = self.b64_to_image(b64)
        t = self.correct_orientation(t, self.get_orientation(t))
        return self.image_to_64(t)

    def get_image(self):
        if self.corrected_perspective is None:
            return self.input_b64
        else:
            return self.corrected_perspective

    @staticmethod
    def get_orientation(image):
        ori = ""

        for orientations in ExifTags.TAGS.keys():
            if ExifTags.TAGS[orientations] == 'Orientation':
                ori = orientations

        if image._getexif() is None:
            return 0

        exif = dict(image._getexif().items())

        if ori not in exif:
            logger.info("Image has no orientation TAG")
            return 0

        if exif[ori] == 3:
            logger.info("Image has an orientation of 180")
            return 180
        elif exif[ori] == 6:
            logger.info("Image has an orientation of 270")
            return 270
        elif exif[ori] == 8:
            logger.info("Image has an orientation of 90")
            return 90
        else:
            logger.info("Image has an orientation of 0")
            return 0

    @staticmethod
    def get_size(image):
        return image.size

    @staticmethod
    def image_to_64(img):
        from cStringIO import StringIO
        buff = StringIO()
        img.save(buff, format="JPEG")
        return base64.b64encode(buff.getvalue())

    @staticmethod
    def b64_to_image(b64):
        return Image.open(BytesIO(base64.b64decode(b64)))

    @staticmethod
    def correct_orientation(im, angle):
        return im.rotate(angle, expand=True)

    # def get_thumbnail(self, im, size):
    #     im = self.b64_to_image(im)
    #     im = self.correct_orientation(im, self.get_orientation(im))
    #     return self.image_to_64(im.thumbnail(size))


if __name__ == "__main__":
    from json import load

    with open("/Users/adamalloul/Ed/gcp_backend/fixture/request_01.json",
              "r") as f:
        input_image = load(f)['image']
