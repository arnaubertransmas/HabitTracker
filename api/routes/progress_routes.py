from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.progress_model import Progress

# * register Blueprint auth
progress_routes = Blueprint("progress", __name__)


@progress_routes.route("/get_user_data", methods=["GET"])
@jwt_required()
def get_user_data():

    try:
        user_email = get_jwt_identity()
        # get it directly from model
        user_data = Progress.get_habits(user_email)

        if user_data is not None:
            return jsonify(
                {
                    "success": True,
                    "message": "User data retrieved correctly",
                    "user_data": user_data,
                }
            )

        return jsonify(
            {"success": False, "message": "Cannot retrieve habits, try it again later"}
        )

    except Exception as e:
        return jsonify({"success": False, "message": f"Cannot retrieve habits, {e}"})
