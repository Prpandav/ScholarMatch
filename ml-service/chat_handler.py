"""
chat_handler.py  —  ScholarMatch LLM Integration
--------------------------------------------------
Uses Google Gemini 1.5 Flash (free tier) to generate
grounded responses from RAG-retrieved scholarship context.
Falls back to a rule-based response if GOOGLE_API_KEY is not set.
"""

import os
from typing import Optional
from dotenv import load_dotenv
from rag_engine import retrieve_chunks

load_dotenv()  # Force load the .env file before checking the key

# ── Gemini setup ──────────────────────────────────────────────────────────────

_API_KEY   = os.getenv("GOOGLE_API_KEY", "")
_MOCK_MODE = not bool(_API_KEY)
_llm       = None

if not _MOCK_MODE:
    try:
        from google import genai
        from google.genai import types as genai_types
        _client = genai.Client(api_key=_API_KEY)
        print("✅ Gemini 1.5 Flash ready (LLM chat enabled)")
    except Exception as e:
        _MOCK_MODE = True
        print(f"⚠️  Gemini init failed: {e} — falling back to mock mode")
else:
    _client = None
    print("⚠️  GOOGLE_API_KEY not set — chat will run in MOCK mode")


# ── System prompt ─────────────────────────────────────────────────────────────

_SYSTEM = (
    "You are ScholarMatch AI — a friendly, expert scholarship counsellor for Indian students. "
    "Your job is to help students discover scholarships they qualify for and guide their applications.\n\n"
    "Rules:\n"
    "1. Base ALL answers on the SCHOLARSHIP CONTEXT provided. Do not invent details.\n"
    "2. If information is not in the context, say so honestly.\n"
    "3. Be warm, encouraging, and specific — mention actual amounts, deadlines, and criteria.\n"
    "4. Keep responses concise: 150-220 words maximum.\n"
    "5. If the student's profile is given, personalise your answer to their eligibility.\n"
    "6. You can respond in Hindi or Gujarati if the student writes in those languages.\n"
    "7. Always end with one clear, actionable next step for the student.\n"
)


# ── Main chat function ────────────────────────────────────────────────────────

def generate_chat_response(message: str, student_profile: Optional[dict] = None) -> dict:
    """
    Full RAG + LLM pipeline:
      1. Retrieve top-6 relevant scholarship chunks from ChromaDB
      2. Build structured prompt with context + profile
      3. Call Gemini -> return response

    Returns: { "response": str, "sources_used": int, "mode": str }
    """
    # Step 1 — Retrieve
    chunks = retrieve_chunks(message, k=6)
    context = (
        "\n".join([f"• {c}" for c in chunks])
        if chunks
        else "No specific scholarship context found."
    )

    # Step 2 — Profile string
    profile_str = ""
    if student_profile:
        g   = student_profile.get("gpa",    "—")
        inc = student_profile.get("income",  "—")
        gen = student_profile.get("gender",  "—")
        reg = student_profile.get("region",  "—")
        cat = student_profile.get("caste",   "—")
        inc_fmt = f"₹{inc:,}" if isinstance(inc, int) else str(inc)
        profile_str = (
            f"\nSTUDENT PROFILE:\n"
            f"  GPA: {g}/10 | Income: {inc_fmt} | Gender: {gen} "
            f"| Region: {reg} | Category: {cat}\n"
        )

    # Step 3 — Full prompt
    prompt = (
        f"{_SYSTEM}"
        f"\nSCHOLARSHIP CONTEXT (use only this):\n{context}"
        f"{profile_str}"
        f"\nSTUDENT QUESTION: {message}"
        f"\n\nYour response:"
    )

    # Step 4 — LLM or mock
    if _MOCK_MODE:
        return {
            "response":     _mock_response(message, chunks),
            "sources_used": len(chunks),
            "mode":         "mock",
        }

    try:
        from google import genai
        client = genai.Client(api_key=_API_KEY)
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=prompt,
        )
        return {
            "response":     response.text.strip(),
            "sources_used": len(chunks),
            "mode":         "gemini-2.0-flash",
        }
    except Exception as e:
        print(f"❌ Gemini API Error during chat: {e}")
        error_details = str(e)
        
        # Handle rate limits or region restrictions gracefully
        if "429" in error_details or "RESOURCE_EXHAUSTED" in error_details:
            return {
                "response": (
                    "⚠️ **AI quota exhausted or region-restricted.**\n\n"
                    + _mock_response(message, chunks)
                ),
                "sources_used": len(chunks),
                "mode": "fallback-mock",
            }
            
        return {
            "response": (
                f"⚠️ **AI Connection Error:**\n{error_details}\n\n"
                "Please double-check your API key in the `.env` file!"
            ),
            "sources_used": len(chunks),
            "mode": "error",
        }


# ── Mock fallback ─────────────────────────────────────────────────────────────

def _mock_response(message: str, chunks: list) -> str:
    """Simple fallback when Gemini API key is not set."""
    msg = message.lower()
    if chunks:
        preview = chunks[0][:250]
        return (
            f"Here's what I found in the scholarship database:\n\n{preview}...\n\n"
        )
    if any(w in msg for w in ["obc", "sc", "st", "caste"]):
        return (
            "For OBC/SC/ST students, key scholarships include:\n"
            "• Post-Matric Scholarship (SC/ST) — up to ₹45,000/yr\n"
            "• OBC Pre-Matric Scholarship — ₹28,000/yr\n"
            "• PM YASASVI (OBC/EBC) — ₹75,000/yr\n\n"
            "Submit your profile above for personalised AI matching! 🎓"
        )
    if any(w in msg for w in ["girl", "female", "women", "woman"]):
        return (
            "Top scholarships for female students:\n"
            "• Pragati Scholarship (AICTE) — ₹50,000/yr\n"
            "• Kotak Kanya Scholarship — ₹1,50,000/yr (GPA ≥ 8.5)\n"
            "• Vigyan Jyoti (Class 11 Science) — ₹40,000/yr\n\n"
            "Fill in your profile to see which ones you qualify for! 🎓"
        )
    return (
        "I can help you find the right scholarship! Try asking:\n"
        "• 'Best scholarship for rural OBC students?'\n"
        "• 'Which scholarship has the highest amount?'\n"
        "• 'Documents needed for NSP scholarship?'\n\n"
        "Or submit your profile above for a personalised AI match. 🎓"
    )
