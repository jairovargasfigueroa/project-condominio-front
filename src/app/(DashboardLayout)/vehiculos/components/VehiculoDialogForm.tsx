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
import { VehiculoDialogFormProps, CreateVehiculoData, UpdateVehiculoData } from '../types';

const VehiculoDialogForm  = ({
  open,
  onClose,
  mode = "create",
  vehiculo,
  onSubmit
} : VehiculoDialogFormProps) => {
  // Estados simples para cada campo (patrón AuthLogin)
  // CAMPOS REQUERIDOS
  const [usuarioId, setUsuarioId] = useState('');
  const [placa, setPlaca] = useState('');
  const [modelo, setModelo] = useState('');
  const [color, setColor] = useState('');
  const [marca, setMarca] = useState('');

  // Resetear cuando se abre el diálogo
  useEffect(() => {
    if (open) {
      if (mode === "edit" && vehiculo) {
        // Modo EDITAR - llenar con datos existentes
        setUsuarioId(vehiculo.usuario.id.toString()); // Usar el ID del usuario del vehículo
        setPlaca(vehiculo.placa || '');
        setModelo(vehiculo.modelo || '');
        setColor(vehiculo.color || '');
        setMarca(vehiculo.marca || '');
      } else {
        // Modo CREAR - formulario vacío
        setUsuarioId('5'); // Por ahora hardcodeado para pruebas, se puede mejorar después
        setPlaca('');
        setModelo('');
        setColor('');
        setMarca('');
      }
    }
  }, [open, mode, vehiculo]);

  // Submit - DEVOLVER DATOS AL PADRE con tipos
  const handleSubmit = (): void => {
    // Validación básica - SOLO LOS CAMPOS DEL JSON REQUERIDO
    if (!usuarioId || !placa || !modelo || !color || !marca) {
      alert('Por favor completa todos los campos requeridos');
      return;
    }

    // Preparar datos según el modo
    const submitData: CreateVehiculoData | UpdateVehiculoData = mode === "edit"
      ? {
          // Datos para actualizar
          usuario_id: parseInt(usuarioId),
          placa,
          modelo,
          color,
          marca
        } as UpdateVehiculoData
      : {
          // Datos para crear - ESTRUCTURA EXACTA DEL JSON REQUERIDO
          usuario_id: parseInt(usuarioId),
          placa,
          modelo,
          color,
          marca
        } as CreateVehiculoData;

    // ENVIAR DATOS AL PADRE
    onSubmit(submitData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {mode === "edit" ? 'Editar Vehículo' : 'Nuevo Vehículo'}
      </DialogTitle>

      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Grid container spacing={3}>

            {/* Sección Vehículo */}
            <Grid size={12}>
              <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                Datos del Vehículo
              </Typography>
            </Grid>

            {/* CAMPOS REQUERIDOS */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                Placa *
              </Typography>
              <CustomTextField
                fullWidth
                placeholder="Ej: ABC123"
                value={placa}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setPlaca(e.target.value.toUpperCase())}
                size="small"
                required
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                Marca *
              </Typography>
              <CustomTextField
                fullWidth
                placeholder="Ej: Toyota"
                value={marca}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setMarca(e.target.value)}
                size="small"
                required
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                Modelo *
              </Typography>
              <CustomTextField
                fullWidth
                placeholder="Ej: Corolla"
                value={modelo}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setModelo(e.target.value)}
                size="small"
                required
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                Color *
              </Typography>
              <CustomTextField
                fullWidth
                placeholder="Ej: Rojo"
                value={color}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setColor(e.target.value)}
                size="small"
                required
              />
            </Grid>

            {/* Usuario ID (oculto por ahora, hardcodeado) */}
            <Grid size={12}>
              <Typography variant="caption" color="textSecondary">
                * Todos los campos son requeridos
              </Typography>
            </Grid>

          </Grid>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button color="error" onClick={onClose}>
          Cancelar
        </Button>
        <Button onClick={handleSubmit}>
          {mode === "edit" ? 'Actualizar' : 'Crear Vehículo'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default VehiculoDialogForm;
