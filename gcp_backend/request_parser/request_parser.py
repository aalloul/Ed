from json import loads, dumps


class RequestParser(object):
    """
    Parses the incoming request from the app
    """

    def __init__(self, request):
        request = loads(request)
        self._set_output(request)
        self._set_email(request)
        self._set_input_language(request)
        self._set_output_language(request)
        self._set_human_translation_requested(request)
        self._set_image(request)
        self._set_timestamp(request)
        self._set_device(request)
        self._set_version(request)
        self._set_user_id(request)
        self._set_extract_reminder(request)

    def _set_output(self, request):
        if "output" not in request:
            raise KeyError("output parameter not found in request")
        else:
            self.output = request["output"]

    def _set_email(self, request):
        if "email" not in request:
            raise KeyError("email parameter not found in request")
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
            raise KeyError("human_translation_requested not found in request")
        else:
            self.human_translation_requested = request[
                'human_translation_requested']

    def _set_image(self, request):
        if "image" not in request:
            raise KeyError("image not found in request")
        else:
            self.image = request["image"]

    def _set_timestamp(self, request):
        if "timestamp" not in request:
            raise KeyError("timestamp not found in request")
        else:
            self.timestamp = request["timestamp"]

    def _set_device(self, request):
        if "device" not in request:
            raise KeyError("device not found in request")
        else:
            self.device = request["device"]

    def _set_version(self, request):
        if "version" not in request:
            raise KeyError("version not found in request")
        else:
            self.version = request["version"]

    def _set_user_id(self, request):
        if "user_id" not in request:
            raise KeyError("user_id not found in request")
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
            "e-mail": self.get_email(),
            "input_language": self.get_input_language(),
            "output_language": self.get_output_language(),
            "request_timestamp": self.get_timestamp(),
            "request_version": self.get_version(),
            "extract_reminder": self.get_extract_reminder(),
            "humman_translation_requested":
                self.get_human_translation_requested(),
            "user_id": self.get_user_id()
        }

    def __str__(self):
        return dumps({
            "e-mail": self.get_email(),
            "input_language": self.get_input_language(),
            "output_language": self.get_output_language(),
            "request_timestamp": self.get_timestamp(),
            "request_version": self.get_version(),
            "extract_reminder": self.get_extract_reminder(),
            "humman_translation_requested":
                self.get_human_translation_requested(),
            "user_id": self.get_user_id()
        }, indent=4)
