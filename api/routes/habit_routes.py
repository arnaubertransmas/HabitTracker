from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from services.habit_service import create_new_habit
from models.habit_model import Habit

# * register Blueprint auth
habit_routes = Blueprint("habit", __name__)


@jwt_required()
def get_identity():
    """Get email from user"""
    email = get_jwt_identity()

    return email


@habit_routes.route("/get_habits", methods=["GET"])
@jwt_required()
def get_habits():
    """Get all existing habits"""
    try:

        email = get_identity()
        habit_type = request.args.get("type", default=None)

        if habit_type:
            habits = Habit.get_habits(email, habit_type)
        else:
            habits = Habit.get_habits(email)

        if habits:
            return (
                jsonify(
                    {
                        "success": True,
                        "message": "Habits retrieved correctly",
                        "habits": habits,
                    }
                ),
                200,
            )
        else:
            return (
                jsonify(
                    {"success": True, "message": "No habits created yet", "habits": []}
                ),
                200,
            )
    except Exception as e:
        return (
            jsonify({"success": False, "message": f"Error getting habit: {str(e)}"}),
            500,
        )


@habit_routes.route("/create_habit", methods=["POST"])
@jwt_required()
def create_habit():
    """Create new habit"""
    try:
        email = get_identity()

        data = request.json
        name = data.get("name", "").strip()
        frequency = data.get("frequency", "").strip()
        time_day = data.get("time_day", "").strip()
        type_habit = data.get("type", "").strip()

        created = create_new_habit(name, frequency, time_day, type_habit, email)

        if created.get("success"):
            return jsonify(created), 201

        return jsonify(created), 400

    except Exception as e:
        return (
            jsonify({"success": False, "message": f"Error creating habit: {str(e)}"}),
            500,
        )


@habit_routes.route("/delete_habit/<string:name>", methods=["DELETE"])
@jwt_required()
def delete_habit(name):
    """Deleting habit based on name"""
    try:
        Habit.delete_habit(name)
        return jsonify({"success": True, "message": "Habit deleted successfully"}), 200

    except Exception as e:
        return (
            jsonify({"success": False, "message": f"Error deleting habit: {str(e)}"}),
            500,
        )
