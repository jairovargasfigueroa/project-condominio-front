"use client";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Grid,
  Typography,
  Checkbox,
  FormControlLabel
} from '@mui/material';
import { useState, useEffect, ChangeEvent } from 'react';
import CustomTextField from '../../components/forms/theme-elements/CustomTextField';
import { ViviendaDialogFormProps, CreateViviendaData, UpdateViviendaData } from '../types';

const ViviendaDialogForm  = ({ 
  open, 
  onClose, 
  mode = "create", 
  vivienda, 
  onSubmit 
} : ViviendaDialogFormProps) => {
  // Estados simples para cada campo (patrón AuthLogin)
  // CAMPOS REQUERIDOS
  const [categoriaId, setCategoriaId] = useState('');
  const [numero, setNumero] = useState('');
  const [direccion, setDireccion] = useState('');
  
  // CAMPOS OPCIONALES
  const [copropietarioId, setCopropietarioId] = useState('');
  const [sinCopropietario, setSinCopropietario] = useState(false);

  // Resetear cuando se abre el diálogo
  useEffect(() => {
    if (open) {
      if (mode === "edit" && vivienda) {
        // Modo EDITAR - llenar con datos existentes
        setCategoriaId(vivienda.categoria.id.toString());
        setNumero(vivienda.numero || '');
        setDireccion(vivienda.direccion || '');
        setCopropietarioId(vivienda.copropietario?.id.toString() || '');
        setSinCopropietario(!vivienda.copropietario);
      } else {
        // Modo CREAR - formulario vacío
        setCategoriaId('3'); // Por ahora hardcodeado
        setNumero('');
        setDireccion('');
        setCopropietarioId('5'); // Por ahora hardcodeado
        setSinCopropietario(false);
      }
    }
  }, [open, mode, vivienda]);

  // Manejar checkbox de sin copropietario
  const handleSinCopropietario = (checked: boolean) => {
    setSinCopropietario(checked);
    if (checked) {
      setCopropietarioId('');
    } else {
      setCopropietarioId('5'); // Valor por defecto
    }
  };

  // Submit - DEVOLVER DATOS AL PADRE con tipos
  const handleSubmit = (): void => {
    // Validación básica - SOLO LOS CAMPOS DEL JSON REQUERIDO
    if (!categoriaId || !numero || !direccion) {
      alert('Por favor completa los campos requeridos: Categoría, Número y Dirección');
      return;
    }

    // Preparar datos según el modo
    const submitData: CreateViviendaData | UpdateViviendaData = mode === "edit" 
      ? {
          // Datos para actualizar
          categoria_id: parseInt(categoriaId),
          copropietario_id: sinCopropietario ? null : parseInt(copropietarioId) || null,
          numero,
          direccion
        } as UpdateViviendaData
      : {
          // Datos para crear - ESTRUCTURA EXACTA DEL JSON REQUERIDO
          categoria_id: parseInt(categoriaId),
          copropietario_id: sinCopropietario ? null : parseInt(copropietarioId) || null,
          numero,
          direccion
        } as CreateViviendaData;

    // ENVIAR DATOS AL PADRE
    onSubmit(submitData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {mode === "edit" ? 'Editar Vivienda' : 'Nueva Vivienda'}
      </DialogTitle>

      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Grid container spacing={3}>

            {/* Sección Vivienda */}
            <Grid size={12}>
              <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                Datos de la Vivienda
              </Typography>
            </Grid>

            {/* CAMPOS REQUERIDOS */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                Número *
              </Typography>
              <CustomTextField
                fullWidth
                placeholder="Ej: 101, A-201"
                value={numero}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setNumero(e.target.value)}
                size="small"
                required
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                Categoría ID * (temporal)
              </Typography>
              <CustomTextField
                fullWidth
                type="number"
                placeholder="ID de categoría"
                value={categoriaId}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setCategoriaId(e.target.value)}
                size="small"
                required
              />
            </Grid>

            <Grid size={12}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                Dirección *
              </Typography>
              <CustomTextField
                fullWidth
                placeholder="Ej: Piso 1, Apartamento 101"
                value={direccion}
                onChange={(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setDireccion(e.target.value)}
                multiline
                rows={2}
                size="small"
                required
              />
            </Grid>

            {/* Sección Copropietario */}
            <Grid size={12}>
              <Typography variant="h6" sx={{ mb: 2, mt: 2, color: 'primary.main' }}>
                Datos del Copropietario
              </Typography>
            </Grid>

            {/* CHECKBOX SIN COPROPIETARIO */}
            <Grid size={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={sinCopropietario}
                    onChange={(e) => handleSinCopropietario(e.target.checked)}
                  />
                }
                label="Sin copropietario asignado"
              />
            </Grid>

            {/* CAMPO COPROPIETARIO ID (solo si no está marcado el checkbox) */}
            {!sinCopropietario && (
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                  Copropietario ID (opcional)
                </Typography>
                <CustomTextField
                  fullWidth
                  type="number"
                  placeholder="ID del copropietario"
                  value={copropietarioId}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setCopropietarioId(e.target.value)}
                  size="small"
                />
              </Grid>
            )}

            <Grid size={12}>
              <Typography variant="caption" color="textSecondary">
                * Los campos marcados son requeridos
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
          {mode === "edit" ? 'Actualizar' : 'Crear Vivienda'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViviendaDialogForm;
