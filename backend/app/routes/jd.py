from fastapi import APIRouter, Depends, status, HTTPException
from app.core.auth_dependency import get_current_user
from app.schemas.jd import (
    JobDescriptionCreate,
    JobDescriptionSuccessResponse
)
from app.services.jd_service import create_job_description
from app.services.jd_service import list_user_job_descriptions

router = APIRouter(
    prefix="/job-descriptions",
    tags=["Job Descriptions"]
)


@router.post(
    "",
    response_model=JobDescriptionSuccessResponse,
    status_code=status.HTTP_201_CREATED
)
async def create_job_description_route(
    payload: JobDescriptionCreate,
    current_user=Depends(get_current_user)
):
    # ---------- STEP 3.2: Validation ----------

    if not payload.jdText or not payload.jdText.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Job description text is required"
        )

    if len(payload.jdText.strip()) < 50:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Job description text is too short"
        )

    # ---------- STEP 3.4: Save JD to MongoDB ----------

    jd_id = await create_job_description(
        user_id=current_user["sub"],
        jd_text=payload.jdText,
        jd_title=payload.jdTitle,
        company_name=payload.companyName
    )

    # ---------- Response ----------

    return {
        "message": "Job description created successfully",
        "jobDescription": {
            "id": str(jd_id),
            "jdText": payload.jdText,
            "jdTitle": payload.jdTitle,
            "companyName": payload.companyName,
            "createdAt": "2026-01-01T00:00:00Z"
        }
    }



@router.get(
    "",
    status_code=status.HTTP_200_OK
)
async def get_user_job_descriptions(
    current_user=Depends(get_current_user)
):
    job_descriptions = await list_user_job_descriptions(
        user_id=current_user["sub"]
    )

    return {
        "jobDescriptions": job_descriptions
    }