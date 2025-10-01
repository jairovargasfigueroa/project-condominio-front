import { apiClient } from '@/services/api';
import {
  CreateGuardiaData,
  UpdateGuardiaData
} from '../types';

// Servicios específicos para la gestión de guardias
export const guardiasService = {
  // Obtener todas las guardias con paginación
  getAll: async (page: number = 1, page_size: number = 10) => {
    try {
      console.log('🔍 GET - Parámetros:', { page, page_size });
      const response = await apiClient.get(`/guardias/?page=${page}&page_size=${page_size}`);
      console.log('✅ GET - Respuesta completa:', response.data);
      console.log('📊 GET - Estructura:', {
        total: response.data?.total_items || 'No definido',
        currentPage: page,
        items: response.data?.data?.length || 0
      });
      return response.data;
    } catch (error) {
      console.error('❌ ERROR GET:', error);
      throw error;
    }
  },

  // Obtener un guardia por ID
  getById: async (id: string) => {
    try {
      console.log(`🔍 GET BY ID - ID: ${id}`);
      const response = await apiClient.get(`/guardias/${id}/`);
      console.log(`✅ GET BY ID - Guardia:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`❌ ERROR GET BY ID ${id}:`, error);
      throw error;
    }
  },

  // Crear un nuevo guardia
  create: async (guardiaData: CreateGuardiaData | FormData) => {
    try {
      console.log('🚀 CREATE - Datos enviados:', guardiaData);
      
      // Si recibimos FormData directamente, enviarlo
      if (guardiaData instanceof FormData) {
        console.log("📤 Recibiendo FormData directamente del formulario");
        
        // Debug: ver contenido de FormData
        console.log('🔍 Contenido de FormData en servicio:');
        for (let [key, value] of guardiaData.entries()) {
          console.log(`  ${key}:`, value instanceof File ? `[File: ${value.name}, ${value.size} bytes]` : value);
        }
        
        const response = await apiClient.post('/guardias/', guardiaData, {
          headers: {
            'Content-Type': undefined // Quitar el Content-Type para que axios detecte FormData
          }
        });
        console.log('✅ CREATE - Guardia creado con FormData:', response.data);
        return response.data;
      }
      
      // Si recibimos objeto JavaScript, verificar si hay foto
      const hasValidFile = guardiaData.usuario.foto_perfil && 
                           guardiaData.usuario.foto_perfil instanceof File;
      
      if (hasValidFile) {
        console.log("Tiene foto válida - Convirtiendo a FormData con formato plano");
        const formData = new FormData();
        
        // Campos del usuario con prefijo usuario_ (PLANOS)
        formData.append('usuario_username', guardiaData.usuario.username);
        formData.append('usuario_email', guardiaData.usuario.email);
        formData.append('usuario_password', guardiaData.usuario.password);
        formData.append('usuario_first_name', guardiaData.usuario.first_name);
        formData.append('usuario_last_name', guardiaData.usuario.last_name);
        formData.append('usuario_rol', guardiaData.usuario.rol);
        
        // Foto del usuario (ya validamos que es un File)
        formData.append('usuario_foto_perfil', guardiaData.usuario.foto_perfil as File);
        
        console.log('📎 FormData creado con foto - formato plano');
        const response = await apiClient.post('/guardias/', formData, {
          headers: {
            'Content-Type': undefined // Quitar el Content-Type para que axios detecte FormData
          }
        });
        console.log('✅ CREATE - Guardia creado con foto:', response.data);
        return response.data;
      } else {
        // Sin foto válida, enviar como JSON normal
        console.log("Sin foto válida - Usando JSON");
        const { foto_perfil, ...usuarioWithoutFile } = guardiaData.usuario;
        const dataWithoutFile = {
          usuario: usuarioWithoutFile
        };
        const response = await apiClient.post('/guardias/', dataWithoutFile);
        console.log('✅ CREATE - Guardia creado sin foto:', response.data);
        return response.data;
      }
    } catch (error) {
      console.error('❌ ERROR CREATE:', error);
      throw error;
    }
  },

  // Actualizar un guardia existente
  update: async (id: string, guardiaData: UpdateGuardiaData | FormData) => {
    try {
      console.log(`🔄 UPDATE - ID: ${id}, Datos:`, guardiaData);
      
      // Si recibimos FormData directamente, enviarlo
      if (guardiaData instanceof FormData) {
        console.log("📤 Recibiendo FormData directamente del formulario para actualización");
        
        const response = await apiClient.put(`/guardias/${id}/`, guardiaData, {
          headers: {
            'Content-Type': undefined // Quitar el Content-Type para que axios detecte FormData
          }
        });
        console.log('✅ UPDATE - Guardia actualizado con FormData:', response.data);
        return response.data;
      }
      
      // Verificar si hay una foto válida (debe ser un archivo File)
      const hasValidFile = guardiaData.usuario?.foto_perfil && 
                           guardiaData.usuario.foto_perfil instanceof File;
      
      if (hasValidFile) {
        console.log("Actualizando con foto válida - Usando FormData");
        const formData = new FormData();
        
        // Campos del usuario con prefijo usuario_ (solo los que se van a actualizar)
        if (guardiaData.usuario.first_name) {
          formData.append('usuario_first_name', guardiaData.usuario.first_name);
        }
        if (guardiaData.usuario.last_name) {
          formData.append('usuario_last_name', guardiaData.usuario.last_name);
        }
        if (guardiaData.usuario.email) {
          formData.append('usuario_email', guardiaData.usuario.email);
        }
        
        // Nueva foto (ya validamos que es un File)
        formData.append('usuario_foto_perfil', guardiaData.usuario.foto_perfil as File);
        
        console.log('📎 FormData creado con foto para actualización');
        const response = await apiClient.patch(`/guardias/${id}/`, formData, {
          headers: {
            'Content-Type': undefined // Quitar el Content-Type para que axios detecte FormData
          }
        });
        console.log(`✅ UPDATE - Guardia actualizado con foto:`, response.data);
        return response.data;
      } else {
        // Sin foto válida, enviar como JSON normal
        console.log("Sin foto válida - Usando JSON para actualización");
        let dataWithoutFile = { ...guardiaData };
        if (guardiaData.usuario?.foto_perfil) {
          const { foto_perfil, ...usuarioWithoutFile } = guardiaData.usuario;
          dataWithoutFile = {
            ...guardiaData,
            usuario: usuarioWithoutFile
          };
        }
        const response = await apiClient.patch(`/guardias/${id}/`, dataWithoutFile);
        console.log(`✅ UPDATE - Guardia actualizado sin foto:`, response.data);
        return response.data;
      }
    } catch (error) {
      console.error(`❌ ERROR UPDATE ${id}:`, error);
      throw error;
    }
  },

  // Eliminar un guardia
  delete: async (id: string) => {
    try {
      console.log(`🗑️ DELETE - ID: ${id}`);
      const response = await apiClient.delete(`/guardias/${id}/`);
      console.log(`✅ DELETE - Guardia eliminado`);
      return response.data;
    } catch (error) {
      console.error(`❌ ERROR DELETE ${id}:`, error);
      throw error;
    }
  },
};
