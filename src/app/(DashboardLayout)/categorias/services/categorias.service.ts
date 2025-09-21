import { apiClient } from '@/services/api';
import { CreateCategoriaData, UpdateCategoriaData } from '../types';

// Servicios específicos para la gestión de categorías
export const categoriasService = {
  // Obtener todas las categorías con paginación
  getAll: async (page: number = 1, page_size: number = 10) => {
    try {
      console.log('🔍 GET - Parámetros:', { page, page_size });
      const response = await apiClient.get(`/categorias/?page=${page}&page_size=${page_size}`);
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

  // Obtener una categoría por ID
  getById: async (id: number) => {
    try {
      console.log(`🔍 GET BY ID - ID: ${id}`);
      const response = await apiClient.get(`/categorias/${id}/`);
      console.log(`✅ GET BY ID - Categoría:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`❌ ERROR GET BY ID ${id}:`, error);
      throw error;
    }
  },

  // Crear una nueva categoría
  create: async (categoriaData: CreateCategoriaData) => {
    try {
      console.log('🚀 CREATE - Datos enviados:', categoriaData);
      const response = await apiClient.post('/categorias/', categoriaData);
      console.log('✅ CREATE - Categoría creada:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ ERROR CREATE:', error);
      throw error;
    }
  },

  // Actualizar una categoría existente
  update: async (id: number, categoriaData: UpdateCategoriaData) => {
    try {
      console.log(`🔄 UPDATE - ID: ${id}, Datos:`, categoriaData);
      const response = await apiClient.put(`/categorias/${id}/`, categoriaData);
      console.log(`✅ UPDATE - Categoría actualizada:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`❌ ERROR UPDATE ${id}:`, error);
      throw error;
    }
  },

  // Eliminar una categoría
  delete: async (id: number) => {
    try {
      console.log(`🗑️ DELETE - ID: ${id}`);
      const response = await apiClient.delete(`/categorias/${id}/`);
      console.log(`✅ DELETE - Categoría eliminada`);
      return response.data;
    } catch (error) {
      console.error(`❌ ERROR DELETE ${id}:`, error);
      throw error;
    }
  },
};
