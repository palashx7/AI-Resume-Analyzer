from fastapi import FastAPI
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI(
    title=os.getenv("APP_NAME", "AI Resume Analyzer"),
    version="0.1.0"
)


@app.get("/health")
async def health_check():
    return {
        "status": "ok",
        "environment": os.getenv("ENV", "unknown")
    }
