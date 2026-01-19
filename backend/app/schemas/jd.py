from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class JobDescriptionCreate(BaseModel):
    jdText: str
    jdTitle: Optional[str] = None
    companyName: Optional[str] = None


class JobDescriptionResponse(BaseModel):
    id: str
    jdText: str
    jdTitle: Optional[str]
    companyName: Optional[str]
    createdAt: datetime


class JobDescriptionSuccessResponse(BaseModel):
    message: str
    jobDescription: JobDescriptionResponse
