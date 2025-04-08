from models.auth_model import User
from utils.logger import log_error
from utils.validators import validate_email, validate_password, is_string
from werkzeug.security import check_password_hash
from datetime import datetime


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

        if type(streak) != list:
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


def update_streak_service(email, date):
    try:
        user = User.get_user("email", email)
        if not user or len(user) == 0:
            return {"success": False, "message": "User not found"}

        user = user[0]
        streak = user.get("streak", [])
        date = date.split("T")[0]  # Extract only YYYY-MM-DD

        today = datetime.now().date()
        last_streak_date = (
            datetime.strptime(streak[-1], "%Y-%m-%d").date() if streak else None
        )

        # If streak exists and the last date is more than 1 day behind, reset streak
        if last_streak_date and (today - last_streak_date).days > 1:
            streak = []  # Reset streak

        if date in streak:
            return {
                "success": True,
                "message": "Streak already recorded for this date",
            }

        # Append new date to the streak list
        streak.append(date)

        # Update the user in the database
        updates = {"streak": streak}
        User.update_user(email, updates)

        return {"success": True, "message": "Streak updated successfully"}
    except Exception as e:
        return {"success": False, "message": str(e)}
