from flask import jsonify, request, Blueprint
from flask_jwt_extended import jwt_required, get_jwt_identity
from services.notes_service import save_note_service
from models.notes_model import Notes

notes_routes = Blueprint("notes", __name__)


@notes_routes.route("/save_note", methods=["POST"])
@jwt_required()
def save_note():
    """Save a note"""
    try:
        email = get_jwt_identity()
        data = request.json
        # get note and habit_name from the request (FRONTEND)
        # note_save = dict
        note = data.get("note", "").strip()
        habit_name = data.get("habit_name", "").strip()

        note_saved = save_note_service(note, habit_name, email)

        if note_saved.get("success"):
            return jsonify({"success": True, "message": "Note saved correctly"}), 200
        else:
            return (
                jsonify(
                    {
                        "success": False,
                        "message": f"Failed to save note: {note_saved.get('message')}",
                    }
                ),
                400,
            )

    except Exception as e:
        return jsonify({"success": False, "message": f"Server error: {str(e)}"}), 500


@notes_routes.route("/get_note/<habit_name>", methods=["GET"])
@jwt_required()
def get_note(habit_name):
    """Get a single note"""
    try:
        email = get_jwt_identity()
        note = Notes.get_note(habit_name, email)

        if note:
            return (
                jsonify(
                    {
                        "success": True,
                        "message": "Note retrieved successfully",
                        "note": note,
                    }
                ),
                200,
            )
        else:
            # return empty dict if no note found
            return (
                jsonify(
                    {
                        "success": True,
                        "message": "Note not found",
                        "note": {"notes": ""},
                    }
                ),
                200,
            )
    except Exception as e:
        return jsonify({"success": False, "message": f"Server error: {str(e)}"}), 500
