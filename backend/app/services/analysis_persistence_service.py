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
    similarity_score: int,
    final_score: int,
    fit_label: str,

    matched_skills: list[str],
    missing_skills: list[str],

    categorized_skills: dict,  # ✅ NEW

    strengths: list[str],
    improvements: list[str],
):
    """
    Persists a completed analysis result to MongoDB.
    """

    analysis_doc = create_analysis_document(
        user_id=user_id,
        resume_id=resume_id,
        job_description_id=job_description_id,

        ats_score=ats_score,
        similarity_score=similarity_score,
        final_score=final_score,
        fit_label=fit_label,

        matched_skills=matched_skills,
        missing_skills=missing_skills,

        categorized_skills=categorized_skills,  # ✅ PASS THROUGH

        strengths=strengths,
        improvements=improvements,
    )

    result = await db.analyses.insert_one(analysis_doc)

    return {
        "analysis_id": result.inserted_id,
        "created_at": analysis_doc["createdAt"],
    }
