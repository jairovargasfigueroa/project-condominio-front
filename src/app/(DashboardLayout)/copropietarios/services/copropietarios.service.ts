import { apiClient } from '@/services/api';
import { CreateCopropietarioData, UpdateCopropietarioData } from '../types';

// Servicios específicos para la gestión de copropietarios
export const copropietariosService = {
  // Obtener todos los copropietarios con paginación
  getAll: async (page: number = 1, page_size: number = 10) => {
    try {
      console.log('🔍 GET - Parámetros:', { page, page_size });
      const response = await apiClient.get(`/copropietarios/?page=${page}&page_size=${page_size}`);
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

  // Obtener un copropietario por ID
  getById: async (id: string) => {
    try {
      console.log(`🔍 GET BY ID - ID: ${id}`);
      const response = await apiClient.get(`/copropietarios/${id}`);
      console.log(`✅ GET BY ID - Copropietario:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`❌ ERROR GET BY ID ${id}:`, error);
      throw error;
    }
  },

  // Crear un nuevo copropietario
  create: async (copropietarioData: CreateCopropietarioData | FormData) => {
    try {
      console.log('🚀 CREATE - Datos enviados:', copropietarioData);
      
      const config = copropietarioData instanceof FormData 
        ? { headers: { 'Content-Type': undefined } }
        : {};
      
      const response = await apiClient.post('/copropietarios/', copropietarioData, config);
      console.log('✅ CREATE - Copropietario creado:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ ERROR CREATE:', error);
      throw error;
    }
  },

  // Actualizar un copropietario existente
  update: async (id: string, copropietarioData: UpdateCopropietarioData | FormData) => {
    try {
      console.log(`🔄 UPDATE - ID: ${id}, Datos:`, copropietarioData);
      
      const config = copropietarioData instanceof FormData 
        ? { headers: { 'Content-Type': undefined } }
        : {};
      
      const response = await apiClient.put(`/copropietarios/${id}/`, copropietarioData, config);
      console.log(`✅ UPDATE - Copropietario actualizado:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`❌ ERROR UPDATE ${id}:`, error);
      throw error;
    }
  },

  // Eliminar un copropietario
  delete: async (id: string) => {
    try {
      console.log(`🗑️ DELETE - ID: ${id}`);
      const response = await apiClient.delete(`/copropietarios/${id}/`);
      console.log(`✅ DELETE - Copropietario eliminado`);
      return response.data;
    } catch (error) {
      console.error(`❌ ERROR DELETE ${id}:`, error);
      throw error;
    }
  },
};