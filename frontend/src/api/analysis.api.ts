import apiClient from "./axios";

/**
 * ---------- Types ----------
 */

export type FitLabel = "High Fit" | "Medium Fit" | "Low Fit";

/**
 * Skill categorization structure
 */
export interface CategorizedSkillGroup {
  core: string[];
  important: string[];
  niceToHave: string[];
}

export interface CategorizedSkills {
  matched: CategorizedSkillGroup;
  missing: CategorizedSkillGroup;
}

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

  categorizedSkills?: CategorizedSkills; // ✅ ADDED

  strengths: string[];
  improvements: string[];

  createdAt: string; // ISO UTC timestamp
}

/**
 * Lighter payload used for analysis history list
 */
export interface AnalysisHistoryItem {
  analysisId: string;
  atsScore: number;
  similarityScore: number;
  finalScore: number;
  fitLabel: FitLabel;
  createdAt: string;
}

export interface AnalysisHistoryResponse {
  page: number;
  limit: number;
  total: number;
  analyses: AnalysisHistoryItem[];
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

    categorizedSkills?: CategorizedSkills; // ✅ ADDED

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
    params,
  );

  return response.data;
}

/**
 * Fetch analysis history for the logged-in user
 */
export async function getAnalysisHistory(
  page = 1,
  limit = 10,
): Promise<AnalysisHistoryResponse> {
  const response = await apiClient.get<AnalysisHistoryResponse>(
    `/analysis/history?page=${page}&limit=${limit}`,
  );

  return response.data;
}

/**
 * Fetch full analysis detail by analysis ID
 */
export async function getAnalysisById(
  analysisId: string,
): Promise<AnalysisByIdResponse> {
  const response = await apiClient.get<AnalysisByIdResponse>(
    `/analysis/${analysisId}`,
  );

  return response.data;
}

export interface AnalysisByIdResponse {
  analysis: AnalysisResult;
}
