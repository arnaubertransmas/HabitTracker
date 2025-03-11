from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, create_access_token
from services.auth_service import login_user, registrate_user
from flask_login import LoginManager
from models.user_model import User

# * register Blueprint auth
auth_routes = Blueprint("auth", __name__)
login_manager = LoginManager()


@login_manager.user_loader
def load_user(user_id):
    """load user id, MUST BE"""
    return User.get_user("_id", user_id)


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

        # registrate user
        registered = registrate_user(name, surname, email, password, password2)

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
            user = User.get_user("email", email)

            # if user exists and its in a list:
            if user and isinstance(user, list):
                user = user[0]

                user_name = user.get("name", "User")

            response = jsonify(
                {
                    "success": True,
                    "message": "Login successful",
                    "access_token": access_token,
                    "user": {"email": email, "name": user_name},  #! email és necessari?
                }
            )

            return response, 200

        return jsonify(logged), 400

    except Exception as e:
        return (
            jsonify({"success": False, "message": f"Error logging the user: {str(e)}"}),
            500,
        )


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
