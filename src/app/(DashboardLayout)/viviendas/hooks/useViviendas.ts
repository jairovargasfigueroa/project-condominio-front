'use client';

import { useState, useEffect, useCallback } from 'react';
import { viviendasService } from '../services';
import { CreateViviendaData, Vivienda, UpdateViviendaData } from '../types';

// Hook específico para gestión de viviendas
export const useViviendas = (autoFetch: boolean = true) => {
  // Estado básico
  const [viviendas, setViviendas] = useState<Vivienda[]>([]);
  const [loading, setLoading] = useState(false);        // Solo para fetch inicial
  const [submitting, setSubmitting] = useState(false);  // Solo para operaciones CRUD
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  // Función para obtener viviendas
  const fetchViviendas = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await viviendasService.getAll(page, pageSize);

      // ✅ Estructura real de tu API: { success, message, data: [...], total_items, total_pages, current_page }
      setViviendas(response.data || []);        // response.data contiene el array de viviendas
      setTotal(response.total_items || 0);       // response.total_items contiene el total


    } catch (error: any) {
      // Si la página no existe, intentar ir a la primera página
      if (error.response?.status === 404 && page > 1) {
        console.log(`⚠️ Página ${page} no encontrada, navegando a página 1`);
        setPage(1);
        return; // El useEffect se ejecutará de nuevo con página 1
      }

      const errorMessage = error instanceof Error ? error.message : 'Error al cargar viviendas';
      setError(errorMessage);
      console.error('Error en fetchViviendas:', error);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize]);

  // Función para crear vivienda
  const createVivienda = useCallback(async (data: CreateViviendaData) => {
    try {
      setSubmitting(true);  // ✅ Usa submitting para operaciones CRUD
      // ❌ NO ponemos setError(null) aquí - no afectamos el error global

      const newVivienda = await viviendasService.create(data);

      // Actualizar lista local
      setViviendas(prev => [newVivienda, ...prev]);
      setTotal(prev => prev + 1);

      return newVivienda;
    } catch (error) {
      // ❌ NO ponemos setError() aquí - usamos notificaciones en el componente
      console.error('Error en createVivienda:', error);
      throw error;
    } finally {
      setSubmitting(false);  // ✅ Usa submitting
    }
  }, []);

  // Función para actualizar vivienda
  const updateVivienda = useCallback(async (id: string, data: UpdateViviendaData) => {
    try {
      setSubmitting(true);  // ✅ Usa submitting para operaciones CRUD
      // ❌ NO ponemos setError(null) aquí - no afectamos el error global

      const updatedVivienda = await viviendasService.update(id, data);

      // Actualizar lista local
      setViviendas(prev =>
        prev.map(vivienda =>
          vivienda.id === id ? updatedVivienda : vivienda
        )
      );

      return updatedVivienda;
    } catch (error) {
      // ❌ NO ponemos setError() aquí - usamos notificaciones en el componente
      console.error('Error en updateVivienda:', error);
      throw error;
    } finally {
      setSubmitting(false);  // ✅ Usa submitting
    }
  }, []);

  // Función para eliminar vivienda
  const deleteVivienda = useCallback(async (id: string) => {
    try {
      setSubmitting(true);  // ✅ Usa submitting para operaciones CRUD
      // ❌ NO ponemos setError(null) aquí - no afectamos el error global

      await viviendasService.delete(id);

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
      setViviendas(prev => prev.filter(vivienda => vivienda.id !== id));
      setTotal(newTotal);

      // Si cambió la página, actualizarla
      if (newPage !== page) {
        console.log(`🔄 DELETE - Navegando de página ${page} a página ${newPage}`);
        setPage(newPage);
      }

    } catch (error) {
      // ❌ NO ponemos setError() aquí - usamos notificaciones en el componente
      console.error('Error en deleteVivienda:', error);
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
    return fetchViviendas();
  }, [fetchViviendas]);

  // Cargar datos automáticamente cuando cambia página, pageSize o autoFetch
  useEffect(() => {
    if (autoFetch) {
      console.log('🔄 useEffect - Ejecutando fetch por cambio de página/pageSize:', { page, pageSize });
      fetchViviendas();
    }
  }, [autoFetch, page, pageSize, fetchViviendas]); // ✅ Incluir fetchViviendas para evitar warning

  return {
    // Estado
    viviendas,
    loading,      // ✅ Solo para fetch inicial (spinner de tabla)
    submitting,   // ✅ Solo para operaciones CRUD (deshabilitar botones)
    error,
    page,
    pageSize,
    total,

    // Acciones CRUD
    createVivienda,
    updateVivienda,
    deleteVivienda,

    // Navegación
    changePage,
    changePageSize,
    refetch,
  };
};
