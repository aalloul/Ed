class GenericSmailException(Exception):
    def __init__(self, *args):
        super(GenericSmailException, self).__init__(args)
        self.error_code = None
        self.description = ""

    def get_json(self):
        return {
            "error_code": self.error_code,
            "description": self.description,
            "reason": self.message
        }


class UnknownError(GenericSmailException):
    def __init__(self, *args):
        super(UnknownError, self).__init__(args)
        self.error_code = 0
        self.description = "Unknown error happened. User should retry later " \
                           "because service is unavailable."
        self.message = args[0]


class JSONMalformed(GenericSmailException):
    def __init__(self, *args):
        super(JSONMalformed, self).__init__(args)
        self.error_code = 1
        self.description = "JSON malformed: The JSON sent as a body is " \
                           "incorrect -- Check implementation"
        self.message = args[0]


class IncompleteRequestBody(GenericSmailException):
    def __init__(self, *args):
        super(IncompleteRequestBody, self).__init__(args)
        self.error_code = 2
        self.description = "Incomplete request body. The JSON sent does not " \
                           "contain all required fields"
        self.message = args[0]


class ImageDecodingException(GenericSmailException):
    def __init__(self, *args):
        super(ImageDecodingException, self).__init__(args)
        self.error_code = 3
        self.description = "Unable to decode image (from String to Bytes). " \
                           "Something went wrong when encoding"
        self.message = args[0]


class UnknownOCRException(GenericSmailException):
    def __init__(self, *args):
        super(UnknownOCRException, self).__init__(args)
        self.error_code = 4
        self.description = "Unknown error in OCR module. Ask user to retry " \
                           "later."
        self.message = args[0]


class UnknownTranslationError(GenericSmailException):
    def __init__(self, *args):
        super(UnknownTranslationError, self).__init__(args)
        self.error_code = 5
        self.description = "Unknown error in Translation module. Ask user to " \
                           "retry later."
        self.message = args[0]

class HTMLFormattingServiceException(GenericSmailException):
    def __init__(self, *args):
        super(HTMLFormattingServiceException, self).__init__(args)
        self.error_code = 6
        self.description = "Error with HTML formatting service. Ask user to " \
                           "retry later."
        self.message = args[0]


class NoTextFoundException(GenericSmailException):
    def __init__(self, *args):
        super(NoTextFoundException, self).__init__(args)
        self.error_code = 7
        self.description = "No text found in image. Ask user to check the " \
                           "image for text,improve picture."
        self.message = args[0]


class UnknownEmailException(GenericSmailException):
    def __init__(self, *args):
        super(UnknownEmailException, self).__init__(args)
        self.error_code = 8
        self.description = "Something went wrong with the e-mail. Request the" \
                           "user to check his e-mail/retry"
        self.message = args[0]


if __name__ == "__main__":
    try:
        raise NoTextFoundException("werewr")
    except NoTextFoundException as ex:
        print(ex.get_json())
