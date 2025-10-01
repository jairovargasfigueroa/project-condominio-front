import { apiClient } from '@/services/api';
import { CreateResidenteData, UpdateResidenteData } from '../types';

// Servicios específicos para la gestión de residentes
export const residentesService = {
  // Obtener todos los residentes con paginación
  getAll: async (page: number = 1, page_size: number = 10) => {
    try {
      console.log('🔍 GET - Parámetros:', { page, page_size });
      const response = await apiClient.get(`/residentes/?page=${page}&page_size=${page_size}`);
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

  // Obtener un residente por ID
  getById: async (id: string) => {
    try {
      console.log(`🔍 GET BY ID - ID: ${id}`);
      const response = await apiClient.get(`/residentes/${id}`);
      console.log(`✅ GET BY ID - Residente:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`❌ ERROR GET BY ID ${id}:`, error);
      throw error;
    }
  },

  // Crear un nuevo residente
  create: async (residenteData: CreateResidenteData | FormData) => {
    try {
      console.log('🚀 CREATE - Datos enviados:', residenteData);
      console.log('🔍 Tipo de datos recibidos:', residenteData instanceof FormData ? 'FormData' : 'Object');
      
      // Si recibimos FormData directamente, enviarlo
      if (residenteData instanceof FormData) {
        console.log("📤 Recibiendo FormData directamente del formulario");
        
        // Debug: ver contenido de FormData
        console.log('🔍 Contenido de FormData en servicio:');
        for (let [key, value] of residenteData.entries()) {
          console.log(`  ${key}:`, value instanceof File ? `[File: ${value.name}, ${value.size} bytes]` : value);
        }
        
        // IMPORTANTE: No poner Content-Type, dejarlo que axios lo detecte automáticamente
        const response = await apiClient.post('/residentes/', residenteData, {
          headers: {
            'Content-Type': undefined // Quitar el Content-Type para que axios detecte FormData
          }
        });
        console.log('✅ CREATE - Residente creado con FormData:', response.data);
        return response.data;
      }
      
      // Si recibimos objeto JavaScript, verificar si hay foto
      const hasValidFile = residenteData.usuario.foto_perfil && 
                           residenteData.usuario.foto_perfil instanceof File;
      
      if (hasValidFile) {
        console.log("Tiene foto válida - Convirtiendo a FormData con formato plano");
        const formData = new FormData();
        
        // Campos del usuario con prefijo usuario_ (PLANOS)
        formData.append('usuario_username', residenteData.usuario.username);
        formData.append('usuario_email', residenteData.usuario.email);
        formData.append('usuario_password', residenteData.usuario.password);
        
        // Agregar campos opcionales solo si existen
        if (residenteData.usuario.first_name) {
          formData.append('usuario_first_name', residenteData.usuario.first_name);
        }
        if (residenteData.usuario.last_name) {
          formData.append('usuario_last_name', residenteData.usuario.last_name);
        }
        if (residenteData.usuario.telefono) {
          formData.append('usuario_telefono', residenteData.usuario.telefono);
        }
        
        // Foto del usuario (ya validamos que es un File)
        formData.append('usuario_foto_perfil', residenteData.usuario.foto_perfil as File);
        
        // Campos del residente
        formData.append('zona', residenteData.zona);
        
        console.log('📎 FormData creado con foto - formato plano');
        const response = await apiClient.post('/residentes/', formData, {
          headers: {
            'Content-Type': undefined // Quitar el Content-Type para que axios detecte FormData
          }
        });
        console.log('✅ CREATE - Residente creado con foto:', response.data);
        return response.data;
      } else {
        // Sin foto válida, enviar como JSON normal
        console.log("Sin foto válida - Usando JSON");
        const { foto_perfil, ...usuarioWithoutFile } = residenteData.usuario;
        const dataWithoutFile = {
          usuario: usuarioWithoutFile,
          zona: residenteData.zona
        };
        const response = await apiClient.post('/residentes/', dataWithoutFile);
        console.log('✅ CREATE - Residente creado sin foto:', response.data);
        return response.data;
      }
    } catch (error) {
      console.error('❌ ERROR CREATE:', error);
      throw error;
    }
  },

  // Actualizar un residente existente
  update: async (id: string, residenteData: UpdateResidenteData | FormData) => {
    try {
      console.log(`🔄 UPDATE - ID: ${id}, Datos:`, residenteData);
      console.log('🔍 Tipo de datos recibidos en update:', residenteData instanceof FormData ? 'FormData' : 'Object');
      
      // Si recibimos FormData directamente, enviarlo
      if (residenteData instanceof FormData) {
        console.log("📤 UPDATE - Recibiendo FormData directamente del formulario");
        
        // Debug: ver contenido de FormData
        console.log('🔍 Contenido de FormData en update:');
        for (let [key, value] of residenteData.entries()) {
          console.log(`  ${key}:`, value instanceof File ? `[File: ${value.name}, ${value.size} bytes]` : value);
        }
        
        // IMPORTANTE: No poner Content-Type, dejarlo que axios lo detecte automáticamente
        const response = await apiClient.patch(`/residentes/${id}/`, residenteData, {
          headers: {
            'Content-Type': undefined // Quitar el Content-Type para que axios detecte FormData
          }
        });
        console.log('✅ UPDATE - Residente actualizado con FormData:', response.data);
        return response.data;
      }
      
      // Verificar si hay una foto válida (debe ser un archivo File)
      const hasValidFile = residenteData.usuario?.foto_perfil && 
                           residenteData.usuario.foto_perfil instanceof File;
      
      if (hasValidFile) {
        console.log("Actualizando con foto válida - Usando FormData");
        const formData = new FormData();
        
        // Campos del usuario con prefijo usuario_ (solo los que se van a actualizar)
        if (residenteData.usuario) {
          if (residenteData.usuario.username) {
            formData.append('usuario_username', residenteData.usuario.username);
          }
          if (residenteData.usuario.email) {
            formData.append('usuario_email', residenteData.usuario.email);
          }
          if (residenteData.usuario.first_name) {
            formData.append('usuario_first_name', residenteData.usuario.first_name);
          }
          if (residenteData.usuario.last_name) {
            formData.append('usuario_last_name', residenteData.usuario.last_name);
          }
          if (residenteData.usuario.telefono) {
            formData.append('usuario_telefono', residenteData.usuario.telefono);
          }
          
          // Nueva foto (ya validamos que es un File)
          formData.append('usuario_foto_perfil', residenteData.usuario.foto_perfil as File);
        }
        
        // Campos del residente
        if (residenteData.zona) formData.append('zona', residenteData.zona);
        if (residenteData.activo !== undefined) formData.append('activo', residenteData.activo.toString());
        if (residenteData.observaciones) formData.append('observaciones', residenteData.observaciones);
        
        console.log('📎 FormData creado con foto para actualización');
        const response = await apiClient.patch(`/residentes/${id}/`, formData, {
          headers: {
            'Content-Type': undefined // Quitar el Content-Type para que axios detecte FormData
          }
        });
        console.log(`✅ UPDATE - Residente actualizado con foto:`, response.data);
        return response.data;
      } else {
        // Sin foto válida, enviar como JSON normal
        console.log("Sin foto válida - Usando JSON para actualización");
        let dataWithoutFile = { ...residenteData };
        if (residenteData.usuario?.foto_perfil) {
          const { foto_perfil, ...usuarioWithoutFile } = residenteData.usuario;
          dataWithoutFile = {
            ...residenteData,
            usuario: usuarioWithoutFile
          };
        }
        const response = await apiClient.patch(`/residentes/${id}/`, dataWithoutFile);
        console.log(`✅ UPDATE - Residente actualizado sin foto:`, response.data);
        return response.data;
      }
    } catch (error) {
      console.error(`❌ ERROR UPDATE ${id}:`, error);
      throw error;
    }
  },

  // Eliminar un residente
  delete: async (id: string) => {
    try {
      console.log(`🗑️ DELETE - ID: ${id}`);
      const response = await apiClient.delete(`/residentes/${id}/`);
      console.log(`✅ DELETE - Residente eliminado`);
      return response.data;
    } catch (error) {
      console.error(`❌ ERROR DELETE ${id}:`, error);
      throw error;
    }
  },
};