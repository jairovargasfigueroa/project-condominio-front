import { apiClient } from '@/services/api';
import {
  CreateComunicadoData,
  UpdateComunicadoData
} from '../types';

// Servicios específicos para la gestión de comunicados
export const comunicadosService = {
  // Obtener todos los comunicados con paginación
  getAll: async (page: number = 1, page_size: number = 10) => {
    try {
      console.log('🔍 GET - Parámetros:', { page, page_size });
      const response = await apiClient.get(`/comunicados/?page=${page}&page_size=${page_size}`);
      console.log('✅ GET - Respuesta completa:', response.data);
      console.log('📊 GET - Estructura:', {
        total: response.data?.total_items || 'No definido',
        currentPage: page,
        items: response.data?.data?.length || 0
      });
      return response.data;
    } catch (error) {
      console.error('❌ ERROR GET:', error);
      throw error;
    }
  },

  // Obtener un comunicado por ID
  getById: async (id: string) => {
    try {
      console.log(`🔍 GET BY ID - ID: ${id}`);
      const response = await apiClient.get(`/comunicados/${id}/`);
      console.log(`✅ GET BY ID - Comunicado:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`❌ ERROR GET BY ID ${id}:`, error);
      throw error;
    }
  },

  // Crear un nuevo comunicado
  create: async (comunicadoData: CreateComunicadoData) => {
    try {
      console.log('🚀 CREATE - Datos enviados:', comunicadoData);
      const response = await apiClient.post('/comunicados/', comunicadoData);
      console.log('✅ CREATE - Comunicado creado:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ ERROR CREATE:', error);
      throw error;
    }
  },

  // Actualizar un comunicado existente
  update: async (id: string, comunicadoData: UpdateComunicadoData) => {
    try {
      console.log(`🔄 UPDATE - ID: ${id}, Datos:`, comunicadoData);
      const response = await apiClient.put(`/comunicados/${id}/`, comunicadoData);
      console.log(`✅ UPDATE - Comunicado actualizado:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`❌ ERROR UPDATE ${id}:`, error);
      throw error;
    }
  },

  // Eliminar un comunicado
  delete: async (id: string) => {
    try {
      console.log(`🗑️ DELETE - ID: ${id}`);
      const response = await apiClient.delete(`/comunicados/${id}/`);
      console.log(`✅ DELETE - Comunicado eliminado`);
      return response.data;
    } catch (error) {
      console.error(`❌ ERROR DELETE ${id}:`, error);
      throw error;
    }
  },

  // Obtener lecturas de un comunicado específico
  getLecturasByComunicado: async (comunicadoId: string) => {
    try {
      console.log(`📖 GET LECTURAS - Comunicado ID: ${comunicadoId}`);
      const response = await apiClient.get(`/lectura-comunicados/por_comunicado/?comunicado_id=${comunicadoId}`);
      console.log(`✅ GET LECTURAS - Lecturas obtenidas:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`❌ ERROR GET LECTURAS ${comunicadoId}:`, error);
      throw error;
    }
  },
};