// Represents the authenticated user returned by backend
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

// Represents the authentication state of the app
export interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
}

// Public interface exposed by Auth context/store
export interface AuthContextValue extends AuthState {
  setAuth: (user: AuthUser, token: string) => void;
  logout: () => void;
  getToken: () => string | null;
}
 