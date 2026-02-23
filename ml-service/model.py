"""
model.py
--------
Mock ML prediction function.

CURRENT STATE : Returns 3 hardcoded scholarships with a lightweight
                heuristic score derived from the student profile fields.

FUTURE STATE  : Replace the body of predict_scholarships() with a real
                Scikit-Learn Decision Tree + Cosine Similarity pipeline.
                The function signature MUST remain the same so main.py
                never needs to change.
"""

from typing import List
from schemas import StudentProfile, Scholarship

# ---------------------------------------------------------------------------
# Mock Scholarship Database
# (In production this will be fetched from MongoDB via the Node backend
#  or loaded from a curated CSV / vector store.)
# ---------------------------------------------------------------------------

MOCK_SCHOLARSHIPS = [
    {
        "id": "SCH001",
        "name": "National Merit Scholarship",
        "provider": "Ministry of Education, India",
        "amount": 72000,
        "base_score": 0.95,
    },
    {
        "id": "SCH002",
        "name": "Pragati Scholarship for Girls",
        "provider": "AICTE",
        "amount": 50000,
        "base_score": 0.88,
    },
    {
        "id": "SCH003",
        "name": "Post-Matric SC/ST Scholarship",
        "provider": "Ministry of Social Justice",
        "amount": 45000,
        "base_score": 0.82,
    },
    {
        "id": "SCH004",
        "name": "Central Sector Scheme for College Students",
        "provider": "Department of Higher Education",
        "amount": 36000,
        "base_score": 0.78,
    },
    {
        "id": "SCH005",
        "name": "Inspire Scholarship",
        "provider": "DST – Department of Science & Technology",
        "amount": 80000,
        "base_score": 0.91,
    },
]


# ---------------------------------------------------------------------------
# Heuristic scorer  (placeholder for the real ML model)
# ---------------------------------------------------------------------------

def _heuristic_score(scholarship: dict, profile: StudentProfile) -> float:
    """
    Applies simple rule-based boosts on top of the scholarship's base score
    to simulate what the Decision Tree + Cosine Similarity pipeline will do.

    Rules (all additive, capped at 1.0):
    - GPA >= 8.0          → +0.03
    - Income <= 300,000   → +0.02
    - Region == "Rural"   → +0.01
    """
    score = scholarship["base_score"]

    if profile.gpa >= 8.0:
        score += 0.03
    if profile.income <= 300_000:
        score += 0.02
    if profile.region.lower() == "rural":
        score += 0.01

    # Clamp to valid range [0.0, 1.0]
    return round(min(score, 1.0), 4)


# ---------------------------------------------------------------------------
# Public prediction interface
# ---------------------------------------------------------------------------

def predict_scholarships(profile: StudentProfile) -> List[Scholarship]:
    """
    Accepts a StudentProfile and returns the top 3 matched Scholarship objects,
    sorted by descending match_score.

    Parameters
    ----------
    profile : StudentProfile
        Validated request payload from the /predict endpoint.

    Returns
    -------
    List[Scholarship]
        Top 3 scholarships ranked by match score.
    """
    scored = []

    for raw in MOCK_SCHOLARSHIPS:
        score = _heuristic_score(raw, profile)
        scored.append(
            Scholarship(
                id=raw["id"],
                name=raw["name"],
                provider=raw["provider"],
                amount=raw["amount"],
                match_score=score,
            )
        )

    # Sort by match_score descending and return the top 3
    top3 = sorted(scored, key=lambda s: s.match_score, reverse=True)[:3]
    return top3
