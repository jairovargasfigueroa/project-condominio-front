import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { AuthTokens, UserSession } from '@/types';

// URL base de la API - configurable por environment
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Instancia principal de axios
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 segundos
  headers: {
    'Content-Type': 'application/json',
  },
});

// Función para obtener el token del localStorage
const getAccessToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  
  try {
    const session = localStorage.getItem('userSession');
    if (session) {
      const userSession: UserSession = JSON.parse(session);
      return userSession.tokens.accessToken;
    }
  } catch (error) {
    console.error('Error obteniendo token:', error);
    return null;
  }
  return null;
};

// Función para obtener el refresh token
const getRefreshToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  
  try {
    const session = localStorage.getItem('userSession');
    if (session) {
      const userSession: UserSession = JSON.parse(session);
      return userSession.tokens.refreshToken;
    }
  } catch (error) {
    console.error('Error obteniendo refresh token:', error);
    return null;
  }
  return null;
};

// Función para verificar si el token ha expirado
const isTokenExpired = (): boolean => {
  if (typeof window === 'undefined') return true;
  
  try {
    const session = localStorage.getItem('userSession');
    if (session) {
      const userSession: UserSession = JSON.parse(session);
      return Date.now() >= userSession.tokens.expiresAt;
    }
  } catch (error) {
    console.error('Error verificando expiración del token:', error);
    return true;
  }
  return true;
};

// Función para actualizar tokens en localStorage
const updateTokensInStorage = (tokens: AuthTokens): void => {
  if (typeof window === 'undefined') return;
  
  try {
    const session = localStorage.getItem('userSession');
    if (session) {
      const userSession: UserSession = JSON.parse(session);
      userSession.tokens = tokens;
      localStorage.setItem('userSession', JSON.stringify(userSession));
    }
  } catch (error) {
    console.error('Error actualizando tokens:', error);
  }
};

// Función para limpiar sesión
const clearSession = (): void => {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem('userSession');
  localStorage.removeItem('accessToken'); // Por si acaso tienes tokens separados
  localStorage.removeItem('refreshToken');
  
  // Redirigir al login
  window.location.href = '/authentication/login';
};

// Función para renovar el token
const refreshAccessToken = async (): Promise<AuthTokens | null> => {
  try {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      throw new Error('No hay refresh token disponible');
    }

    const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
      refreshToken,
    });

    const newTokens: AuthTokens = response.data.tokens;
    updateTokensInStorage(newTokens);
    
    return newTokens;
  } catch (error) {
    console.error('Error renovando token:', error);
    clearSession();
    return null;
  }
};

// Interceptor de peticiones - Agrega el token automáticamente
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Verificar si el token ha expirado antes de hacer la petición
    if (isTokenExpired()) {
      const newTokens = await refreshAccessToken();
      if (!newTokens) {
        clearSession();
        return Promise.reject(new Error('No se pudo renovar el token'));
      }
    }

    const token = getAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log de la petición en desarrollo
    if (process.env.NODE_ENV === 'development') {
      console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`, {
        headers: config.headers,
        data: config.data,
      });
    }

    return config;
  },
  (error) => {
    console.error('Error en interceptor de petición:', error);
    return Promise.reject(error);
  }
);

// Interceptor de respuestas - Maneja errores y renovación de tokens
apiClient.interceptors.response.use(
  (response) => {
    // Log de la respuesta en desarrollo
    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url}`, {
        status: response.status,
        data: response.data,
      });
    }

    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Log del error en desarrollo
    if (process.env.NODE_ENV === 'development') {
      console.error(`❌ ${originalRequest?.method?.toUpperCase()} ${originalRequest?.url}`, {
        status: error.response?.status,
        data: error.response?.data,
      });
    }

    // Si es un error 401 y no hemos intentado renovar el token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newTokens = await refreshAccessToken();
        if (newTokens && originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newTokens.accessToken}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        console.error('Error renovando token:', refreshError);
        clearSession();
        return Promise.reject(refreshError);
      }
    }

    // Manejo de otros errores HTTP
    const errorData = error.response?.data as any;
    const errorMessage = errorData?.message || 
                        error.message || 
                        'Error en la comunicación con el servidor';

    const apiError = {
      message: errorMessage,
      status: error.response?.status,
      code: error.code,
    };

    // Mostrar notificación de error (puedes integrar con tu sistema de notificaciones)
    if (error.response?.status !== 401) {
      console.error('Error de API:', apiError);
      // Aquí podrías agregar un toast o notificación
    }

    return Promise.reject(apiError);
  }
);

// Instancia separada sin interceptores para autenticación
export const authApiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Funciones de utilidad para configuración
export const setApiBaseURL = (url: string): void => {
  apiClient.defaults.baseURL = url;
  authApiClient.defaults.baseURL = url;
};

export const setApiTimeout = (timeout: number): void => {
  apiClient.defaults.timeout = timeout;
  authApiClient.defaults.timeout = timeout;
};

// Exportar las funciones de utilidad
export {
  getAccessToken,
  getRefreshToken,
  isTokenExpired,
  updateTokensInStorage,
  clearSession,
  refreshAccessToken,
};