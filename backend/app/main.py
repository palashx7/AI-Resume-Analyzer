from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

from routes import auth
from routes.resume import router as resume_router
from routes.jd import router as jd_router
from routes.analysis import router as analysis_router


load_dotenv()

app = FastAPI(
    title=os.getenv("APP_NAME", "AI Resume Analyzer"),
    version="0.1.0"
)

# ---------- CORS ----------
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://ai-resume-analyzer-chi-ten.vercel.app",
        "https://ai-resume-analyzer-fq54wunu5-palashs-projects-6c6a75b6.vercel.app",
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

# ---------- Health ----------
@app.get("/health")
async def health_check():
    return {"status": "ok"}

# ---------- Railway entrypoint ----------
if __name__ == "__main__":
    import uvicorn

    port = int(os.getenv("PORT", 8000))
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=port,
        log_level="info",
    )
