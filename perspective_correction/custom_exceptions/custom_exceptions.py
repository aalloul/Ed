class GenericImageCorrectionException(Exception):
    def __init__(self, *args):
        super(GenericImageCorrectionException, self).__init__(args)
        self.error_code = None
        self.description = ""

    def get_json(self):
        return {
            "error_code": self.error_code,
            "description": self.description,
            "reason": self.message
        }


class UnknownError(GenericImageCorrectionException):
    def __init__(self, *args):
        super(UnknownError, self).__init__(args)
        self.error_code = 0
        self.description = "Unknown error happened. User should retry later " \
                           "because service is unavailable."
        self.message = args[0]


class NoImprovementFound(GenericImageCorrectionException):
    def __init__(self, *args):
        super(NoImprovementFound, self).__init__(args)
        self.error_code = 1
        self.description = "I did not find an efficient crop for the picture."
        self.message = args[0]


class UnsatisfyingResult(GenericImageCorrectionException):
    def __init__(self, *args):
        super(UnsatisfyingResult, self).__init__(args)
        self.error_code = 2
        self.description = "The result of the optimization leads to a too " \
                           "large degradation in quality."
        self.message = args[0]
