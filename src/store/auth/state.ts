export interface UserData {
  id?: string;
  email?: string;
  displayName?: string;
  label?: string;
  roles: { [role: string]: boolean };
}

export interface User extends UserData {
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
