from json import loads, load
import logging
from sys import stdout
from importlib import import_module

# Logging
logging.basicConfig(stream=stdout, format='%(asctime)s %(message)s')
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)

class Parser(object):
    """
       Parses the incoming request from the app
       """

    def __init__(self, request):
        self.request = request

        # The request parameter is a list of dict objects. We check the first
        #  element for the presence of the field datamodel_version.
        if "datamodel_version" not in request[0]:
            raise Exception("version not found in request")
        else:
            logger.info("")
            self.version = str(request[0]["datamodel_version"]).replace(".", "")

    def parse(self):
        hand = import_module("data_parsers.parser_v{}".format(
            self.version.replace(".", "")))

        return hand.Parser(self.request).upload()
