# 🧠 AI Resume Analyzer & Job Match Platform

A **full-stack, production-ready AI application** that analyzes resumes against job descriptions using **ATS-style matching**, secure authentication, persistent analysis history, and a modern frontend dashboard.

This project simulates how real-world Applicant Tracking Systems (ATS) evaluate resumes and provides actionable insights to candidates.

---

## 🚀 Key Features

### 🔐 Authentication & Security
- JWT-based authentication
- Protected routes (frontend + backend)
- Strict user-level data isolation
- Secure MongoDB queries scoped by user

### 📄 Resume Management
- PDF resume upload
- Server-side text extraction using **PyMuPDF**
- Resume metadata & ownership persisted in MongoDB
- Resume selection via frontend dropdown (no manual IDs)

### 📝 Job Description Management
- Structured job description creation
- Title, company, and JD text validation
- User-owned job description storage
- Dropdown-based selection in frontend

### 🧠 ATS Analysis Engine
- Deterministic ATS-style keyword matching
- Matched vs missing skills detection
- ATS score calculation (0–100)
- Fit classification: **High / Medium / Low**
- Actionable strengths & improvement suggestions

### 📊 Analysis History
- Deterministic ATS-style keyword matching
- Matched vs missing skills detection
- ATS score calculation (0–100)
- Fit classification: High / Medium / Low
- Actionable strengths & improvement suggestions


### 🖥️ Frontend Dashboard
- Built with React + TypeScript
- Auth-protected dashboard layout
- Resume & JD dropdown selection
- Analysis result visualization
- Analysis history navigation
- Fully deployed frontend (production build)

---

## 🏗️ Architecture Overview

### High-Level Architecture

```mermaid
flowchart TD
    FE[Frontend<br/>(React + TypeScript)]
    API[REST API<br/>(FastAPI)]
    DB[(MongoDB Atlas<br/>Cloud Database)]
    ATS[ATS Analysis Engine<br/>(Keyword Matching)]

    FE --> API
    API --> DB
    API --> ATS
    ATS --> API
```



### Folder Structure

```text
Directory structure:
└── palashx7-ai-resume-analyzer/
    ├── README.md
    ├── backend/
    │   ├── README.md
    │   ├── docker-compose.yml
    │   ├── Dockerfile
    │   ├── requirements.txt
    │   └── app/
    │       ├── main.py
    │       ├── core/
    │       │   ├── auth_dependency.py
    │       │   ├── config.py
    │       │   ├── jwt.py
    │       │   └── security.py
    │       ├── db/
    │       │   └── mongodb.py
    │       ├── models/
    │       │   ├── analysis_model.py
    │       │   ├── jd_model.py
    │       │   └── resume_model.py
    │       ├── routes/
    │       │   ├── analysis.py
    │       │   ├── auth.py
    │       │   ├── jd.py
    │       │   └── resume.py
    │       ├── schemas/
    │       │   ├── analysis.py
    │       │   ├── analysis_history.py
    │       │   ├── jd.py
    │       │   ├── resume.py
    │       │   └── user.py
    │       └── services/
    │           ├── analysis_history_service.py
    │           ├── analysis_persistence_service.py
    │           ├── analysis_service.py
    │           ├── jd_service.py
    │           ├── nlp_service.py
    │           ├── pdf_service.py
    │           ├── resume_service.py
    │           ├── scoring_service.py
    │           └── similarity_service.py
    ├── docs/
    │   ├── API Contract (Backend routes).txt
    │   ├── architecture.md
    │   ├── BACKEND_CONTEXT.md
    │   ├── Database Schema draft.txt
    │   ├── PRD (Product Requirements Doc).txt
    │   ├── Tasks + Timeline (Kanban).txt
    │   └── Tech Stack and Architecture.txt
    └── frontend/
        ├── README.md
        ├── eslint.config.js
        ├── index.html
        ├── package.json
        ├── tsconfig.app.json
        ├── tsconfig.json
        ├── tsconfig.node.json
        ├── vite.config.ts
        └── src/
            ├── App.css
            ├── App.tsx
            ├── index.css
            ├── main.tsx
            ├── api/
            │   ├── analysis.api.ts
            │   ├── analysis.types.ts
            │   ├── auth.api.ts
            │   ├── axios.ts
            │   ├── jobDescription.api.ts
            │   └── resumes.api.ts
            ├── auth/
            │   ├── auth.actions.ts
            │   ├── auth.constants.ts
            │   ├── auth.types.ts
            │   ├── auth.utils.ts
            │   └── AuthContext.tsx
            ├── layouts/
            │   ├── AppLayout.tsx
            │   ├── AuthLayout.tsx
            │   └── DashboardLayout.tsx
            ├── pages/
            │   ├── LandingPage.tsx
            │   ├── analysis/
            │   │   ├── AnalysisHistoryPage.tsx
            │   │   └── AnalysisPage.tsx
            │   ├── auth/
            │   │   ├── LoginPage.tsx
            │   │   └── RegisterPage.tsx
            │   ├── dashboard/
            │   │   ├── DashboardOverview.tsx
            │   │   └── DashboardPage.tsx
            │   ├── jobDescriptions/
            │   │   └── JobDescriptionsPage.tsx
            │   └── resumes/
            │       └── ResumesPage.tsx
            └── routes/
                ├── AppRoutes.tsx
                └── AuthGuard.tsx


```

