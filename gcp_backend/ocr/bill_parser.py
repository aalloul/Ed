from re import sub, match
import logging
from sys import stdout

logging.basicConfig(stream=stdout, format='%(asctime)s %(message)s')
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)


class Payment(object):
    def __init__(self, sender=None, amount=None, acceptgiro=False, iban=None,
                 bic=None, payment_reference=None):
        self.sender = sender
        self.amount = amount
        self.acceptgiro = acceptgiro
        self.iban = iban
        self.bic = bic
        self.payment_reference = payment_reference


def is_comma_for_decimals(price):
    p1, p2 = price.split(",")
    if len(p2) < 3:
        return True
    else:
        return False


def correct_format(price):
    if "," in price and is_comma_for_decimals(price):
        return float(price.replace(",", "."))
    if "," in price and not is_comma_for_decimals(price):
        return float(price.replace(",", ""))


def get_price(line):
    regex = u"(.*)(te betalen)(\s+)" \
            u"(\u20ac){0,1}(\s+)" \
            u"([0-9]+(\,[0-9]+)*)" \
            u"(.*)"

    if match(regex, line):
        price = sub(regex, "\\6", line)
        try:
            formatted_price = float(price)
        except ValueError:
            formatted_price = correct_format(price)
        return formatted_price


def find_amount_alone(text):
    li = [get_price(_) for _ in text.split("\n")]
    possible_prices = [_ for _ in li if _ is not None]
    if len(possible_prices) == 0:
        return Payment()

    if (len(possible_prices) == 1) or \
            (len(possible_prices) > 1 and len(set(possible_prices)) == 1):
        return Payment(amount=[possible_prices[0]])

    if len(possible_prices) > 1 and len(set(possible_prices)) > 1:
        return Payment(amount=list(set(possible_prices)))


def parse_amount(am):
    am = float(am) / 1000
    am = str(am).split(".")
    return float(am[0] + "." + am[1][0:2])


def parse_accept_giro(text):
    # # Rekeningnummber
    # payment_ref_reg = "([0-9]+)(\+)\s"
    # # Amount
    # amount_reg = "([0-9]+)(\<)\s"
    # # BIC
    # bic_reg = "([A-Z]+([0-9]*)([A-Z]*))(\+)\s"
    # # IBAN
    # iban_reg = "(([A-Z]{2})([0-9]{2})([A-Z 0-9]+))(\+)\s"
    # digit_reg = "[0-9]+\>"
    #
    # # Accept giro regex
    # giro_reg = payment_ref_reg + amount_reg + bic_reg + iban_reg + digit_reg
    giro_reg = "(.+)\<\s(.+)\>"

    # Some init
    payment_ref = None
    amount = None
    bic = None
    iban = None

    text_split = text.split("\n")

    for line in text_split:
        if match(giro_reg, line):
            # Old
            # payment_ref = sub(giro_reg, "\\1", text)
            # amount = float(sub(giro_reg, "\\3", text)) / 100
            # bic = sub(giro_reg, "\\5", text)
            # iban = sub(giro_reg, "\\9", text)

            part_1 = sub(giro_reg, "\\1", line)
            payment_ref, amount = part_1.split("+")

            amount = parse_amount(amount)

            part_2 = sub(giro_reg, "\\2", line)
            bic, iban, code = part_2.split("+")

    if payment_ref is None:
        return Payment()

    ind = text_split.index("van")
    sender = text_split[ind + 1]

    return Payment(sender=sender, payment_reference=payment_ref,
                   amount=[amount],
                   bic=bic, iban=iban, acceptgiro=True)


def find_bill(text):
    if "Acceptgiro" in text:
        logger.info("Found Acceptgiro")
        return parse_accept_giro(text)

    return find_amount_alone(text)


if __name__ == "__main__":
    from json import load

    with open("../fixture/accept_giro_example_ocr.json", "r") as f:
        full_text = load(f)['responses'][0]['fullTextAnnotation']['text']

    bill = find_bill(full_text)
