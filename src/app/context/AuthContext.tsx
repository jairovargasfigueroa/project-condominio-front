'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '@/services';
import { 
  User, 
  LoginCredentials, 
  RegisterData, 
  UserPreferences,
  ChangePasswordData,
  ResetPasswordData 
} from '@/types';

// Interfaz del contexto de autenticación
interface AuthContextType {
  // Estado
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  preferences: UserPreferences;

  // Acciones de autenticación
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  
  // Gestión de perfil
  updateProfile: (userData: Partial<User>) => Promise<void>;
  changePassword: (passwordData: ChangePasswordData) => Promise<void>;
  refreshUserData: () => Promise<void>;
  
  // Gestión de preferencias
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
  
  // Gestión de contraseñas
  requestPasswordReset: (data: ResetPasswordData) => Promise<void>;
  
  // Verificación de permisos
  hasPermission: (permission: string) => boolean;
  hasAnyRole: (roles: string[]) => boolean;
  hasAllRoles: (roles: string[]) => boolean;
}

// Crear el contexto
const AuthContext = createContext<AuthContextType | null>(null);

// Hook personalizado para usar el contexto
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

// Props del provider
interface AuthProviderProps {
  children: React.ReactNode;
}

// Provider del contexto de autenticación
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [preferences, setPreferences] = useState<UserPreferences>({
    theme: 'light',
    language: 'es',
    sidebarCollapsed: false,
  });

  // Computed values
  const isAuthenticated = user !== null && authService.isAuthenticated();

  // Función para inicializar el estado desde localStorage
  const initializeAuth = useCallback(async () => {
    try {
      setIsLoading(true);

      // Verificar si hay una sesión guardada
      if (authService.isAuthenticated()) {
        const currentUser = authService.getCurrentUser();
        const userPreferences = authService.getUserPreferences();
        
        if (currentUser) {
          setUser(currentUser);
          setPreferences(userPreferences);
          
          // Opcionalmente, refrescar los datos del usuario desde el servidor
          try {
            const updatedUser = await authService.getProfile();
            setUser(updatedUser);
          } catch (error) {
            console.error('Error refreshing user data:', error);
            // Si falla, mantener los datos locales
          }
        }
      } else {
        // Limpiar estado si no hay autenticación válida
        setUser(null);
      }
    } catch (error) {
      console.error('Error inicializando autenticación:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Efecto para inicializar la autenticación al montar el componente
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // Función de login
  const login = useCallback(async (credentials: LoginCredentials): Promise<void> => {
    try {
      setIsLoading(true);
      const authResponse = await authService.login(credentials);
      
      setUser(authResponse.user);
      
      // También actualizar las preferencias si vienen del servidor
      const userPreferences = authService.getUserPreferences();
      setPreferences(userPreferences);
      
    } catch (error) {
      console.error('Error en login:', error);
      throw error; // Re-lanzar para que el componente pueda manejar el error
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Función de registro
  const register = useCallback(async (userData: RegisterData): Promise<void> => {
    try {
      setIsLoading(true);
      const authResponse = await authService.register(userData);
      
      setUser(authResponse.user);
      
      const userPreferences = authService.getUserPreferences();
      setPreferences(userPreferences);
      
    } catch (error) {
      console.error('Error en registro:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Función de logout
  const logout = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);
      await authService.logout();
    } catch (error) {
      console.error('Error en logout:', error);
      // Continuar con el logout local aunque falle el servidor
    } finally {
      setUser(null);
      setPreferences({
        theme: 'light',
        language: 'es',
        sidebarCollapsed: false,
      });
      setIsLoading(false);
    }
  }, []);

  // Función para actualizar perfil
  const updateProfile = useCallback(async (userData: Partial<User>): Promise<void> => {
    try {
      const updatedUser = await authService.updateProfile(userData);
      setUser(updatedUser);
    } catch (error) {
      console.error('Error actualizando perfil:', error);
      throw error;
    }
  }, []);

  // Función para cambiar contraseña
  const changePassword = useCallback(async (passwordData: ChangePasswordData): Promise<void> => {
    try {
      await authService.changePassword(passwordData);
    } catch (error) {
      console.error('Error cambiando contraseña:', error);
      throw error;
    }
  }, []);

  // Función para refrescar datos del usuario
  const refreshUserData = useCallback(async (): Promise<void> => {
    try {
      if (isAuthenticated) {
        const updatedUser = await authService.getProfile();
        setUser(updatedUser);
      }
    } catch (error) {
      console.error('Error refrescando datos del usuario:', error);
      throw error;
    }
  }, [isAuthenticated]);

  // Función para actualizar preferencias
  const updatePreferences = useCallback((newPreferences: Partial<UserPreferences>): void => {
    const updatedPreferences = { ...preferences, ...newPreferences };
    setPreferences(updatedPreferences);
    authService.updateUserPreferences(newPreferences);
  }, [preferences]);

  // Función para solicitar reset de contraseña
  const requestPasswordReset = useCallback(async (data: ResetPasswordData): Promise<void> => {
    try {
      await authService.requestPasswordReset(data);
    } catch (error) {
      console.error('Error solicitando reset de contraseña:', error);
      throw error;
    }
  }, []);

  // Funciones de verificación de permisos
  const hasPermission = useCallback((permission: string): boolean => {
    return authService.hasPermission(permission);
  }, []);

  const hasAnyRole = useCallback((roles: string[]): boolean => {
    return authService.hasAnyRole(roles);
  }, []);

  const hasAllRoles = useCallback((roles: string[]): boolean => {
    return authService.hasAllRoles(roles);
  }, []);

  // Valor del contexto
  const contextValue: AuthContextType = {
    // Estado
    user,
    isAuthenticated,
    isLoading,
    preferences,

    // Acciones de autenticación
    login,
    register,
    logout,

    // Gestión de perfil
    updateProfile,
    changePassword,
    refreshUserData,

    // Gestión de preferencias
    updatePreferences,

    // Gestión de contraseñas
    requestPasswordReset,

    // Verificación de permisos
    hasPermission,
    hasAnyRole,
    hasAllRoles,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Export del contexto para casos especiales
export { AuthContext };