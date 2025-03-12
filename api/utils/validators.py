import re


def validate_email(email):
    """email validation for register"""
    return bool(re.match(r"^[\w.-]+@([\w.-]+\.)+[a-zA-Z]{2,}$", email))


def validate_password(password):
    """password validation for register"""

    if not bool(
        re.match(
            r"^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&].{8,}$", password
        )
    ):
        return False

    return True


def is_string(*args):
    """Check if all inputs are only letters and spaces"""
    for arg in args:
        # 1st validation to prevent errorType
        if not isinstance(arg, str):
            return False
        # 2nd validation to match nums in strFORMAT
        if not bool(re.match(r"^[a-zA-Z\s]+$", arg, re.IGNORECASE)):
            return False
    return True
