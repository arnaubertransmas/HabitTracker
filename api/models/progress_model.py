import os
from pymongo import MongoClient

client = MongoClient(os.environ.get("MONGO_URL"))
db = client.HabitTracker
progress_collection = db["progress"]


class Progress:

    def __init__(self, user_email, habit_name, date, completed):
        self.user_email = user_email
        self.habit_name = habit_name
        self.date = date
        self.completed = completed

    ALLOWED_FIELDS = ["habit_name", "user_email", "date", "completed"]

    @staticmethod
    def save_habit_to_progress(name, time_day, habit_type, completed, user_email):
        try:
            result = progress_collection.insert_one(
                {
                    "name": name,
                    "time_day": time_day,
                    "type": habit_type,
                    "completed": completed,
                    "user_email": user_email,
                }
            )
        except Exception as e:
            raise e

    @staticmethod
    def update_habit(habit_name, user_email, updates):
        try:
            filtered_updates = {}
            for field, value in updates.items():  # returns key:value
                # if field in allowed_fields, update value
                if field in Progress.ALLOWED_FIELDS:
                    filtered_updates[field] = value

            result = progress_collection.update_one(
                {"name": habit_name, "user_email": user_email},
                {"$set": filtered_updates},
            )
        except Exception as e:
            return str(e)

    @staticmethod
    def get_habits(user_email):
        try:

            habits_raw = list(
                progress_collection.find({"user_email": user_email}, {"_id": 0})
            )

            # format each habit
            formatted_habits = []
            for habit in habits_raw:
                habit_data = {
                    "habitName": habit["name"],
                    "completed": habit["completed"],
                    "time_day": habit["time_day"],
                    "habit_type": habit["type"],
                }
                formatted_habits.append(habit_data)

            return formatted_habits

        except Exception as e:
            raise e

    @staticmethod
    def delete_habit(name):
        try:
            progress_collection.delete_one({"name": name})
        except Exception as e:
            return e
