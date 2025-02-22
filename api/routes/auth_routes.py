from flask import Blueprint, request, jsonify
from services.auth_service import login_user, registrate_user
from models.user_model import User

auth_routes = Blueprint("auth", __name__)


@auth_routes.route("/signup", methods=["POST"])
def signup():
    """signup route, register new user to DB"""

    try:
        # arriba un json des de react.js
        data = request.json

        name = data.get("name", "").strip()
        surname = data.get("surname", "").strip()
        email = data.get("email", "").strip()
        password = data.get("password", "").strip()
        password2 = data.get("password2", "").strip()

        if not all([name, surname, email, password, password2]):
            return (
                jsonify({"success": False, "message": "All fields are required"}),
                400,
            )

        # registrem usuari
        registered = registrate_user(name, surname, email, password, password2)
        if registered.get("Success"):
            return jsonify(registered), 201
        return jsonify(registered), 400

    except Exception as e:
        return (
            jsonify({"success": False, "message": f"Error registering user {str(e)}"}),
            500,
        )


@auth_routes.route("/signin", methods=["POST"])
def signin():
    """signin route, recieve json from frontend"""
    try:
        if request.method == "POST":
            data = request.json
            email = data.get("email", "").strip()
            password = data.get("password", "").strip()

            # loggin de l'usuari
            logged = login_user(email, password)
            if logged.get("Success"):
                return jsonify(logged), 201
            return jsonify(logged), 400
    except Exception as e:
        return (
            jsonify({"success": False, "message": f"Error registering user {str(e)}"}),
            500,
        )


@auth_routes.route("/users", methods=["GET"])
def get_users():
    return User.get_users()
