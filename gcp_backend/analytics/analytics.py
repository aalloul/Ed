import logging
from sys import stdout
from json import load, dumps
from google.appengine.api.urlfetch import POST, create_rpc, make_fetch_call
from google.auth.transport.requests import Request
import google.auth
from time import time
from hashlib import sha1
from base64 import b64decode
from uuid import uuid4

logging.basicConfig(stream=stdout, format='%(asctime)s %(message)s')
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)


class Analytics(object):
    def __init__(self):
        self._secret = self._load_secrets()
        self.url = "https://www.googleapis.com/bigquery/v2/projects/" \
                   "{google_cloud_project}/datasets/{datasetId}/tables/" \
                   "{tableId}/insertAll".format(
                        tableId=self._secret["table_id"],
                        datasetId=self._secret["dataset_id"],
                        google_cloud_project=self._secret["project_id"])

        logger.debug("dataset_id = {}, table_id = {}".format(
            self._secret["dataset_id"], self._secret["table_id"],
        ))

        self.storage_scope = "https://www.googleapis.com/auth/" \
                             "devstorage.read_write"
        self._storage_token = None
        self.token = "Bearer {access_token}"
        self._body = {"request_timestamp": round(time(), 3)}
        self.image = None
        self.extracted_text = None
        self.translated_text = None
        self.storage_bucket = 'smail_images'
        self.storage_images = 'raw_images'
        self.storage_extracted_text = 'raw_text'
        self.storage_translated_text = 'translated_text'
        self.file_name = uuid4()

    @staticmethod
    def _load_secrets():
        with open("project.secret", "r") as f:
            return load(f)

    @staticmethod
    def _refresh_token(scope):
        logger.debug("Token refresh start")
        credentials, _ = google.auth.default(scopes=(scope,))
        request = Request()
        credentials.refresh(request)
        logger.debug("  -> Token refreshed")
        return credentials.token

    def _get_payload(self):

        return {
            "kind": "bigquery#tableDataInsertAllRequest",
            "skipInvalidRows": False,
            "ignoreUnknownValues": False,
            "rows": [
                {
                    "insertId": sha1(dumps(self._body)).hexdigest(),
                    "json": self._body
                }
            ]
        }

    def commit(self):
        logger.info("Uploading to BQ")
        rpc_bq = self.upload_bq()
        logger.info("Uploading the images")
        rpc_im = self.upload_images()
        logger.info("Uploading the raw text")
        rpc_ext_text = self.upload_raw_text()
        logger.info("Uploading the translated text")
        rpc_trans_text = self.upload_trans_text()

        logger.info("BQ get results")
        self._check_answer(rpc_bq.get_result())
        logger.info("  -> Received")

        if rpc_ext_text is not None:
            logger.info("rpc_ext_text get results")
            self._check_answer(rpc_ext_text.get_result())

        if rpc_trans_text is not None:
            logger.info("rpc_trans_text get results")
            self._check_answer(rpc_trans_text.get_result())

        if rpc_im is not None:
            logger.info("rpc_im get results")
            self._check_answer(rpc_im.get_result())

        logger.info("Done")

    def upload_bq(self):
        logger.debug('Event to report = {}'.format(
            dumps(self._body, indent=4)
        ))

        logger.debug("Refreshing token")
        sc = "https://www.googleapis.com/auth/bigquery.insertdata"
        token = self._refresh_token(sc)
        rpc = create_rpc(deadline=300)  # TODO improve this!

        logger.debug("Posting data to BigQuery")
        make_fetch_call(rpc, self.url, method=POST,
                        headers={
                            "Content-Type": "application/json",
                            "Authorization": self.token.format(
                                access_token=token)
                        },
                        payload=dumps(self._get_payload())
                        )
        return rpc

    @staticmethod
    def _check_answer(answer):
        if 200 <= answer.status_code < 300:
            return True

        else:
            logger.error("Answer error = {}".format(answer.content))
            raise Exception("Errors were returned. Check the logs!")

    def add_request_summary(self, req):
        self._body.update(req)

    def add_event(self, k, v):
        logger.debug("Adding event {}:{}".format(k, v))

        if k in self._body.keys():
            raise ValueError("Key {} is already present in the event {}".format(
                k, self._body
            ))

        self._body[k] = v

    def add_image(self, im):
        self.image = im

    def add_extracted_text(self, te):
        self.extracted_text = te

    def add_translated_text(self, te):
        self.translated_text = te

    def upload_images(self):

        if self._storage_token is None:
            self._storage_token = self._refresh_token(self.storage_scope)

        logger.debug("Token = {}".format(self.storage_scope))

        rpc = create_rpc(deadline=300)  # TODO Change this to acceptable delay

        url = "https://www.googleapis.com/upload/storage/v1/b/{bucket}" \
              "/o?uploadType=media&name={name}".format(
                    bucket=self.storage_bucket,
                    name=self.storage_images + "/{}.jpeg".format(self.file_name)
                )

        make_fetch_call(rpc,
                        url,
                        method=POST,
                        headers={
                            "Content-Type": "image/jpeg",
                            "Authorization": self.token.format(
                                access_token=self._storage_token)
                        },
                        payload=b64decode(self.image)
                        )

        return rpc

    def upload_raw_text(self):
        if self.extracted_text is None:
            logger.info("No extracted text found")
            return

        if self._storage_token is None:
            self._storage_token = self._refresh_token(self.storage_scope)

        logger.info("Token = {}".format(self._storage_token))
        rpc = create_rpc(deadline=300)  # TODO Change this to acceptable delay

        url = "https://www.googleapis.com/upload/storage/v1/b/{bucket}" \
              "/o?uploadType=media&name={name}".format(
                    bucket=self.storage_bucket,
                    name=self.storage_extracted_text +
                    "/{}.json".format(self.file_name)
                )

        logger.info("make_fetch_all started...")
        make_fetch_call(rpc, url, method=POST,
                        headers={
                            "Content-Type": "application/json",
                            "Authorization": self.token.format(
                                access_token=self._storage_token)
                        },
                        payload=self.extracted_text
                        )
        return rpc

    def upload_trans_text(self):

        if self.translated_text is None:
            logger.info("No translated text found")
            return

        if self._storage_token is None:
            self._storage_token = self._refresh_token(self.storage_scope)

        logger.info("Token = {}".format(self._storage_token))
        rpc = create_rpc(deadline=300)  # TODO Change this to acceptable delay

        url = "https://www.googleapis.com/upload/storage/v1/b/{bucket}" \
              "/o?uploadType=media&name={name}".format(
                bucket=self.storage_bucket,
                name=self.storage_translated_text + "/{}.json".format(
                    self.file_name)
                )

        logger.info("make_fetch_all started...")
        make_fetch_call(rpc,
                        url,
                        method=POST,
                        headers={
                            "Content-Type": "application/json",
                            "Authorization": self.token.format(
                                access_token=self._storage_token)
                        },
                        payload=self.translated_text
                        )
        return rpc
