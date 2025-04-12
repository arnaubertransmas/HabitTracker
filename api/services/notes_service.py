from models.habit_model import Habit
from models.notes_model import Notes


def save_note_service(notes, habit_name, user_email):
    """save note to the database || validations"""
    try:
        if not Habit.get_habit(habit_name, user_email):
            return {"success": False, "message": "Habit not found"}

        # check if note exists
        existing_note = Notes.get_note(habit_name, user_email)
        if existing_note:
            # modify note
            Notes.update_note(habit_name, user_email, notes)
            return {"success": True, "message": "Note updated successfully"}

        # Create new note
        note = Notes(notes, habit_name, user_email)
        note.save()
        return {"success": True, "message": "Note saved successfully"}

    except Exception as e:
        print(f"Error in save_note_service: {e}")
        return {"success": False, "message": f"Failed to save note: {str(e)}"}
