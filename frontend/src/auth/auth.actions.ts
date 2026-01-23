import { AUTH_TOKEN_STORAGE_KEY } from "./auth.constants";

/**
 * Global logout handler (non-React).
 * Used by Axios interceptors.
 */
export function forceLogout() {
  localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);

  // Hard redirect to login
  window.location.href = "/login";
}
