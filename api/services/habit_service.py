from models.habit_model import Habit
from utils.logger import log_error
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
        # validation of data sent from frontend
        if not all(
            [name, frequency, time_day, type_habit, user_email]
            or not isinstance(completed, list)
        ):
            return {"success": False, "message": "All fields are required"}

        if type(name) != str:
            return {"success": False, "message": "Name param must contain only strings"}

        if type(days) != list:
            return {"success": False, "message": "Invalid format for days param"}

        if type(completed) != list:
            return {"success": False, "message": "Invalid format for completed param"}

        if Habit.get_habit(name, user_email):
            return {"success": False, "message": "Habit already exists"}

        if time_day not in TIME_MAP:
            return {"success": False, "message": "Invalid time of day"}

        start_time, end_time = TIME_MAP[time_day]
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
        # update habit validation
        habit = Habit.get_habit(habit_name, user_email)

        if not habit:
            return {"success": False, "message": "Habit doesn't exist"}

        if habit_name != new_name:
            if Habit.get_habit(new_name, user_email):
                return {"success": False, "message": "Habit already exists"}

        # dict for updates
        updates = {}

        # check new changes
        if habit["name"] != new_name:
            updates["name"] = new_name

        if habit["frequency"] != frequency:
            if type(days) == list:
                updates["frequency"] = frequency

        if habit["time_day"] != time_day:
            if time_day.lower() in TIME_MAP:
                updates["time_day"] = time_day

                # update corresponding hours to new time_day
                new_start_time, new_end_time = TIME_MAP[time_day.lower()]
                updates["start_time"] = new_start_time
                updates["end_time"] = new_end_time

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

        # Convert str to date object and get date of today
        date_obj = datetime.strptime(date_str, "%Y-%m-%d").date()
        date_today = datetime.now().date()

        if date_obj != date_today:
            return {
                "success": False,
                "message": "Cannot mark habits as complete for other dates",
            }

        completed = habit.get("completed", [])

        # Check if date is already in completed list
        date_str_formatted = date_obj.strftime(
            "%Y-%m-%d"
        )  # Convert back to string for storage
        if date_str_formatted not in completed:
            completed.append(date_str_formatted)

            # Update the habit
            updates = {"completed": completed}
            Habit.update_habit(habit_name, email, updates)

            return {
                "success": True,
                "message": f"Habit marked as complete for {date_str_formatted}",
            }
        else:
            return {
                "success": True,
                "message": f"Habit already completed on {date_str_formatted}",
            }
    except Exception as e:
        return {"success": False, "message": str(e)}


def update_streak_service(habit_name, date, email):
    try:
        habit = Habit.get_habit(habit_name, email)
        if not habit:
            return {"success": False, "message": "Habit not found"}

        completed = habit.get("completed", [])
        if date in completed:
            return {"success": False, "message": "Streak already on date"}

        # Update the habit
        updates = {"streak": date.split("T")[0]}  # Extract only YYYY-MM-DD
        Habit.update_habit(habit_name, email, updates)

        return {"success": True, "message": "Streak updated successfully"}
    except Exception as e:
        return {"success": False, "message": str(e)}
