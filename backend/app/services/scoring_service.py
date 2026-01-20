def compute_final_score(
    ats_score: int,
    similarity_score: int,
    ats_weight: float = 0.4,
    ai_weight: float = 0.6
) -> int:
    """
    Computes weighted final fit score (0–100)
    using ATS score and AI similarity score.
    """

    # ---------- Safety checks ----------
    ats_score = max(0, min(ats_score, 100))
    similarity_score = max(0, min(similarity_score, 100))

    # ---------- Weighted average ----------
    final_score = (ats_weight * ats_score) + (ai_weight * similarity_score)

    # ---------- Clamp & round ----------
    final_score = round(max(0, min(final_score, 100)))

    return final_score


def get_fit_label(final_score: int) -> str:
    """
    Returns fit label based on final score.
    """

    if final_score >= 75:
        return "High Fit"
    elif final_score >= 50:
        return "Medium Fit"
    else:
        return "Low Fit"
