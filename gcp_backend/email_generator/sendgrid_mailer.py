import sendgrid
from sendgrid.helpers import mail
import logging
from sys import stdout
from custom_exceptions.custom_exceptions import UnknownEmailException

# Logging
logging.basicConfig(stream=stdout, format='%(asctime)s %(message)s')
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)


class Sendgrid(object):
    """

    """
    NO_TEXT_FOUND = "Dear user,\n\n" \
                    "unfortunately we have not been able to decode your letter \
                     and extract the text to translate from it. \n\n" \
                    "May we please ask you to try again and please make sure" \
                    " the image is not blurry. and the text is readable?\n\n" \
                    "If you need any assistance, please get in touch with us " \
                    "through e-mail (smail.app.rocks@gmail.com) or via " \
                    "Facebook (https://www.facebook.com/smailrocks).\n\n" \
                    "Your friends from Sm@il."

    def __init__(self, initial_request, html, text=None, parsed_ocr=None,
                 human_translation=False, price_to_pay=()):

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
        self.text = text
        self.price_to_pay = max(price_to_pay) if len(price_to_pay) > 0 else 0

    def _get_subject(self):
        if self.price_to_pay:
            return "Sm@il - Your scanned mail - !! Bill found !!"
        else:
            return 'Smail - Your mail scanned, translated and ready for ' \
                   'archiving'

    def _get_bill_text(self):
        if not self.price_to_pay:
            return ""
        elif self.html is None:
            return """Payment required:\n\n
                    We have detected in the letter you received that you
                    are required to pay {} Eur\n\n""".format(self.price_to_pay)
        else:
            return """<h2>Bill found</h2>
                    <p>We have detected in the letter you received 
                    that you are 
                    required to pay <b>{} Euros</b>.</p>

                    <h2>Translated mail</h2>\n""".format(self.price_to_pay)

    def _build_message_for_auto_translation(self):
        """Builds the message when the required translation is automatic"""

        to_email = mail.Email(self.initial_request.get_email())
        logger.debug("  - to {}".format(to_email))

        from_email = mail.Email(self.sendgrid_sender)
        logger.debug("  - from {}".format(from_email))

        subject = self._get_subject()
        bill_text = self._get_bill_text()

        if self.html is None:
            content = mail.Content('text', bill_text+self.text)
        else:
            content = mail.Content('text/html', bill_text+self.html)
        logger.debug("  - Content done")

        message = mail.Mail(from_email=from_email, subject=subject,
                            to_email=to_email, content=content)

        if self.initial_request is not None:
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
        logger.debug("self.initial_request.get_email() = ".format(
            self.initial_request.get_email()))
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
            logger.error("Error!!! {}".format(ex))
            logger.error(ex.message)
            raise UnknownEmailException(ex.message)

        logger.info("Email sent")
        return response.status_code, response.body, response.headers
