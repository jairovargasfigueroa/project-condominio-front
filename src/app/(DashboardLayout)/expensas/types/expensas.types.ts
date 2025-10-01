// Tipos específicos para expensas
export interface Expensa {
  id: number;
  mes: number;
  año: number;
  monto_pagado: number;
  estado: 'pendiente' | 'pagado' | 'vencido';
  metodo_pago: 'efectivo' | 'tarjeta' | 'qr' | null;
  fecha_vencimiento: string;
  fecha_creacion: string;
  vivienda: {
    id: number;
    numero: string;
    direccion: string;
    categoria: {
      id: number;
      nombre: string;
      descripcion: string;
      tarifa_mensual: number;
    };
    copropietario: {
      id: number;
      usuario: {
        id: number;
        username: string;
        first_name: string;
        last_name: string;
        email: string;
        rol: string;
      };
    } | null;
  };
}

export interface GenerarMesData {
  mes: number;
  año: number;
}

export interface UpdateExpensaData {
  estado?: 'pendiente' | 'pagado' | 'vencido';
  metodo_pago?: string;
  monto_pagado?: number;
  fecha_pago?: string;
}

export interface ExpensasFilters {
  mes: number;
  año: number;
}

export interface EstadisticasExpensas {
  total_expensas: number;
  pendientes: number;
  pagadas: number;
  vencidas: number;
  monto_total_pendiente: number;
  monto_total_recaudado: number;
}

// Estados para el hook de expensas
export interface UseExpensasState {
  expensas: Expensa[];
  loading: boolean;
  error: string | null;
  total: number;
  submitting: boolean;
  estadisticas: EstadisticasExpensas | null;
}

// Respuestas de la API
export interface ExpensasResponse {
  success: boolean;
  message: string;
  data: Expensa[];
  total_items: number;
  total_pages: number;
  current_page: number;
}

export interface ExpensaResponse {
  success: boolean;
  data: Expensa;
  message: string;
}

export interface GenerarMesResponse {
  success: boolean;
  data: EstadisticasExpensas;
  message: string;
}

// Re-exportaciones para facilitar el uso
export type {
  Expensa as ExpensaType,
  GenerarMesData as GenerarMesRequest,
  UpdateExpensaData as UpdateExpensaRequest,
};