import { AUTH_TOKEN_STORAGE_KEY } from "./auth.constants";

/**
 * Read the auth token.
 * Prefer memory (AuthContext) later; fallback to localStorage for bootstrapping.
 */
export function getStoredAuthToken(): string | null {
  return localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
}
