from models.habit_model import Habit
from utils.logger import log_error


def create_new_habit(
    name, frequency, days, time_day, type_habit, completed, user_email
):
    try:
        # validation of data sent from frontend
        if not all([name, frequency, time_day, type_habit, user_email]):
            return {"success": False, "message": "All fields are required"}

        if type(name) != str:
            return {"success": False, "message": "Name param must contain only strings"}

        if type(days) != list:
            return {"success": False, "message": "Invalid format for days param"}

        if type(completed) != bool:
            return {"success": False, "message": "Invalid format for completed param"}

        if Habit.get_habit(name, user_email):
            return {"success": False, "message": "Habit already exists"}

        time_map = {
            "morning": ("07:00", "12:00"),
            "afternoon": ("12:00", "18:00"),
            "night": ("18:00", "22:00"),
        }

        if time_day.lower() not in time_map:
            return {"success": False, "message": "Invalid time of day"}

        start_time, end_time = time_map[time_day.lower()]
        habit = Habit(
            name,
            frequency,
            days,
            time_day,
            start_time,
            end_time,
            type_habit,
            completed,
            user_email,
        )
        habit.save_habit()

        return {"success": True, "message": "Habit saved correctly"}

    except Exception as e:
        print(e, "from service")
        log_error(f"Habit registration {e}")
        return {"success": False, "message": f"Server error: {str(e)}"}
