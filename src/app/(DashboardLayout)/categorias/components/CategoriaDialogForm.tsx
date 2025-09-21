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
import { CategoriaDialogFormProps, CreateCategoriaData, UpdateCategoriaData } from '../types';

const CategoriaDialogForm  = ({
  open,
  onClose,
  mode = "create",
  categoria,
  onSubmit
} : CategoriaDialogFormProps) => {
  // Estados simples para cada campo
  const [nombre, setNombre] = useState('');
  const [tarifaMensual, setTarifaMensual] = useState('');

  // Resetear cuando se abre el diálogo
  useEffect(() => {
    if (open) {
      if (mode === "edit" && categoria) {
        // Modo EDITAR - llenar con datos existentes
        setNombre(categoria.nombre || '');
        setTarifaMensual(categoria.tarifa_mensual || '');
      } else {
        // Modo CREAR - formulario vacío
        setNombre('');
        setTarifaMensual('');
      }
    }
  }, [open, mode, categoria]);

  // Submit - DEVOLVER DATOS AL PADRE con tipos
  const handleSubmit = (): void => {
    // Validación básica
    if (!nombre || !tarifaMensual) {
      alert('Por favor completa todos los campos requeridos');
      return;
    }

    // Validar que tarifa sea un número válido
    const tarifaNumber = parseFloat(tarifaMensual);
    if (isNaN(tarifaNumber) || tarifaNumber <= 0) {
      alert('Por favor ingresa una tarifa mensual válida');
      return;
    }

    // Preparar datos según el modo
    const submitData: CreateCategoriaData | UpdateCategoriaData = {
      nombre,
      tarifa_mensual: tarifaNumber // Convertir a número para envío
    };

    // ENVIAR DATOS AL PADRE
    onSubmit(submitData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {mode === "edit" ? 'Editar Categoría' : 'Nueva Categoría'}
      </DialogTitle>

      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Grid container spacing={3}>

            {/* Sección Categoría */}
            <Grid size={12}>
              <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                Datos de la Categoría
              </Typography>
            </Grid>

            {/* CAMPO NOMBRE */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                Nombre *
              </Typography>
              <CustomTextField
                fullWidth
                placeholder="Ej: Premium, Básico, VIP"
                value={nombre}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setNombre(e.target.value)}
                size="small"
                required
              />
            </Grid>

            {/* CAMPO TARIFA MENSUAL */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                Tarifa Mensual *
              </Typography>
              <CustomTextField
                fullWidth
                type="number"
                placeholder="Ej: 500.00"
                value={tarifaMensual}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setTarifaMensual(e.target.value)}
                size="small"
                required
                inputProps={{
                  min: 0,
                  step: 0.01
                }}
              />
            </Grid>

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
          {mode === "edit" ? 'Actualizar' : 'Crear Categoría'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CategoriaDialogForm;
