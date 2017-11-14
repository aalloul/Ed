import sendgrid
from sendgrid.helpers import mail
import logging
from sys import stdout

# Logging
logging.basicConfig(stream=stdout, format='%(asctime)s %(message)s')
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)


class Sendgrid(object):
    """

    """

    def __init__(self, initial_request, extracted_text, translated_text):
        logger.info("Initializing Sendgrid client")
        self.api_key = \
            "SG.dL-7fS_ER9GeIC5s5AVlww" \
            ".uoM3usp8D6jVHkG1YAKBmIhdfTpSGclwuUPgdHWHh2M"
        self.sendgrid_sender = 'ed@ed.com'
        self.initial_request = initial_request
        self.extracted_text = extracted_text
        self.translated_text = translated_text

    def _build_message(self):
        logger.info("Build message")

        to_email = mail.Email(self.initial_request.get_email())
        logger.debug("  - to {}".format(to_email))

        from_email = mail.Email(self.sendgrid_sender)
        logger.debug("  - from {}".format(from_email))

        subject = 'Ed - Your mail scanned, translated and ready for ' \
                  'archiving'
        content = mail.Content('text/plain', self._get_content())
        logger.debug("  - Content {}".format(self._get_content()[0:50]))

        message = mail.Mail(from_email=from_email, subject=subject,
                            to_email=to_email, content=content)

        message.add_attachment(self._build_attachment())
        logger.debug("  -> Message built")
        return message

    def _build_attachment(self):
        logger.info("Add attachment")
        attachment = mail.Attachment()
        attachment.content = (self.initial_request.get_image())
        attachment.type = "application/jpg"
        attachment.filename = "scanned_document.jpg"
        attachment.disposition = "attachment"
        attachment.content_id = "Scanned document"
        logger.debug("  -> Attachment added")
        return attachment

    def _get_content(self):
        logger.debug("_get_content Enter")
        logger.debug("  - Extracted text {}".format(self.extracted_text[0:20]))
        logger.debug("  - Extracted text {}".format(self.translated_text[0:20]))

        message = """Dear user,
        
        please find attached a scan of the mail you created a few minutes 
        earlier. Below you can also find the original text extracted 
        automatically and its translation to English.
        
        {}
        
        English version:
        
        {}
        """.format(self.extracted_text, self.translated_text)
        logger.debug("_get_content Exit")

        return message

    def send(self):
        sg = sendgrid.SendGridAPIClient(apikey=self.api_key)
        response = sg.client.mail.send.post(request_body=self._build_message()
                                            .get())
        logger.info("Email sent")
        if 200 <= response.status_code < 300:
            logger.debug("E-mail sent successfully")
            return True, True, True
        else:
            logger.error("E-mail not sent. Status code = {}, body = {}, "
                         "headers = {}".format(response.status_code,
                                               response.body, response.headers))
            return response.status_code, response.body, response.headers