'use client';

import { useState, useEffect, useCallback } from 'react';
import { residentesService } from '../services';
import { CreateResidenteData, Residente, UpdateResidenteData } from '../types';

// Hook específico para gestión de residentes
export const useResidentes = (autoFetch: boolean = true) => {
  // Estado básico
  const [residentes, setResidentes] = useState<Residente[]>([]);
  const [loading, setLoading] = useState(false);        // Solo para fetch inicial
  const [submitting, setSubmitting] = useState(false);  // Solo para operaciones CRUD
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  // Función para obtener residentes
  const fetchResidentes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await residentesService.getAll(page, pageSize);
      
      // ✅ Estructura real de tu API: { success, message, data: [...], total_items, total_pages, current_page }
      setResidentes(response.data || []);        // response.data contiene el array de residentes
      setTotal(response.total_items || 0);       // response.total_items contiene el total
      
    } catch (error: any) {
      // Si la página no existe, intentar ir a la primera página
      if (error.response?.status === 404 && page > 1) {
        console.log(`⚠️ Página ${page} no encontrada, navegando a página 1`);
        setPage(1);
        return; // El useEffect se ejecutará de nuevo con página 1
      }
      
      const errorMessage = error instanceof Error ? error.message : 'Error al cargar residentes';
      setError(errorMessage);
      console.error('Error en fetchResidentes:', error);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize]);

  // Función para crear residente
  const createResidente = useCallback(async (data: CreateResidenteData) => {
    try {
      setSubmitting(true);  // ✅ Usa submitting para operaciones CRUD
      // ❌ NO ponemos setError(null) aquí - no afectamos el error global
      
      const newResidente = await residentesService.create(data);
      
      // Actualizar lista local
      setResidentes(prev => [newResidente, ...prev]);
      setTotal(prev => prev + 1);
      
      return newResidente;
    } catch (error) {
      // ❌ NO ponemos setError() aquí - usamos notificaciones en el componente
      console.error('Error en createResidente:', error);
      throw error;
    } finally {
      setSubmitting(false);  // ✅ Usa submitting
    }
  }, []);

  // Función para actualizar residente
  const updateResidente = useCallback(async (id: string, data: UpdateResidenteData) => {
    try {
      setSubmitting(true);  // ✅ Usa submitting para operaciones CRUD
      // ❌ NO ponemos setError(null) aquí - no afectamos el error global
      
      const updatedResidente = await residentesService.update(id, data);
      
      // Actualizar lista local
      setResidentes(prev => 
        prev.map(residente => 
          residente.id === id ? updatedResidente : residente
        )
      );
      
      return updatedResidente;
    } catch (error) {
      // ❌ NO ponemos setError() aquí - usamos notificaciones en el componente
      console.error('Error en updateResidente:', error);
      throw error;
    } finally {
      setSubmitting(false);  // ✅ Usa submitting
    }
  }, []);

  // Función para eliminar residente
  const deleteResidente = useCallback(async (id: string) => {
    try {
      setSubmitting(true);  // ✅ Usa submitting para operaciones CRUD
      // ❌ NO ponemos setError(null) aquí - no afectamos el error global
      
      await residentesService.delete(id);
      
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
      setResidentes(prev => prev.filter(residente => residente.id !== id));
      setTotal(newTotal);
      
      // Si cambió la página, actualizarla
      if (newPage !== page) {
        console.log(`🔄 DELETE - Navegando de página ${page} a página ${newPage}`);
        setPage(newPage);
      }
      
    } catch (error) {
      // ❌ NO ponemos setError() aquí - usamos notificaciones en el componente
      console.error('Error en deleteResidente:', error);
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
    return fetchResidentes();
  }, [fetchResidentes]);

  // Cargar datos automáticamente cuando cambia página, pageSize o autoFetch
  useEffect(() => {
    if (autoFetch) {
      console.log('🔄 useEffect - Ejecutando fetch por cambio de página/pageSize:', { page, pageSize });
      fetchResidentes();
    }
  }, [autoFetch, page, pageSize, fetchResidentes]); // ✅ Incluir fetchResidentes para evitar warning

  return {
    // Estado
    residentes,
    loading,      // ✅ Solo para fetch inicial (spinner de tabla)
    submitting,   // ✅ Solo para operaciones CRUD (deshabilitar botones)
    error,
    page,
    pageSize,
    total,
    
    // Acciones CRUD
    createResidente,
    updateResidente,
    deleteResidente,
    
    // Navegación
    changePage,
    changePageSize,
    refetch,
  };
};