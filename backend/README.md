# 🧠 AI Resume Analyzer & Job Match Platform (Backend)

A production-ready backend system that analyzes resumes against job descriptions using **ATS-style keyword matching**, secure authentication, and persistent analysis history.

---

## 🚀 Features

### 🔐 Authentication & Security
- JWT-based authentication
- Strict ownership checks (no cross-user data access)
- Secure MongoDB queries scoped by user

### 📄 Resume Management
- PDF resume upload
- Text extraction using **PyMuPDF**
- Resume persistence in MongoDB

### 📝 Job Description Management
- Structured job description input
- Validation for meaningful content
- MongoDB persistence

### 🧠 ATS Analysis Engine
- Deterministic ATS keyword matching
- Matched vs missing skills
- ATS score calculation (0–100)
- Human-readable strengths & improvement suggestions

### 📊 Analysis History
- Persisted analysis results
- Paginated analysis history
- Fetch individual analysis by ID

---

## 🏗️ Architecture Overview

### Folder Structure

```text
backend/
 ├── app/
 │   ├── core/        # Auth, JWT, config
 │   ├── db/          # MongoDB connection
 │   ├── models/      # MongoDB document builders
 │   ├── schemas/     # Request/response schemas
 │   ├── services/    # Business logic
 │   └── routes/      # API endpoints
 ├── requirements.txt
 └── main.py

```

### Design Principles
- Thin routes, fat services
- Clear separation of concerns
- Deterministic, testable logic
- Production-style error handling


## 🧠 ATS Analysis Logic (How It Works)

1. Resume text and job description text are preprocessed
- Lowercasing
- Whitespace normalization
- Noise removal
2. Keywords are extracted from the Job Description
3. Keywords are matched against resume text
4. ATS score is calculated using:
```bash
ATS Score = (matched keywords / total keywords) × 100
```
5. Rule-based feedback is generated:
- Strengths → matched skills
- Improvements → missing skills
This mirrors how real Applicant Tracking Systems work at a baseline level.

🔌 API Overview
🔐 Auth
POST /auth/register
POST /auth/login

📄 Resumes
POST /resumes/upload

📝 Job Descriptions
POST /job-descriptions

🧠 Analysis
POST /analysis/run
GET  /analysis/history?page=1&limit=10
GET  /analysis/{analysisId}

🔑 Authorization Header
Authorization: Bearer <JWT_TOKEN>

🧪 Tech Stack

FastAPI

MongoDB Atlas

JWT Authentication

PyMuPDF (PDF text extraction)

Pydantic (schemas & validation)

🛠️ Local Development Setup
1️⃣ Create virtual environment
python -m venv venv

2️⃣ Activate environment
# Windows
venv\Scripts\activate

# macOS / Linux
source venv/bin/activate

3️⃣ Install dependencies
pip install -r requirements.txt

4️⃣ Run server
uvicorn app.main:app --reload

5️⃣ Open Swagger UI
http://localhost:8000/docs

🔮 Future Enhancements

Semantic similarity using sentence-transformers

Hybrid ATS + AI scoring

Resume improvement suggestions

Frontend dashboard integration

👨‍💻 Author

Palash Bhivgade
Final-year Electronics & Telecommunication Engineering student
Focused on backend engineering, system design, and applied AI

🏁 Why This Project Matters

This project demonstrates:

Real-world backend architecture

Secure multi-user data handling

Deterministic analysis logic

Clean API design

Production-grade MongoDB usage