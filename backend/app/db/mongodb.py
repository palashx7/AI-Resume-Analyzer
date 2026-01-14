from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
DB_NAME = "ai_resume_analyzer"

client = AsyncIOMotorClient(MONGO_URI)
database = client[DB_NAME]


def get_database():
    return database
