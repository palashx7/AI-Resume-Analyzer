from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()

# Prefer Docker / cloud variable, fallback to local .env
MONGO_URI = os.getenv("MONGODB_URI") or os.getenv("MONGO_URI")

if not MONGO_URI:
    raise RuntimeError("MongoDB URI not set. Define MONGODB_URI or MONGO_URI.")

DB_NAME = "ai_resume_analyzer"

client = AsyncIOMotorClient(MONGO_URI)
database = client[DB_NAME]

def get_database():
    return database
