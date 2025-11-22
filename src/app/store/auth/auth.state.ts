export interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  user: {
    id: string;
    mobile: string;
  } | null;
}

export const initialAuthState: AuthState = {
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  user: null
};
