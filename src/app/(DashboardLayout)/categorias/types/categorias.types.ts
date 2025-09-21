// Tipos específicos para categorías
export interface Categoria {
  id: number;
  nombre: string;
  tarifa_mensual: string; // Tu API devuelve string "500.00"
}

export interface CreateCategoriaData {
  nombre: string;
  tarifa_mensual: number; // Para envío se usa number 500.00
}

export interface UpdateCategoriaData {
  nombre?: string;
  tarifa_mensual?: number;
}

export interface CategoriasFilters {
  nombre?: string;
  tarifa_desde?: number;
  tarifa_hasta?: number;
  search?: string;
}

// Estados para el hook de categorías
export interface UseCategoriasState {
  categorias: Categoria[];
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface UseCategoriasActions {
  fetchCategorias: () => Promise<void>;
  createCategoria: (data: CreateCategoriaData) => Promise<Categoria>;
  updateCategoria: (id: number, data: UpdateCategoriaData) => Promise<Categoria>;
  deleteCategoria: (id: number) => Promise<void>;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  setFilters: (filters: CategoriasFilters) => void;
  refetch: () => Promise<void>;
}

// Props para el componente CategoriaDialogForm
export interface CategoriaDialogFormProps {
  open: boolean;
  onClose: () => void;
  mode?: "create" | "edit";
  categoria?: Categoria | null;
  onSubmit: (data: CreateCategoriaData | UpdateCategoriaData) => Promise<void> | void;
}
