from pydantic import BaseModel
from datetime import datetime
from typing import List


class AnalysisRunRequest(BaseModel):
    resumeId: str
    jobDescriptionId: str


class AnalysisScores(BaseModel):
    atsScore: int


class AnalysisResult(BaseModel):
    analysisId: str
    scores: AnalysisScores
    matchedSkills: List[str]
    missingSkills: List[str]
    strengths: List[str]
    improvements: List[str]
    createdAt: datetime


class AnalysisRunResponse(BaseModel):
    message: str
    analysis: AnalysisResult
