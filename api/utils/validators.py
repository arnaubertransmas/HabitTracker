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
        return False

    if not all([name, surname, email]):
        return False

    if not validate_email(email):
        return False

    if password or password2:
        if password != password2:
            return False

        if not validate_password(password):
            return False

    if check_existing_email and User.get_user("email", email):
        return False

    return True


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
        return False

    if type(name) != str:
        return False

    if type(days) != list:
        return False

    if type(completed) != list:
        return False

    if time_day not in TIME_MAP:
        return False

    if is_creation and Habit.get_habit(name, user_email):
        return False

    return True
