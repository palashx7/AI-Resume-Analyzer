import apiClient from "./axios";

/**
 * Resume object returned by backend
 * (keep minimal fields; UI can format)
 */
export interface Resume {
  id: string;
  filename: string;
  createdAt: string; // ISO UTC string
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
export async function getResumes(): Promise<Resume[]> {
  const response = await apiClient.get<Resume[]>("/resumes");
  return response.data;
}
