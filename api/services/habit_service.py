from models.habit_model import Habit
from utils.logger import log_error
from utils.validators import validate_habit_fields
from datetime import datetime


TIME_MAP = {
    "Morning": ("07:00", "12:00"),
    "Afternoon": ("12:00", "18:00"),
    "Night": ("18:00", "22:00"),
}


def create_new_habit(
    name, frequency, days, time_day, type_habit, completed, user_email
):
    try:
        validation = validate_habit_fields(
            TIME_MAP, name, frequency, days, time_day, type_habit, user_email, completed
        )
        if not validation:
            return {"success": False, "message": "Invalid data"}

        # start_time['] - end_time[1]
        start_time, end_time = TIME_MAP[time_day]

        # habit to save at DB
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
        log_error(f"Habit registration {e}")
        return {"success": False, "message": f"Server error: {str(e)}"}


def update_habit_service(habit_name, new_name, frequency, days, time_day, user_email):
    try:
        habit = Habit.get_habit(habit_name, user_email)

        if not habit:
            return {"success": False, "message": "Habit doesn't exist"}

        # force to use a different name
        if habit_name != new_name and Habit.get_habit(new_name, user_email):
            return {"success": False, "message": "Habit already exists"}

        # validate all fields
        validation = validate_habit_fields(
            TIME_MAP,
            new_name,
            frequency,
            days,
            time_day,
            habit.get("type", ""),
            user_email,
            habit.get("completed", []),
            is_creation=False,
        )

        if not validation:
            return {"success": False, "message": "Invalid data"}

        # add only modified fields
        updates = {}
        if habit["name"] != new_name:
            updates["name"] = new_name

        if habit["frequency"] != frequency:
            updates["frequency"] = frequency

        if type(days) == list:
            updates["days"] = days

        if habit["time_day"] != time_day and time_day in TIME_MAP:
            updates["time_day"] = time_day
            updates["start_time"], updates["end_time"] = TIME_MAP[time_day]

        Habit.update_habit(habit_name, user_email, updates)

        return {"success": True, "message": "Habit updated successfully"}

    except Exception as e:
        log_error(f"Habit update error {e}")
        return {"success": False, "message": f"Server error: {str(e)}"}


def complete_habit_service(habit_name, date_str, email):
    try:
        habit = Habit.get_habit(habit_name, email)
        if not habit:
            return {"success": False, "message": "Habit not found"}

        # convert to date obj to compare
        date_obj = datetime.strptime(date_str, "%Y-%m-%d").date()
        date_today = datetime.now().date()

        if date_obj != date_today:
            return {
                "success": False,
                "message": "Cannot mark habits as complete for other dates",
            }

        # get list of completed dates
        completed = habit.get("completed", [])

        # check if current date is already in list
        date_str_formatted = date_obj.strftime("%Y-%m-%d")
        if date_str_formatted not in completed:
            completed.append(date_str_formatted)

            # update habit with new date
            updates = {"completed": completed}
            Habit.update_habit(habit_name, email, updates)

            return {
                "success": True,
                "message": f"Habit marked as complete for {date_str_formatted}",
            }
        return {
            "success": True,
            "message": f"Habit already completed on {date_str_formatted}",
        }
    except Exception as e:
        return {"success": False, "message": str(e)}
