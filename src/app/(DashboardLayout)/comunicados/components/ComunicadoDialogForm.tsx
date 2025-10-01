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
import { ComunicadoDialogFormProps, CreateComunicadoData, UpdateComunicadoData } from '../types';

const ComunicadoDialogForm  = ({ 
  open, 
  onClose, 
  mode = "create", 
  comunicado, 
  onSubmit 
} : ComunicadoDialogFormProps) => {
  // Estados simples para cada campo (patrón AuthLogin)
  // CAMPOS REQUERIDOS
  const [titulo, setTitulo] = useState('');
  const [contenido, setContenido] = useState('');

  // Resetear cuando se abre el diálogo
  useEffect(() => {
    if (open) {
      if (mode === "edit" && comunicado) {
        // Modo EDITAR - llenar con datos existentes
        setTitulo(comunicado.titulo || '');
        setContenido(comunicado.contenido || '');
      } else {
        // Modo CREAR - formulario vacío
        setTitulo('');
        setContenido('');
      }
    }
  }, [open, mode, comunicado]);

  // Submit - DEVOLVER DATOS AL PADRE con tipos
  const handleSubmit = (): void => {
    // Validación básica - SOLO LOS CAMPOS DEL JSON REQUERIDO
    if (!titulo || !contenido) {
      alert('Por favor completa los campos requeridos: Título y Contenido');
      return;
    }

    // Preparar datos según el modo
    const submitData: CreateComunicadoData | UpdateComunicadoData = mode === "edit" 
      ? {
          // Datos para actualizar
          titulo,
          contenido
        } as UpdateComunicadoData
      : {
          // Datos para crear - ESTRUCTURA EXACTA DEL JSON REQUERIDO
          titulo,
          contenido
        } as CreateComunicadoData;

    // ENVIAR DATOS AL PADRE
    onSubmit(submitData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {mode === "edit" ? 'Editar Comunicado' : 'Nuevo Comunicado'}
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Grid container spacing={3}>
            
            {/* Sección Comunicado */}
            <Grid size={12}>
              <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                Datos del Comunicado
              </Typography>
            </Grid>

            {/* CAMPOS REQUERIDOS */}
            <Grid size={12}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                Título *
              </Typography>
              <CustomTextField
                fullWidth
                placeholder="Ingrese el título del comunicado"
                value={titulo}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setTitulo(e.target.value)}
                size="small"
                required
              />
            </Grid>

            <Grid size={12}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                Contenido *
              </Typography>
              <CustomTextField
                fullWidth
                multiline
                rows={6}
                placeholder="Ingrese el contenido del comunicado"
                value={contenido}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setContenido(e.target.value)}
                size="small"
                required
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
          {mode === "edit" ? 'Actualizar' : 'Crear Comunicado'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ComunicadoDialogForm;