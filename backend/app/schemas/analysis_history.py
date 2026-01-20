from pydantic import BaseModel
from typing import List


# ---------- HISTORY (LIST) ----------

class AnalysisHistoryItem(BaseModel):
    analysisId: str
    resumeId: str
    jobDescriptionId: str
    atsScore: int
    similarityScore: int
    finalScore: int
    fitLabel: str
    createdAt: str




class AnalysisHistoryResponse(BaseModel):
    page: int
    limit: int
    total: int
    analyses: List[AnalysisHistoryItem]


# ---------- DETAIL (SINGLE ANALYSIS) ----------

class AnalysisDetail(BaseModel):
    analysisId: str
    resumeId: str
    jobDescriptionId: str
    atsScore: int
    similarityScore: int
    finalScore: int
    fitLabel: str
    matchedSkills: List[str]
    missingSkills: List[str]
    strengths: List[str]
    improvements: List[str]
    createdAt: str




class AnalysisDetailResponse(BaseModel):
    analysis: AnalysisDetail
