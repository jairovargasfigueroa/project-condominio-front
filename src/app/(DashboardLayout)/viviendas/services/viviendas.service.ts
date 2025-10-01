import { apiClient } from '@/services/api';
import { CreateViviendaData, UpdateViviendaData, ViviendaDetalles } from '../types';

// Servicios específicos para la gestión de viviendas
export const viviendasService = {
  // Obtener todas las viviendas con paginación
  getAll: async (page: number = 1, page_size: number = 10) => {
    try {
      console.log('🔍 GET - Parámetros:', { page, page_size });
      const response = await apiClient.get(`/viviendas/?page=${page}&page_size=${page_size}`);
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

  // Obtener una vivienda por ID
  getById: async (id: string) => {
    try {
      console.log(`🔍 GET BY ID - ID: ${id}`);
      const response = await apiClient.get(`/viviendas/${id}`);
      console.log(`✅ GET BY ID - Vivienda:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`❌ ERROR GET BY ID ${id}:`, error);
      throw error;
    }
  },

  // Crear una nueva vivienda
  create: async (viviendaData: CreateViviendaData) => {
    try {
      console.log('🚀 CREATE - Datos enviados:', viviendaData);
      const response = await apiClient.post('/viviendas/', viviendaData);
      console.log('✅ CREATE - Vivienda creada:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ ERROR CREATE:', error);
      throw error;
    }
  },

  // Actualizar una vivienda existente
  update: async (id: string, viviendaData: UpdateViviendaData) => {
    try {
      console.log(`🔄 UPDATE - ID: ${id}, Datos:`, viviendaData);
      const response = await apiClient.put(`/viviendas/${id}/`, viviendaData);
      console.log(`✅ UPDATE - Vivienda actualizada:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`❌ ERROR UPDATE ${id}:`, error);
      throw error;
    }
  },

  // Eliminar una vivienda
  delete: async (id: string) => {
    try {
      console.log(`🗑️ DELETE - ID: ${id}`);
      const response = await apiClient.delete(`/viviendas/${id}/`);
      console.log(`✅ DELETE - Vivienda eliminada`);
      return response.data;
    } catch (error) {
      console.error(`❌ ERROR DELETE ${id}:`, error);
      throw error;
    }
  },

  // Obtener detalles completos de una vivienda
  getDetalles: async (id: string): Promise<{ success: boolean; data: ViviendaDetalles; message: string }> => {
    try {
      console.log(`🔍 GET DETALLES - ID: ${id}`);
      const response = await apiClient.get(`/viviendas/${id}/detalles/`);
      console.log(`✅ GET DETALLES - Respuesta:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`❌ ERROR GET DETALLES ${id}:`, error);
      throw error;
    }
  },
};
