import re
from models.auth_model import User
from models.habit_model import Habit


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


def validate_user_fields(
    name, surname, email, password=None, password2=None, check_existing_email=True
):
    """validate user fields for register/edit_profile"""

    if not is_string(name, surname):
        return {"success": False, "message": "Name/surname must be in string format"}

    if not all([name, surname, email]):
        return {"success": False, "message": "Missing fields"}

    if not validate_email(email):
        return {"success": False, "message": "Invalid email"}

    if password or password2:
        if password != password2:
            return {"success": False, "message": "Passwords must be identical"}

        if not validate_password(password):
            return {"success": False, "message": "Missing complexity in your password"}

    if check_existing_email and User.get_user("email", email):
        return {"success": False, "message": "User already exists, change email"}

    return {"success": True, "message": "User correctly validated"}


def validate_habit_fields(
    TIME_MAP,
    name,
    frequency,
    days,
    time_day,
    type_habit,
    user_email,
    completed=True,
    is_creation=True,
):
    """validate habit fields for create/update Habit/Non-negotiable"""
    if not all([name, frequency, time_day, type_habit, user_email]):
        return {"success": False, "message": "Missing fields"}

    if type(name) != str:
        return {"success": False, "message": "Bad name field format"}

    if type(days) != list:
        return {"success": False, "message": "Bad days field format"}

    if type(completed) != list:
        return {"success": False, "message": "Bad completed field format"}

    if time_day not in TIME_MAP:
        return {"success": False, "message": "Bad time day format"}

    if is_creation and Habit.get_habit(name, user_email):
        return {"success": False, "message": "Habit already exists"}

    return {"success": True, "message": "Habit correctly validated"}
