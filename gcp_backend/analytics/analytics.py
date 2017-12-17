import logging
from sys import stdout
from json import load, dumps
from google.appengine.api.urlfetch import fetch, POST
from google.auth.transport.requests import Request
import google.auth
from time import time
from hashlib import sha1

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

        self.scope = "https://www.googleapis.com/auth/bigquery.insertdata"
        self.credentials = None
        self.token = "Bearer {access_token}"
        self._body = {"request_timestamp": round(time(), 3)}

    @staticmethod
    def _load_secrets():
        with open("project.secret", "r") as f:
            return load(f)

    def _refresh_token(self):
        logger.debug("Token refresh start")
        self.credentials, _ = google.auth.default(scopes=(self.scope,))
        request = Request()
        self.credentials.refresh(request)
        logger.debug("  -> Token refreshed")
        self.token = self.token.format(access_token=self.credentials.token)

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
        logger.debug('Event to report = {}'.format(
            dumps(self._body, indent=4)
        ))

        if self.credentials is None:
            logger.debug("Refreshing token")
            self._refresh_token()

        try:
            logger.debug("Posting data to BigQuery")
            res = fetch(
                self.url,
                method=POST,
                headers={
                    "Content-Type": "application/json",
                    "Authorization": self.token
                },
                payload=dumps(self._get_payload())
            )
            self._check_answer(res.content)
        except Exception as ex:
            logger.error(ex)
            raise ex

    @staticmethod
    def _check_answer(answer):
        if "errors" in answer:
            logger.error("Answer received from BigQuery = {}".format(answer))
            raise Exception("Errors were returned by BigQuery. Check the logs!")
        else:
            logger.info("Answer from BQ = {}".format(answer))
            logger.info("Insert of rows into BigQuery went well")

    def add_request_summary(self, req):
        self._body.update(req)

    def add_event(self, k, v):
        logger.debug("Adding event {}:{}".format(k, v))

        if k in self._body.keys():
            raise ValueError("Key {} is already present in the event {}".format(
                k, self._body
            ))

        self._body[k] = v
