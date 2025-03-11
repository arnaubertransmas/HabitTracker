import string
from models.habit_model import Habit
from utils.logger import log_error


def create_new_habit(name, duration, repeat, time_day):
    try:

        if not all([name, duration, repeat, time_day]):
            return {"success": False, "message": "All fields are required"}

        if type(name) != str:
            return {"success": False, "message": "Name param must contain only strings"}

        if type(duration) != int:
            return {"success": False, "message": "Duration must be an integrer"}

        if Habit.get_habit("name", name):
            return {"success": False, "message": "Habit already exists"}

        habit = Habit(name, duration, repeat, time_day)
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
