// Tipos específicos para vehículos
export interface Usuario {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  telefono: string;
  fecha_nacimiento: string;
  date_joined: string;
}

export interface Vehiculo {
  id: number;
  usuario: Usuario;
  placa: string;
  modelo: string;
  color: string;
  marca: string;
}

export interface CreateVehiculoData {
  usuario_id: number;
  placa: string;
  modelo: string;
  color: string;
  marca: string;
}

export interface UpdateVehiculoData {
  usuario_id?: number;
  placa?: string;
  modelo?: string;
  color?: string;
  marca?: string;
}

export interface VehiculosFilters {
  usuario?: string;
  marca?: string;
  color?: string;
  search?: string;
}

// Estados para el hook de vehículos
export interface UseVehiculosState {
  vehiculos: Vehiculo[];
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface UseVehiculosActions {
  fetchVehiculos: () => Promise<void>;
  createVehiculo: (data: CreateVehiculoData) => Promise<Vehiculo>;
  updateVehiculo: (id: number, data: UpdateVehiculoData) => Promise<Vehiculo>;
  deleteVehiculo: (id: number) => Promise<void>;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  setFilters: (filters: VehiculosFilters) => void;
  refetch: () => Promise<void>;
}

// Props para el componente VehiculoDialogForm
export interface VehiculoDialogFormProps {
  open: boolean;
  onClose: () => void;
  mode?: "create" | "edit";
  vehiculo?: Vehiculo | null;
  onSubmit: (data: CreateVehiculoData | UpdateVehiculoData) => Promise<void> | void;
}
