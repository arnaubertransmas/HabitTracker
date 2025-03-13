import string
from models.habit_model import Habit
from utils.logger import log_error


def create_new_habit(name, frequency, time_day, type_habit, user_email):
    try:

        if not all([name, frequency, time_day, type_habit, user_email]):
            return {"success": False, "message": "All fields are required"}

        if type(name) != str:
            return {"success": False, "message": "Name param must contain only strings"}

        if Habit.get_habit("name", name):
            return {"success": False, "message": "Habit already exists"}

        habit = Habit(name, frequency, time_day, type_habit, user_email)
        habit.save_habit()

        return {"success": True, "message": "Habit saved correctly"}

    except Exception as e:
        log_error(f"Habit registration {e}")
        return {"success": False, "message": f"Server error: {str(e)}"}


def delete_habit(id):
    try:
        if Habit.get_habit("_id", str(id)):
            return {"success": False, "message": "Habit not found"}

        Habit.delete_habit(str(id))
        return {"success": True, "message": "Habit deleted correctly"}

    except Exception as e:
        log_error(f"Habit error when deleting {e}")
        return {"success": False, "message": f"Server error: {str(e)}"}
