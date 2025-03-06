from models.user_model import User
from utils.logger import log_error
from utils.validators import validate_email, validate_password
from werkzeug.security import check_password_hash
from flask_jwt_extended import create_access_token


def registrate_user(name, surname, email, password, password2):
    try:

        if not all([name, surname, email, password, password2]):
            return {"Success": False, "message": "All fields are required"}

        if not validate_email(email):
            return {"Success": False, "message": "Invalid email address"}

        if password != password2:
            return {"Success": False, "message": "Passwords must be identical"}

        password_validation = validate_password(password)
        if not password_validation["Success"]:
            return password_validation

        if User.get_user("email", email):
            return {"success": False, "message": "This address is already registered!"}

        user = User(name, surname, email, password)
        user.save()

        return {"Success": True, "message": "User registered correctly"}

    except Exception as e:
        log_error(f"User registration {e}")
        return {"Success": False, "message": f"Server error: {str(e)}"}


def login_user(email, password):
    try:
        if not email and not password:
            return {"Success": False, "message": "All fields are required"}

        if not validate_email(email):
            return {"Success": False, "message": "Invalid email format"}

        user_to_login = User.get_user("email", email)

        if not user_to_login or len(user_to_login) == 0:
            return {"Success": False, "message": "User not registered"}

        user = user_to_login[0]

        if not check_password_hash(user["password"], password):
            return {"Success": False, "message": "Invalid credentials"}

        return {
            "Success": True,
            "message": "Login successful",
        }

    except Exception as e:
        print(f"Login error: {str(e)}")
        log_error(f"Login error: {e}")
        return {"Success": False, "message": f"Server error: {str(e)}"}
