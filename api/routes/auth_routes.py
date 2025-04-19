from flask import Blueprint, request, jsonify
from flask_jwt_extended import (
    get_jwt_identity,
    jwt_required,
    create_access_token,
    create_refresh_token,
)
from services.auth_service import (
    login_user,
    registrate_user,
    update_streak_service,
    update_user_service,
)
from flask_login import LoginManager
from models.auth_model import User

# * register Blueprint auth
auth_routes = Blueprint("auth", __name__)
login_manager = LoginManager()


@auth_routes.route("/refresh_token", methods=["POST"])
@jwt_required(refresh=True)
def refresh_token():
    """Refresh access token automatically"""
    try:
        current_user = get_jwt_identity()
        new_access_token = create_access_token(identity=current_user)

        return jsonify({"success": True, "access_token": new_access_token}), 200
    except Exception as e:
        return (
            jsonify({"success": False, "message": f"Error refreshing token: {str(e)}"}),
            500,
        )


@login_manager.user_loader
def load_user(user_id):
    """load user id, MUST BE"""
    return User.get_user("_id", user_id)


@auth_routes.route("/get_user", methods=["GET"])
@jwt_required()
def get_user():
    """Get user data"""
    try:
        email = get_jwt_identity()
        # get user data from DB
        user = User.get_user("email", email)

        if user and isinstance(user, list):
            user = user[0]
            return jsonify({"success": True, "user": user}), 200

        return jsonify({"success": False, "message": "User not found"}), 404

    except Exception as e:
        return (
            jsonify({"success": False, "message": f"Error getting user: {str(e)}"}),
            500,
        )


@auth_routes.route("/signup", methods=["POST"])
def signup():
    """Signup route, register new user to DB"""
    try:
        data = request.json
        name = data.get("name", "").strip()
        surname = data.get("surname", "").strip()
        email = data.get("email", "").strip()
        password = data.get("password", "").strip()
        password2 = data.get("password2", "").strip()
        streak = []

        # registrate user
        registered = registrate_user(name, surname, email, password, password2, streak)

        if registered.get("success"):
            return jsonify(registered), 201

        return jsonify(registered), 400

    except Exception as e:
        return (
            jsonify({"success": False, "message": f"Error registering user: {str(e)}"}),
            500,
        )


@auth_routes.route("/signin", methods=["POST"])
def signin():
    try:
        data = request.json
        email = data.get("email", "").strip()
        password = data.get("password", "").strip()

        # sign in user
        logged = login_user(email, password)

        if logged.get("success"):
            # create access token
            access_token = create_access_token(identity=email)
            refresh_token = create_refresh_token(identity=email)
            user = User.get_user("email", email)

            # if user exists and its in a list:
            if user and isinstance(user, list):
                user = user[0]

                # if no name found User will be name displayed
                user_name = user.get("name", "User")

            response = jsonify(
                {
                    "success": True,
                    "message": "Login successful",
                    "access_token": access_token,
                    "access_token_refresh": refresh_token,
                    "user": {"name": user_name},
                }
            )

            return response, 200

        return jsonify(logged), 400

    except Exception as e:
        return (
            jsonify({"success": False, "message": f"Error logging the user: {str(e)}"}),
            500,
        )


@auth_routes.route("/update_user", methods=["PUT"])
@jwt_required()
def update_user():
    """Update user data"""
    try:
        data = request.json
        name = data.get("name", "").strip()
        surname = data.get("surname", "").strip()
        email = get_jwt_identity()
        password = data.get("password", "").strip()
        password2 = data.get("password2", "").strip()

        # validate data
        updated = update_user_service(name, surname, email, password, password2)

        if updated.get("success"):
            return jsonify({"success": True, "message": "User info updated"}), 201

        return jsonify({"success": False, "message": "Error updating user info"}), 400

    except Exception as e:
        return (
            jsonify({"success": False, "message": f"Error checking session: {str(e)}"}),
            500,
        )


@auth_routes.route("/update_streak", methods=["POST"])
@jwt_required()
def update_streak():
    """Update user's habit streak"""
    try:
        email = get_jwt_identity()
        data = request.json
        date = data.get("date", "")

        # validate data in service
        streak_updated = update_streak_service(email, date)

        if streak_updated.get("success"):
            return jsonify({"success": True, "message": streak_updated["message"]}), 200
        else:
            return jsonify({"success": False, "message": "Couldn't update streak"}), 404
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500


@auth_routes.route("/logout", methods=["POST"])
@jwt_required()
def logout():
    """User logout"""
    try:
        response = jsonify({"success": True, "message": "Logout successful"})

        return response, 200

    except Exception as e:
        return (
            jsonify(
                {
                    "success": False,
                    "message": f"Logout failed: {str(e)}",
                }
            ),
            400,
        )


@auth_routes.route("/check_session", methods=["GET"])
def check_session():
    """Check if the session is active"""
    try:
        return jsonify({"success": True, "message": "Session active!"}), 200
    except Exception as e:
        return (
            jsonify({"success": False, "message": f"Error checking session: {str(e)}"}),
            500,
        )


@auth_routes.route("/delete_user", methods=["DELETE"])
@jwt_required()
def delete_user():
    """Delete user"""
    try:
        email = get_jwt_identity()

        # delete user from DB
        User.delete_user(email)
        # logout user to prevent access to the app
        logout()

        return jsonify({"success": True, "message": "User deleted successfully"}), 200

    except Exception as e:
        return (
            jsonify({"success": False, "message": f"Error deleting user: {str(e)}"}),
            500,
        )
