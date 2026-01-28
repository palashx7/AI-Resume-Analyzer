import apiClient from "./axios";

/**
 * Payload for creating a Job Description
 * Matches backend schema exactly
 */
export interface CreateJobDescriptionPayload {
  jdTitle: string;
  companyName: string;
  jdText: string;
}

/**
 * Minimal Job Description response
 * (backend may return more fields; we keep it lean)
 */
export interface JobDescription {
  id: string;
  jdTitle: string;
  companyName: string;
  jdText: string;
  createdAt: string;
}

/**
 * Create a new Job Description
 */
export async function createJobDescription(
  payload: CreateJobDescriptionPayload
): Promise<JobDescription> {
  const response = await apiClient.post<JobDescription>(
    "/job-descriptions",
    payload
  );

  return response.data;
}
