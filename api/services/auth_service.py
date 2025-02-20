from models.user_model import User
from utils.logger import log_error
from utils.validators import validate_email, validate_password


def registrate_user(name, surname, email, password, password2):
    try:

        if not all([name, surname, email, password, password2]):
            return {"Success": False, "message": "All fields are required"}

        if not validate_email(email):
            return {"Success": False, "message": "Invalid email address"}

        if password != password2:
            return {
                "Success": False,
                "message": "Passwords must be identical",
            }

        password_validation = validate_password(password)
        if not password_validation["Success"]:
            return password_validation

        user = User(name, surname, email, password)
        user.save()
        return {"Success": True, "message": "User registred correctly"}

    except Exception as e:
        log_error(f"User registration {e}")
        return {"Success": False, "message": "Server error"}
