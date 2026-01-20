from fastapi import APIRouter, Depends, status
from app.core.auth_dependency import get_current_user
from app.schemas.analysis import (
    AnalysisRunRequest,
    AnalysisRunResponse
)
from app.services.analysis_service import (
    fetch_resume_and_jd,
    run_ats_keyword_match
)
from app.services.analysis_persistence_service import save_analysis_result
from app.services.analysis_history_service import get_analysis_history
from app.services.analysis_history_service import get_analysis_by_id


router = APIRouter(
    prefix="/analysis",
    tags=["Analysis"]
)


@router.post(
    "/run",
    response_model=AnalysisRunResponse,
    status_code=status.HTTP_200_OK
)
async def run_analysis(
    payload: AnalysisRunRequest,
    current_user=Depends(get_current_user)
):
    # ---------- STEP 4.2: Fetch & ownership check ----------
    resume, job_description = await fetch_resume_and_jd(
        user_id=current_user["sub"],
        resume_id=payload.resumeId,
        job_description_id=payload.jobDescriptionId
    )

    # ---------- STEP 4.4 + 4.5: ATS analysis ----------
    ats_result = run_ats_keyword_match(
        resume_text=resume["extractedText"],
        jd_text=job_description["jdText"]
    )

    # ---------- STEP 4.6: Save analysis ----------
    analysis_id = await save_analysis_result(
        user_id=current_user["sub"],
        resume_id=payload.resumeId,
        job_description_id=payload.jobDescriptionId,
        ats_score=ats_result["atsScore"],
        matched_skills=ats_result["matchedSkills"],
        missing_skills=ats_result["missingSkills"],
        strengths=ats_result["strengths"],
        improvements=ats_result["improvements"],
    )

    # ---------- Response ----------
    return {
        "message": "Analysis completed successfully",
        "analysis": {
            "analysisId": str(analysis_id),
            "scores": {
                "atsScore": ats_result["atsScore"]
            },
            "matchedSkills": ats_result["matchedSkills"],
            "missingSkills": ats_result["missingSkills"],
            "strengths": ats_result["strengths"],
            "improvements": ats_result["improvements"],
            "createdAt": "2026-01-01T00:00:00Z"
        }
    }

@router.get(
    "/history",
    status_code=status.HTTP_200_OK
)
async def get_analysis_history_route(
    current_user=Depends(get_current_user)
):
    analyses = await get_analysis_history(
        user_id=current_user["sub"]
    )

    return {
        "analyses": analyses
    }



@router.get(
    "/{analysisId}",
    status_code=status.HTTP_200_OK
)
async def get_analysis_by_id_route(
    analysisId: str,
    current_user=Depends(get_current_user)
):
    analysis = await get_analysis_by_id(
        user_id=current_user["sub"],
        analysis_id=analysisId
    )

    return {
        "analysis": analysis
    }

