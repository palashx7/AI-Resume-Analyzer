from datetime import datetime
from bson import ObjectId


def create_resume_document(
    user_id: str,
    resume_title: str | None,
    original_filename: str,
    extracted_text: str
) -> dict:
    """
    Creates a MongoDB-ready resume document.
    """
    return {
        "userId": ObjectId(user_id),
        "resumeTitle": resume_title,
        "originalFileName": original_filename,
        "extractedText": extracted_text,
        "createdAt": datetime.utcnow(),
        "updatedAt": datetime.utcnow(),
    }
