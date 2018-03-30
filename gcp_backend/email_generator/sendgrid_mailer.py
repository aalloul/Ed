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

    def __init__(self, initial_request, html, text=None, parsed_ocr=None,
                 human_translation=False, price_to_pay=None, is_problem=False):

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
        if self.html is not None and not is_problem:
                self.html += self.html_email_addendum()
        self.text = text
        self.price_to_pay = price_to_pay

    def _get_subject(self):

        if self.price_to_pay is None or self.price_to_pay.amount is None:
            return 'Smail - Your mail scanned, translated and ready for ' \
                   'archiving'

        if self.price_to_pay.acceptgiro:
            return "Sm@il - Your scanned mail - Invoice from {}".format(
                self.price_to_pay.sender)
        else:
            return "Sm@il - Your scanned mail - /!\ Invoice found /!\ "

    def _get_accept_giro_text(self, html=True):
        out = ""

        if self.price_to_pay is None or not self.price_to_pay.acceptgiro:
            return out

        if html:
            out += """<p>This amount can be paid through the Acceptgiro system.
             Simply connect to your bank account and transfer the above """
            out += "amount using the following details:</p>"
            out += "<ul>"
            out += "<li>Sender = {}</li>".format(self.price_to_pay.sender)
            out += "<li>Payment reference (betalingskenmerk) =" \
                   "{}</li>".format(self.price_to_pay.payment_reference)
            out += "<li>IBAN: {}</li>".format(self.price_to_pay.iban)
            out += "<li>BIC (usually not needed in EU): " \
                   "{}</li>".format(self.price_to_pay.bic)
            out += "</ul>"
        else:
            out += """This amount can be paid through the Acceptgiro system.
                         Simply connect to your bank account and transfer the 
                         above"""
            out += """ amount using the following details:\n"""
            out += "   - Beneficiary = {}\n".format(self.price_to_pay.sender)
            out += "   - Payment reference (betalingskenmerk) =" \
                   "{}\n".format(self.price_to_pay.payment_reference)
            out += "   - IBAN: {}\n".format(self.price_to_pay.iban)
            out += "   - BIC (usually not needed in EU): " \
                   "{}\n\n".format(self.price_to_pay.bic)
        return out

    def _get_bill_text(self):
        if self.price_to_pay is None or self.price_to_pay.amount is None:
            out = ""
        elif self.price_to_pay.amount is not None and self.html is None:
            out = "Payment required:"
            out += "We have detected in the letter you received that you"
            out += "are required to pay {} " \
                   "Eur.\n".format(max(self.price_to_pay.amount))
            out += self._get_accept_giro_text(False)

        else:
            out = """<h2>Invoice found</h2>
                    <p>It seems that you are required to make a payment of 
                    <b>{} Euros. </b>.</p>""".format(max(
                self.price_to_pay.amount))
            out += self._get_accept_giro_text(True)
            out += """<h2>Translated mail</h2>\n"""
        return out

    def _build_message_for_auto_translation(self):
        """Builds the message when the required translation is automatic"""

        to_email = mail.Email(self.initial_request.get_email())
        logger.debug("  - to {}".format(to_email))

        from_email = mail.Email(self.sendgrid_sender)
        logger.debug("  - from {}".format(from_email))

        subject = self._get_subject()
        bill_text = self._get_bill_text()

        if self.html is None:
            content = mail.Content('text', bill_text + self.text)
        else:
            content = mail.Content('text/html', bill_text + self.html)
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

    @classmethod
    def no_text_found(cls):
        with open("no_text_found.html", "r") as f:
            return f.read()

    @classmethod
    def html_email_addendum(cls):
        with open("html_email_addendum.html", "r") as f:
            return f.read()

    @classmethod
    def unexpected_error(cls):
        with open("unexpected_error.html", "r") as f:
            return f.read()

if __name__ == "__main__":
    sg = Sendgrid(None, None, text=Sendgrid.no_text_found())
    print(sg.text)