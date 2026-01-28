// src/api/analysis.types.ts

/**
 * Request payload for running resume vs JD analysis
 * POST /analysis/run
 */
export interface RunAnalysisRequest {
  resumeId: string;
  jobDescriptionId: string;
}

/**
 * Analysis scores returned by backend
 * (Backend currently exposes atsScore at top-level)
 */
export interface AnalysisScores {
  atsScore: number;
}

/**
 * Core analysis result structure
 * Used for:
 * - Run analysis response
 * - Analysis detail page
 */
export interface AnalysisResult {
  analysisId?: string; // present in run-analysis response
  resumeId: string;
  jobDescriptionId: string;

  atsScore: number;

  matchedSkills: string[];
  missingSkills: string[];

  strengths: string[];
  improvements: string[];

  createdAt: string;
}

/**
 * Response from POST /analysis/run
 */
export interface RunAnalysisResponse {
  analysisId: string;

  atsScore: number;

  matchedSkills: string[];
  missingSkills: string[];

  strengths: string[];
  improvements: string[];

  createdAt: string;
}

/**
 * Single item in analysis history list
 * GET /analysis/history
 */
export interface AnalysisHistoryItem {
  analysisId: string;

  resumeTitle: string;
  jdTitle: string;

  atsScore: number;

  createdAt: string;
}

/**
 * Response from GET /analysis/history
 */
export interface AnalysisHistoryResponse {
  history: AnalysisHistoryItem[];
}

/**
 * Response from GET /analysis/{analysisId}
 */
export interface AnalysisDetailResponse {
  analysis: AnalysisResult;
}
