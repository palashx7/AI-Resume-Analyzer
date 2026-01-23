import apiClient from "./axios";

/* =========================
   Types (mirror backend)
========================= */

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface MeResponse {
  id: string;
  name: string;
  email: string;
  role: string;
}

/* =========================
   API Functions
========================= */

export async function login(payload: LoginRequest): Promise<LoginResponse> {
  const response = await apiClient.post<LoginResponse>(
    "/auth/login",
    payload
  );
  return response.data;
}

export async function register(
  payload: RegisterRequest
): Promise<void> {
  await apiClient.post("/auth/register", payload);
}

export async function getMe(): Promise<MeResponse> {
  const response = await apiClient.get<MeResponse>("/auth/me");
  return response.data;
}
