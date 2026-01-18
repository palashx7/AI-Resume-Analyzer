from fastapi import HTTPException, status
from typing import ByteString
import fitz  # PyMuPDF


async def read_pdf_bytes(file) -> ByteString:
    """
    Reads uploaded PDF file bytes safely.
    Assumes file is already validated (PDF + size).
    """
    try:
        file_bytes = await file.read()

        if not file_bytes:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Uploaded file is empty"
            )

        return file_bytes

    except Exception:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Failed to read PDF file"
        )


def extract_text_from_pdf(pdf_bytes: ByteString) -> str:
    """
    Extracts text from a PDF using PyMuPDF.
    Returns cleaned text string.
    """
    try:
        doc = fitz.open(stream=pdf_bytes, filetype="pdf")
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Invalid or corrupted PDF file"
        )

    extracted_text = []

    for page in doc:
        page_text = page.get_text()

        if page_text:
            extracted_text.append(page_text)

    full_text = "\n".join(extracted_text).strip()

    # Handle image-only or empty PDFs
    if not full_text or len(full_text) < 50:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Unable to extract text from resume. Please upload a text-based PDF."
        )

    return full_text
