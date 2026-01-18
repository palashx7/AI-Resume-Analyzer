from fastapi import FastAPI
from dotenv import load_dotenv
import os

from app.routes import auth  # 👈 import routers here
from app.routes.resume import router as resume_router

load_dotenv()

app = FastAPI(
    title=os.getenv("APP_NAME", "AI Resume Analyzer"),
    version="0.1.0"
)

# ---------- Routes ----------
app.include_router(auth.router)

app.include_router(resume_router)

# ---------- Health Check ----------
@app.get("/health")
async def health_check():
    return {
        "status": "ok",
        "environment": os.getenv("ENV", "unknown")
    }
