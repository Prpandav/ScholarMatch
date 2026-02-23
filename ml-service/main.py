"""
main.py
-------
FastAPI application entry point for the ScholarMatch ML Microservice.

Endpoints
---------
GET  /          → Health check
POST /predict   → Accepts StudentProfile JSON, returns top 3 scholarships
"""

import os
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from schemas import StudentProfile, PredictionResponse
from model import predict_scholarships

# ---------------------------------------------------------------------------
# Load environment variables from .env
# ---------------------------------------------------------------------------
load_dotenv()
PORT = int(os.getenv("PORT", 8000))

# ---------------------------------------------------------------------------
# FastAPI application setup
# ---------------------------------------------------------------------------
app = FastAPI(
    title="ScholarMatch ML Service",
    description=(
        "A FastAPI microservice that accepts a student profile and returns "
        "the top 3 matched scholarships using ML-based ranking."
    ),
    version="1.0.0",
    docs_url="/docs",      # Swagger UI
    redoc_url="/redoc",    # ReDoc UI
)

# ---------------------------------------------------------------------------
# CORS Middleware
# Allow the Node.js Express backend (typically on port 5000) to call this
# service.  In production, replace "*" with your actual backend origin.
# ---------------------------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],          # e.g. ["http://localhost:5000"] in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------

@app.get("/", tags=["Health"])
def health_check():
    """
    Simple liveness probe.
    The Node backend can ping this before sending prediction requests.
    """
    return {"status": "healthy", "service": "ScholarMatch ML Service", "version": "1.0.0"}


@app.post(
    "/predict",
    response_model=PredictionResponse,
    tags=["Prediction"],
    summary="Predict top 3 matching scholarships for a student",
)
def predict(profile: StudentProfile):
    """
    **Accepts** a student profile JSON payload and **returns** the top 3
    scholarship matches ranked by a machine-learning score.

    ### Request Body
    | Field    | Type  | Description                        |
    |----------|-------|------------------------------------|
    | name     | str   | Student's full name                |
    | gpa      | float | GPA on a 10-point scale (0–10)     |
    | income   | int   | Annual family income in INR        |
    | gender   | str   | Male / Female / Other              |
    | region   | str   | Urban / Rural / Semi-Urban         |
    | caste    | str   | General / OBC / SC / ST            |

    ### Response
    Returns a JSON object with `student_name`, `total_matches`, and
    a `scholarships` array of 3 items, each with `id`, `name`, `provider`,
    `amount`, and `match_score`.
    """
    try:
        results = predict_scholarships(profile)
    except Exception as e:
        # Surface any unexpected model errors as a clean HTTP 500
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

    return PredictionResponse(
        student_name=profile.name,
        total_matches=len(results),
        scholarships=results,
    )


# ---------------------------------------------------------------------------
# Dev runner  (python main.py)
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=PORT, reload=True)
