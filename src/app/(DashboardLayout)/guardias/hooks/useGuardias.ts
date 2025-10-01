import { useState, useCallback, useEffect } from 'react';
import { guardiasService } from '../services';
import { Guardia, CreateGuardiaData, UpdateGuardiaData } from '../types';

export function useGuardias() {
  // ✅ Estados principales
  const [guardias, setGuardias] = useState<Guardia[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // ✅ Estados de paginación
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  // ✅ FETCH INICIAL Y REFETCH
  const fetchGuardias = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await guardiasService.getAll(page, pageSize);
      
      if (response.success) {
        setGuardias(response.data);
        setTotal(response.total_items);
      } else {
        setError('Error al cargar los guardias');
        setGuardias([]);
        setTotal(0);
      }
    } catch (error) {
      console.error('Error al obtener guardias:', error);
      setError('Error al cargar los guardias');
      setGuardias([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize]);

  // ✅ REFETCH MANUAL (para después de crear/editar)
  const refetch = useCallback(async () => {
    await fetchGuardias();
  }, [fetchGuardias]);

  // ✅ CREAR GUARDIA
  const createGuardia = useCallback(async (data: CreateGuardiaData | FormData) => {
    setSubmitting(true);
    try {
      const response = await guardiasService.create(data);
      if (response.success) {
        console.log('✅ HOOK - Guardia creado exitosamente');
        // No actualizar lista aquí, se hará desde el componente con refetch()
      }
    } catch (error) {
      console.error('❌ HOOK - Error al crear guardia:', error);
      throw error; // Re-throw para que el componente lo maneje
    } finally {
      setSubmitting(false);
    }
  }, []);

  // ✅ ACTUALIZAR GUARDIA
  const updateGuardia = useCallback(async (id: string, data: UpdateGuardiaData | FormData) => {
    setSubmitting(true);
    try {
      const response = await guardiasService.update(id, data);
      if (response.success) {
        console.log('✅ HOOK - Guardia actualizado exitosamente');
        // No actualizar lista aquí, se hará desde el componente con refetch()
      }
    } catch (error) {
      console.error('❌ HOOK - Error al actualizar guardia:', error);
      throw error; // Re-throw para que el componente lo maneje
    } finally {
      setSubmitting(false);
    }
  }, []);

  // ✅ ELIMINAR GUARDIA (con navegación de páginas)
  const deleteGuardia = useCallback(async (id: string) => {
    setSubmitting(true);
    try {
      await guardiasService.delete(id);
      console.log('✅ HOOK - Guardia eliminado exitosamente');
      
      // ✅ LÓGICA DE NAVEGACIÓN DE PÁGINAS
      const newTotal = total - 1;
      const maxPage = Math.max(1, Math.ceil(newTotal / pageSize));
      
      if (page > maxPage) {
        // Si estamos en una página que ya no existe, ir a la última página válida
        console.log(`📄 Navegando de página ${page} a ${maxPage}`);
        setPage(maxPage);
      } else {
        // Mantener la página actual y refrescar
        await fetchGuardias();
      }
    } catch (error) {
      console.error('❌ HOOK - Error al eliminar guardia:', error);
      throw error; // Re-throw para que el componente lo maneje
    } finally {
      setSubmitting(false);
    }
  }, [total, pageSize, page, fetchGuardias]);

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
    fetchGuardias();
  }, [fetchGuardias]);

  return {
    // Datos
    guardias,
    loading,
    submitting,
    error,
    
    // Paginación
    page,
    pageSize,
    total,
    
    // Actions
    createGuardia,
    updateGuardia,
    deleteGuardia,
    refetch,
    changePage,
    changePageSize,
  };
}
