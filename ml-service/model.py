"""
model.py  —  ScholarMatch ML Prediction Engine
------------------------------------------------
Rich dummy scholarship database (25 entries) with full metadata.
The _heuristic_score() function simulates Decision Tree + Cosine Similarity.
FUTURE: Replace with trained sklearn pipeline; keep function signature.
"""

from datetime import date
from typing import List
from schemas import StudentProfile, Scholarship

# ── Helpers ──────────────────────────────────────────────────────────────────

def _days_left(deadline_str: str) -> int:
    try:
        d = date.fromisoformat(deadline_str)
        delta = (d - date.today()).days
        return max(delta, 0)
    except Exception:
        return 90


# ── Scholarship Database (25 entries) ────────────────────────────────────────

RAW_SCHOLARSHIPS = [
    {
        "id": "SCH001",
        "name": "National Merit Scholarship",
        "provider": "Ministry of Education, India",
        "category": "Merit-based",
        "amount": 72000,
        "base_score": 0.93,
        "deadline": "2026-08-31",
        "apply_url": "https://scholarships.gov.in",
        "documents_required": ["Class 10/12 Marksheet", "Income Certificate", "Aadhaar Card", "Bank Passbook"],
        "eligibility_criteria": ["GPA ≥ 8.0", "Annual family income ≤ ₹6,00,000", "Enrolled in recognised institution"],
        "gpa_min": 8.0, "income_max": 600000, "gender_pref": None, "region_pref": None, "caste_pref": None,
    },
    {
        "id": "SCH002",
        "name": "Pragati Scholarship for Girls",
        "provider": "AICTE – Ministry of Education",
        "category": "Women Empowerment",
        "amount": 50000,
        "base_score": 0.88,
        "deadline": "2026-05-15",
        "apply_url": "https://www.aicte-india.org/bureaus/pgrants",
        "documents_required": ["Marksheet", "Income Certificate", "Aadhaar Card", "Admission Letter"],
        "eligibility_criteria": ["Female students only", "GPA ≥ 6.0", "Income ≤ ₹8,00,000", "Technical/Professional course"],
        "gpa_min": 6.0, "income_max": 800000, "gender_pref": "Female", "region_pref": None, "caste_pref": None,
    },
    {
        "id": "SCH003",
        "name": "Post-Matric Scholarship (SC/ST)",
        "provider": "Ministry of Social Justice & Empowerment",
        "category": "Category-specific",
        "amount": 45000,
        "base_score": 0.85,
        "deadline": "2026-03-08",
        "apply_url": "https://scholarships.gov.in/fresh/newstdRegfrmInstruction",
        "documents_required": ["Caste Certificate", "Income Certificate", "Marksheet", "Aadhaar", "Bank Passbook"],
        "eligibility_criteria": ["SC/ST category", "Pursuing post-matric course", "Income ≤ ₹2,50,000"],
        "gpa_min": 0.0, "income_max": 250000, "gender_pref": None, "region_pref": None, "caste_pref": ["SC", "ST"],
    },
    {
        "id": "SCH004",
        "name": "Central Sector Scheme for College Students",
        "provider": "Department of Higher Education",
        "category": "Merit-cum-Need",
        "amount": 36000,
        "base_score": 0.80,
        "deadline": "2026-07-31",
        "apply_url": "https://scholarships.gov.in",
        "documents_required": ["Class 12 Marksheet (top 20%)", "Income Certificate", "Aadhaar", "College ID"],
        "eligibility_criteria": ["Top 20% in Class 12 Board", "GPA ≥ 7.0", "Income ≤ ₹4,50,000", "First-year college student"],
        "gpa_min": 7.0, "income_max": 450000, "gender_pref": None, "region_pref": None, "caste_pref": None,
    },
    {
        "id": "SCH005",
        "name": "INSPIRE Scholarship",
        "provider": "DST – Dept. of Science & Technology",
        "category": "Merit-based (Science)",
        "amount": 80000,
        "base_score": 0.91,
        "deadline": "2026-09-15",
        "apply_url": "http://www.online-inspire.gov.in",
        "documents_required": ["Class 12 Marksheet", "Aadhaar", "College Admission Proof", "Bank Passbook"],
        "eligibility_criteria": ["GPA ≥ 9.0", "Natural/Basic Science course", "Top 1% of Board Exam"],
        "gpa_min": 9.0, "income_max": 9999999, "gender_pref": None, "region_pref": None, "caste_pref": None,
    },
    {
        "id": "SCH006",
        "name": "OBC Pre-Matric Scholarship",
        "provider": "Ministry of Social Justice & Empowerment",
        "category": "Category-specific",
        "amount": 28000,
        "base_score": 0.83,
        "deadline": "2026-03-05",
        "apply_url": "https://scholarships.gov.in",
        "documents_required": ["OBC Non-Creamy Layer Certificate", "Income Certificate", "School ID", "Aadhaar"],
        "eligibility_criteria": ["OBC Non-Creamy Layer", "Income ≤ ₹1,00,000", "Class 1–10 student"],
        "gpa_min": 0.0, "income_max": 100000, "gender_pref": None, "region_pref": None, "caste_pref": ["OBC"],
    },
    {
        "id": "SCH007",
        "name": "Begum Hazrat Mahal National Scholarship",
        "provider": "Maulana Azad Education Foundation",
        "category": "Minority + Women",
        "amount": 12000,
        "base_score": 0.78,
        "deadline": "2026-10-31",
        "apply_url": "https://maef.nic.in",
        "documents_required": ["Minority Community Certificate", "Income Certificate", "Marksheet", "Aadhaar"],
        "eligibility_criteria": ["Female minority students (Muslim/Christian/Sikh/Buddhist/Parsi/Jain)", "Class 9–12", "GPA ≥ 5.0", "Income ≤ ₹2,00,000"],
        "gpa_min": 5.0, "income_max": 200000, "gender_pref": "Female", "region_pref": None, "caste_pref": None,
    },
    {
        "id": "SCH008",
        "name": "Swami Vivekananda Merit-cum-Means Scholarship",
        "provider": "West Bengal Government",
        "category": "Merit-cum-Need",
        "amount": 60000,
        "base_score": 0.82,
        "deadline": "2026-06-15",
        "apply_url": "https://svmcm.wbhed.gov.in",
        "documents_required": ["Class 12 Marksheet", "Income Certificate", "Domicile Certificate", "Aadhaar"],
        "eligibility_criteria": ["GPA ≥ 7.5", "Income ≤ ₹2,50,000", "West Bengal domicile"],
        "gpa_min": 7.5, "income_max": 250000, "gender_pref": None, "region_pref": None, "caste_pref": None,
    },
    {
        "id": "SCH009",
        "name": "Vidyasaarathi Scholarship",
        "provider": "NSDL & Corporate Partners",
        "category": "CSR – Need-based",
        "amount": 40000,
        "base_score": 0.79,
        "deadline": "2026-06-30",
        "apply_url": "https://www.vidyasaarathi.co.in",
        "documents_required": ["Income Certificate", "Marksheet", "Aadhaar", "Bank Passbook"],
        "eligibility_criteria": ["GPA ≥ 6.0", "Income ≤ ₹3,00,000", "Diploma/Degree course"],
        "gpa_min": 6.0, "income_max": 300000, "gender_pref": None, "region_pref": None, "caste_pref": None,
    },
    {
        "id": "SCH010",
        "name": "Tata Capital Pankh Scholarship",
        "provider": "Tata Capital Limited (CSR)",
        "category": "CSR – Merit-cum-Need",
        "amount": 50000,
        "base_score": 0.86,
        "deadline": "2026-04-01",
        "apply_url": "https://www.tatacapital.com/pankh",
        "documents_required": ["Marksheet", "Income Certificate", "Aadhaar", "Fee Structure"],
        "eligibility_criteria": ["GPA ≥ 6.0", "Income ≤ ₹3,00,000", "Class 11–12 or UG programme"],
        "gpa_min": 6.0, "income_max": 300000, "gender_pref": None, "region_pref": None, "caste_pref": None,
    },
    {
        "id": "SCH011",
        "name": "Rural Talent Search Scholarship",
        "provider": "Ministry of Panchayati Raj",
        "category": "Rural Empowerment",
        "amount": 30000,
        "base_score": 0.77,
        "deadline": "2026-07-20",
        "apply_url": "https://scholarships.gov.in",
        "documents_required": ["Rural Domicile Certificate", "Income Certificate", "Marksheet", "Aadhaar"],
        "eligibility_criteria": ["Rural region mandatory", "GPA ≥ 6.5", "Income ≤ ₹2,00,000"],
        "gpa_min": 6.5, "income_max": 200000, "gender_pref": None, "region_pref": "Rural", "caste_pref": None,
    },
    {
        "id": "SCH012",
        "name": "Reliance Foundation Undergraduate Scholarship",
        "provider": "Reliance Foundation (CSR)",
        "category": "CSR – Merit-based",
        "amount": 200000,
        "base_score": 0.90,
        "deadline": "2026-03-15",
        "apply_url": "https://reliancefoundation.org/scholarships",
        "documents_required": ["Class 12 Marksheet", "JEE/CUET Score", "Income Certificate", "Aadhaar"],
        "eligibility_criteria": ["GPA ≥ 8.5", "Income ≤ ₹15,00,000", "Top engineering/medical/commerce college"],
        "gpa_min": 8.5, "income_max": 1500000, "gender_pref": None, "region_pref": None, "caste_pref": None,
    },
    {
        "id": "SCH013",
        "name": "HDFC Bank Parivartan ECSS Scholarship",
        "provider": "HDFC Bank (CSR)",
        "category": "CSR – Need-based",
        "amount": 75000,
        "base_score": 0.84,
        "deadline": "2026-05-31",
        "apply_url": "https://www.hdfcbank.com/parivartan",
        "documents_required": ["Income Certificate", "Marksheet", "Aadhaar", "Bank Passbook", "Fee Receipt"],
        "eligibility_criteria": ["GPA ≥ 5.5", "Income ≤ ₹2,50,000", "Class 11 to PG level"],
        "gpa_min": 5.5, "income_max": 250000, "gender_pref": None, "region_pref": None, "caste_pref": None,
    },
    {
        "id": "SCH014",
        "name": "Sitaram Jindal Foundation Scholarship",
        "provider": "Sitaram Jindal Foundation",
        "category": "CSR – Merit-cum-Need",
        "amount": 40000,
        "base_score": 0.81,
        "deadline": "2026-09-30",
        "apply_url": "https://sjfoundation.org",
        "documents_required": ["Marksheet", "Income Certificate", "Aadhaar", "Community Certificate"],
        "eligibility_criteria": ["GPA ≥ 6.0", "Income ≤ ₹2,50,000", "PUC/Diploma/UG/PG enrolled"],
        "gpa_min": 6.0, "income_max": 250000, "gender_pref": None, "region_pref": None, "caste_pref": None,
    },
    {
        "id": "SCH015",
        "name": "EWS Scholarship – Central Government",
        "provider": "Ministry of Education (EWS Quota)",
        "category": "EWS – Need-based",
        "amount": 25000,
        "base_score": 0.80,
        "deadline": "2026-10-15",
        "apply_url": "https://scholarships.gov.in",
        "documents_required": ["EWS Certificate", "Income Certificate", "Aadhaar", "Marksheet"],
        "eligibility_criteria": ["General category EWS", "Income ≤ ₹8,00,000", "GPA ≥ 6.0"],
        "gpa_min": 6.0, "income_max": 800000, "gender_pref": None, "region_pref": None, "caste_pref": ["General"],
    },
    {
        "id": "SCH016",
        "name": "Kotak Kanya Scholarship",
        "provider": "Kotak Education Foundation (CSR)",
        "category": "Women + Merit",
        "amount": 150000,
        "base_score": 0.89,
        "deadline": "2026-03-10",
        "apply_url": "https://kotakeducation.org",
        "documents_required": ["Marksheet (≥85%)", "Income Certificate", "Aadhaar", "Admission Letter"],
        "eligibility_criteria": ["Female students only", "GPA ≥ 8.5", "Income ≤ ₹3,00,000", "First-year professional degree"],
        "gpa_min": 8.5, "income_max": 300000, "gender_pref": "Female", "region_pref": None, "caste_pref": None,
    },
    {
        "id": "SCH017",
        "name": "Aditya Birla Capital Scholarship",
        "provider": "Aditya Birla Group (CSR)",
        "category": "CSR – Merit-cum-Need",
        "amount": 60000,
        "base_score": 0.83,
        "deadline": "2026-05-15",
        "apply_url": "https://adityabirlascholars.net",
        "documents_required": ["Marksheet", "Income Certificate", "Bank Passbook", "Aadhaar"],
        "eligibility_criteria": ["GPA ≥ 7.5", "Income ≤ ₹6,00,000", "UG/PG programme"],
        "gpa_min": 7.5, "income_max": 600000, "gender_pref": None, "region_pref": None, "caste_pref": None,
    },
    {
        "id": "SCH018",
        "name": "ONGC Scholarship",
        "provider": "ONGC Foundation (PSU CSR)",
        "category": "SC/ST/OBC – Merit",
        "amount": 48000,
        "base_score": 0.82,
        "deadline": "2026-06-30",
        "apply_url": "https://ongcindia.com/scholarship",
        "documents_required": ["Category Certificate", "Marksheet", "Income Certificate", "Aadhaar"],
        "eligibility_criteria": ["SC/ST or OBC category", "GPA ≥ 7.0", "Engineering/Medicine/MBA course"],
        "gpa_min": 7.0, "income_max": 999999, "gender_pref": None, "region_pref": None, "caste_pref": ["SC", "ST", "OBC"],
    },
    {
        "id": "SCH019",
        "name": "PM YASASVI Scholarship",
        "provider": "Ministry of Social Justice (OBC/EBC/DNT)",
        "category": "OBC/EBC/DNT",
        "amount": 75000,
        "base_score": 0.87,
        "deadline": "2026-08-31",
        "apply_url": "https://yet.nta.ac.in",
        "documents_required": ["OBC/EBC Certificate", "Aadhaar", "Class 8/10 Marksheet", "Income Certificate"],
        "eligibility_criteria": ["OBC/EBC/DNT category", "Income ≤ ₹2,50,000", "Class 9 or 11 student"],
        "gpa_min": 0.0, "income_max": 250000, "gender_pref": None, "region_pref": None, "caste_pref": ["OBC"],
    },
    {
        "id": "SCH020",
        "name": "NTPC National Scholarship (Tribal)",
        "provider": "NTPC Foundation (PSU CSR)",
        "category": "ST – Need-based",
        "amount": 36000,
        "base_score": 0.79,
        "deadline": "2026-08-15",
        "apply_url": "https://ntpclimited.com/ntpcscholarship",
        "documents_required": ["Tribal/ST Certificate", "Aadhaar", "Income Certificate", "Marksheet"],
        "eligibility_criteria": ["ST (Scheduled Tribe) category", "Income ≤ ₹1,50,000", "Class 9 to Degree level"],
        "gpa_min": 0.0, "income_max": 150000, "gender_pref": None, "region_pref": None, "caste_pref": ["ST"],
    },
    {
        "id": "SCH021",
        "name": "Ishan Uday Scholarship (NE India)",
        "provider": "UGC – University Grants Commission",
        "category": "Regional – NE States",
        "amount": 54000,
        "base_score": 0.76,
        "deadline": "2026-09-20",
        "apply_url": "https://ishan.buddy4study.com",
        "documents_required": ["NE State Domicile Certificate", "Marksheet", "Aadhaar", "Income Certificate"],
        "eligibility_criteria": ["Domicile of NE India", "GPA ≥ 6.5", "Income ≤ ₹4,50,000", "UG/PG enrolment"],
        "gpa_min": 6.5, "income_max": 450000, "gender_pref": None, "region_pref": "Rural", "caste_pref": None,
    },
    {
        "id": "SCH022",
        "name": "Vigyan Jyoti Scholarship",
        "provider": "DST – Dept. of Science & Technology",
        "category": "Women in STEM",
        "amount": 40000,
        "base_score": 0.85,
        "deadline": "2026-03-20",
        "apply_url": "https://vigyanindia.in",
        "documents_required": ["Class 10 Marksheet", "Aadhaar", "School Certificate"],
        "eligibility_criteria": ["Female students in Class 11 Science", "GPA ≥ 7.0", "STEM stream mandatory"],
        "gpa_min": 7.0, "income_max": 9999999, "gender_pref": "Female", "region_pref": None, "caste_pref": None,
    },
    {
        "id": "SCH023",
        "name": "Fair & Lovely (STEM Star) Scholarship",
        "provider": "HUL Foundation (CSR)",
        "category": "Women in STEM – Need-based",
        "amount": 30000,
        "base_score": 0.80,
        "deadline": "2026-04-20",
        "apply_url": "https://stemstar.in",
        "documents_required": ["Marksheet", "Income Certificate", "Aadhaar", "Essay"],
        "eligibility_criteria": ["Female students", "GPA ≥ 6.0", "Income ≤ ₹4,00,000", "Science stream"],
        "gpa_min": 6.0, "income_max": 400000, "gender_pref": "Female", "region_pref": None, "caste_pref": None,
    },
    {
        "id": "SCH024",
        "name": "Ambedkar Foundation National Fellowship",
        "provider": "Dr. Ambedkar Foundation",
        "category": "SC – Research/PG",
        "amount": 120000,
        "base_score": 0.84,
        "deadline": "2026-11-30",
        "apply_url": "https://ambedkarfoundation.nic.in",
        "documents_required": ["SC Certificate", "PG Marksheet", "Aadhaar", "Research Proposal (if applicable)"],
        "eligibility_criteria": ["Scheduled Caste category", "PG / Doctoral level", "GPA ≥ 7.0"],
        "gpa_min": 7.0, "income_max": 9999999, "gender_pref": None, "region_pref": None, "caste_pref": ["SC"],
    },
    {
        "id": "SCH025",
        "name": "Mahadbt Rural Girls Scholarship",
        "provider": "Maharashtra Government",
        "category": "Rural + Women",
        "amount": 35000,
        "base_score": 0.81,
        "deadline": "2026-04-05",
        "apply_url": "https://mahadbt.maharashtra.gov.in",
        "documents_required": ["Domicile Certificate (MH)", "Rural Certificate", "Gender ID", "Marksheet", "Income Certificate"],
        "eligibility_criteria": ["Female students", "Rural Maharashtra domicile", "GPA ≥ 5.0", "Income ≤ ₹2,50,000"],
        "gpa_min": 5.0, "income_max": 250000, "gender_pref": "Female", "region_pref": "Rural", "caste_pref": None,
    },
]


