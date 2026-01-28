import apiClient from "./axios";

/**
 * ---------- Types ----------
 */

export type FitLabel = "High Fit" | "Medium Fit" | "Low Fit";

/**
 * This interface EXACTLY matches how analysis data
 * is returned from the backend and stored in MongoDB.
 */
export interface AnalysisResult {
  atsScore: number;
  similarityScore: number;
  finalScore: number;
  fitLabel: FitLabel;

  matchedSkills: string[];
  missingSkills: string[];
  strengths: string[];
  improvements: string[];

  createdAt: string; // ISO UTC timestamp
}

/**
 * Lighter payload used for analysis history list
 */
export interface AnalysisHistoryItem {
  id: string;
  finalScore: number;
  fitLabel: FitLabel;
  createdAt: string;
}

/**
 * ---------- API Calls ----------
 */

/**
 * Run AI analysis between a resume and a job description
 */
export interface AnalysisRunResponse {
  message: string;
  analysis: {
    scores: {
      atsScore: number;
      similarityScore: number;
      finalScore: number;
    };
    fitLabel: FitLabel;
    matchedSkills: string[];
    missingSkills: string[];
    strengths: string[];
    improvements: string[];
    createdAt: string;
  };
}

export async function runAnalysis(params: {
  resumeId: string;
  jobDescriptionId: string;
}): Promise<AnalysisRunResponse> {
  const response = await apiClient.post<AnalysisRunResponse>(
    "/analysis/run",
    params
  );

  return response.data;
}


/**
 * Fetch analysis history for the logged-in user
 */
export async function getAnalysisHistory(): Promise<AnalysisHistoryItem[]> {
  const response = await apiClient.get<AnalysisHistoryItem[]>(
    "/analysis/history"
  );

  return response.data;
}

/**
 * Fetch full analysis detail by analysis ID
 */
export async function getAnalysisById(
  analysisId: string
): Promise<AnalysisResult> {
  const response = await apiClient.get<AnalysisResult>(
    `/analysis/${analysisId}`
  );

  return response.data;
}
