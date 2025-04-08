from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
import jwt
from services.habit_service import (
    complete_habit_service,
    create_new_habit,
    update_habit_service,
)
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


@habit_routes.route("/habit_detail/<habit_name>", methods=["GET"])
@jwt_required()
def get_habit_detail(habit_name):
    """Get the detail of specific habit"""
    try:
        email = get_identity()
        habit = habit_name

        habit_detailed = Habit.get_habit(habit, email)

        if habit_detailed:
            return (
                jsonify(
                    {"success": True, "message": "Habit Found", "habit": habit_detailed}
                ),
                201,
            )
        else:
            return jsonify({"success": False, "message": "Habit not found"}), 404

    except Exception as e:
        return (
            jsonify({"success": False, "message": f"Error consulting habit: {str(e)}"}),
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
        days = data.get("days", "")
        time_day = data.get("time_day", "").strip()
        type_habit = data.get("type", "").strip()
        completed = data.get("completed", "")

        created = create_new_habit(
            name, frequency, days, time_day, type_habit, completed, email
        )

        if created.get("success"):
            return (
                jsonify({"success": True, "message": "Habit created successfully"}),
                201,
            )

        return jsonify({"success": False, "message": "Failed to create habit"}), 400

    except Exception as e:
        return (
            jsonify({"success": False, "message": f"Error creating habit: {str(e)}"}),
            500,
        )


@habit_routes.route("/update_habit/<string:habit_name>", methods=["PUT"])
@jwt_required()
def update_habit(habit_name):
    """Update a habit/non-negotiable"""
    try:
        email = get_identity()

        data = request.json
        new_name = data.get("name", "").strip()
        frequency = data.get("frequency", "").strip()
        days = data.get("days", "")
        time_day = data.get("time_day", "").strip()

        updated = update_habit_service(
            habit_name, new_name, frequency, days, time_day, email
        )

        if updated.get("success"):
            return (
                jsonify({"success": True, "message": "Habit updated successfully"}),
                201,
            )

        return jsonify({"success": False, "message": "Failed to update habit"}), 400

    except Exception as e:
        return (
            jsonify({"success": False, "message": f"Error updating habit: {str(e)}"}),
            500,
        )


@habit_routes.route("/complete/<string:habit_name>", methods=["POST"])
@jwt_required()
def complete_habit(habit_name):
    try:
        email = get_identity()
        data = request.json
        date = data.get("completed", "")

        completed = complete_habit_service(habit_name, date, email)
        if completed.get("success"):
            return jsonify({"success": True, "message": "Habit completed"}), 200
        else:
            return (
                jsonify({"success": False, "message": "Couldn't complete habit"}),
                404,
            )

    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500


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
