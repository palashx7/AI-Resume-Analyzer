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

SKILL_ALIASES = {
    "ci": "ci/cd",
    "cd": "ci/cd",
    "ci-cd": "ci/cd",

    "postgres": "postgresql",
    "psql": "postgresql",

    "rabbit": "rabbitmq",

    "mongo": "mongodb",

    "js": "javascript",
}

SKILL_DISPLAY_NAMES = {
    "ci/cd": "CI/CD",
    "postgresql": "PostgreSQL",
    "rabbitmq": "RabbitMQ",
    "mongodb": "MongoDB",
    "fastapi": "FastAPI",
    "aws": "AWS",
    "jwt": "JWT",
    "nosql": "NoSQL",
    "sql": "SQL",
    "javascript": "JavaScript",
}


# =========================
# SKILL WEIGHTS (ATS IMPORTANCE)
# =========================

SKILL_WEIGHTS = {
    # ---- Core backend ----
    "python": 3,
    "fastapi": 3,
    "django": 3,
    "flask": 3,

    # ---- Databases ----
    "mongodb": 2,
    "postgresql": 2,
    "mysql": 2,
    "sql": 2,
    "nosql": 2,

    # ---- Infra / DevOps ----
    "docker": 2,
    "kubernetes": 2,
    "aws": 2,
    "azure": 2,
    "gcp": 2,

    # ---- APIs & Auth ----
    "rest": 1,
    "graphql": 1,
    "jwt": 1,
    "oauth": 1,

    # ---- Messaging / Extras ----
    "kafka": 1,
    "rabbitmq": 1,
    "microservices": 1,
    "ci/cd": 1,
}


SKILL_PRIORITY = {
    "python": "core",
    "fastapi": "core",
    "docker": "important",
    "mongodb": "important",
    "postgresql": "important",
    "aws": "core",
    "kafka": "niceToHave",
    "rabbitmq": "niceToHave",
    "ci/cd": "important",
    "jwt": "important",
    "microservices": "core",
}


def categorize_skills(skills: list[str]) -> dict:
    categories = {
        "core": [],
        "important": [],
        "niceToHave": []
    }

    for skill in skills:
        weight = SKILL_WEIGHTS.get(skill.lower(), 1)

        if weight >= 3:
            categories["core"].append(skill)
        elif weight == 2:
            categories["important"].append(skill)
        else:
            categories["niceToHave"].append(skill)

    return categories




# =========================
# TEXT PREPROCESSING
# =========================

def preprocess_text(text: str) -> str:
    text = text.lower()
    text = re.sub(r"[^a-z0-9\s]", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text


def format_skill(skill: str) -> str:
    return SKILL_DISPLAY_NAMES.get(skill, skill.upper())


def count_skill_occurrences(text: str, skill: str) -> int:
    """
    Counts how many times a skill appears in the text.
    Uses word-boundary matching to avoid partial matches.
    """
    pattern = rf"\b{re.escape(skill)}\b"
    return len(re.findall(pattern, text))



# =========================
# SKILL EXTRACTION
# =========================

def normalize_skill(word: str) -> str:
    """
    Normalize skill aliases to canonical form.
    """
    return SKILL_ALIASES.get(word, word)


def extract_skills_from_text(text: str) -> set[str]:
    words = text.split()

    skills = set()

    for word in words:
        if word in STOPWORDS:
            continue

        normalized = normalize_skill(word)

        if normalized in CANONICAL_SKILLS:
            skills.add(normalized)

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
    """
    Calculates weighted ATS score.
    Core skills contribute more than nice-to-have skills.
    """

    total_weight = 0
    matched_weight = 0

    for skill in matched:
        weight = SKILL_WEIGHTS.get(skill.lower(), 1)
        matched_weight += weight
        total_weight += weight

    for skill in missing:
        weight = SKILL_WEIGHTS.get(skill.lower(), 1)
        total_weight += weight

    if total_weight == 0:
        return 0

    return round((matched_weight / total_weight) * 100)



# =========================
# FEEDBACK
# =========================

def generate_strengths_and_improvements(
    strong: list[str],
    partial: list[str],
    missing: list[str]
) -> tuple[list[str], list[str]]:

    strengths = []
    improvements = []

    if strong:
        strengths.append(
            "Strong experience with " +
            ", ".join(strong[:3]) + "."
        )

    if partial:
        strengths.append(
            "Familiarity with " +
            ", ".join(partial[:3]) + "."
        )

    if missing:
        improvements.append(
            "Consider adding experience with " +
            ", ".join(missing[:3]) + " if relevant."
        )

    if not strong and not partial:
        improvements.append(
            "Your resume shows limited direct skill alignment with the job description."
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

    strong_skills = []
    partial_skills = []
    missing_skills = []

    for skill in jd_skills:
        count = count_skill_occurrences(resume_clean, skill)

        if count >= 2:
            strong_skills.append(skill)
        elif count == 1:
            partial_skills.append(skill)
        else:
            missing_skills.append(skill)

    # ---------- ATS INPUT ----------
    matched = strong_skills + partial_skills
    missing = missing_skills

    # ---------- ATS SCORE ----------
    ats_score = calculate_ats_score(matched, missing)

    # ---------- FEEDBACK ----------
    strengths, improvements = generate_strengths_and_improvements(
    strong_skills,
    partial_skills,
    missing_skills
)


    # ---------- CLEANUP ----------
    matched = sorted(set(matched))
    missing = sorted(set(missing))


    categorized_matched = categorize_skills(matched)
    categorized_missing = categorize_skills(missing)

    categorized_skills = {
    "matched": categorize_skills(matched),
    "missing": categorize_skills(missing)
}

    # ---------- UI FORMATTING ----------
    matched = [format_skill(skill) for skill in matched]
    missing = [format_skill(skill) for skill in missing]

    return {
    "atsScore": ats_score,
    "matchedSkills": matched,
    "missingSkills": missing,
    "categorizedSkills": categorized_skills,
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
