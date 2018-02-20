from json import load, dump, dumps
from base64 import b64encode, b64decode
from requests import post
from time import time


def read_image(path):
    with open(path, "rb") as f:
        im = f.read()
    return b64encode(im)

def get_fixture_for_ocr(image):
    return {
        "device": "android",
        "email": "adampackets@gmail.com",
        "extract_reminder": False,
        "human_translation_requested": False,
        "image": image,
        "input_language": "nl",
        "output": ["email", "app"],
        "output_language": "en",
        "timestamp": int(1000*time()),
        "user_id": "b8e75ce1bc2d0e5b",
        "version": 0.2,
        "debug": True
    }

def get_ocr_payload(image, in_language="nl"):
    return {
        "requests": [
            {
                "image": {
                    "content": image
                },
                "features": [
                    {
                        "type": "DOCUMENT_TEXT_DETECTION"
                    }],
                "imageContext": {
                    "languageHints": [in_language],
                }
            }
        ]
    }

def get_ocr_result(payload):
    api_key = "AIzaSyB5KLbSquVl7pYsYjVpCOhOsrqjYTbuf-8"
    response = post(
        "https://vision.googleapis.com/v1/images:annotate?key=" +
        api_key,
        data=dumps(payload),
        headers={"Content-Type": "application/json"}
    )

    if 200 <= response.status_code < 300:
        return response.json()
    else:
        print ("Status code = {}, reason = {}".format(response.status_code,
                                                      response.reason))


if __name__=="__main__":
    """ Small script to create new fixtures as we add more test cases to the
    back-end API.
    """
    filename = "request_01.jpeg"

    im = read_image(filename)

    ocr_fix = get_fixture_for_ocr(im)

    ocr_res = get_ocr_result(get_ocr_payload(im))

    with open("request_01.json", "w") as f:
        dump(ocr_fix, f, indent=4)

    with open("request_01_ocr.json", "w") as f:
        dump(ocr_res, f, indent=4)
