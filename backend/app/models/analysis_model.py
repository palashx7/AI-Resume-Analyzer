from datetime import datetime
from bson import ObjectId


def create_analysis_document(
    user_id: str,
    resume_id: str,
    job_description_id: str,
    ats_score: int,
    similarity_score: int,
    final_score: int,
    fit_label: str,   
    matched_skills: list[str],
    missing_skills: list[str],
    strengths: list[str],
    improvements: list[str],
) -> dict:
    return {
        "userId": ObjectId(user_id),
        "resumeId": ObjectId(resume_id),
        "jobDescriptionId": ObjectId(job_description_id),
        "atsScore": ats_score,
        "similarityScore": similarity_score,
        "finalScore": final_score,
        "fitLabel": fit_label,
        "matchedSkills": matched_skills,
        "missingSkills": missing_skills,
        "strengths": strengths,
        "improvements": improvements,
        "createdAt": datetime.utcnow(),
    }
