from pydantic import BaseModel
from datetime import datetime
from typing import List


class AnalysisHistoryItem(BaseModel):
    analysisId: str
    resumeId: str
    jobDescriptionId: str
    atsScore: int
    createdAt: str


class AnalysisHistoryResponse(BaseModel):
    page: int
    limit: int
    total: int
    analyses: List[AnalysisHistoryItem]


class AnalysisDetailResponse(BaseModel):
    analysisId: str
    resumeId: str
    jobDescriptionId: str
    atsScore: int
    matchedSkills: List[str]
    missingSkills: List[str]
    strengths: List[str]
    improvements: List[str]
    createdAt: str
