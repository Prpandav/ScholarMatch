# 🎓 ScholarMatch

**An AI-powered scholarship discovery platform and automated counsellor for Indian students.**

ScholarMatch uses Machine Learning, RAG (Retrieval-Augmented Generation), and Explainable AI (XAI) to match students with the most relevant scholarships, verify their documents via OCR, and guide them through their application process via a conversational AI chatbot.

---

## ✨ Key Features

- **🎯 AI Scholarship Matching:** Recommends top scholarships based on a student's exact profile (GPA, Income, Region, Caste, Gender).
- **🤖 RAG-powered Chatbot:** A 24/7 AI counsellor powered by Google Gemini and ChromaDB that grounds its answers strictly in real scholarship data.
- **📄 OCR Document Verification:** Instantly extracts and verifies documents (Aadhaar, Income Certificates, Marksheets) using PyTesseract.
- **⚖️ Explainable AI (XAI):** Transparent recommendations with fairness notes, showing students exactly _why_ they matched.
- **🎛️ What-If Simulator:** Real-time sliders for GPA and Income to dynamically simulate how eligibility rankings change.
- **🛡️ Rate Limiting & Protection:** Built-in IP rate-limiting on both Node.js and Python microservices to prevent abuse.

---

## 🛠️ Tech Stack

### Frontend

- **Framework:** React.js (Vite)
- **Styling:** Tailwind CSS
- **Libraries:** Axios, React Markdown, i18next

### Backend (Node.js)

- **Framework:** Express.js
- **Database:** MongoDB & Mongoose
- **Middleware:** Express Rate Limit, CORS

### ML Microservice (Python)

- **Framework:** FastAPI, Uvicorn, SlowAPI
- **AI & RAG:** Google Gemini (2.0 Flash API), ChromaDB, SentenceTransformers (`all-MiniLM-L6-v2`)
- **Computer Vision:** PyTesseract (OCR), Pillow

---

## 📂 Project Architecture

```text
ScholarMatch/
├── frontend/          # React Vite app (UI, Chat Widget, Forms)
├── backend/           # Node.js Express server (MongoDB, Auth, Routing)
└── ml-service/        # Python FastAPI (Predictions, OCR, ChromaDB RAG, Gemini)
```

---

## 🚀 Installation & Setup

### Prerequisites

- Node.js (v18+)
- Python (v3.9+)
- MongoDB (Local or Atlas URI)
- _Optional: Tesseract OCR installed on your system for real document scanning._

### 1. Setup ML Microservice (Python)

Navigate to the ML service directory and install dependencies:

```bash
cd ml-service
python -m venv venv

# Activate virtual environment
# On Windows: venv\Scripts\activate
# On Mac/Linux: source venv/bin/activate

pip install -r requirements.txt
```

Create a `.env` file inside `ml-service/`:

```env
PORT=8000
GOOGLE_API_KEY="your_google_gemini_api_key_here"
```

Start the FastAPI server:

```bash
python main.py
# Server runs on http://localhost:8000
```

### 2. Setup Node.js Backend

Open a new terminal and navigate to the backend directory:

```bash
cd backend
npm install
```

Create a `.env` file inside `backend/`:

```env
PORT=5000
MONGO_URI="mongodb://localhost:27017/scholarmatch"
ML_SERVICE_URL="http://localhost:8000"
```

Start the Node.js server:

```bash
npm run dev
# Server runs on http://localhost:5000
```

### 3. Setup Frontend

Open a third terminal and navigate to the frontend directory:

```bash
cd frontend
npm install
npm run dev
# App runs on http://localhost:5173
```
