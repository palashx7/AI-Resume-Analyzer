import type { AuthContextValue, AuthState, AuthUser } from "./auth.types";
import { AUTH_TOKEN_STORAGE_KEY } from "./auth.constants";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
  });

  useEffect(() => {
  const storedToken = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);

  if (storedToken) {
    setAuthState({
      user: null,          // user will be fetched later
      token: storedToken,
      isAuthenticated: true,
    });
  }
}, []);


  const setAuth = (user: AuthUser, token: string) => {
  // Persist token for refresh survival
  localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);

  setAuthState({
    user,
    token,
    isAuthenticated: true,
  });
};


  const logout = () => {
  // Clear persisted token
  localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);

  // Reset in-memory auth state
  setAuthState({
    user: null,
    token: null,
    isAuthenticated: false,
  });
};
 

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
