from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class ResumeResponse(BaseModel):
    id: str
    resumeTitle: Optional[str]
    originalFileName: str
    createdAt: datetime

class ResumeUploadResponse(BaseModel):
    id: str
    resumeTitle: Optional[str]
    originalFileName: str
    extractedTextPreview: str
    createdAt: datetime


class ResumeUploadSuccessResponse(BaseModel):
    message: str
    resume: ResumeUploadResponse