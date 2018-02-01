from json import dumps
import logging
from sys import stdout
from base64 import b64decode
from custom_exceptions.custom_exceptions import IncompleteRequestBody, \
    ImageDecodingException

# Logging
logging.basicConfig(stream=stdout, format='%(asctime)s %(message)s')
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)


class Parser(object):
    """
    Parses the incoming request from the app
    """

    def __init__(self, request):
        self.version = 0.2

        logger.debug("Request loaded to JSON")
        self._set_output(request)
        logger.debug("_set_output done")
        self._set_email(request)
        logger.debug("_set_email done")
        self._set_input_language(request)
        logger.debug("_set_input_language done")
        self._set_output_language(request)
        logger.debug("_set_output_language done")
        self._set_human_translation_requested(request)
        logger.debug("_set_human_translation_requested")
        self._set_image(request)
        logger.debug("_set_image")
        self._set_timestamp(request)
        logger.debug("_set_timestamp")
        self._set_device(request)
        logger.debug("_set_device")
        self._set_version(request)
        logger.debug("_set_version")
        self._set_user_id(request)
        logger.debug("_set_user_id")
        self._set_extract_reminder(request)
        logger.debug("_set_debug")
        self._set_debug(request)

        logger.debug("Request parsing done")

    def _set_debug(self, request):
        if "debug" not in request:
            raise IncompleteRequestBody("debug parameter not found in request")
        else:
            self.debug = request["debug"]

    def _set_output(self, request):
        if "output" not in request:
            raise IncompleteRequestBody("output parameter not found in request")
        else:
            self.output = request["output"]

    def _set_email(self, request):
        if "email" not in request:
            raise IncompleteRequestBody("email parameter not found in request")
        else:
            self.email = request["email"]

    def _set_input_language(self, request):
        if "input_language" not in request:
            self.input_language = "nl"
        else:
            self.input_language = request["input_language"]

    def _set_output_language(self, request):
        if "output_language" not in request:
            self.output_language = "en"
        else:
            self.output_language = request["output_language"]

    def _set_human_translation_requested(self, request):
        if "human_translation_requested" not in request:
            raise IncompleteRequestBody("human_translation_requested not found"
                                        " in request")
        else:
            self.human_translation_requested = request[
                'human_translation_requested']

    def _set_image(self, request):
        if "image" not in request:
            raise IncompleteRequestBody("image not found in request")

        try:
            b64decode(request['image'])
        except Exception as ex:
            logger.error("Caught an exception while decoding image")
            logger.error("Message was = {}".format(ex.message))
            raise ImageDecodingException(ex.message)

        self.image = request["image"]

    def _set_timestamp(self, request):
        if "timestamp" not in request:
            raise IncompleteRequestBody("timestamp not found in request")
        else:
            self.timestamp = request["timestamp"] / 1000

    def _set_device(self, request):
        if "device" not in request:
            raise IncompleteRequestBody("device not found in request")
        else:
            self.device = request["device"]

    def _set_version(self, request):
        if "version" not in request:
            raise IncompleteRequestBody("version not found in request")
        else:
            self.version = request["version"]

    def _set_user_id(self, request):
        if "user_id" not in request:
            raise IncompleteRequestBody("user_id not found in request")
        else:
            self.user_id = request["user_id"]

    def _set_extract_reminder(self, request):
        if "user_id" not in request:
            self.extract_reminder = False
        else:
            self.extract_reminder = request["extract_reminder"]

    def get_output(self):
        return self.output

    def get_email(self):
        return self.email

    def get_input_language(self):
        return self.input_language

    def get_output_language(self):
        return self.output_language

    def get_human_translation_requested(self):
        return self.human_translation_requested

    def get_image(self):
        return self.image

    def get_timestamp(self):
        return self.timestamp

    def get_device(self):
        return self.device

    def get_version(self):
        return self.version

    def get_user_id(self):
        return self.user_id

    def get_extract_reminder(self):
        return self.extract_reminder

    def get_debug(self):
        return {
            "email": self.get_email(),
            "input_language": self.get_input_language(),
            "output_language": self.get_output_language(),
            "request_timestamp": self.get_timestamp(),
            "request_version": self.get_version(),
            "extract_reminder": self.get_extract_reminder(),
            "humman_translation_requested":
                self.get_human_translation_requested(),
            "user_id": self.get_user_id()
        }

    def get_request_summary(self):
        return {
            "email": self.get_email(),
            "input_language": self.get_input_language(),
            "output_language": self.get_output_language(),
            "request_timestamp": self.get_timestamp(),
            "request_version": self.get_version(),
            "extract_reminder": self.get_extract_reminder(),
            "humman_translation_requested":
                self.get_human_translation_requested(),
            "user_id": self.get_user_id(),
            "device": self.get_device()
        }

    def __str__(self):
        return dumps(self.get_request_summary(), indent=4)
