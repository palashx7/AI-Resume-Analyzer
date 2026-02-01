from fastapi import HTTPException, status
from bson import ObjectId
from app.db.mongodb import get_database
from app.models.jd_model import create_jd_document

db = get_database()


async def create_job_description(
    user_id: str,
    jd_text: str,
    jd_title: str | None = None,
    company_name: str | None = None
) -> ObjectId:
    """
    Inserts a job description into MongoDB and returns the inserted ID.
    """
    try:
        jd_doc = create_jd_document(
            user_id=user_id,
            jd_text=jd_text,
            jd_title=jd_title,
            company_name=company_name
        )

        result = await db.job_descriptions.insert_one(jd_doc)
        return result.inserted_id

    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to save job description"
        )


async def list_user_job_descriptions(user_id: str):
    """
    Returns lightweight list of job descriptions for dropdowns.
    """
    try:
        cursor = (
            db.job_descriptions
            .find(
                {"userId": ObjectId(user_id)},
                {
                    "_id": 1,
                    "jdTitle": 1,
                    "companyName": 1,
                    "createdAt": 1,
                }
            )
            .sort("createdAt", -1)
        )

        job_descriptions = []
        async for doc in cursor:
            job_descriptions.append({
                "id": str(doc["_id"]),
                "jdTitle": doc.get("jdTitle"),
                "companyName": doc.get("companyName"),
                "createdAt": doc.get("createdAt"),
            })

        return job_descriptions

    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch job descriptions"
        )