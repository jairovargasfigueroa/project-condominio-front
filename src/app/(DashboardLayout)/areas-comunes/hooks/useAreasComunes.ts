import { useState, useCallback, useEffect } from 'react';
import { areasComunesService } from '../services';
import { AreaComun, CreateAreaComunData, UpdateAreaComunData } from '../types';

export function useAreasComunes() {
  // ✅ Estados principales
  const [areasComunes, setAreasComunes] = useState<AreaComun[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // ✅ Estados de paginación
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  // ✅ FETCH INICIAL Y REFETCH
  const fetchAreasComunes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await areasComunesService.getAll(page, pageSize);
      
      if (response.success) {
        setAreasComunes(response.data);
        setTotal(response.total_items);
      } else {
        setError('Error al cargar las areas comunes');
        setAreasComunes([]);
        setTotal(0);
      }
    } catch (error) {
      console.error('Error al obtener areas comunes:', error);
      setError('Error al cargar las areas comunes');
      setAreasComunes([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize]);

  // ✅ REFETCH MANUAL (para después de crear/editar)
  const refetch = useCallback(async () => {
    await fetchAreasComunes();
  }, [fetchAreasComunes]);

  // ✅ CREAR AREA COMUN
  const createAreaComun = useCallback(async (data: CreateAreaComunData) => {
    setSubmitting(true);
    try {
      const response = await areasComunesService.create(data);
      if (response.success) {
        console.log('✅ HOOK - Area Comun creada exitosamente');
        // No actualizar lista aquí, se hará desde el componente con refetch()
      }
    } catch (error) {
      console.error('❌ HOOK - Error al crear area comun:', error);
      throw error; // Re-throw para que el componente lo maneje
    } finally {
      setSubmitting(false);
    }
  }, []);

  // ✅ ACTUALIZAR AREA COMUN
  const updateAreaComun = useCallback(async (id: string, data: UpdateAreaComunData) => {
    setSubmitting(true);
    try {
      const response = await areasComunesService.update(id, data);
      if (response.success) {
        console.log('✅ HOOK - Area Comun actualizada exitosamente');
        // No actualizar lista aquí, se hará desde el componente con refetch()
      }
    } catch (error) {
      console.error('❌ HOOK - Error al actualizar area comun:', error);
      throw error; // Re-throw para que el componente lo maneje
    } finally {
      setSubmitting(false);
    }
  }, []);

  // ✅ ELIMINAR AREA COMUN (con navegación de páginas)
  const deleteAreaComun = useCallback(async (id: string) => {
    setSubmitting(true);
    try {
      await areasComunesService.delete(id);
      console.log('✅ HOOK - Area Comun eliminada exitosamente');
      
      // ✅ LÓGICA DE NAVEGACIÓN DE PÁGINAS
      const newTotal = total - 1;
      const maxPage = Math.max(1, Math.ceil(newTotal / pageSize));
      
      if (page > maxPage) {
        // Si estamos en una página que ya no existe, ir a la última página válida
        console.log(`📄 Navegando de página ${page} a ${maxPage}`);
        setPage(maxPage);
      } else {
        // Mantener la página actual y refrescar
        await fetchAreasComunes();
      }
    } catch (error) {
      console.error('❌ HOOK - Error al eliminar area comun:', error);
      throw error; // Re-throw para que el componente lo maneje
    } finally {
      setSubmitting(false);
    }
  }, [total, pageSize, page, fetchAreasComunes]);

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
    fetchAreasComunes();
  }, [fetchAreasComunes]);

  return {
    // Datos
    areasComunes,
    loading,
    submitting,
    error,
    
    // Paginación
    page,
    pageSize,
    total,
    
    // Actions
    createAreaComun,
    updateAreaComun,
    deleteAreaComun,
    refetch,
    changePage,
    changePageSize,
  };
}