import { authApiClient, apiClient, clearSession, updateTokensInStorage } from './api';
import { 
  AuthResponse, 
  LoginCredentials, 
  RegisterData, 
  User, 
  AuthTokens,
  ResetPasswordData,
  ChangePasswordData,
  UserSession,
  UserPreferences,
  ApiResponse 
} from '@/types';

// Servicios de autenticación
export const authService = {
  // Login del usuario
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const response = await authApiClient.post('/usuarios/authenticate/', credentials);
      
      // Estructura de respuesta de tu backend
      const { user, access_token, refresh_token } = response.data.data;
      
      // Adaptar a nuestro formato esperado
      const authData: AuthResponse = {
        user: user,
        tokens: {
          accessToken: access_token,
          refreshToken: refresh_token,
          tokenType: 'Bearer',
          expiresAt: Date.now() + (24 * 60 * 60 * 1000), // 24 horas por defecto
        }
      };
      
      // Guardar la sesión completa en localStorage
      const userSession: UserSession = {
        user: authData.user,
        tokens: authData.tokens,
        preferences: {
          theme: 'light',
          language: 'es',
          sidebarCollapsed: false,
        },
      };
      
      localStorage.setItem('userSession', JSON.stringify(userSession));
      
      return authData;
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  },

  // Registro de nuevo usuario
  register: async (userData: RegisterData): Promise<AuthResponse> => {
    try {
      const response = await authApiClient.post<ApiResponse<AuthResponse>>('/auth/register', userData);
      
      const authData = response.data.data;
      
      // Guardar la sesión después del registro
      const userSession: UserSession = {
        user: authData.user,
        tokens: authData.tokens,
        preferences: {
          theme: 'light',
          language: 'es',
          sidebarCollapsed: false,
        },
      };
      
      localStorage.setItem('userSession', JSON.stringify(userSession));
      
      return authData;
    } catch (error) {
      console.error('Error en registro:', error);
      throw error;
    }
  },

  // Logout del usuario
  logout: async (): Promise<void> => {
    try {
      // Intentar hacer logout en el servidor
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.error('Error en logout del servidor:', error);
      // Continuar con el logout local aunque falle el servidor
    } finally {
      // Limpiar sesión local siempre
      clearSession();
    }
  },

  // Renovar token de acceso
  refreshToken: async (refreshToken: string): Promise<AuthTokens> => {
    try {
      const response = await authApiClient.post<ApiResponse<{ tokens: AuthTokens }>>('/auth/refresh', {
        refreshToken,
      });
      
      const tokens = response.data.data.tokens;
      updateTokensInStorage(tokens);
      
      return tokens;
    } catch (error) {
      console.error('Error renovando token:', error);
      clearSession();
      throw error;
    }
  },

  // Verificar si el usuario está autenticado
  isAuthenticated: (): boolean => {
    if (typeof window === 'undefined') return false;
    
    try {
      const session = localStorage.getItem('userSession');
      if (!session) return false;
      
      const userSession: UserSession = JSON.parse(session);
      
      // Verificar si el token ha expirado
      return Date.now() < userSession.tokens.expiresAt;
    } catch (error) {
      console.error('Error verificando autenticación:', error);
      return false;
    }
  },

  // Obtener usuario actual
  getCurrentUser: (): User | null => {
    if (typeof window === 'undefined') return null;
    
    try {
      const session = localStorage.getItem('userSession');
      if (!session) return null;
      
      const userSession: UserSession = JSON.parse(session);
      return userSession.user;
    } catch (error) {
      console.error('Error obteniendo usuario actual:', error);
      return null;
    }
  },

  // Obtener perfil del usuario desde el servidor
  getProfile: async (): Promise<User> => {
    try {
      const response = await apiClient.get<ApiResponse<User>>('/auth/profile');
      return response.data.data;
    } catch (error) {
      console.error('Error obteniendo perfil:', error);
      throw error;
    }
  },

  // Actualizar perfil del usuario
  updateProfile: async (userData: Partial<User>): Promise<User> => {
    try {
      const response = await apiClient.put<ApiResponse<User>>('/auth/profile', userData);
      
      // Actualizar usuario en la sesión local
      const session = localStorage.getItem('userSession');
      if (session) {
        const userSession: UserSession = JSON.parse(session);
        userSession.user = { ...userSession.user, ...response.data.data };
        localStorage.setItem('userSession', JSON.stringify(userSession));
      }
      
      return response.data.data;
    } catch (error) {
      console.error('Error actualizando perfil:', error);
      throw error;
    }
  },

  // Cambiar contraseña
  changePassword: async (passwordData: ChangePasswordData): Promise<void> => {
    try {
      await apiClient.post('/auth/change-password', passwordData);
    } catch (error) {
      console.error('Error cambiando contraseña:', error);
      throw error;
    }
  },

  // Solicitar reset de contraseña
  requestPasswordReset: async (data: ResetPasswordData): Promise<void> => {
    try {
      await authApiClient.post('/auth/forgot-password', data);
    } catch (error) {
      console.error('Error solicitando reset de contraseña:', error);
      throw error;
    }
  },

  // Confirmar reset de contraseña
  confirmPasswordReset: async (token: string, newPassword: string): Promise<void> => {
    try {
      await authApiClient.post('/auth/reset-password', {
        token,
        newPassword,
      });
    } catch (error) {
      console.error('Error confirmando reset de contraseña:', error);
      throw error;
    }
  },

  // Obtener preferencias del usuario
  getUserPreferences: (): UserPreferences => {
    const defaultPreferences: UserPreferences = {
      theme: 'light',
      language: 'es',
      sidebarCollapsed: false,
    };

    if (typeof window === 'undefined') return defaultPreferences;
    
    try {
      const session = localStorage.getItem('userSession');
      if (!session) return defaultPreferences;
      
      const userSession: UserSession = JSON.parse(session);
      return userSession.preferences || defaultPreferences;
    } catch (error) {
      console.error('Error obteniendo preferencias:', error);
      return defaultPreferences;
    }
  },

  // Actualizar preferencias del usuario
  updateUserPreferences: (preferences: Partial<UserPreferences>): void => {
    if (typeof window === 'undefined') return;
    
    try {
      const session = localStorage.getItem('userSession');
      if (session) {
        const userSession: UserSession = JSON.parse(session);
        userSession.preferences = { ...userSession.preferences, ...preferences };
        localStorage.setItem('userSession', JSON.stringify(userSession));
      }
    } catch (error) {
      console.error('Error actualizando preferencias:', error);
    }
  },

  // Verificar permisos del usuario
  hasPermission: (permission: string): boolean => {
    const user = authService.getCurrentUser();
    if (!user) return false;
    
    // Aquí puedes implementar tu lógica de permisos
    // Por ejemplo, verificar roles específicos
    return user.roles.includes('admin') || user.roles.includes(permission);
  },

  // Verificar si el usuario tiene alguno de los roles especificados
  hasAnyRole: (roles: string[]): boolean => {
    const user = authService.getCurrentUser();
    if (!user) return false;
    
    return roles.some(role => user.roles.includes(role));
  },

  // Verificar si el usuario tiene todos los roles especificados
  hasAllRoles: (roles: string[]): boolean => {
    const user = authService.getCurrentUser();
    if (!user) return false;
    
    return roles.every(role => user.roles.includes(role));
  },
};