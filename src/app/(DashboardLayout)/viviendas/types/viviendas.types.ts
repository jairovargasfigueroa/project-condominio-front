// Tipos específicos para viviendas
export interface Categoria {
  id: number;
  nombre: string;
  tarifa_mensual: string;
}

export interface Usuario {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
}

export interface Copropietario {
  id: number;
  usuario: Usuario;
}

export interface Residente {
  id: number;
  usuario: Usuario;
  zona: string;
  vivienda_id?: number;
}

export interface ViviendaDetalles {
  id: number;
  numero: string;
  direccion: string;
  categoria: {
    id: number;
    nombre: string;
    descripcion: string;
  };
  copropietario: Copropietario | null;
  copropietario_id: number | null;
  residentes_actuales: Residente[];
  cantidad_residentes: number;
}

export interface Vivienda {
  id: string;
  categoria: Categoria;
  copropietario: Copropietario | null;
  numero: string;
  direccion: string;
}

export interface CreateViviendaData {
  categoria_id: number;
  copropietario_id: number | null;
  numero: string;
  direccion: string;
}

export interface UpdateViviendaData {
  categoria_id?: number;
  copropietario_id?: number | null;
  numero?: string;
  direccion?: string;
}

export interface ViviendasFilters {
  categoria?: string;
  copropietario?: string;
  numero?: string;
  search?: string;
}

// Estados para el hook de viviendas
export interface UseViviendasState {
  viviendas: Vivienda[];
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface UseViviendasActions {
  fetchViviendas: () => Promise<void>;
  createVivienda: (data: CreateViviendaData) => Promise<Vivienda>;
  updateVivienda: (id: string, data: UpdateViviendaData) => Promise<Vivienda>;
  deleteVivienda: (id: string) => Promise<void>;
  changePage: (page: number) => void;
  changePageSize: (pageSize: number) => void;
  setFilters: (filters: ViviendasFilters) => void;
  refetch: () => Promise<void>;
}

// Props para el componente ViviendaDialogForm
export interface ViviendaDialogFormProps {
  open: boolean;
  onClose: () => void;
  mode?: "create" | "edit";
  vivienda?: Vivienda | null;
  onSubmit: (data: CreateViviendaData | UpdateViviendaData) => Promise<void> | void;
}

// Props para el componente ViviendasTable
export interface ViviendasTableProps {
  viviendas: Vivienda[];
  isLoading: boolean;
  pagination: {
    currentPage: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onEdit: (vivienda: Vivienda) => void;
  onDelete: (vivienda: Vivienda) => void;
}

// ✅ Tipos útiles basados en el patrón de residentes
export interface ViviendasResponse {
  success: boolean;
  message: string;
  data: Vivienda[];
  total_items: number;
  total_pages: number;
  current_page: number;
}

export interface ApiError {
  message: string;
  status: number;
  code?: string;
}
