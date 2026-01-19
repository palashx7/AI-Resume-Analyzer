from datetime import datetime
from bson import ObjectId


def create_analysis_document(
    user_id: str,
    resume_id: str,
    job_description_id: str,
    ats_score: int,
    matched_skills: list[str],
    missing_skills: list[str],
    strengths: list[str],
    improvements: list[str],
) -> dict:
    """
    Creates a MongoDB-ready analysis document.
    """
    return {
        "userId": ObjectId(user_id),
        "resumeId": ObjectId(resume_id),
        "jobDescriptionId": ObjectId(job_description_id),
        "atsScore": ats_score,
        "matchedSkills": matched_skills,
        "missingSkills": missing_skills,
        "strengths": strengths,
        "improvements": improvements,
        "createdAt": datetime.utcnow(),
    }
