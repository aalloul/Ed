#!/usr/bin/env python
import os


with open("version.txt", "r") as f:
    version = f.read()

version = int(version)

if version < 9:
    version_str = "00{}".format(version+1)
elif version >= 9 and version < 100:
    version_str = "0{}".format(version+1)
else:
    version_str = str(version+1)


res = os.system("gcloud app deploy --version {}".format(version_str))

if res == 0:
    with open("version.txt", "w") as f:
        f.write(version_str)
else:
    print ("ERROR - Deployment ended with exit status == {}".format(res))

