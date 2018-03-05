import logging
from sys import stdout
from json import dumps, loads

# Logging
logging.basicConfig(stream=stdout, format='%(asctime)s %(message)s')
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)


def _request_library(url, data):
    h = {"Content-Type": "application/json"}
    if __name__ == "__main__":
        from requests import post
        return post(
            url, data=data,
        )
    else:
        from google.appengine.api.urlfetch import fetch, POST
        return fetch(
            url,
            payload=data,
            method=POST,
            headers=h
        )


def correct(b64):
    _url = "http://35.230.54.110:33330/correct_image"
    logger.info("Request persppective correction started")

    req = _request_library(_url, dumps({"image": b64}))
    if req.status_code >= 300:
        logger.info("Received error from server {}".format(req.content))
        return b64
    else:
        if 'result' not in req.content:
            logger.info("Result not in response".format(req.content))
            return b64
        else:
            logger.info("All good, returning")
            return loads(req.content)['result']


if __name__ == "__main__":
    from base64 import b64encode

    with open("../fixture/request_rotation_270_2.jpeg", "rb") as f:
        im = b64encode(f.read())

    t_ = correct(im)
