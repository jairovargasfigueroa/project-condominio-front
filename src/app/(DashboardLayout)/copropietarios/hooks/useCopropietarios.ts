'use client';

import { useState, useEffect, useCallback } from 'react';
import { copropietariosService } from '../services';
import { CreateCopropietarioData, Copropietario, UpdateCopropietarioData } from '../types';

// Hook específico para gestión de copropietarios
export const useCopropietarios = (autoFetch: boolean = true) => {
  // Estado básico
  const [copropietarios, setCopropietarios] = useState<Copropietario[]>([]);
  const [loading, setLoading] = useState(false);        // Solo para fetch inicial
  const [submitting, setSubmitting] = useState(false);  // Solo para operaciones CRUD
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  // Función para obtener copropietarios
  const fetchCopropietarios = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await copropietariosService.getAll(page, pageSize);
      
      // ✅ Estructura real de tu API: { success, message, data: [...], total_items, total_pages, current_page }
      setCopropietarios(response.data || []);        // response.data contiene el array de copropietarios
      setTotal(response.total_items || 0);       // response.total_items contiene el total
      
    } catch (error: any) {
      // Si la página no existe, intentar ir a la primera página
      if (error.response?.status === 404 && page > 1) {
        console.log(`⚠️ Página ${page} no encontrada, navegando a página 1`);
        setPage(1);
        return; // El useEffect se ejecutará de nuevo con página 1
      }
      
      const errorMessage = error instanceof Error ? error.message : 'Error al cargar copropietarios';
      setError(errorMessage);
      console.error('Error en fetchCopropietarios:', error);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize]);

  // Función para crear copropietario
  const createCopropietario = useCallback(async (data: CreateCopropietarioData | FormData) => {
    try {
      setSubmitting(true);  // ✅ Usa submitting para operaciones CRUD
      // ❌ NO ponemos setError(null) aquí - no afectamos el error global
      
      const newCopropietario = await copropietariosService.create(data);
      
      // Actualizar lista local
      setCopropietarios(prev => [newCopropietario, ...prev]);
      setTotal(prev => prev + 1);
      
      return newCopropietario;
    } catch (error) {
      // ❌ NO ponemos setError() aquí - usamos notificaciones en el componente
      console.error('Error en createCopropietario:', error);
      throw error;
    } finally {
      setSubmitting(false);  // ✅ Usa submitting
    }
  }, []);

  // Función para actualizar copropietario
  const updateCopropietario = useCallback(async (id: string, data: UpdateCopropietarioData | FormData) => {
    try {
      setSubmitting(true);  // ✅ Usa submitting para operaciones CRUD
      // ❌ NO ponemos setError(null) aquí - no afectamos el error global
      
      const updatedCopropietario = await copropietariosService.update(id, data);
      
      // Actualizar lista local
      setCopropietarios(prev => 
        prev.map(copropietario => 
          copropietario.id === id ? updatedCopropietario : copropietario
        )
      );
      
      return updatedCopropietario;
    } catch (error) {
      // ❌ NO ponemos setError() aquí - usamos notificaciones en el componente
      console.error('Error en updateCopropietario:', error);
      throw error;
    } finally {
      setSubmitting(false);  // ✅ Usa submitting
    }
  }, []);

  // Función para eliminar copropietario
  const deleteCopropietario = useCallback(async (id: string) => {
    try {
      setSubmitting(true);  // ✅ Usa submitting para operaciones CRUD
      // ❌ NO ponemos setError(null) aquí - no afectamos el error global
      
      await copropietariosService.delete(id);
      
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
      setCopropietarios(prev => prev.filter(copropietario => copropietario.id !== id));
      setTotal(newTotal);
      
      // Si cambió la página, actualizarla
      if (newPage !== page) {
        console.log(`🔄 DELETE - Navegando de página ${page} a página ${newPage}`);
        setPage(newPage);
      }
      
    } catch (error) {
      // ❌ NO ponemos setError() aquí - usamos notificaciones en el componente
      console.error('Error en deleteCopropietario:', error);
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
    return fetchCopropietarios();
  }, [fetchCopropietarios]);

  // Cargar datos automáticamente cuando cambia página, pageSize o autoFetch
  useEffect(() => {
    if (autoFetch) {
      console.log('🔄 useEffect - Ejecutando fetch por cambio de página/pageSize:', { page, pageSize });
      fetchCopropietarios();
    }
  }, [autoFetch, page, pageSize, fetchCopropietarios]); // ✅ Incluir fetchCopropietarios para evitar warning

  return {
    // Estado
    copropietarios,
    loading,      // ✅ Solo para fetch inicial (spinner de tabla)
    submitting,   // ✅ Solo para operaciones CRUD (deshabilitar botones)
    error,
    page,
    pageSize,
    total,
    
    // Acciones CRUD
    createCopropietario,
    updateCopropietario,
    deleteCopropietario,
    
    // Navegación
    changePage,
    changePageSize,
    refetch,
  };
};