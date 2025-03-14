import os
from pymongo import MongoClient

client = MongoClient(os.environ.get("MONGO_URL"))
db = client.HabitTracker
habits_collection = db["habits"]


class Habit:

    def __init__(self, name, frequency, time_day, type_habit, user_email):
        self.name = name
        self.frequency = frequency
        self.time_day = time_day
        self.type = type_habit
        self.user_email = user_email

    def save_habit(self):
        try:
            result = habits_collection.insert_one(
                {
                    "name": self.name,
                    "frequency": self.frequency,
                    "time_day": self.time_day,
                    "type": self.type,
                    "user_email": self.user_email,
                }
            )
        except Exception as e:
            raise e

    @staticmethod
    def get_habits(user_email):
        try:
            # exclude ID avoiding ObjectID error
            habits = list(
                habits_collection.find({"user_email": user_email}, {"_id": 0})
            )
            return habits
        except Exception as e:
            raise e

    @staticmethod
    def get_habit(param, value):
        try:
            habit = list(habits_collection.find({param: value}))
            return habit
        except Exception as e:
            return e

    @staticmethod
    def delete_habit(name):
        try:
            habits_collection.delete_one({"name": name})
        except Exception as e:
            return e
