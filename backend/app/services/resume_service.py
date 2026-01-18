from fastapi import HTTPException, status
from bson import ObjectId
from app.db.mongodb import get_database
from app.models.resume_model import create_resume_document

db = get_database()


async def create_resume(
    user_id: str,
    resume_title: str | None,
    original_filename: str,
    extracted_text: str
) -> ObjectId:
    """
    Inserts a resume document into MongoDB and returns the inserted ID.
    """
    try:
        resume_doc = create_resume_document(
            user_id=user_id,
            resume_title=resume_title,
            original_filename=original_filename,
            extracted_text=extracted_text
        )

        result = await db.resumes.insert_one(resume_doc)
        return result.inserted_id

    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to save resume"
        )
