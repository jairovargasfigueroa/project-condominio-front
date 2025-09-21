'use client';

import { useState, useEffect, useCallback } from 'react';
import { categoriasService } from '../services';
import { CreateCategoriaData, Categoria, UpdateCategoriaData } from '../types';

// Hook específico para gestión de categorías
export const useCategorias = (autoFetch: boolean = true) => {
  // Estado básico
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(false);        // Solo para fetch inicial
  const [submitting, setSubmitting] = useState(false);  // Solo para operaciones CRUD
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  // Función para obtener categorías
  const fetchCategorias = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await categoriasService.getAll(page, pageSize);

      // ✅ Estructura real de tu API: { success, message, data: [...], total_items, total_pages, current_page }
      setCategorias(response.data || []);        // response.data contiene el array de categorías
      setTotal(response.total_items || 0);       // response.total_items contiene el total

    } catch (error: any) {
      // Si la página no existe, intentar ir a la primera página
      if (error.response?.status === 404 && page > 1) {
        console.log(`⚠️ Página ${page} no encontrada, navegando a página 1`);
        setPage(1);
        return; // El useEffect se ejecutará de nuevo con página 1
      }

      const errorMessage = error instanceof Error ? error.message : 'Error al cargar categorías';
      setError(errorMessage);
      console.error('Error en fetchCategorias:', error);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize]);

  // Función para crear categoría
  const createCategoria = useCallback(async (data: CreateCategoriaData) => {
    try {
      setSubmitting(true);  // ✅ Usa submitting para operaciones CRUD
      // ❌ NO ponemos setError(null) aquí - no afectamos el error global

      const newCategoria = await categoriasService.create(data);

      // Actualizar lista local
      setCategorias(prev => [newCategoria, ...prev]);
      setTotal(prev => prev + 1);

      return newCategoria;
    } catch (error) {
      // ❌ NO ponemos setError() aquí - usamos notificaciones en el componente
      console.error('Error en createCategoria:', error);
      throw error;
    } finally {
      setSubmitting(false);  // ✅ Usa submitting
    }
  }, []);

  // Función para actualizar categoría
  const updateCategoria = useCallback(async (id: number, data: UpdateCategoriaData) => {
    try {
      setSubmitting(true);  // ✅ Usa submitting para operaciones CRUD
      // ❌ NO ponemos setError(null) aquí - no afectamos el error global

      const updatedCategoria = await categoriasService.update(id, data);

      // Actualizar lista local
      setCategorias(prev =>
        prev.map(categoria =>
          categoria.id === id ? updatedCategoria : categoria
        )
      );

      return updatedCategoria;
    } catch (error) {
      // ❌ NO ponemos setError() aquí - usamos notificaciones en el componente
      console.error('Error en updateCategoria:', error);
      throw error;
    } finally {
      setSubmitting(false);  // ✅ Usa submitting
    }
  }, []);

  // Función para eliminar categoría
  const deleteCategoria = useCallback(async (id: number) => {
    try {
      setSubmitting(true);  // ✅ Usa submitting para operaciones CRUD
      // ❌ NO ponemos setError(null) aquí - no afectamos el error global

      await categoriasService.delete(id);

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
      setCategorias(prev => prev.filter(categoria => categoria.id !== id));
      setTotal(newTotal);

      // Si cambió la página, actualizarla
      if (newPage !== page) {
        console.log(`🔄 DELETE - Navegando de página ${page} a página ${newPage}`);
        setPage(newPage);
      }

    } catch (error) {
      // ❌ NO ponemos setError() aquí - usamos notificaciones en el componente
      console.error('Error en deleteCategoria:', error);
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
    return fetchCategorias();
  }, [fetchCategorias]);

  // Cargar datos automáticamente cuando cambia página, pageSize o autoFetch
  useEffect(() => {
    if (autoFetch) {
      console.log('🔄 useEffect - Ejecutando fetch por cambio de página/pageSize:', { page, pageSize });
      fetchCategorias();
    }
  }, [autoFetch, page, pageSize, fetchCategorias]); // ✅ Incluir fetchCategorias para evitar warning

  return {
    // Estado
    categorias,
    loading,      // ✅ Solo para fetch inicial (spinner de tabla)
    submitting,   // ✅ Solo para operaciones CRUD (deshabilitar botones)
    error,
    page,
    pageSize,
    total,

    // Acciones CRUD
    createCategoria,
    updateCategoria,
    deleteCategoria,

    // Navegación
    changePage,
    changePageSize,
    refetch,
  };
};