### Design Principles
- Thin routes, fat services
- Clear separation of concerns
- Deterministic, testable logic
- Production-style error handling


## 🧠 ATS Analysis Logic (How It Works)

1. **Preprocessing**
- Lowercasing
- Whitespace normalization
- Noise removal
2. Keywords are extracted from the Job Description
3. Keywords are matched against resume text
4. ATS score is calculated using:
```bash
ATS Score = (matched keywords / total keywords) × 100
```
5. **Insights Generation**
- Strengths → matched skills
- Improvements → missing skills
- Fit label assigned based on score
This mirrors how **real ATS systems operate at a baseline level**, before semantic ranking.

## 🔌 API Overview
### 🔐 Auth
- POST /auth/register
- POST /auth/login

### 📄 Resumes
- POST /resumes/upload
- GET /resumes

### 📝 Job Descriptions
- POST /job-descriptions
- GET /job-descriptions

### 🧠 Analysis
- POST /analysis/run
- GET  /analysis/history?page=1&limit=10
- GET  /analysis/{analysisId}

### 🔑 Authorization Header
```bash
Authorization: Bearer <JWT_TOKEN>
```

## 🧪 Tech Stack

### Backend
- FastAPI
- MongoDB Atlas
- JWT Authentication
- PyMuPDF (PDF parsing)
- Pydantic
- Docker & Docker Compose   

### Frontend
- React
- TypeScript
- Vite
- Axios
- Context API
- Modern component-driven UI

## 🛠️ Local Development Setup

### Backend

```bash
cd backend
docker compose up --build
```

OR

1️⃣ Create virtual environment
```bash
python -m venv venv
```
2️⃣ Activate environment
```bash
# Windows
venv\Scripts\activate

# macOS / Linux
source venv/bin/activate
```
3️⃣ Install dependencies
```bash
pip install -r requirements.txt
```
4️⃣ Run server
```bash
uvicorn app.main:app --reload
```

5️⃣ Open Swagger UI
```bash
http://localhost:8000/docs
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## 🚀 Deployment
- Backend: Dockerized & deployed (Railway / similar)
- Frontend: Production build deployed (Vercel)
- Database: MongoDB Atlas (cloud)
- Environment-based configuration used for secure deployment.

## 🔮 Future Enhancements
- Load ML models once at startup (latency optimization)
- Semantic similarity using sentence-transformers
- Hybrid ATS + AI scoring
- Resume improvement recommendations
- Role-based analytics dashboard

## 👨‍💻 Author

**Palash Bhivgade**
Final-year Electronics & Telecommunication Engineering student
Focused on Backend Engineering, System Design, and Applied AI

## 🏁 Why This Project Matters

This project demonstrates:
- End-to-end full-stack ownership
- Secure, multi-user backend architecture
- Real ATS-style evaluation logic
- Clean API & frontend integration
- Production deployment with Docker
- Practical AI applied to a real problem