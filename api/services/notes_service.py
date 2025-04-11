from utils.logger import log_error
from models.notes_model import Notes
from models.habit_model import Habit


def save_note_service(notes, habit_name, user_email):
    """save note to the database || validations"""
    try:
        if not Habit.get_habit(habit_name, user_email):
            return {"success": False, "message": "Habit not found"}, 404

        if len(notes) >= 90:
            return {"success": False, "message": "Note limit exceeded"}, 400

        if Notes.get_note(habit_name, user_email):
            return {"success": False, "message": "Note already exists"}, 400

        note = Notes(notes, habit_name, user_email)
        note.save()

        return {"success": True, "message": "Note saved successfully"}, 200

    except Exception as e:
        log_error(e)
        return {"success": False, "message": "Failed to save note"}, 500
