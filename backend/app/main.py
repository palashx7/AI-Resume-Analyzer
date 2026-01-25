from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

from app.routes import auth
from app.routes.resume import router as resume_router
from app.routes.jd import router as jd_router
from app.routes.analysis import router as analysis_router

load_dotenv()

app = FastAPI(
    title=os.getenv("APP_NAME", "AI Resume Analyzer"),
    version="0.1.0"
)

# ---------- CORS (REQUIRED FOR FRONTEND) ----------
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------- Routes ----------
app.include_router(auth.router)
app.include_router(resume_router)
app.include_router(jd_router)
app.include_router(analysis_router)

# ---------- Health Check ----------
@app.get("/health")
async def health_check():
    return {
        "status": "ok",
        "environment": os.getenv("ENV", "unknown")
    }
