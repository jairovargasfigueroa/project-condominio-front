// ===================================
// TIPOS PARA LA ENTIDAD GUARDIA
// ===================================

// Usuario dentro del Guardia
export interface GuardiaUsuario {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  rol: string;
  fecha_registro: string;
  foto_perfil_url?: string;
}

// Entidad principal Guardia
export interface Guardia {
  id: string;
  usuario: GuardiaUsuario;
}

// ===================================
// TIPOS PARA CREAR GUARDIA (POST)
// ===================================
export interface CreateGuardiaData {
  usuario: {
    username: string;
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    rol: string;
    foto_perfil?: File;
  };
}

// ===================================
// TIPOS PARA ACTUALIZAR GUARDIA (PUT)
// ===================================
export interface UpdateGuardiaData {
  usuario: {
    first_name: string;
    last_name: string;
    email: string;
    foto_perfil?: File;
  };
}

// ===================================
// TIPOS PARA LOS COMPONENTES
// ===================================
export interface GuardiaDialogFormProps {
  open: boolean;
  onClose: () => void;
  mode?: "create" | "edit";
  guardia?: Guardia | null;
  onSubmit: (data: CreateGuardiaData | UpdateGuardiaData | FormData) => void;
}

// ===================================
// RESPUESTAS DE LA API
// ===================================
export interface GuardiaApiResponse {
  success: boolean;
  message: string;
  data: Guardia[];
  total_items: number;
  total_pages: number;
  current_page: number;
}

export interface SingleGuardiaApiResponse {
  success: boolean;
  message: string;
  data: Guardia;
}

export interface DeleteGuardiaApiResponse {
  success: boolean;
  message: string;
}
