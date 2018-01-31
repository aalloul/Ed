from json import loads, load
import logging
from sys import stdout
from importlib import import_module
from custom_exceptions.custom_exceptions import JSONMalformed, \
    IncompleteRequestBody

# Logging
logging.basicConfig(stream=stdout, format='%(asctime)s %(message)s')
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)


class RequestParser(object):
    """
    Parses the incoming request from the app
    """

    def __init__(self, request):
        try:
            self.request = loads(request)
        except ValueError:
            raise JSONMalformed("Json malformed.")
        except Exception as ex:
            raise Exception("Unknown exception: {}".format(ex.message))

        if "version" not in self.request:
            raise IncompleteRequestBody("version not found in request")
        else:
            self.version = str(self.request["version"]).replace(".", "")

    def parse(self):
        hand = import_module("request_parser.parser_v{}".format(
            self.version.replace(".", "")))

        return hand.Parser(self.request)

if __name__ == "__main__":
    with open("../fixture/test_rotation_90.json", "r") as f:
        j = f.read()
    parsed_req = RequestParser(j).parse()
