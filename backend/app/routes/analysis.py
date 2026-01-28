from fastapi import APIRouter, Depends, status
from app.core.auth_dependency import get_current_user

from app.schemas.analysis import (
    AnalysisRunRequest,
    AnalysisRunResponse
)
from app.schemas.analysis_history import (
    AnalysisHistoryResponse,
    AnalysisDetailResponse
)

from app.services.analysis_service import (
    fetch_resume_and_jd,
    run_ats_keyword_match
)
from app.services.analysis_persistence_service import save_analysis_result
from app.services.analysis_history_service import (
    get_analysis_history,
    get_analysis_by_id
)
from app.services.similarity_service import compute_similarity_score
from app.services.scoring_service import (
    compute_final_score,
    get_fit_label
)

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

    # ---------- STEP 6.3: AI similarity ----------
    similarity_score = compute_similarity_score(
        resume_text=resume["extractedText"],
        jd_text=job_description["jdText"]
    )

    # ---------- STEP 6.4: Final weighted score ----------
    final_score = compute_final_score(
        ats_score=ats_result["atsScore"],
        similarity_score=similarity_score
    )

    # ---------- STEP 6.5: Fit label ----------
    fit_label = get_fit_label(final_score)

    # ---------- STEP 4.6: Save analysis ----------
    analysis_result = await save_analysis_result(
        user_id=current_user["sub"],
        resume_id=payload.resumeId,
        job_description_id=payload.jobDescriptionId,
        ats_score=ats_result["atsScore"],
        similarity_score=similarity_score,
        final_score=final_score,
        fit_label=fit_label,
        matched_skills=ats_result["matchedSkills"],
        missing_skills=ats_result["missingSkills"],
        strengths=ats_result["strengths"],
        improvements=ats_result["improvements"],
    )

    # ---------- Response ----------
    return {
        "message": "Analysis completed successfully",
        "analysis": {
            "analysisId": str(analysis_result["analysis_id"]),
            "scores": {
                "atsScore": ats_result["atsScore"],
                "similarityScore": similarity_score,
                "finalScore": final_score
            },
            "fitLabel": fit_label,
            "matchedSkills": ats_result["matchedSkills"],
            "missingSkills": ats_result["missingSkills"],
            "strengths": ats_result["strengths"],
            "improvements": ats_result["improvements"],
            "createdAt": analysis_result["created_at"].isoformat()
        }
    }


@router.get(
    "/history",
    response_model=AnalysisHistoryResponse,
    status_code=status.HTTP_200_OK
)
async def get_analysis_history_route(
    page: int = 1,
    limit: int = 10,
    current_user=Depends(get_current_user)
):
    page = max(page, 1)
    limit = min(max(limit, 1), 50)

    return await get_analysis_history(
        user_id=current_user["sub"],
        page=page,
        limit=limit
    )


@router.get(
    "/{analysisId}",
    response_model=AnalysisDetailResponse,
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
