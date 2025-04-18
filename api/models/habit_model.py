import os
from pymongo import MongoClient

client = MongoClient(os.environ.get("MONGO_URL"))
db = client.HabitTracker
habits_collection = db["habits"]


class Habit:

    def __init__(
        self,
        name,
        frequency,
        days,
        time_day,
        start_time,
        end_time,
        type_habit,
        completed,
        user_email,
    ):
        self.name = name
        self.frequency = frequency
        self.days = days
        self.time_day = time_day
        self.start_time = start_time
        self.end_time = end_time
        self.type = type_habit
        self.completed = completed
        self.user_email = user_email

    def save_habit(self):
        try:
            result = habits_collection.insert_one(
                {
                    "name": self.name,
                    "frequency": self.frequency,
                    "days": self.days,
                    "time_day": self.time_day,
                    "start_time": self.start_time,
                    "end_time": self.end_time,
                    "type": self.type,
                    "completed": self.completed,
                    "user_email": self.user_email,
                }
            )
        except Exception as e:
            raise e

    @staticmethod
    def get_habits(user_email, habit_type=None):
        try:

            # base query
            query = {"user_email": user_email}

            # if type specified add it
            if habit_type:
                query["type"] = habit_type

            # exclude ID avoiding ObjectID error
            habits = list(habits_collection.find(query, {"_id": 0}))

            return habits
        except Exception as e:
            raise e

    @staticmethod
    def get_habit(habit_name, user_email):
        try:
            habit = habits_collection.find_one(
                {"name": habit_name, "user_email": user_email}, {"_id": 0}
            )
            return habit if habit else None
        except Exception as e:
            raise e

    @staticmethod
    def update_habit(habit_name, user_email, updates):
        try:
            # update only changes, not all ($set)
            result = habits_collection.update_one(
                {"name": habit_name, "user_email": user_email}, {"$set": updates}
            )
        except Exception as e:
            return e

    @staticmethod
    def delete_habit(name):
        try:
            habits_collection.delete_one({"name": name})
        except Exception as e:
            return e
