from flask import jsonify


class Answer(object):
    def __init__(self, original_text=None, translated_text=None,
                 reminder=None, human_requested = False):
        self.original_text = original_text
        self.translated_text = translated_text
        self.reminder = reminder
        self.human_requested = human_requested

    def get_answer(self):
        return jsonify(self._build_answer())

    def _build_answer(self):
        if self.human_requested:
            return {
                "ack": 200
            }
        if self.reminder is None:
            return {
                "translated_text": self.translated_text,
                "original_text": self.original_text,
                "set_reminder": False
            }
        else:
            return {
                "translated_text": self.translated_text,
                "original_text": self.original_text,
                "set_reminder": True,
                "reminder": self.reminder
            }