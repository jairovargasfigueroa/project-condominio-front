import { apiClient } from '@/services/api';
import { CreateVehiculoData, UpdateVehiculoData } from '../types';

// Servicios específicos para la gestión de vehículos
export const vehiculosService = {
  // Obtener todos los vehículos con paginación
  getAll: async (page: number = 1, page_size: number = 10) => {
    try {
      console.log('🔍 GET - Parámetros:', { page, page_size });
      const response = await apiClient.get(`/vehiculos/?page=${page}&page_size=${page_size}`);
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

  // Obtener un vehículo por ID
  getById: async (id: number) => {
    try {
      console.log(`🔍 GET BY ID - ID: ${id}`);
      const response = await apiClient.get(`/vehiculos/${id}/`);
      console.log(`✅ GET BY ID - Vehículo:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`❌ ERROR GET BY ID ${id}:`, error);
      throw error;
    }
  },

  // Crear un nuevo vehículo
  create: async (vehiculoData: CreateVehiculoData) => {
    try {
      console.log('🚀 CREATE - Datos enviados:', vehiculoData);
      const response = await apiClient.post('/vehiculos/', vehiculoData);
      console.log('✅ CREATE - Vehículo creado:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ ERROR CREATE:', error);
      throw error;
    }
  },

  // Actualizar un vehículo existente
  update: async (id: number, vehiculoData: UpdateVehiculoData) => {
    try {
      console.log(`🔄 UPDATE - ID: ${id}, Datos:`, vehiculoData);
      const response = await apiClient.put(`/vehiculos/${id}/`, vehiculoData);
      console.log(`✅ UPDATE - Vehículo actualizado:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`❌ ERROR UPDATE ${id}:`, error);
      throw error;
    }
  },

  // Eliminar un vehículo
  delete: async (id: number) => {
    try {
      console.log(`🗑️ DELETE - ID: ${id}`);
      const response = await apiClient.delete(`/vehiculos/${id}/`);
      console.log(`✅ DELETE - Vehículo eliminado`);
      return response.data;
    } catch (error) {
      console.error(`❌ ERROR DELETE ${id}:`, error);
      throw error;
    }
  },
};
