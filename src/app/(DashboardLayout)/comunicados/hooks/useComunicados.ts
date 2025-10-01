import { useState, useCallback, useEffect } from 'react';
import { comunicadosService } from '../services';
import { Comunicado, CreateComunicadoData, UpdateComunicadoData } from '../types';

export function useComunicados() {
  // ✅ Estados principales
  const [comunicados, setComunicados] = useState<Comunicado[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // ✅ Estados de paginación
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  // ✅ FETCH INICIAL Y REFETCH
  const fetchComunicados = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await comunicadosService.getAll(page, pageSize);
      
      if (response.success) {
        setComunicados(response.data);
        setTotal(response.total_items);
      } else {
        setError('Error al cargar los comunicados');
        setComunicados([]);
        setTotal(0);
      }
    } catch (error) {
      console.error('Error al obtener comunicados:', error);
      setError('Error al cargar los comunicados');
      setComunicados([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize]);

  // ✅ REFETCH MANUAL (para después de crear/editar)
  const refetch = useCallback(async () => {
    await fetchComunicados();
  }, [fetchComunicados]);

  // ✅ CREAR COMUNICADO
  const createComunicado = useCallback(async (data: CreateComunicadoData) => {
    setSubmitting(true);
    try {
      const response = await comunicadosService.create(data);
      if (response.success) {
        console.log('✅ HOOK - Comunicado creado exitosamente');
        // No actualizar lista aquí, se hará desde el componente con refetch()
      }
    } catch (error) {
      console.error('❌ HOOK - Error al crear comunicado:', error);
      throw error; // Re-throw para que el componente lo maneje
    } finally {
      setSubmitting(false);
    }
  }, []);

  // ✅ ACTUALIZAR COMUNICADO
  const updateComunicado = useCallback(async (id: string, data: UpdateComunicadoData) => {
    setSubmitting(true);
    try {
      const response = await comunicadosService.update(id, data);
      if (response.success) {
        console.log('✅ HOOK - Comunicado actualizado exitosamente');
        // No actualizar lista aquí, se hará desde el componente con refetch()
      }
    } catch (error) {
      console.error('❌ HOOK - Error al actualizar comunicado:', error);
      throw error; // Re-throw para que el componente lo maneje
    } finally {
      setSubmitting(false);
    }
  }, []);

  // ✅ ELIMINAR COMUNICADO (con navegación de páginas)
  const deleteComunicado = useCallback(async (id: string) => {
    setSubmitting(true);
    try {
      await comunicadosService.delete(id);
      console.log('✅ HOOK - Comunicado eliminado exitosamente');
      
      // ✅ LÓGICA DE NAVEGACIÓN DE PÁGINAS
      const newTotal = total - 1;
      const maxPage = Math.max(1, Math.ceil(newTotal / pageSize));
      
      if (page > maxPage) {
        // Si estamos en una página que ya no existe, ir a la última página válida
        console.log(`📄 Navegando de página ${page} a ${maxPage}`);
        setPage(maxPage);
      } else {
        // Mantener la página actual y refrescar
        await fetchComunicados();
      }
    } catch (error) {
      console.error('❌ HOOK - Error al eliminar comunicado:', error);
      throw error; // Re-throw para que el componente lo maneje
    } finally {
      setSubmitting(false);
    }
  }, [total, pageSize, page, fetchComunicados]);

  // ✅ CAMBIAR PÁGINA
  const changePage = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  // ✅ CAMBIAR TAMAÑO DE PÁGINA
  const changePageSize = useCallback((newPageSize: number) => {
    setPageSize(newPageSize);
    setPage(1); // Resetear a la primera página
  }, []);

  // ✅ EFFECT PARA CARGAR DATOS INICIALES Y CUANDO CAMBIE LA PÁGINA
  useEffect(() => {
    fetchComunicados();
  }, [fetchComunicados]);

  return {
    // Datos
    comunicados,
    loading,
    submitting,
    error,
    
    // Paginación
    page,
    pageSize,
    total,
    
    // Actions
    createComunicado,
    updateComunicado,
    deleteComunicado,
    refetch,
    changePage,
    changePageSize,
  };
}