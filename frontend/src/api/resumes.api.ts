import apiClient from "./axios";

/**
 * Resume object returned by backend
 * (keep minimal fields; UI can format)
 */
export interface Resume {
  id: string;
  resumeTitle: string;
  originalFileName: string;
  createdAt: string;
}


/**
 * Upload resume (already exists in your file)
 */
export async function uploadResume(file: File): Promise<void> {
  const formData = new FormData();
  formData.append("file", file);

  await apiClient.post("/resumes/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

/**
 * Fetch user's uploaded resumes
 */
export interface GetResumesResponse {
  resumes: Resume[];
}

export async function getResumes(): Promise<Resume[]> {
  const response = await apiClient.get<GetResumesResponse>("/resumes");
  return response.data.resumes;
}

