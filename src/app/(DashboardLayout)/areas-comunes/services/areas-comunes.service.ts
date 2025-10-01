import { apiClient } from '@/services/api';
import {
  CreateAreaComunData,
  UpdateAreaComunData
} from '../types';

// Servicios específicos para la gestión de areas comunes
export const areasComunesService = {
  // Obtener todas las areas comunes con paginación
  getAll: async (page: number = 1, page_size: number = 10) => {
    try {
      console.log('🔍 GET - Parámetros:', { page, page_size });
      const response = await apiClient.get(`/areas-comunes/?page=${page}&page_size=${page_size}`);
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

  // Obtener un area comun por ID
  getById: async (id: string) => {
    try {
      console.log(`🔍 GET BY ID - ID: ${id}`);
      const response = await apiClient.get(`/areas-comunes/${id}/`);
      console.log(`✅ GET BY ID - Area Comun:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`❌ ERROR GET BY ID ${id}:`, error);
      throw error;
    }
  },

  // Crear una nueva area comun
  create: async (areaComunData: CreateAreaComunData) => {
    try {
      console.log('🚀 CREATE - Datos enviados:', areaComunData);
      const response = await apiClient.post('/areas-comunes/', areaComunData);
      console.log('✅ CREATE - Area Comun creada:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ ERROR CREATE:', error);
      throw error;
    }
  },

  // Actualizar un area comun existente
  update: async (id: string, areaComunData: UpdateAreaComunData) => {
    try {
      console.log(`🔄 UPDATE - ID: ${id}, Datos:`, areaComunData);
      const response = await apiClient.put(`/areas-comunes/${id}/`, areaComunData);
      console.log(`✅ UPDATE - Area Comun actualizada:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`❌ ERROR UPDATE ${id}:`, error);
      throw error;
    }
  },

  // Eliminar un area comun
  delete: async (id: string) => {
    try {
      console.log(`🗑️ DELETE - ID: ${id}`);
      const response = await apiClient.delete(`/areas-comunes/${id}/`);
      console.log(`✅ DELETE - Area Comun eliminada`);
      return response.data;
    } catch (error) {
      console.error(`❌ ERROR DELETE ${id}:`, error);
      throw error;
    }
  },
};