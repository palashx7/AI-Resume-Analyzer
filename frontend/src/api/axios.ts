import axios from "axios";
import { getStoredAuthToken } from "../auth/auth.utils";
import { forceLogout } from "../auth/auth.actions";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
  },
});


// Request interceptor (already present)
apiClient.interceptors.request.use(
  (config) => {
    const token = getStoredAuthToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// 🔁 Response interceptor — handle 401 globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url || "";

    // 🚫 Do NOT auto-logout on auth endpoints
    const isAuthEndpoint =
      url.includes("/auth/login") || url.includes("/auth/register");

    if (status === 401 && !isAuthEndpoint) {
      forceLogout();
    }

    return Promise.reject(error);
  }
);

export default apiClient;
