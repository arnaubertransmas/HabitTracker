import re


def validate_email(email):
    """email validation for register"""
    return bool(re.match(r"^[\w.-]+@([\w.-]+\.)+[a-zA-Z]{2,}$", email))


def validate_password(password):
    """password validation for register"""

    if len(password) < 8:
        return False

    if not bool(
        re.match(
            r"^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&].{8,}$", password
        )
    ):
        return False

    return True
