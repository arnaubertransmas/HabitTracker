import os
from pymongo import MongoClient

client = MongoClient(os.environ.get("MONGO_URL"))
db = client.HabitTracker
notes_collection = db["notes"]


class Notes:

    def __init__(self, notes, habit_name, user_email):
        self.notes = notes
        self.habit_name = habit_name
        self.user_email = user_email

    def save(self):
        """Save a note to the database"""
        try:
            notes_collection.insert_one(
                {
                    "notes": self.notes,
                    "habit_name": self.habit_name,
                    "user_email": self.user_email,
                }
            )

        except Exception as e:
            raise e

    @staticmethod
    def get_note(habit_name, user_email):
        """get a single note from the database"""
        try:
            note = notes_collection.find_one(
                {"habit_name": habit_name, "user_email": user_email}, {"_id": 0}
            )
            return note
        except Exception as e:
            raise e
