import { apiClient } from '@/services/api';
import { CreateResidenteData, UpdateResidenteData } from '../types';

// Servicios específicos para la gestión de residentes
export const residentesService = {
  // Obtener todos los residentes con paginación
  getAll: async (page: number = 1, page_size: number = 10) => {
    try {
      console.log('🔍 GET - Parámetros:', { page, page_size });
      const response = await apiClient.get(`/residentes/?page=${page}&page_size=${page_size}`);
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

  // Obtener un residente por ID
  getById: async (id: string) => {
    try {
      console.log(`🔍 GET BY ID - ID: ${id}`);
      const response = await apiClient.get(`/residentes/${id}`);
      console.log(`✅ GET BY ID - Residente:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`❌ ERROR GET BY ID ${id}:`, error);
      throw error;
    }
  },

  // Crear un nuevo residente
  create: async (residenteData: CreateResidenteData) => {
    try {
      console.log('🚀 CREATE - Datos enviados:', residenteData);
      const response = await apiClient.post('/residentes/', residenteData);
      console.log('✅ CREATE - Residente creado:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ ERROR CREATE:', error);
      throw error;
    }
  },

  // Actualizar un residente existente
  update: async (id: string, residenteData: UpdateResidenteData) => {
    try {
      console.log(`🔄 UPDATE - ID: ${id}, Datos:`, residenteData);
      const response = await apiClient.put(`/residentes/${id}/`, residenteData);
      console.log(`✅ UPDATE - Residente actualizado:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`❌ ERROR UPDATE ${id}:`, error);
      throw error;
    }
  },

  // Eliminar un residente
  delete: async (id: string) => {
    try {
      console.log(`🗑️ DELETE - ID: ${id}`);
      const response = await apiClient.delete(`/residentes/${id}/`);
      console.log(`✅ DELETE - Residente eliminado`);
      return response.data;
    } catch (error) {
      console.error(`❌ ERROR DELETE ${id}:`, error);
      throw error;
    }
  },
};