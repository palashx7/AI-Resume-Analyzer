from fastapi import (
    APIRouter,
    UploadFile,
    File,
    Form,
    Depends,
    HTTPException,
    status
)

from app.core.auth_dependency import get_current_user
from app.schemas.resume import ResumeUploadSuccessResponse
from app.services.pdf_service import (
    read_pdf_bytes,
    extract_text_from_pdf
)
from app.services.resume_service import create_resume
from app.services.resume_service import list_user_resumes

router = APIRouter(
    prefix="/resumes",
    tags=["Resumes"]
)

MAX_FILE_SIZE = 2 * 1024 * 1024  # 2MB


@router.post(
    "/upload",
    response_model=ResumeUploadSuccessResponse,
    status_code=201
)
async def upload_resume(
    file: UploadFile = File(...),
    resumeTitle: str | None = Form(None),
    current_user=Depends(get_current_user)
):
    # ---------- STEP 2.2: File Validation ----------

    if not file or not file.filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No file uploaded"
        )

    if not file.filename.lower().endswith(".pdf") or file.content_type != "application/pdf":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only PDF files are allowed"
        )

    file_bytes = await file.read()

    if len(file_bytes) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File size exceeds 2MB limit"
        )

    # Reset pointer for downstream services
    await file.seek(0)

    # ---------- STEP 2.3: PDF Text Extraction ----------

    pdf_bytes = await read_pdf_bytes(file)
    extracted_text = extract_text_from_pdf(pdf_bytes)

    # ---------- STEP 2.4: Save Resume to MongoDB ----------

    resume_id = await create_resume(
        user_id=current_user["sub"],
        resume_title=resumeTitle,
        original_filename=file.filename,
        extracted_text=extracted_text
    )

    # ---------- Response ----------

    preview_length = 300
    text_preview = extracted_text[:preview_length]

    return {
        "message": "Resume uploaded successfully",
        "resume": {
            "id": str(resume_id),
            "resumeTitle": resumeTitle,
            "originalFileName": file.filename,
            "extractedTextPreview": text_preview,
            "createdAt": "2026-01-01T00:00:00Z"
        }
    }



@router.get(
    "",
    status_code=status.HTTP_200_OK
)
async def get_user_resumes(
    current_user=Depends(get_current_user)
):
    resumes = await list_user_resumes(
        user_id=current_user["sub"]
    )

    return {
        "resumes": resumes
    }