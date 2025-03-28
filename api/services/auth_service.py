from models.auth_model import User
from utils.logger import log_error
from utils.validators import validate_email, validate_password, is_string
from werkzeug.security import check_password_hash


def registrate_user(name, surname, email, password, password2, streak):
    try:

        if not is_string(name, surname):
            return {"success": False, "message": "Can't contain numbers"}

        if not all([name, surname, email, password, password2] or streak is None):
            return {"success": False, "message": "All fields are required"}

        if not validate_email(email):
            return {"success": False, "message": "Invalid email address"}

        if password != password2:
            return {"success": False, "message": "Passwords must be identical"}

        password_validation = validate_password(password)
        if not password_validation:
            return {"success": False, "message": "Password don't match the requisites!"}

        if User.get_user("email", email):
            return {"success": False, "message": "This address is already registered!"}

        if type(streak) != int:
            return {"success": False, "message": "Invalid streak type"}

        user = User(name, surname, email, password, streak)
        user.save()

        return {"success": True, "message": "User registered correctly"}

    except Exception as e:
        log_error(f"User registration {e}")
        return {"success": False, "message": f"Server error: {str(e)}"}


def login_user(email, password):
    try:
        if not email and not password:
            return {"success": False, "message": "All fields are required"}

        if not validate_email(email):
            return {"success": False, "message": "Invalid email format"}

        user_to_login = User.get_user("email", email)

        if not user_to_login or len(user_to_login) == 0:
            return {"success": False, "message": "User not registered"}

        user = user_to_login[0]

        if not check_password_hash(user["password"], password):
            return {"success": False, "message": "Invalid credentials"}

        return {
            "success": True,
            "message": "Login successful",
        }

    except Exception as e:
        log_error(f"Login error: {e}")
        return {"success": False, "message": f"Server error: {str(e)}"}
