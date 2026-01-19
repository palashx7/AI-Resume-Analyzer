from fastapi import HTTPException, status
from bson import ObjectId
from app.db.mongodb import get_database
from app.models.analysis_model import create_analysis_document

db = get_database()


async def save_analysis_result(
    user_id: str,
    resume_id: str,
    job_description_id: str,
    ats_score: int,
    matched_skills: list[str],
    missing_skills: list[str],
    strengths: list[str],
    improvements: list[str],
) -> ObjectId:
    """
    Saves analysis result into MongoDB and returns analysis ID.
    """
    try:
        analysis_doc = create_analysis_document(
            user_id=user_id,
            resume_id=resume_id,
            job_description_id=job_description_id,
            ats_score=ats_score,
            matched_skills=matched_skills,
            missing_skills=missing_skills,
            strengths=strengths,
            improvements=improvements,
        )

        result = await db.analyses.insert_one(analysis_doc)
        return result.inserted_id

    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to save analysis result",
        )
