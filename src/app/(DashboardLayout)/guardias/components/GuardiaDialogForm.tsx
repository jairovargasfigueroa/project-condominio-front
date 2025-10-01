"use client";
import { 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Box,
  Grid,
  Typography
} from '@mui/material';
import { useState, useEffect, ChangeEvent } from 'react';
import CustomTextField from '../../components/forms/theme-elements/CustomTextField';
import { GuardiaDialogFormProps, CreateGuardiaData, UpdateGuardiaData } from '../types';

const GuardiaDialogForm  = ({ 
  open, 
  onClose, 
  mode = "create", 
  guardia, 
  onSubmit 
} : GuardiaDialogFormProps) => {
  // Estados simples para cada campo (patrón AuthLogin)
  // CAMPOS REQUERIDOS PARA CREAR
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  
  // CAMPOS OPCIONALES
  const [rol] = useState('guardia'); // Siempre fijo como "guardia"
  
  // ESTADOS PARA FOTO
  const [foto, setFoto] = useState<File | null>(null);
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);

  // Función para manejar cambio de archivo
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        alert('Por favor selecciona un archivo de imagen válido');
        return;
      }
      
      // Validar tamaño (5MB máximo)
      if (file.size > 5 * 1024 * 1024) {
        alert('El archivo es muy grande. Máximo 5MB');
        return;
      }
      
      setFoto(file);
      
      // Crear preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setFotoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Resetear cuando se abre el diálogo
  useEffect(() => {
    if (open) {
      if (mode === "edit" && guardia) {
        // Modo EDITAR - llenar con datos existentes
        setUsername(guardia.usuario.username || '');
        setEmail(guardia.usuario.email || '');
        setFirstName(guardia.usuario.first_name || '');
        setLastName(guardia.usuario.last_name || '');
        setPassword(''); // No mostrar password al editar
        // Configurar foto existente si hay
        if (guardia.usuario.foto_perfil_url) {
          setFotoPreview(guardia.usuario.foto_perfil_url);
        } else {
          setFotoPreview(null);
        }
        setFoto(null); // No hay archivo nuevo
      } else {
        // Modo CREAR - formulario vacío
        setUsername('');
        setEmail('');
        setFirstName('');
        setLastName('');
        setPassword('');
        setFoto(null);
        setFotoPreview(null);
      }
    }
  }, [open, mode, guardia]);

  // Submit - DEVOLVER DATOS AL PADRE con tipos
  const handleSubmit = (): void => {
    if (mode === "edit") {
      // Para EDITAR solo validar campos editables
      if (!firstName || !lastName || !email) {
        alert('Por favor completa los campos requeridos: Nombre, Apellido y Email');
        return;
      }

      // Si hay foto, usar FormData
      if (foto) {
        console.log('📎 Enviando con FormData (archivo presente)');
        console.log('🖼️ Archivo detectado:', foto.name, foto.type, foto.size);
        const formData = new FormData();
        
        // Campos de usuario con formato plano
        formData.append('usuario_first_name', firstName);
        formData.append('usuario_last_name', lastName);
        formData.append('usuario_email', email);
        
        // Archivo
        formData.append('usuario_foto_perfil', foto);
        console.log('📁 Archivo agregado a FormData:', foto instanceof File);
        
        // Debug: verificar contenido de FormData
        console.log('🔍 Contenido de FormData:');
        for (let [key, value] of formData.entries()) {
          console.log(`  ${key}:`, value instanceof File ? `[File: ${value.name}]` : value);
        }
        
        console.log('📤 Enviando FormData con archivo - formato plano');
        onSubmit(formData);
        return;
      }

      // Sin foto, usar JSON normal
      const submitData: UpdateGuardiaData = {
        usuario: {
          first_name: firstName,
          last_name: lastName,
          email
        }
      };

      onSubmit(submitData);
    } else {
      // Para CREAR validar todos los campos requeridos
      if (!username || !email || !password || !firstName || !lastName) {
        alert('Por favor completa los campos requeridos: Usuario, Email, Contraseña, Nombre y Apellido');
        return;
      }

      // Si hay foto, usar FormData
      if (foto) {
        console.log('📎 Enviando con FormData (archivo presente)');
        console.log('🖼️ Archivo detectado:', foto.name, foto.type, foto.size);
        const formData = new FormData();
        
        // Campos de usuario con formato plano
        formData.append('usuario_username', username);
        formData.append('usuario_email', email);
        formData.append('usuario_password', password);
        formData.append('usuario_first_name', firstName);
        formData.append('usuario_last_name', lastName);
        formData.append('usuario_rol', rol);
        
        // Archivo
        formData.append('usuario_foto_perfil', foto);
        console.log('📁 Archivo agregado a FormData:', foto instanceof File);
        
        // Debug: verificar contenido de FormData
        console.log('🔍 Contenido de FormData:');
        for (let [key, value] of formData.entries()) {
          console.log(`  ${key}:`, value instanceof File ? `[File: ${value.name}]` : value);
        }
        
        console.log('📤 Enviando FormData con archivo - formato plano');
        onSubmit(formData);
        return;
      }

      // Sin foto, usar JSON normal
      const submitData: CreateGuardiaData = {
        usuario: {
          username,
          email,
          password,
          first_name: firstName,
          last_name: lastName,
          rol
        }
      };

      onSubmit(submitData);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {mode === "edit" ? 'Editar Guardia' : 'Nuevo Guardia'}
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Grid container spacing={3}>
            
            {/* Sección Usuario */}
            <Grid size={12}>
              <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                Datos del Usuario
              </Typography>
            </Grid>

            {/* CAMPOS REQUERIDOS PARA CREAR */}
            {mode === "create" && (
              <>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                    Nombre de Usuario *
                  </Typography>
                  <CustomTextField
                    fullWidth
                    placeholder="Ingrese el nombre de usuario"
                    value={username}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
                    size="small"
                    required
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                    Contraseña *
                  </Typography>
                  <CustomTextField
                    fullWidth
                    type="password"
                    placeholder="Ingrese la contraseña"
                    value={password}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                    size="small"
                    required
                  />
                </Grid>
              </>
            )}

            {/* CAMPOS EDITABLES (CREAR y EDITAR) */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                Nombre *
              </Typography>
              <CustomTextField
                fullWidth
                placeholder="Ingrese el nombre"
                value={firstName}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setFirstName(e.target.value)}
                size="small"
                required
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                Apellido *
              </Typography>
              <CustomTextField
                fullWidth
                placeholder="Ingrese el apellido"
                value={lastName}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setLastName(e.target.value)}
                size="small"
                required
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                Email *
              </Typography>
              <CustomTextField
                fullWidth
                type="email"
                placeholder="ejemplo@correo.com"
                value={email}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                size="small"
                required
              />
            </Grid>

            {/* Mostrar username solo en modo editar (solo lectura) */}
            {mode === "edit" && (
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                  Usuario (solo lectura)
                </Typography>
                <CustomTextField
                  fullWidth
                  value={username}
                  size="small"
                  disabled
                  sx={{ backgroundColor: 'grey.100' }}
                />
              </Grid>
            )}

            {/* Sección Rol */}
            <Grid size={12}>
              <Typography variant="h6" sx={{ mb: 2, mt: 2, color: 'primary.main' }}>
                Información del Rol
              </Typography>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                Rol (fijo)
              </Typography>
              <CustomTextField
                fullWidth
                value={rol}
                size="small"
                disabled
                sx={{ backgroundColor: 'grey.100' }}
              />
            </Grid>

            {/* Foto de Perfil */}
            <Grid size={12}>
              <Typography variant="h6" sx={{ mb: 2, mt: 2, color: 'primary.main' }}>
                Foto de Perfil
              </Typography>
            </Grid>

            <Grid size={12}>
              <Button
                variant="outlined"
                component="label"
                fullWidth
                sx={{ mb: 2 }}
              >
                Seleccionar Foto
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </Button>
              
              {fotoPreview && (
                <Box sx={{ textAlign: 'center', mb: 2 }}>
                  <img
                    src={fotoPreview}
                    alt="Preview"
                    style={{
                      maxWidth: '150px',
                      maxHeight: '150px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                      border: '1px solid #ddd'
                    }}
                  />
                  <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                    {foto ? `Archivo: ${foto.name}` : 'Foto actual'}
                  </Typography>
                </Box>
              )}
            </Grid>
            
          </Grid>
        </Box>
      </DialogContent>
      
      <DialogActions>
        <Button color="error" onClick={onClose}>
          Cancelar
        </Button>
        <Button onClick={handleSubmit}>
          {mode === "edit" ? 'Actualizar' : 'Crear Guardia'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GuardiaDialogForm;
