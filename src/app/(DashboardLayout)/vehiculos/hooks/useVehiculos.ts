'use client';

import { useState, useEffect, useCallback } from 'react';
import { vehiculosService } from '../services';
import { CreateVehiculoData, Vehiculo, UpdateVehiculoData } from '../types';

// Hook específico para gestión de vehículos
export const useVehiculos = (autoFetch: boolean = true) => {
  // Estado básico
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [loading, setLoading] = useState(false);        // Solo para fetch inicial
  const [submitting, setSubmitting] = useState(false);  // Solo para operaciones CRUD
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  // Función para obtener vehículos
  const fetchVehiculos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await vehiculosService.getAll(page, pageSize);

      // ✅ Estructura real de tu API: { success, message, data: [...], total_items, total_pages, current_page }
      setVehiculos(response.data || []);        // response.data contiene el array de vehículos
      setTotal(response.total_items || 0);       // response.total_items contiene el total

    } catch (error: any) {
      // Si la página no existe, intentar ir a la primera página
      if (error.response?.status === 404 && page > 1) {
        console.log(`⚠️ Página ${page} no encontrada, navegando a página 1`);
        setPage(1);
        return; // El useEffect se ejecutará de nuevo con página 1
      }

      const errorMessage = error instanceof Error ? error.message : 'Error al cargar vehículos';
      setError(errorMessage);
      console.error('Error en fetchVehiculos:', error);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize]);

  // Función para crear vehículo
  const createVehiculo = useCallback(async (data: CreateVehiculoData) => {
    try {
      setSubmitting(true);  // ✅ Usa submitting para operaciones CRUD
      // ❌ NO ponemos setError(null) aquí - no afectamos el error global

      const newVehiculo = await vehiculosService.create(data);

      // Actualizar lista local
      setVehiculos(prev => [newVehiculo, ...prev]);
      setTotal(prev => prev + 1);

      return newVehiculo;
    } catch (error) {
      // ❌ NO ponemos setError() aquí - usamos notificaciones en el componente
      console.error('Error en createVehiculo:', error);
      throw error;
    } finally {
      setSubmitting(false);  // ✅ Usa submitting
    }
  }, []);

  // Función para actualizar vehículo
  const updateVehiculo = useCallback(async (id: number, data: UpdateVehiculoData) => {
    try {
      setSubmitting(true);  // ✅ Usa submitting para operaciones CRUD
      // ❌ NO ponemos setError(null) aquí - no afectamos el error global

      const updatedVehiculo = await vehiculosService.update(id, data);

      // Actualizar lista local
      setVehiculos(prev =>
        prev.map(vehiculo =>
          vehiculo.id === id ? updatedVehiculo : vehiculo
        )
      );

      return updatedVehiculo;
    } catch (error) {
      // ❌ NO ponemos setError() aquí - usamos notificaciones en el componente
      console.error('Error en updateVehiculo:', error);
      throw error;
    } finally {
      setSubmitting(false);  // ✅ Usa submitting
    }
  }, []);

  // Función para eliminar vehículo
  const deleteVehiculo = useCallback(async (id: number) => {
    try {
      setSubmitting(true);  // ✅ Usa submitting para operaciones CRUD
      // ❌ NO ponemos setError(null) aquí - no afectamos el error global

      await vehiculosService.delete(id);

      // Calcular nueva página después de eliminar
      const newTotal = total - 1;
      const maxPage = Math.ceil(newTotal / pageSize);

      // Si la página actual se queda sin elementos, ir a la página anterior
      const newPage = page > maxPage ? Math.max(1, maxPage) : page;

      console.log('📊 DELETE - Cálculo de página:', {
        totalAnterior: total,
        totalNuevo: newTotal,
        paginaActual: page,
        paginaMaxima: maxPage,
        paginaNueva: newPage
      });

      // Actualizar estado local
      setVehiculos(prev => prev.filter(vehiculo => vehiculo.id !== id));
      setTotal(newTotal);

      // Si cambió la página, actualizarla
      if (newPage !== page) {
        console.log(`🔄 DELETE - Navegando de página ${page} a página ${newPage}`);
        setPage(newPage);
      }

    } catch (error) {
      // ❌ NO ponemos setError() aquí - usamos notificaciones en el componente
      console.error('Error en deleteVehiculo:', error);
      throw error;
    } finally {
      setSubmitting(false);  // ✅ Usa submitting
    }
  }, [total, pageSize, page]);

  // Función para cambiar página
  const changePage = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  // Función para cambiar tamaño de página
  const changePageSize = useCallback((newPageSize: number) => {
    setPageSize(newPageSize);
    setPage(1); // Reset a página 1
  }, []);

  // Función para refrescar datos
  const refetch = useCallback(() => {
    return fetchVehiculos();
  }, [fetchVehiculos]);

  // Cargar datos automáticamente cuando cambia página, pageSize o autoFetch
  useEffect(() => {
    if (autoFetch) {
      console.log('🔄 useEffect - Ejecutando fetch por cambio de página/pageSize:', { page, pageSize });
      fetchVehiculos();
    }
  }, [autoFetch, page, pageSize, fetchVehiculos]); // ✅ Incluir fetchVehiculos para evitar warning

  return {
    // Estado
    vehiculos,
    loading,      // ✅ Solo para fetch inicial (spinner de tabla)
    submitting,   // ✅ Solo para operaciones CRUD (deshabilitar botones)
    error,
    page,
    pageSize,
    total,

    // Acciones CRUD
    createVehiculo,
    updateVehiculo,
    deleteVehiculo,

    // Navegación
    changePage,
    changePageSize,
    refetch,
  };
};
