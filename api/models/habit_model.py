import os
from pymongo import MongoClient

client = MongoClient(os.environ.get("MONGO_URL"))
db = client.HabitTracker
habits_collection = db["habits"]


class Habit:

    def __init__(self, name, duration, repeat, time_day):
        self.name = name
        self.duration = duration
        self.repeat = repeat
        self.time_day = time_day

    def save_habit(self):
        try:
            result = habits_collection.insert_one(
                {
                    "name": self.name,
                    "duration": self.duration,
                    "repeat": self.repeat,
                    "time_day": self.time_day,
                }
            )
        except Exception as e:
            raise e

    @staticmethod
    def get_habits():
        try:
            # exclude ID avoiding ObjectID error
            habits = list(habits_collection.find({}, {"_id": 0}))
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

    def delete_habit(id):
        try:
            habits_collection.delete_one({"_id": str(id)})
        except Exception as e:
            return e
