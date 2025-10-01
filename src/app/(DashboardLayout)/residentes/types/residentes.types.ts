// Tipos específicos para residentes
export interface Residente {
  id: string;
  usuario: {
    username: string;
    email: string;
    first_name?: string;
    last_name?: string;
    telefono?: string;
    foto_perfil_url?: string;
  };
  zona: string;
  vivienda?: {
    id: string;
    numero: string;
  } | null;
  activo: boolean;
  fechaIngreso?: string;
  fechaActualizacion?: string;
  observaciones?: string;
}

export interface CreateResidenteData {
  usuario: {
    username: string;
    email: string;
    password: string;
    first_name?: string;
    last_name?: string;
    telefono?: string;
    foto_perfil?: File;
  };
  zona: string;
  vivienda_id?: string | null;
}

export interface UpdateResidenteData {
  usuario?: {
    username?: string;
    email?: string;
    first_name?: string;
    last_name?: string;
    telefono?: string;
    foto_perfil?: File;
    
  };
  zona?: string;
  vivienda_id?: string | null;
  activo?: boolean;
  observaciones?: string;
}

export interface ResidentesFilters {
  zona?: string;
  activo?: boolean;
  fechaDesde?: string;
  fechaHasta?: string;
  search?: string;
}

// Estados para el hook de residentes
export interface UseResidentesState {
  residentes: Residente[];
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface UseResidentesActions {
  fetchResidentes: () => Promise<void>;
  createResidente: (data: CreateResidenteData) => Promise<Residente>;
  updateResidente: (id: string, data: UpdateResidenteData) => Promise<Residente>;
  deleteResidente: (id: string) => Promise<void>;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  setFilters: (filters: ResidentesFilters) => void;
  refetch: () => Promise<void>;
}

// Props para el componente ResidenteDialogForm
export interface ResidenteDialogFormProps {
  open: boolean;
  onClose: () => void;
  mode?: "create" | "edit";
  residente?: Residente | null;
  onSubmit: (data: CreateResidenteData | UpdateResidenteData | FormData) => Promise<void> | void;
}