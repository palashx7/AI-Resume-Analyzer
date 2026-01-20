from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

# Load model ONCE (singleton-style)
_model = SentenceTransformer("all-MiniLM-L6-v2")


def compute_similarity_score(
    resume_text: str,
    jd_text: str
) -> int:
    """
    Computes semantic similarity score (0–100)
    between resume text and job description text.
    """

    if not resume_text or not jd_text:
        return 0

    # Generate embeddings
    embeddings = _model.encode(
        [resume_text, jd_text],
        convert_to_numpy=True,
        normalize_embeddings=True
    )

    resume_embedding = embeddings[0].reshape(1, -1)
    jd_embedding = embeddings[1].reshape(1, -1)

    # Cosine similarity
    similarity = cosine_similarity(
        resume_embedding,
        jd_embedding
    )[0][0]

    # Convert to percentage
    similarity_score = round(float(similarity) * 100)

    return similarity_score
