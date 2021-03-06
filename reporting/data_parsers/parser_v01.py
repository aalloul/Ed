import logging
from sys import stdout
from json import load, dumps
from google.appengine.api.urlfetch import fetch, POST
from google.auth.transport.requests import Request
from hashlib import sha1
import google.auth

logging.basicConfig(stream=stdout, format='%(asctime)s %(message)s')
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)


def get_class(body):
    return Parser(body)


class Parser(object):
    def __init__(self, body):
        self._required_fields = ['app_version', 'action',
                                 'phone_maker', 'phone_model', 'os_version',
                                 'user_id', 'timestamp', 'type', 'screen',
                                 'screen_start', 'session_start']
        self._body = self._check_required_fields(body)
        logger.debug("Converting ms to seconds")
        self._convert_ms_to_s()

        logger.debug("Loading secrets")
        self._secret = self._load_secrets()


        self._add_row_hash()

        self.url = "https://www.googleapis.com/bigquery/v2/projects/" \
                   "{google_cloud_project}/datasets/{datasetId}/tables/" \
                   "{tableId}/insertAll".format(
                        tableId=self._secret["table_id"],
                        datasetId=self._secret["dataset_id"],
                        google_cloud_project=self._secret["project_id"])

        self.scope = "https://www.googleapis.com/auth/bigquery.insertdata"
        self.credentials = None
        self.token = "Bearer {access_token}"

    def _convert_ms_to_s(self):
        # All timestamps are received in milliseconds and BQ expects a float
        # where the integer part represents the seconds and the decimal part
        # represents to milli or micro-seconds

        # Mandatory fields first

        for rec in self._body:
            rec['session_start'] = rec["session_start"] / 1000
            rec["timestamp"] = rec["timestamp"] / 1000
            rec["screen_start"] = rec["screen_start"] / 1000

            # Non-mandatory fields
            if "screen_end" in rec:
                rec["screen_end"] = rec["screen_end"] / 1000

            if "session_end" in self._body:
                rec["session_end"] = rec["session_end"] / 1000

    def _check_required_fields(self, body):
        logger.debug("Checking presence of required fields")

        for f in self._required_fields:
            for record in body:
                self._check_required_fields_per_record(record, f)

        return body

    @staticmethod
    def _check_required_fields_per_record(record, field):
        if field not in record.keys():
            logger.error("Required key {} is missing".format(field))
            raise ValueError("Required key {} is missing".format(field))

    @staticmethod
    def _load_secrets():
        with open("project.secret", "r") as f:
            return load(f)

    def _add_row_hash(self):
        logger.debug("Adding hash value to each row")
        for row in self._body:
            row["_hash"] = self._get_hash(row)

    @staticmethod
    def _get_hash(row):
        return sha1(dumps(row).encode("utf-8")).hexdigest()

    def _refresh_token(self):
        logger.debug("Token refresh start")
        self.credentials, _ = google.auth.default(scopes=(self.scope,))
        request = Request()
        self.credentials.refresh(request)
        logger.debug("  -> Token refreshed")
        self.token = self.token.format(access_token=self.credentials.token)

    def _get_payload(self):

        payload = {
            "kind": "bigquery#tableDataInsertAllRequest",
            "skipInvalidRows": False,
            "ignoreUnknownValues": False,
            "rows": []
        }

        payload["rows"] = [
            {"insertId": it["_hash"], "json": it} for it in self._body]

        return payload

    def upload(self):
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
            logger.info("Insert of rows into BigQuery went well")