# ── Heuristic scorer & explainer ─────────────────────────────────────────────

def _score_and_explain(raw: dict, profile: StudentProfile):
    score = raw["base_score"]
    explain = []

    # GPA check
    if profile.gpa >= raw["gpa_min"]:
        score += 0.02
        explain.append(f"✓ Your GPA {profile.gpa} meets the minimum {raw['gpa_min']}")
    else:
        score -= 0.15
        explain.append(f"⚠ Your GPA {profile.gpa} is below the minimum {raw['gpa_min']}")

    # Income check
    if profile.income <= raw["income_max"]:
        score += 0.02
        explain.append(f"✓ Your income ₹{profile.income:,} is within the ₹{raw['income_max']:,} limit")
    else:
        score -= 0.20
        explain.append(f"✗ Income ₹{profile.income:,} exceeds limit ₹{raw['income_max']:,}")

    # Gender preference
    if raw["gender_pref"]:
        if profile.gender == raw["gender_pref"]:
            score += 0.05
            explain.append(f"✓ {raw['gender_pref']}-specific scholarship — you qualify")
        else:
            score -= 0.40
            explain.append(f"✗ This scholarship is for {raw['gender_pref']} students only")

    # Region preference
    if raw["region_pref"]:
        if profile.region == raw["region_pref"]:
            score += 0.03
            explain.append(f"✓ {raw['region_pref']} region bonus applied")
        else:
            score -= 0.10
            explain.append(f"⚠ Preference given to {raw['region_pref']} students")

    # Caste preference
    if raw["caste_pref"]:
        if profile.caste in raw["caste_pref"]:
            score += 0.05
            explain.append(f"✓ Your category ({profile.caste}) is eligible")
        else:
            score -= 0.35
            explain.append(f"✗ This scholarship is for {'/'.join(raw['caste_pref'])} categories only")

    return round(min(max(score, 0.0), 1.0), 4), explain


# ── Public prediction interface ───────────────────────────────────────────────

def predict_scholarships(profile: StudentProfile) -> List[Scholarship]:
    """
    Returns top 3 Scholarship objects ranked by match_score descending.
    Drop-in ready: replace this body with trained sklearn pipeline later.
    """
    scored = []
    for raw in RAW_SCHOLARSHIPS:
        score, explain = _score_and_explain(raw, profile)
        dl = raw["deadline"]
        scored.append(Scholarship(
            id=raw["id"],
            name=raw["name"],
            provider=raw["provider"],
            category=raw["category"],
            amount=raw["amount"],
            match_score=score,
            deadline=dl,
            days_left=_days_left(dl),
            apply_url=raw["apply_url"],
            documents_required=raw["documents_required"],
            eligibility_criteria=raw["eligibility_criteria"],
            explanation=explain,
        ))

    return sorted(scored, key=lambda s: s.match_score, reverse=True)[:3]
