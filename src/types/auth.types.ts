// Tipos de autenticación
export interface User {
  id: string;
  username: string;
  email: string;
  telefono?: string;
  roles: string[];
  activo: boolean;
  fechaCreacion: string;
  ultimoAcceso?: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  telefono?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  tokenType: 'Bearer';
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

export interface UserSession {
  user: User;
  tokens: AuthTokens;
  preferences: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark';
  language: 'es' | 'en';
  sidebarCollapsed: boolean;
}

export interface ResetPasswordData {
  email: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}