from bson import ObjectId
from app.db.mongodb import get_database
from fastapi import HTTPException, status

# ✅ import categorization logic
from app.services.analysis_service import categorize_skills


db = get_database()


async def get_analysis_history(
    user_id: str,
    page: int = 1,
    limit: int = 10
) -> dict:
    """
    Returns paginated analysis history for a user.
    """
    skip = (page - 1) * limit

    query = {"userId": ObjectId(user_id)}

    total = await db.analyses.count_documents(query)

    cursor = (
        db.analyses
        .find(query)
        .sort("createdAt", -1)
        .skip(skip)
        .limit(limit)
    )

    analyses = []
    async for doc in cursor:
        analyses.append({
            "analysisId": str(doc["_id"]),
            "resumeId": str(doc["resumeId"]),
            "jobDescriptionId": str(doc["jobDescriptionId"]),
            "atsScore": doc.get("atsScore", 0),
            "similarityScore": doc.get("similarityScore", 0),
            "finalScore": doc.get("finalScore", 0),
            "fitLabel": doc.get("fitLabel", "Unknown"),
            "createdAt": doc["createdAt"].isoformat(),
        })

    return {
        "page": page,
        "limit": limit,
        "total": total,
        "analyses": analyses,
    }


async def get_analysis_by_id(user_id: str, analysis_id: str) -> dict:
    doc = await db.analyses.find_one({
        "_id": ObjectId(analysis_id),
        "userId": ObjectId(user_id)
    })

    if not doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Analysis not found"
        )

    matched = doc.get("matchedSkills", [])
    missing = doc.get("missingSkills", [])

    categorized_skills = {
        "matched": categorize_skills(matched),
        "missing": categorize_skills(missing),
    }
    

    return {
        "analysisId": str(doc["_id"]),
        "resumeId": str(doc["resumeId"]),
        "jobDescriptionId": str(doc["jobDescriptionId"]),

        "atsScore": doc.get("atsScore", 0),
        "similarityScore": doc.get("similarityScore", 0),
        "finalScore": doc.get("finalScore", 0),
        "fitLabel": doc.get("fitLabel", "Unknown"),

        "matchedSkills": matched,
        "missingSkills": missing,
        "categorizedSkills": doc.get("categorizedSkills", {
    "matched": {"core": [], "important": [], "niceToHave": []},
    "missing": {"core": [], "important": [], "niceToHave": []},
}),

        # ✅ ALWAYS PRESENT NOW
        "categorizedSkills": categorized_skills,

        "strengths": doc.get("strengths", []),
        "improvements": doc.get("improvements", []),
        "createdAt": doc["createdAt"].isoformat(),
    }
