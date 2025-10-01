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
import { ResidenteDialogFormProps, CreateResidenteData, UpdateResidenteData } from '../types';

const ResidenteDialogForm  = ({ 
  open, 
  onClose, 
  mode = "create", 
  residente, 
  onSubmit 
} : ResidenteDialogFormProps) => {
  // Estados simples para cada campo (patrón AuthLogin)
  // CAMPOS REQUERIDOS
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [zona, setZona] = useState('');
  
  // CAMPOS OPCIONALES
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [telefono, setTelefono] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [viviendaId, setViviendaId] = useState<string>('');
  const [fotoPerfil, setFotoPerfil] = useState<File | null>(null);
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);

  // Resetear cuando se abre el diálogo
  useEffect(() => {
    if (open) {
      if (mode === "edit" && residente) {
        // Modo EDITAR - llenar con datos existentes
        setUsername(residente.usuario.username || '');
        setEmail(residente.usuario.email || '');
        setFirstName(residente.usuario.first_name || '');
        setLastName(residente.usuario.last_name || '');
        setTelefono(residente.usuario.telefono || '');
        setPassword(''); // No mostrar password al editar
        setZona(residente.zona || '');
        setObservaciones(residente.observaciones || '');
        setViviendaId(residente.vivienda?.id || '');
        setFotoPerfil(null);
        setFotoPreview(residente.usuario.foto_perfil_url || null);
      } else {
        // Modo CREAR - formulario vacío
        setUsername('');
        setEmail('');
        setFirstName('');
        setLastName('');
        setTelefono('');
        setPassword('');
        setZona('');
        setObservaciones('');
        setViviendaId('');
        setFotoPerfil(null);
        setFotoPreview(null);
      }
    }
  }, [open, mode, residente]);

  // Manejar selección de archivo de foto
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        alert('Por favor selecciona un archivo de imagen válido');
        event.target.value = ''; // Limpiar input
        return;
      }
      
      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('El archivo es demasiado grande. Máximo 5MB permitido');
        event.target.value = ''; // Limpiar input
        return;
      }
      
      console.log('📎 Archivo seleccionado:', file.name, 'Tipo:', file.type, 'Tamaño:', file.size);
      setFotoPerfil(file);
      
      // Crear preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setFotoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      // Si no hay archivo, limpiar estado
      console.log('🗑️ No hay archivo seleccionado, limpiando estado');
      setFotoPerfil(null);
      setFotoPreview(null);
    }
  };

  // Submit - DEVOLVER DATOS AL PADRE con tipos
  const handleSubmit = (): void => {
    // Validación básica - diferentes para crear vs editar
    if (mode === "create") {
      // Para CREAR: username, email, password y zona son requeridos
      if (!username || !email || !password || !zona) {
        alert('Por favor completa los campos requeridos: Usuario, Email, Contraseña y Zona');
        return;
      }
    } else {
      // Para EDITAR: solo email y zona son requeridos
      if (!email || !zona) {
        alert('Por favor completa los campos requeridos: Email y Zona');
        return;
      }
    }

    // Si hay archivo, crear FormData directamente
    if (fotoPerfil && fotoPerfil instanceof File) {
      console.log('📎 Enviando con FormData (archivo presente)');
      console.log('🖼️ Archivo detectado:', fotoPerfil.name, fotoPerfil.type, fotoPerfil.size);
      const formData = new FormData();
      
      // Campos del usuario con prefijo usuario_ (PLANOS)
      formData.append('usuario_username', username);
      formData.append('usuario_email', email);
      if (mode === "create") {
        formData.append('usuario_password', password);
      }
      
      // Campos opcionales del usuario
      if (firstName) formData.append('usuario_first_name', firstName);
      if (lastName) formData.append('usuario_last_name', lastName);
      if (telefono) formData.append('usuario_telefono', telefono);
      
      // Archivo de foto
      formData.append('usuario_foto_perfil', fotoPerfil);
      console.log('📁 Archivo agregado a FormData:', fotoPerfil instanceof File);
      
      // Campos del residente
      formData.append('zona', zona);
      if (viviendaId) formData.append('vivienda_id', viviendaId);
      if (observaciones) formData.append('observaciones', observaciones);
      
      // Debug: verificar contenido de FormData
      console.log('🔍 Contenido de FormData:');
      for (let [key, value] of formData.entries()) {
        console.log(`  ${key}:`, value instanceof File ? `[File: ${value.name}]` : value);
      }
      
      console.log('📤 Enviando FormData con archivo - formato plano');
      onSubmit(formData);
      return;
    }

    // Sin archivo, enviar objeto JSON normal
    // console.log('📄 Enviando JSON (sin archivo)');
    // const submitData: CreateResidenteData | UpdateResidenteData = mode === "edit" 
    //   ? {
    //       // Datos para actualizar (sin password)
    //       usuario: {
    //         username,
    //         email,
    //         ...(firstName && { first_name: firstName }),
    //         ...(lastName && { last_name: lastName }),
    //         ...(telefono && { telefono: telefono })
    //       },
    //       zona,
    //       ...(viviendaId && { vivienda_id: viviendaId }),
    //       ...(observaciones && { observaciones: observaciones })
    //     } as UpdateResidenteData
    //   : {
    //       // Datos para crear
    //       usuario: {
    //         username,
    //         email,
    //         password,
    //         ...(firstName && { first_name: firstName }),
    //         ...(lastName && { last_name: lastName }),
    //         ...(telefono && { telefono: telefono })
    //       },
    //       zona,
    //       ...(viviendaId && { vivienda_id: viviendaId })
    //     } as CreateResidenteData;

    // console.log('� Enviando JSON sin archivo');
    // onSubmit(submitData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {mode === "edit" ? 'Editar Residente' : 'Nuevo Residente'}
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

            {/* CAMPOS REQUERIDOS */}
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

            {/* CAMPOS OPCIONALES DE NOMBRE */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                Nombre (opcional)
              </Typography>
              <CustomTextField
                fullWidth
                placeholder="Ingrese el nombre"
                value={firstName}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setFirstName(e.target.value)}
                size="small"
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                Apellido (opcional)
              </Typography>
              <CustomTextField
                fullWidth
                placeholder="Ingrese el apellido"
                value={lastName}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setLastName(e.target.value)}
                size="small"
              />
            </Grid>

            {/* Password solo para crear nuevos - REQUERIDO */}
           
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
            

            {/* CAMPO OPCIONAL */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                Teléfono (opcional)
              </Typography>
              <CustomTextField
                fullWidth
                placeholder="Ingrese el teléfono"
                value={telefono}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setTelefono(e.target.value)}
                size="small"
              />
            </Grid>

            {/* Campo de Foto de Perfil */}
            <Grid size={12}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                Foto de Perfil (opcional)
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                  variant="outlined"
                  component="label"
                  sx={{ alignSelf: 'flex-start' }}
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
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                      component="img"
                      src={fotoPreview}
                      alt="Preview"
                      sx={{
                        width: 60,
                        height: 60,
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '2px solid #e0e0e0'
                      }}
                    />
                    <Box>
                      <Typography variant="body2" color="textSecondary">
                        {fotoPerfil ? `Archivo: ${fotoPerfil.name}` : 'Foto actual'}
                      </Typography>
                      <Button
                        size="small"
                        color="error"
                        onClick={() => {
                          setFotoPerfil(null);
                          setFotoPreview(null);
                        }}
                      >
                        Quitar foto
                      </Button>
                    </Box>
                  </Box>
                )}
              </Box>
            </Grid>

            {/* Sección Residente */}
            <Grid size={12}>
              <Typography variant="h6" sx={{ mb: 2, mt: 2, color: 'primary.main' }}>
                Datos del Residente
              </Typography>
            </Grid>

            {/* CAMPO REQUERIDO */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                Zona *
              </Typography>
              <CustomTextField
                fullWidth
                placeholder="Ej: Torre A, Casa 123"
                value={zona}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setZona(e.target.value)}
                size="small"
                required
              />
            </Grid>

            {/* CAMPO OPCIONAL - Vivienda */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                ID de Vivienda (opcional)
              </Typography>
              <CustomTextField
                fullWidth
                placeholder="Ej: 101, 205, A-15"
                value={viviendaId}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setViviendaId(e.target.value)}
                size="small"
                helperText="Puede quedar vacío si no tiene vivienda asignada"
              />
            </Grid>

            {/* CAMPO OPCIONAL */}
            <Grid size={12}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                Observaciones (opcional)
              </Typography>
              <CustomTextField
                fullWidth
                placeholder="Observaciones adicionales (opcional)"
                value={observaciones}
                onChange={(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setObservaciones(e.target.value)}
                multiline
                rows={3}
                size="small"
              />
            </Grid>
            
          </Grid>
        </Box>
      </DialogContent>
      
      <DialogActions>
        <Button color="error" onClick={onClose}>
          Cancelar
        </Button>
        <Button onClick={handleSubmit}>
          {mode === "edit" ? 'Actualizar' : 'Crear Residente'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ResidenteDialogForm;
