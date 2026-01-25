import apiClient from "./axios";
import type { AuthUser } from "../auth/auth.types";

export interface LoginResponse {
  token: string;        // 👈 backend returns `token`
  user: AuthUser;
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  const response = await apiClient.post<LoginResponse>("/auth/login", {
    email,
    password,
  });

  return response.data;
}
