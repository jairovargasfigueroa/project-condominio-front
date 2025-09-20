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
  const [telefono, setTelefono] = useState('');
  const [observaciones, setObservaciones] = useState('');

  // Resetear cuando se abre el diálogo
  useEffect(() => {
    if (open) {
      if (mode === "edit" && residente) {
        // Modo EDITAR - llenar con datos existentes
        setUsername(residente.usuario.username || '');
        setEmail(residente.usuario.email || '');
        setTelefono(residente.usuario.telefono || '');
        setPassword(''); // No mostrar password al editar
        setZona(residente.zona || '');
        setObservaciones(residente.observaciones || '');
      } else {
        // Modo CREAR - formulario vacío
        setUsername('');
        setEmail('');
        setTelefono('');
        setPassword('');
        setZona('');
        setObservaciones('');
      }
    }
  }, [open, mode, residente]);

  // Submit - DEVOLVER DATOS AL PADRE con tipos
  const handleSubmit = (): void => {
    // Validación básica - SOLO LOS CAMPOS DEL JSON REQUERIDO
    if (!username || !email || !password || !zona) {
      alert('Por favor completa los campos requeridos: Usuario, Email, Contraseña y Zona');
      return;
    }

    // Preparar datos según el modo
    const submitData: CreateResidenteData | UpdateResidenteData = mode === "edit" 
      ? {
          // Datos para actualizar (sin password)
          usuario: {
            username,
            email,
            password,
            telefono: telefono || '' // Opcional
          },
          zona,
          observaciones: observaciones || '' // Opcional
        } as UpdateResidenteData
      : {
          // Datos para crear - ESTRUCTURA EXACTA DEL JSON REQUERIDO
          usuario: {
            username,
            email,
            password
          },
          zona
        } as CreateResidenteData;

    // ENVIAR DATOS AL PADRE
    onSubmit(submitData);
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
