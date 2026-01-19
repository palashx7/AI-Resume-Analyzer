from fastapi import HTTPException, status
from bson import ObjectId
from app.db.mongodb import get_database
import re

db = get_database()

def preprocess_text(text: str) -> str:
    """
    Basic text preprocessing for analysis.
    """
    # Convert to lowercase
    text = text.lower()

    # Remove special characters (keep words and spaces)
    text = re.sub(r"[^a-z0-9\s]", " ", text)

    # Normalize whitespace
    text = re.sub(r"\s+", " ", text).strip()

    return text

def extract_keywords_from_jd(jd_text: str) -> set[str]:
    """
    Extracts unique keywords from preprocessed job description text.
    """
    words = jd_text.split()

    keywords = {
        word
        for word in words
        if len(word) >= 3
    }

    return keywords


def match_keywords_with_resume(
    resume_text: str,
    jd_keywords: set[str]
) -> tuple[list[str], list[str]]:
    """
    Matches JD keywords against resume text.
    Returns matched and missing keywords.
    """
    matched = []
    missing = []

    for keyword in jd_keywords:
        if keyword in resume_text:
            matched.append(keyword)
        else:
            missing.append(keyword)

    return matched, missing


def calculate_ats_score(
    matched: list[str],
    missing: list[str]
) -> int:
    """
    Calculates ATS score as a percentage.
    """
    total = len(matched) + len(missing)

    if total == 0:
        return 0

    score = (len(matched) / total) * 100
    return round(score)



def run_ats_keyword_match(
    resume_text: str,
    jd_text: str
) -> dict:
    """
    Runs full ATS keyword matching pipeline with feedback.
    """
    # Preprocess text
    resume_clean = preprocess_text(resume_text)
    jd_clean = preprocess_text(jd_text)

    # Extract keywords from JD
    jd_keywords = extract_keywords_from_jd(jd_clean)

    # Match keywords
    matched, missing = match_keywords_with_resume(
        resume_clean,
        jd_keywords
    )

    # Calculate score
    ats_score = calculate_ats_score(matched, missing)

    # Generate feedback
    strengths, improvements = generate_strengths_and_improvements(
        matched,
        missing
    )

    return {
        "atsScore": ats_score,
        "matchedSkills": matched,
        "missingSkills": missing,
        "strengths": strengths,
        "improvements": improvements
    }




STOPWORDS = {
    "and", "with", "for", "the", "a", "an",
    "looking", "experience", "role", "job"
}


def generate_strengths_and_improvements(
    matched: list[str],
    missing: list[str]
) -> tuple[list[str], list[str]]:
    """
    Generates human-readable strengths and improvements
    based on ATS keyword matching.
    """

    # Filter stopwords
    matched_clean = [w for w in matched if w not in STOPWORDS]
    missing_clean = [w for w in missing if w not in STOPWORDS]

    strengths = []
    improvements = []

    if matched_clean:
        strengths.append(
            "Your resume shows experience with " +
            ", ".join(matched_clean[:5]) + "."
        )

    if missing_clean:
        improvements.append(
            "Consider adding experience with " +
            ", ".join(missing_clean[:5]) + " if applicable."
        )

    if not matched_clean:
        improvements.append(
            "Your resume has limited keyword overlap with the job description. Consider tailoring it more closely."
        )

    return strengths, improvements




async def fetch_resume_and_jd(
    user_id: str,
    resume_id: str,
    job_description_id: str
):
    """
    Fetches resume and job description and ensures ownership.
    """

    # Fetch resume
    resume = await db.resumes.find_one({
        "_id": ObjectId(resume_id),
        "userId": ObjectId(user_id)
    })

    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume not found"
        )

    # Fetch job description
    job_description = await db.job_descriptions.find_one({
        "_id": ObjectId(job_description_id),
        "userId": ObjectId(user_id)
    })

    if not job_description:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job description not found"
        )

    return resume, job_description
