export interface AuthUser {
  id: string;
  email: string;
  role: string;
  name?: string;
}


export interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
}

export interface AuthContextValue extends AuthState {
  setAuth: (user: AuthUser, token: string) => void;
  logout: () => void;
  getToken: () => string | null;
}
