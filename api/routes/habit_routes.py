from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from services.habit_service import create_new_habit
from models.habit_model import Habit

# * register Blueprint auth
habit_routes = Blueprint("habit", __name__)


@habit_routes.route("/get_habits", methods=["GET"])
def get_habits():
    """Get all existing habits"""
    try:
        habits = Habit.get_habits()

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
                jsonify({"success": False, "message": "There are no habits created"}),
                404,
            )
    except Exception as e:
        return (
            jsonify({"success": False, "message": f"Error getting habit: {str(e)}"}),
            500,
        )


@habit_routes.route("create_habit", methods=["POST"])
@jwt_required()
def create_habit():
    """Create new habit"""
    try:
        data = request.json
        name = data.get("name", "").strip()
        duration = data.get("duration", "")
        repeat = data.get("repeat", "").strip()
        time_day = data.get("time_day", "").strip()

        created = create_new_habit(name, duration, repeat, time_day)

        if created.get("success"):
            return jsonify(created), 201

        return jsonify(created), 400

    except Exception as e:
        return (
            jsonify({"success": False, "message": f"Error creating habit: {str(e)}"}),
            500,
        )


@habit_routes.route("delete_habit", methods=["DELETE"])
@jwt_required()
def delete_habit():
    try:
        pass
    except Exception as e:
        return (
            jsonify({"success": False, "message": f"Error deleting habit: {str(e)}"}),
            500,
        )
