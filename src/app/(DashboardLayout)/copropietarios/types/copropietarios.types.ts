// Tipos específicos para copropietarios
export interface Copropietario {
  id: string;
  usuario: {
    username: string;
    email: string;
    telefono: string;
    foto_perfil_url?: string;
  };
  activo: boolean;
  fechaIngreso?: string;
  fechaActualizacion?: string;
  observaciones?: string;
}

export interface CreateCopropietarioData {
  usuario: {
    username: string;
    email: string;
    password: string;
    foto_perfil?: File;
  };
}

export interface UpdateCopropietarioData {
  usuario?: {
    username?: string;
    email?: string;
    telefono?: string;
    foto_perfil?: File;
  };
  activo?: boolean;
  observaciones?: string;
}

export interface CopropietariosFilters {
  activo?: boolean;
  fechaDesde?: string;
  fechaHasta?: string;
  search?: string;
}

// Estados para el hook de copropietarios
export interface UseCopropietariosState {
  copropietarios: Copropietario[];
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
  pageSize: number;
  submitting: boolean;
}

// Respuestas de la API
export interface CopropietariosResponse {
  success: boolean;
  data: Copropietario[];
  total_items: number;
  total_pages: number;
  current_page: number;
  page_size: number;
}

export interface CopropietarioResponse {
  success: boolean;
  data: Copropietario;
  message: string;
}

// Re-exportaciones para facilitar el uso
export type {
  Copropietario as CopropietarioType,
  CreateCopropietarioData as CreateCopropietarioRequest,
  UpdateCopropietarioData as UpdateCopropietarioRequest,
};