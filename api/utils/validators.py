import re


def validate_email(email):
    """email validation for register"""
    return bool(re.match(r"^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$", email))


def validate_password(password):
    """password validation for register"""

    if len(password) < 8:
        return {"Success": False, "message": "Password must have at least 8 characters"}

    if not bool(
        re.match(
            r"^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&].{8,}$", password
        )
    ):
        return {
            "Success": False,
            "message": "Include at least 1 special character, 1 uppercase and 1 number",
        }

    return {"Success": True}
