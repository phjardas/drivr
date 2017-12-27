export interface User {
  id?: string;
  email?: string;
  displayName?: string;
  label?: string;
  authenticated: boolean;
  anonymous: boolean;
}

export interface SignIn {
  providerId?: string;
  pending: boolean;
  error: any;
}

export interface AuthState {
  signin?: SignIn;
  user?: User;
}

export const state: AuthState = { signin: undefined, user: undefined };
