from flask import Blueprint, request, jsonify
from services.auth_service import registrate_user

auth_routes = Blueprint("auth", __name__)


@auth_routes.route("/signup", methods=["GET"])
def signup():
    """signup route, takes data from form"""

    if request.method == "GET":
        name = request.form.get("name", "")
        surname = request.form.get("surname", "")
        email = request.form.get("email", "")
        password = request.form.get("password", "")
        password2 = request.form.get("password2", "")

        registered = registrate_user(name, surname, email, password, password2)
        return jsonify(registered)

    return jsonify({"Success": False, "message": "Method not allowed"}), 405


@auth_routes.route("/signin", methods=["GET"])
def signin():
    """signin route, takes data from form"""
    if request.method == "GET":
        email = request.form.get("email", "")
        password = request.form.get("password", "")
