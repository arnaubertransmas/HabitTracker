from models.auth_model import User
from utils.logger import log_error
from utils.validators import validate_email, validate_user_fields
from werkzeug.security import check_password_hash, generate_password_hash
from datetime import datetime


def registrate_user(name, surname, email, password, password2, streak):
    try:
        # Use the validation function
        validation_result = validate_user_fields(
            name, surname, email, password, password2
        )
        if not validation_result:
            return {"success": False, "message": "Invalid data format"}

        # Additional validation specific to registration
        if streak is None:
            streak = []

        # Save it in the database
        user = User(name, surname, email, password, streak)
        user.save()

        return {"success": True, "message": "User registered correctly"}

    except Exception as e:
        log_error(f"User registration error: {e}")
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

        # validate with the hashed password
        if not check_password_hash(user["password"], password):
            return {"success": False, "message": "Invalid credentials"}

        return {
            "success": True,
            "message": "Login successful",
        }

    except Exception as e:
        log_error(f"Login error: {e}")
        return {"success": False, "message": f"Server error: {str(e)}"}


def update_user_service(name, surname, email, password, password2):
    try:
        # check if user exists
        user = User.get_user("email", email)
        user = user[0]

        if not user:
            return {"success": False, "message": "User not found"}

        if password and password2:
            # use of validate_user_fields functiok
            validation_result = validate_user_fields(
                name, surname, email, password, password2, check_existing_email=False
            )
        else:
            validation_result = validate_user_fields(
                name, surname, email, check_existing_email=False
            )
        if not validation_result:
            return {"success": False, "message": "Invalid data format"}

        # empty dict, store only fields that need to be updated
        updates = {}

        if user["name"] != name:
            updates["name"] = name
        if user["surname"] != surname:
            updates["surname"] = surname
        if password:
            updates["password"] = generate_password_hash(password)

        User.update_user(email, updates)
        return {"success": True, "message": "User updated successfully"}

    except Exception as e:
        log_error(f"User update error: {e}")
        return {"success": False, "message": f"Server error: {str(e)}"}


def update_streak_service(email, date):
    try:
        user = User.get_user("email", email)
        if not user or len(user) == 0:
            return {"success": False, "message": "User not found"}

        user = user[0]
        streak = user.get("streak", [])
        date = date.split("T")[0]  # extract only YYYY-MM-DD

        today = datetime.now().date()
        # get the latest streak date if streak
        last_streak_date = (
            datetime.strptime(streak[-1], "%Y-%m-%d").date() if streak else None
        )

        # if last_streak and today date is more than 1 day behind reset streak
        if last_streak_date:
            days_since_last = (today - last_streak_date).days

            if days_since_last > 1:
                streak = []

        if date in streak:
            return {
                "success": True,
                "message": "Streak already recorded for this date",
            }

        streak.append(date)

        updates = {"streak": streak}
        # update streak at db
        User.update_user(email, updates)

        return {"success": True, "message": "Streak updated successfully"}
    except Exception as e:
        return {"success": False, "message": str(e)}
