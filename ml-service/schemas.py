"""
schemas.py
----------
Pydantic models that define the data contracts for the /predict endpoint.
- StudentProfile : the incoming request body
- Scholarship    : a single scholarship result item
- PredictionResponse : the full response wrapper
"""

from pydantic import BaseModel, Field
from typing import List


# ---------------------------------------------------------------------------
# Request Schema
# ---------------------------------------------------------------------------

class StudentProfile(BaseModel):
    """
    Represents the student profile sent by the Node.js backend.
    All fields map directly to the features used by the ML model.
    """
    name: str = Field(..., example="Riya Sharma")
    gpa: float = Field(..., ge=0.0, le=10.0, example=8.5,
                       description="GPA on a 10-point scale")
    income: int = Field(..., ge=0, example=250000,
                        description="Annual family income in INR")
    gender: str = Field(..., example="Female",
                        description="Gender of the student")
    region: str = Field(..., example="Rural",
                        description="Urban / Rural / Semi-Urban")
    caste: str = Field(..., example="OBC",
                       description="General / OBC / SC / ST")


# ---------------------------------------------------------------------------
# Response Schemas
# ---------------------------------------------------------------------------

class Scholarship(BaseModel):
    """
    Represents a single matched scholarship returned by the ML model.
    """
    id: str = Field(..., example="SCH001")
    name: str = Field(..., example="National Merit Scholarship")
    provider: str = Field(..., example="Ministry of Education, India")
    amount: int = Field(..., example=50000,
                        description="Annual scholarship amount in INR")
    match_score: float = Field(..., ge=0.0, le=1.0, example=0.95,
                               description="Cosine similarity score (0–1)")


class PredictionResponse(BaseModel):
    """
    The full response envelope returned by POST /predict.
    Contains the student name for confirmation + top matched scholarships.
    """
    student_name: str = Field(..., example="Riya Sharma")
    total_matches: int = Field(..., example=3)
    scholarships: List[Scholarship]
