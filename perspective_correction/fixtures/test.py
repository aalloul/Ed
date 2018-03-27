#!/usr/bin/env python

from requests import post
from os import chdir
from base64 import b64encode, b64decode
from json import loads
from time import time
from glob import glob


# url = "http://35.230.54.110:33330/correct_image"
url = "http://127.0.0.1:5000/correct_image"
#fname = "request_first_user_06.jpeg"
fname = "example_01.png"
with open(fname, "rb") as f:
    image = b64encode(f.read())
    print("Read done")
start = time()
req = post(url,json={"image":image})
print ("Post done")
if 199 < req.status_code < 300:
    res = req.json()
    print ("Request took {} s".format(time() - start))
    with open("../output/" + fname, "wb") as f:
        f.write(b64decode(res['result']))
else:
    print(req.status_code)
    print(req.reason)
    print("No improvement for {}".format(fname))

# fnames = glob("*jp*g")
#
# for fname in fnames:
#     print "file = "+fname
#     with open(fname, "rb") as f:
#         image = b64encode(f.read())
#
#     start = time()
#     req = post("http://127.0.0.1:5000/correct_image",json={"image":image})
#     if 199 < req.status_code < 300:
#         res = req.json()
#         print ("Request took {} s".format(time() - start))
#         with open("../output/"+fname, "wb") as f:
#             f.write(b64decode(res['result']))
#     else:
#         print(req.status_code)
#         print(req.reason)
#         print("No improvement for {}".format(fname))
#
