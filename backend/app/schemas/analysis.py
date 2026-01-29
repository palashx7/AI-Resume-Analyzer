from pydantic import BaseModel
from typing import List


# =========================
# REQUEST
# =========================

class AnalysisRunRequest(BaseModel):
    resumeId: str
    jobDescriptionId: str


# =========================
# SCORES
# =========================

class AnalysisScores(BaseModel):
    atsScore: int
    similarityScore: int
    finalScore: int


# =========================
# CATEGORIZED SKILLS
# =========================

class SkillCategory(BaseModel):
    core: List[str]
    important: List[str]
    niceToHave: List[str]


class CategorizedSkills(BaseModel):
    matched: SkillCategory
    missing: SkillCategory


# =========================
# ANALYSIS RESULT
# =========================

class AnalysisResult(BaseModel):
    analysisId: str
    scores: AnalysisScores
    fitLabel: str

    # flat lists (still useful)
    matchedSkills: List[str]
    missingSkills: List[str]

    # ✅ NEW (this is what frontend needs)
    categorizedSkills: CategorizedSkills

    strengths: List[str]
    improvements: List[str]
    createdAt: str


# =========================
# RESPONSE
# =========================

class AnalysisRunResponse(BaseModel):
    message: str
    analysis: AnalysisResult
