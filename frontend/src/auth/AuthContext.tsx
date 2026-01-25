import { createContext, useContext, useEffect, useState } from "react";
import type { AuthContextValue, AuthState, AuthUser } from "./auth.types";
import { AUTH_TOKEN_STORAGE_KEY } from "./auth.constants";

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isInitialized: false, // 👈 IMPORTANT
  });

  /**
   * 🔁 Restore auth state on app load
   */
  useEffect(() => {
    const storedToken = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);

    if (storedToken) {
      setAuthState({
        user: null, // user can be fetched later via /auth/me
        token: storedToken,
        isAuthenticated: true,
        isInitialized: true,
      });
    } else {
      setAuthState((prev) => ({
        ...prev,
        isInitialized: true,
      }));
    }
  }, []);

  /**
   * 🔐 Set auth after successful login
   */
  const setAuth = (user: AuthUser, token: string) => {
    localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);

    setAuthState({
      user,
      token,
      isAuthenticated: true,
      isInitialized: true,
    });
  };

  /**
   * 🚪 Logout user
   */
  const logout = () => {
    localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);

    setAuthState({
      user: null,
      token: null,
      isAuthenticated: false,
      isInitialized: true,
    });
  };

  /**
   * 🔑 Get current token (used by Axios if needed)
   */
  const getToken = () => {
    return authState.token;
  };

  const value: AuthContextValue = {
    ...authState,
    setAuth,
    logout,
    getToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
