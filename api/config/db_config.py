import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv(dotenv_path="./.env.local")

MONGO_URL = os.environ.get("MONGO_URL", "")
# MONGO_USERNAME = os.environ.get("MONGO_USERNAME", "root")
# MONGO_PASSWORD = os.environ.get("MONGO_PASSWORD", "")

mongo_client = MongoClient(
    host=MONGO_URL,
    # username=MONGO_USERNAME,
    # password=MONGO_PASSWORD,
)
