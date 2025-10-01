// ===================================
// TIPOS PARA LA ENTIDAD COMUNICADO
// ===================================

// Entidad principal Comunicado
export interface Comunicado {
  id: string;
  titulo: string;
  contenido: string;
  fecha_publicacion: string;
}

// ===================================
// TIPOS PARA LECTURAS DE COMUNICADOS
// ===================================

// Usuario dentro de residente_info
export interface UsuarioInfo {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  telefono: string;
  fecha_nacimiento: string;
  rol: string;
  date_joined: string;
  foto_perfil_url: string | null;
}

// Residente info dentro de la lectura
export interface ResidenteInfo {
  id: number;
  zona: string;
  usuario: UsuarioInfo;
}

// Comunicado info dentro de la lectura
export interface ComunicadoInfo {
  id: number;
  titulo: string;
  contenido: string;
  fecha_publicacion: string;
  importante: boolean;
}

// Lectura individual
export interface LecturaComunicado {
  id: number;
  residente: number;
  comunicado: number;
  fecha_lectura: string;
  residente_info: ResidenteInfo;
  comunicado_info: ComunicadoInfo;
}

// Respuesta de la API para lecturas
export interface LecturasApiResponse {
  success: boolean;
  data: LecturaComunicado[];
  message: string;
}

// ===================================
// TIPOS PARA CREAR COMUNICADO (POST)
// ===================================
export interface CreateComunicadoData {
  titulo: string;
  contenido: string;
}

// ===================================
// TIPOS PARA ACTUALIZAR COMUNICADO (PUT)
// ===================================
export interface UpdateComunicadoData {
  titulo: string;
  contenido: string;
}

// ===================================
// TIPOS PARA LOS COMPONENTES
// ===================================
export interface ComunicadoDialogFormProps {
  open: boolean;
  onClose: () => void;
  mode?: "create" | "edit";
  comunicado?: Comunicado | null;
  onSubmit: (data: CreateComunicadoData | UpdateComunicadoData) => void;
}

// ===================================
// RESPUESTAS DE LA API
// ===================================
export interface ComunicadoApiResponse {
  success: boolean;
  message: string;
  data: Comunicado[];
  total_items: number;
  total_pages: number;
  current_page: number;
}

export interface SingleComunicadoApiResponse {
  success: boolean;
  message: string;
  data: Comunicado;
}

export interface DeleteComunicadoApiResponse {
  success: boolean;
  message: string;
}