from flask import jsonify


class Answer(object):
    def __init__(self, original_text=None, translated_text=None, exception=None,
                 reminder=None, human_requested=False, email_status=False):

        self.exception = exception
        self.original_text = original_text
        self.translated_text = translated_text
        self.reminder = reminder
        self.human_requested = human_requested
        self.email_status = email_status


    def get_answer(self):
        if self.exception is not None:
            return jsonify(self._build_exception_answer())
        else:
            return jsonify(self._build_answer())

    def _build_exception_answer(self):
        return {
            "exception": str(self.exception)
        }

    def _build_answer(self):
        if self.human_requested:
            return {
                "ack": 200
            }
        if self.reminder is None:
            return {
                "translated_text": self.translated_text,
                "original_text": self.original_text,
                "email_status": self.email_status,
                "set_reminder": False
            }
        else:
            return {
                "translated_text": self.translated_text,
                "original_text": self.original_text,
                "set_reminder": True,
                "email_status": self.email_status,
                "reminder": self.reminder
            }
