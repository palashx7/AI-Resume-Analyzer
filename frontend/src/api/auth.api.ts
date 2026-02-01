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


export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  message: string;
}

export async function register(
  payload: RegisterRequest
): Promise<RegisterResponse> {
  const response = await apiClient.post<RegisterResponse>(
    "/auth/register",
    payload
  );

  return response.data;
}
