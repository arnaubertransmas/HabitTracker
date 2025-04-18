from models.progress_model import Progress


def get_user_data_service(user_email):
    try:
        user_habits = Progress.get_habits(user_email)
        formatted_habits = []

        for habit in user_habits:
            # create data dict that will get frontend
            habit_data = {
                "habitName": habit["name"],
                "completed": habit["completed"],
                "time_day": habit["time_day"],
                "habit_type": habit["type"],
            }
            formatted_habits.append(habit_data)

        return {
            "success": True,
            "message": "Habits formatted successfully",
            "data": formatted_habits,
        }

    except Exception as e:
        return {
            "success": False,
            "message": f"Error retrieving habits: {e}",
            "data": [],
        }
