from models.habit_model import Habit
from utils.logger import log_error


def create_new_habit(name, frequency, days, time_day, type_habit, user_email):
    try:
        # validation of data sent from frontend
        if not all([name, frequency, time_day, type_habit, user_email]):
            return {"success": False, "message": "All fields are required"}

        if type(name) != str:
            return {"success": False, "message": "Name param must contain only strings"}

        if type(days) != list:
            return {"success": False, "message": "Invalid format for days param"}

        if Habit.get_habit("name", name):
            return {"success": False, "message": "Habit already exists"}

        habit = Habit(name, frequency, days, time_day, type_habit, user_email)
        habit.save_habit()

        return {"success": True, "message": "Habit saved correctly"}

    except Exception as e:
        log_error(f"Habit registration {e}")
        return {"success": False, "message": f"Server error: {str(e)}"}
