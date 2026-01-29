from fastapi import HTTPException, status
from bson import ObjectId
from app.db.mongodb import get_database
import re

db = get_database()

# =========================
# SKILL DEFINITIONS
# =========================

CANONICAL_SKILLS = {
    "python", "java", "javascript",
    "fastapi", "django", "flask",
    "docker", "kubernetes",
    "mongodb", "postgresql", "mysql",
    "aws", "azure", "gcp",
    "rest", "graphql",
    "jwt", "oauth",
    "ci", "cd", "ci/cd",
    "kafka", "rabbitmq",
    "microservices",
    "nosql", "sql",
}

STOPWORDS = {
    "a", "an", "the", "and", "or", "but", "if", "while",
    "with", "without", "within", "by", "for", "from",
    "to", "of", "in", "on", "at", "as", "per",
    "is", "are", "was", "were", "be", "been", "being",
    "this", "that", "these", "those",
    "it", "its", "they", "them", "their", "we", "you", "your",
    "will", "would", "should", "can", "could", "may", "might",
    "must", "shall",
    "role", "roles", "responsibility", "responsibilities",
    "required", "requirements", "preferred",
    "experience", "knowledge", "ability",
    "work", "working", "team", "teams",
    "company", "business", "environment",
    "using", "use", "used",
}

# =========================
# TEXT PREPROCESSING
# =========================

def preprocess_text(text: str) -> str:
    text = text.lower()
    text = re.sub(r"[^a-z0-9\s]", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text


# =========================
# SKILL EXTRACTION
# =========================

def extract_skills_from_text(text: str) -> set[str]:
    words = text.split()
    skills = {
        word
        for word in words
        if word not in STOPWORDS
        and word in CANONICAL_SKILLS
    }
    return skills


def match_skills(
    resume_text: str,
    jd_skills: set[str]
) -> tuple[list[str], list[str]]:

    matched = []
    missing = []

    for skill in jd_skills:
        if skill in resume_text:
            matched.append(skill)
        else:
            missing.append(skill)

    return matched, missing


def calculate_ats_score(
    matched: list[str],
    missing: list[str]
) -> int:
    total = len(matched) + len(missing)
    if total == 0:
        return 0
    return round((len(matched) / total) * 100)


# =========================
# FEEDBACK
# =========================

def generate_strengths_and_improvements(
    matched: list[str],
    missing: list[str]
) -> tuple[list[str], list[str]]:

    strengths = []
    improvements = []

    if matched:
        strengths.append(
            "Your resume shows experience with " +
            ", ".join(matched[:5]) + "."
        )

    if missing:
        improvements.append(
            "Consider adding experience with " +
            ", ".join(missing[:5]) + " if applicable."
        )

    if not matched:
        improvements.append(
            "Your resume has limited skill overlap with the job description."
        )

    return strengths, improvements


# =========================
# MAIN PIPELINE
# =========================

def run_ats_keyword_match(
    resume_text: str,
    jd_text: str
) -> dict:

    resume_clean = preprocess_text(resume_text)
    jd_clean = preprocess_text(jd_text)

    jd_skills = extract_skills_from_text(jd_clean)

    matched, missing = match_skills(
        resume_clean,
        jd_skills
    )

    ats_score = calculate_ats_score(matched, missing)

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


# =========================
# FETCH HELPERS
# =========================

async def fetch_resume_and_jd(
    user_id: str,
    resume_id: str,
    job_description_id: str
):
    resume = await db.resumes.find_one({
        "_id": ObjectId(resume_id),
        "userId": ObjectId(user_id)
    })

    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume not found"
        )

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
