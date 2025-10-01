'use client';

import { useState, useEffect, useCallback } from 'react';
import { expensasService } from '../services';
import { GenerarMesData, Expensa, UpdateExpensaData, EstadisticasExpensas } from '../types';

// Hook específico para gestión de expensas
export const useExpensas = (mes: number, año: number, autoFetch: boolean = true) => {
  // Estado básico
  const [expensas, setExpensas] = useState<Expensa[]>([]);
  const [loading, setLoading] = useState(false);        // Solo para fetch inicial
  const [submitting, setSubmitting] = useState(false);  // Solo para operaciones CRUD
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [estadisticas, setEstadisticas] = useState<EstadisticasExpensas | null>(null);

  // Función para obtener expensas por período
  const fetchExpensas = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await expensasService.getPorPeriodo(mes, año);
      
      // ✅ Estructura de tu API: { success, message, data: [...], total_items }
      setExpensas(response.data || []);           // response.data contiene el array de expensas
      setTotal(response.total_items || 0);       // response.total_items contiene el total
      
    } catch (error: any) {
      const errorMessage = error instanceof Error ? error.message : 'Error al cargar expensas';
      setError(errorMessage);
      console.error('Error en fetchExpensas:', error);
    } finally {
      setLoading(false);
    }
  }, [mes, año]);

  // Función para generar expensas del mes
  const generarMes = useCallback(async (data: GenerarMesData) => {
    try {
      setSubmitting(true);  // ✅ Usa submitting para operaciones CRUD
      
      const response = await expensasService.generarMes(data);
      
      // Actualizar estadísticas
      setEstadisticas(response.data);
      
      // Refrescar la lista
      await fetchExpensas();
      
      return response;
    } catch (error) {
      console.error('Error en generarMes:', error);
      throw error;
    } finally {
      setSubmitting(false);  // ✅ Usa submitting
    }
  }, [fetchExpensas]);

  // Función para actualizar expensa
  const updateExpensa = useCallback(async (id: number, data: UpdateExpensaData) => {
    try {
      setSubmitting(true);  // ✅ Usa submitting para operaciones CRUD
      
      const response = await expensasService.update(id, data);
      
      // Actualizar lista local
      setExpensas(prev => 
        prev.map(expensa => 
          expensa.id === id ? response.data : expensa
        )
      );
      
      return response;
    } catch (error) {
      console.error('Error en updateExpensa:', error);
      throw error;
    } finally {
      setSubmitting(false);  // ✅ Usa submitting
    }
  }, []);

  // Función para refrescar datos
  const refetch = useCallback(() => {
    return fetchExpensas();
  }, [fetchExpensas]);

  // Cargar datos automáticamente cuando cambia mes, año o autoFetch
  useEffect(() => {
    if (autoFetch) {
      console.log('🔄 useEffect - Ejecutando fetch por cambio de período:', { mes, año });
      fetchExpensas();
    }
  }, [autoFetch, mes, año, fetchExpensas]);

  return {
    // Estado
    expensas,
    loading,      // ✅ Solo para fetch inicial (spinner de tabla)
    submitting,   // ✅ Solo para operaciones CRUD (deshabilitar botones)
    error,
    total,
    estadisticas,
    
    // Acciones
    generarMes,
    updateExpensa,
    refetch,
  };
};