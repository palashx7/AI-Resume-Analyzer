import axios from "axios";
import { getStoredAuthToken } from "../auth/auth.utils";
import { forceLogout } from "../auth/auth.actions";

const apiClient = axios.create({
   baseURL: "http://127.0.0.1:8000",
  timeout: 10000,
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
    if (error.response?.status === 401) {
      forceLogout();
    }

    return Promise.reject(error);
  }
);

export default apiClient;
