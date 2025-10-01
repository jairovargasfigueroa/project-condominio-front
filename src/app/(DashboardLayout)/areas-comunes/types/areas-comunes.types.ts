// ===================================
// TIPOS PARA LA ENTIDAD AREA COMUN
// ===================================

// Tipos de area común según el modelo Django
export type TipoAreaComun = 'gratuita' | 'pago';

// Entidad principal Area Comun
export interface AreaComun {
  id: string;
  nombre: string;
  tipo: TipoAreaComun;
  costo: number;
}

// ===================================
// TIPOS PARA CREAR AREA COMUN (POST)
// ===================================
export interface CreateAreaComunData {
  nombre: string;
  tipo: TipoAreaComun;
  costo: number;
}

// ===================================
// TIPOS PARA ACTUALIZAR AREA COMUN (PUT)
// ===================================
export interface UpdateAreaComunData {
  nombre: string;
  tipo: TipoAreaComun;
  costo: number;
}

// ===================================
// TIPOS PARA LOS COMPONENTES
// ===================================
export interface AreaComunDialogFormProps {
  open: boolean;
  onClose: () => void;
  mode?: "create" | "edit";
  areaComun?: AreaComun | null;
  onSubmit: (data: CreateAreaComunData | UpdateAreaComunData) => void;
}

// ===================================
// RESPUESTAS DE LA API
// ===================================
export interface AreaComunApiResponse {
  success: boolean;
  message: string;
  data: AreaComun[];
  total_items: number;
  total_pages: number;
  current_page: number;
}

export interface SingleAreaComunApiResponse {
  success: boolean;
  message: string;
  data: AreaComun;
}

export interface DeleteAreaComunApiResponse {
  success: boolean;
  message: string;
}