from flask import jsonify


class Answer(object):
    def __init__(self, ):
        pass

    def get_answer(self):
        return jsonify(self._build_answer())

    def _build_answer(self):
        return {
            "translated_text": "Some translation text goes here",
            "original_text": "Sommige vertalingstekst komt hier",
            "set_reminder": True,
            "reminder": 1513071050000
        }
