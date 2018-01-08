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

    def __init__(self, initial_request, html, parsed_ocr=None,
                 human_translation=False):

        logger.info("Initializing Sendgrid client")
        self.api_key = \
            "SG.dL-7fS_ER9GeIC5s5AVlww" \
            ".uoM3usp8D6jVHkG1YAKBmIhdfTpSGclwuUPgdHWHh2M"
        self.sendgrid_sender = 'smail@smail.rocks'
        self.initial_request = initial_request
        self.human_translation = human_translation
        self.parsed_ocr = parsed_ocr
        self.DEBUG = False
        self.html = html

    def _build_message_for_auto_translation(self):
        """Builds the message when the required translation is automatic"""

        to_email = mail.Email(self.initial_request.get_email())
        logger.debug("  - to {}".format(to_email))

        from_email = mail.Email(self.sendgrid_sender)
        logger.debug("  - from {}".format(from_email))

        subject = 'Smail - Your mail scanned, translated and ready for ' \
                  'archiving'
        logger.info(self.html)
        content = mail.Content('text/html', self.html)
        logger.debug("  - Content done")

        message = mail.Mail(from_email=from_email, subject=subject,
                            to_email=to_email, content=content)

        message.add_attachment(self._build_attachment())
        logger.debug("  -> Message built")
        return message

    def _build_message_for_human_translator(self):
        logger.debug("Building message:")
        to_email = mail.Email("adampackets@gmail.com")
        logger.debug("  - to {}".format(to_email))

        from_email = mail.Email(self.sendgrid_sender)
        logger.debug("  - from {}".format(from_email))

        subject = 'Smail - Human translation required'
        content = mail.Content('text/plain',
                               self._get_content_for_human_translations())
        logger.debug("  - Content (first 50 chars) {}".format(
            self._get_content_for_human_translations()[0:50]))

        message = mail.Mail(from_email=from_email, subject=subject,
                            to_email=to_email, content=content)

        message.add_attachment(self._build_attachment())
        logger.debug("  -> Message built")
        return message

    def _build_message(self):
        logger.info("Build message")

        if self.human_translation:
            return self._build_message_for_human_translator()
        else:
            return self._build_message_for_auto_translation()

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

    def _get_content_for_human_translations(self):
        logger.debug("Building content for human translation")
        logger.debug("self.initial_request.get_email() = ".format(self.initial_request.get_email()))
        message = """Dear translator, 
        
        user with e-mail address {} requires a human translation for the 
        attached document!
        
        Thanks!
        """.format(self.initial_request.get_email())

        return message

    def _get_content_for_automatic_translations(self):
        logger.debug("Building content for automatic translation")

        message = """Dear user,
        
        please find attached a scan of the mail you created a few minutes 
        earlier. Below you can also find the original text extracted 
        automatically and its translation to English.
        
        English version:
        
        {}
        
        Original version
        
        {}
        
        Your friends @ Smail!
        """.format(self._get_english_version(), self._get_original_version())
        logger.debug("Content built (50 chars) = {}".format(message[0:50]))
        return message

    def _get_english_version(self):
        logger.info("Extracting English version")
        return "\n".join([w['translation'] for w in self.parsed_ocr[1]])

    def _get_original_version(self):
        logger.info("Extracting original version")
        return "\n".join([w['word'] for w in self.parsed_ocr[1]])

    def send(self):
        if self.DEBUG:
            return 200, "", ""

        try:
            sg = sendgrid.SendGridAPIClient(apikey=self.api_key)
            response = sg.client.mail.send.post(
                request_body=self._build_message().get())
        except Exception as ex:
            logger.error("ERror!!! {}".format(ex))
            logger.error(ex.message)
            raise

        logger.info("Email sent")
        return response.status_code, response.body, response.headers
