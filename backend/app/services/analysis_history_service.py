from bson import ObjectId
from app.db.mongodb import get_database
from fastapi import HTTPException, status

db = get_database()


async def get_analysis_history(user_id: str) -> list[dict]:
    """
    Returns analysis history for a user (latest first).
    """
    cursor = db.analyses.find(
        {"userId": ObjectId(user_id)}
    ).sort("createdAt", -1)

    analyses = []
    async for doc in cursor:
        analyses.append({
            "analysisId": str(doc["_id"]),
            "resumeId": str(doc["resumeId"]),
            "jobDescriptionId": str(doc["jobDescriptionId"]),
            "atsScore": doc["atsScore"],
            "createdAt": doc["createdAt"],
        })

    return analyses


async def get_analysis_by_id(
    user_id: str,
    analysis_id: str
) -> dict:
    """
    Returns a single analysis by ID with ownership check.
    """
    doc = await db.analyses.find_one({
        "_id": ObjectId(analysis_id),
        "userId": ObjectId(user_id)
    })

    if not doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Analysis not found"
        )

    return {
        "analysisId": str(doc["_id"]),
        "resumeId": str(doc["resumeId"]),
        "jobDescriptionId": str(doc["jobDescriptionId"]),
        "atsScore": doc["atsScore"],
        "matchedSkills": doc["matchedSkills"],
        "missingSkills": doc["missingSkills"],
        "strengths": doc["strengths"],
        "improvements": doc["improvements"],
        "createdAt": doc["createdAt"],
    }
