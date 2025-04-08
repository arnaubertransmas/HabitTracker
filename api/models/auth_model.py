import os
from pymongo import MongoClient
from werkzeug.security import generate_password_hash

client = MongoClient(os.environ.get("MONGO_URL"))
db = client.HabitTracker
users_collection = db["users"]


class User:

    def __init__(self, name, surname, email, password, streak):
        self.name = name
        self.surname = surname
        self.email = email
        self.password = generate_password_hash(password)
        self.streak = streak
        # self.id = None

    def save(self):
        try:
            result = users_collection.insert_one(
                {
                    "name": self.name,
                    "surname": self.surname,
                    "email": self.email,
                    "password": self.password,
                    "streak": self.streak,
                }
            )

            # self.id = result.inserted_id

        except Exception as e:
            raise e

    @staticmethod
    def get_users():
        try:
            # exclude ID avoiding ObjectID error
            users = list(users_collection.find({}, {"_id": 0}))
            return users
        except Exception as e:
            raise e

    @staticmethod
    def get_user(param, value):
        try:
            if param == "_id":
                user = list(users_collection.find({param: value}))
            user = list(users_collection.find({param: value}, {"_id": 0}))
            return user
        except Exception as e:
            return e

    @staticmethod
    def update_user(email, updates):
        try:
            users_collection.update_one({"email": email}, {"$set": updates})
        except Exception as e:
            raise e
