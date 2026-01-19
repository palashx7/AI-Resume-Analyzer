from datetime import datetime
from bson import ObjectId


def create_jd_document(
    user_id: str,
    jd_text: str,
    jd_title: str | None = None,
    company_name: str | None = None
) -> dict:
    """
    Creates a MongoDB-ready Job Description document.
    """
    return {
        "userId": ObjectId(user_id),
        "jdText": jd_text,
        "jdTitle": jd_title,
        "companyName": company_name,
        "createdAt": datetime.utcnow(),
        "updatedAt": datetime.utcnow(),
    }
