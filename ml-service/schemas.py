"""
schemas.py  —  ScholarMatch ML Service
Updated with rich response fields: eligibility explanation, deadline,
documents required, fairness info, and OCR verification schemas.
"""

from pydantic import BaseModel, Field
from typing import List, Optional


# ── Request ─────────────────────────────────────────────────────────────────

class StudentProfile(BaseModel):
    name:   str   = Field(..., example="Riya Sharma")
    gpa:    float = Field(..., ge=0.0, le=10.0, example=8.5)
    income: int   = Field(..., ge=0, example=250000)
    gender: str   = Field(..., example="Female")
    region: str   = Field(..., example="Rural")
    caste:  str   = Field(..., example="OBC")


# ── Scholarship response ─────────────────────────────────────────────────────

class Scholarship(BaseModel):
    id:                  str         = Field(..., example="SCH001")
    name:                str         = Field(..., example="National Merit Scholarship")
    provider:            str         = Field(..., example="Ministry of Education")
    category:            str         = Field(..., example="Merit-based")
    amount:              int         = Field(..., example=72000)
    match_score:         float       = Field(..., ge=0.0, le=1.0, example=0.95)
    deadline:            str         = Field(..., example="2025-03-31")
    days_left:           int         = Field(..., example=36)
    apply_url:           str         = Field(..., example="https://scholarships.gov.in")
    documents_required:  List[str]   = Field(..., example=["Marksheet", "Income Certificate"])
    eligibility_criteria:List[str]   = Field(..., example=["GPA ≥ 8.0", "Income < ₹6L"])
    explanation:         List[str]   = Field(..., example=["✓ Your GPA 8.5 meets minimum 8.0"])


class PredictionResponse(BaseModel):
    student_name:   str            = Field(..., example="Riya Sharma")
    total_matches:  int            = Field(..., example=3)
    fairness_note:  str            = Field(..., example="Recommendations are gender-neutral and income-weighted.")
    scholarships:   List[Scholarship]


# ── OCR / Document verification ──────────────────────────────────────────────

class OCRResponse(BaseModel):
    verified:       bool   = Field(..., example=True)
    document_type:  str    = Field(..., example="Income Certificate")
    confidence:     float  = Field(..., ge=0.0, le=1.0, example=0.91)
    extracted_text: str    = Field(..., example="Annual Income: ₹2,40,000")
    message:        str    = Field(..., example="Document successfully verified.")


# ── Chat / RAG ────────────────────────────────────────────────────────────────

class StudentProfileOpt(BaseModel):
    """Optional student profile attached to a chat message for personalisation."""
    gpa:    Optional[float] = None
    income: Optional[int]   = None
    gender: Optional[str]   = None
    region: Optional[str]   = None
    caste:  Optional[str]   = None


class ChatRequest(BaseModel):
    message:         str                      = Field(..., example="Which scholarship is best for a rural OBC girl?")
    student_profile: Optional[StudentProfileOpt] = None


class ChatResponse(BaseModel):
    response:     str  = Field(..., example="Based on your profile, the Pragati Scholarship fits best...")
    sources_used: int  = Field(..., example=5)
    mode:         str  = Field(..., example="gemini-1.5-flash")
