import { apiClient } from '@/services/api';
import { GenerarMesData, UpdateExpensaData } from '../types';

// Servicios específicos para la gestión de expensas
export const expensasService = {
  // Obtener todas las expensas por período
  getPorPeriodo: async (mes: number, año: number) => {
    try {
      console.log('🔍 GET POR PERIODO - Parámetros:', { mes, año });
      const response = await apiClient.get(`/expensas/por_periodo/?mes=${mes}&año=${año}`);
      console.log('✅ GET POR PERIODO - Respuesta completa:', response.data);
      console.log('📊 GET POR PERIODO - Estructura:', {
        total: response.data?.total_items || 'No definido',
        items: response.data?.data?.length || 0
      });
      return response.data;
    } catch (error) {
      console.error('❌ ERROR GET POR PERIODO:', error);
      throw error;
    }
  },

  // Generar expensas del mes
  generarMes: async (data: GenerarMesData) => {
    try {
      console.log('🚀 GENERAR MES - Datos enviados:', data);
      const response = await apiClient.post('/expensas/generar_mes/', data);
      console.log('✅ GENERAR MES - Expensas generadas:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ ERROR GENERAR MES:', error);
      throw error;
    }
  },

  // Actualizar una expensa existente
  update: async (id: number, expensaData: UpdateExpensaData) => {
    try {
      console.log(`🔄 UPDATE - ID: ${id}, Datos:`, expensaData);
      const response = await apiClient.patch(`/expensas/${id}/`, expensaData);
      console.log(`✅ UPDATE - Expensa actualizada:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`❌ ERROR UPDATE ${id}:`, error);
      throw error;
    }
  },
};