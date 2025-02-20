from typing import Collection
from pymongo import MongoClient
from werkzeug.security import generate_password_hash

client = MongoClient("mongodb://localhost:27017/")
db = client.HabitTracker
users_collection = db.users


class User:

    def __init__(self, name, surname, email, password):
        self.name = name
        self.surname = surname
        self.email = email
        self.password = generate_password_hash(password)

    def save(self):
        users_collection.insert_one(
            {
                "name": self.name,
                "surname": self.surname,
                "email": self.email,
                "password": self.password,
            }
        )
