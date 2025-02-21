import os
from pymongo import MongoClient
from werkzeug.security import generate_password_hash

client = MongoClient(os.environ.get("MONGO_URL"))
db = client.HabitTracker
users_collection = db["users"]


class User:

    def __init__(self, name, surname, email, password):
        self.name = name
        self.surname = surname
        self.email = email
        self.password = generate_password_hash(password)

    def save(self):
        try:
            users_collection.insert_one(
                {
                    "name": self.name,
                    "surname": self.surname,
                    "email": self.email,
                    "password": self.password,
                }
            )
        except Exception as e:
            raise e

    @staticmethod
    def find_email(email):
        return users_collection.find_one({"email": email}) is not None

    @staticmethod
    def get_users():
        try:
            # excloem l'ID per evitar ObjectID error
            users = list(users_collection.find({}, {"_id": 0}))
            return users
        except Exception as e:
            raise e

    @staticmethod
    def get_user(param, value):
        try:
            user = list(users_collection.find({param: value}))
            return user
        except Exception as e:
            return e
