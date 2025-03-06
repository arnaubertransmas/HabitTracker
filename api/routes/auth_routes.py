from flask import Blueprint, request, jsonify
from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity,
    create_access_token,
    set_access_cookies,
    unset_jwt_cookies,
    verify_jwt_in_request,
)
from services.auth_service import login_user, registrate_user

auth_routes = Blueprint("auth", __name__)  # Fixed incorrect `name` usage


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

        if not all([name, surname, email, password, password2]):
            return (
                jsonify({"success": False, "message": "All fields are required"}),
                400,
            )

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

        logged = login_user(email, password)

        if logged.get("Success"):
            access_token = create_access_token(identity=email)

            response = jsonify(
                {
                    "Success": True,
                    "message": "Login successful",
                    "access_token": access_token,
                    "user": email,
                }
            )

            set_access_cookies(response, access_token)

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
    try:
        # Log detailed request information
        print("Logout Request Headers:", request.headers)
        print("Logout Request Cookies:", request.cookies)

        # Attempt to get the current user's identity
        try:
            user = get_jwt_identity()
            print("Current User Identity:", user)
        except Exception as identity_error:
            print("Error getting user identity:", str(identity_error))
            user = "Unknown"

        # Create a response
        response = jsonify(
            {"success": True, "message": "Logout successful", "user": user}
        )

        # Unset JWT cookies
        unset_jwt_cookies(response)

        return response, 200

    except Exception as e:
        print("Comprehensive Logout Error:")
        print("Error Type:", type(e))
        print("Error Details:", str(e))

        return (
            jsonify(
                {
                    "success": False,
                    "message": f"Logout failed: {str(e)}",
                    "error_type": str(type(e)),
                }
            ),
            400,
        )


# @auth_routes.route("/auth/check_session", methods=["GET"])
# def check_session():
#     try:
#         try:
#             verify_jwt_in_request(locations=["cookies"])
#             user = get_jwt_identity()

#             # If we get here, the token is valid
#             return jsonify({"success": True, "message": f"User found: {user}"}), 200

#         except Exception as jwt_error:
#             # If JWT verification fails, return unauthorized
#             print("JWT Verification Failed:", str(jwt_error))
#             return jsonify({"success": False, "message": "No active session"}), 401

#     except Exception as e:
#         print("Check Session Error:", str(e))
#         return jsonify({"success": False, "message": "Error checking session"}), 500
