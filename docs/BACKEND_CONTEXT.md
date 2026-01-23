AI Resume Analyzer & Job Match Platform
Backend Context & Architecture Guide
1. Project Overview

This backend powers an AI-driven Resume Analyzer & Job Match Platform.

The system allows users to:

Register and authenticate securely

Upload resumes (PDF)

Create job descriptions

Run AI-powered analysis to evaluate resume–job fit

View historical analysis results

The backend is feature-complete, modular, and designed using production-grade patterns.

2. Tech Stack
Core Technologies

FastAPI – API framework

MongoDB Atlas – Primary database

JWT Authentication – Secure stateless auth

PyMuPDF – PDF text extraction

sentence-transformers – Semantic similarity (AI)

scikit-learn – Cosine similarity

Design Philosophy

API-first

Strict schema validation

Clear separation of concerns

No business logic inside routes

Services are pure and testable

3. High-Level Architecture

The backend follows a layered architecture:

Routes (FastAPI)
   ↓
Services (Business & AI logic)
   ↓
Models (MongoDB document creation)
   ↓
Database (MongoDB)

Responsibilities
Layer	Responsibility
Routes	Request validation & orchestration
Services	Core logic (AI, scoring, validation)
Models	Construct MongoDB documents
Schemas	Request/response contracts
Core	Auth, JWT, config, security
4. Authentication & Authorization
Authentication Mechanism

JWT-based stateless authentication

Tokens issued at login

Tokens sent via Authorization: Bearer <token>

Key Details

JWT payload contains:

sub → userId

role

exp

Auth dependency:

Validates token

Extracts userId

Injects user context into routes

Auth Endpoints
POST /auth/register
POST /auth/login


All protected routes require a valid JWT.

5. User Ownership & Security Model

Every resource is user-owned:

Resumes

Job Descriptions

Analyses

Ownership rules:

Users can only access their own data

Ownership is enforced at the service layer

Unauthorized access returns 403/404

6. Resume Module
Purpose

Handles resume upload and processing.

Features

Accepts PDF resumes only

Maximum file size: 2 MB

Extracts text using PyMuPDF

Stores extracted text for later AI analysis

Key Validations

File existence

MIME type = application/pdf

Size limit enforced

Ownership enforced

Stored Resume Fields
{
  "_id": ObjectId,
  "userId": ObjectId,
  "originalFileName": string,
  "extractedText": string,
  "createdAt": datetime (UTC)
}

7. Job Description (JD) Module
Purpose

Stores job descriptions against which resumes are analyzed.

Features

Supports long, multi-line text

No length restriction (within MongoDB limits)

Ownership enforced

Stored JD Fields
{
  "_id": ObjectId,
  "userId": ObjectId,
  "jdTitle": string,
  "companyName": string,
  "jdText": string,
  "createdAt": datetime (UTC)
}

8. Analysis Engine (Core Intelligence)

The analysis engine is the heart of the platform.

Each analysis combines deterministic scoring and AI semantic understanding.

8.1 ATS Keyword Matching
Purpose

Simulates traditional Applicant Tracking System behavior.

How It Works

Extracts keywords from resume and JD

Computes overlap

Determines missing skills

Outputs

atsScore (0–100)

matchedSkills

missingSkills

strengths

improvements

This component is rule-based and explainable.

8.2 AI Semantic Similarity
Purpose

Understand meaning, not just keywords.

Implementation

Model: all-MiniLM-L6-v2

Sentence embeddings for resume & JD

Cosine similarity

Normalized embeddings

Output

similarityScore (0–100)

This allows:

Paraphrase matching

Semantic relevance detection

Better real-world matching

8.3 Weighted Final Score
Purpose

Produce a single actionable score.

Formula
finalScore = (0.4 × atsScore) + (0.6 × similarityScore)


Rationale:

ATS ensures requirements coverage

AI similarity captures contextual relevance

AI weighted higher to reflect modern hiring

8.4 Fit Label
Purpose

Human-readable decision layer.

Final Score	Fit Label
≥ 75	High Fit
50–74	Medium Fit
< 50	Low Fit

Used directly by frontend for:

Badges

Colors

User interpretation

9. Analysis APIs
POST /analysis/run

Runs a complete analysis.

Input
{
  "resumeId": "...",
  "jobDescriptionId": "..."
}

Output
{
  "scores": {
    "atsScore": number,
    "similarityScore": number,
    "finalScore": number
  },
  "fitLabel": "High Fit | Medium Fit | Low Fit",
  "matchedSkills": [],
  "missingSkills": [],
  "strengths": [],
  "improvements": [],
  "createdAt": "ISO-UTC"
}

GET /analysis/history

Paginated list of analyses

Lightweight response

Used for dashboards

GET /analysis/{analysisId}

Full analysis detail

Used for deep inspection

10. Time Handling

All timestamps stored in UTC

ISO 8601 format

Backend does NOT convert timezones

Frontend is responsible for local conversion

This avoids:

Timezone bugs

DST issues

Server-region inconsistencies

11. Database Design Notes

MongoDB ObjectIds used everywhere

References stored as ObjectId (not embedded)

Designed for scalability

Backward-compatible schema evolution

12. Error Handling Philosophy

Validation errors → 400

Unauthorized → 401

Forbidden / Ownership → 403

Not found → 404

Internal bugs → 500 (with logs)

FastAPI schemas act as response filters to prevent accidental leaks.

13. Backend Status

✔ All core features implemented
✔ AI pipeline stable
✔ Schema contracts finalized
✔ Ready for frontend integration
✔ Suitable for demos & interviews

14. What This Backend Is NOT Responsible For

UI rendering

Timezone conversion

Presentation logic

Payments / billing

Admin moderation

These belong to frontend or future services.

15. Summary

This backend represents a complete AI-powered resume analysis system with:

Secure auth

Document processing

AI-driven matching

Explainable scoring

Clean architecture

It is designed to be extended, not rewritten.