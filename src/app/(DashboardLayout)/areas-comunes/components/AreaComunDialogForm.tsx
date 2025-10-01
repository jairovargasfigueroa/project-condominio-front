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
  MenuItem
} from '@mui/material';
import { useState, useEffect, ChangeEvent } from 'react';
import CustomTextField from '../../components/forms/theme-elements/CustomTextField';
import { AreaComunDialogFormProps, CreateAreaComunData, UpdateAreaComunData } from '../types';

const AreaComunDialogForm  = ({ 
  open, 
  onClose, 
  mode = "create", 
  areaComun, 
  onSubmit 
} : AreaComunDialogFormProps) => {
  // Estados simples para cada campo (patrón AuthLogin)
  // CAMPOS REQUERIDOS
  const [nombre, setNombre] = useState('');
  const [tipo, setTipo] = useState('gratuita'); // Default: gratuita
  const [costo, setCosto] = useState('');

  // Resetear cuando se abre el diálogo
  useEffect(() => {
    if (open) {
      if (mode === "edit" && areaComun) {
        // Modo EDITAR - llenar con datos existentes
        setNombre(areaComun.nombre || '');
        setTipo(areaComun.tipo || 'gratuita');
        setCosto(areaComun.costo?.toString() || '0.00');
      } else {
        // Modo CREAR - formulario vacío
        setNombre('');
        setTipo('gratuita'); // Default: gratuita
        setCosto('0.00');
      }
    }
  }, [open, mode, areaComun]);

  // Manejar cambio de tipo
  const handleTipoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newTipo = event.target.value;
    setTipo(newTipo);
    
    // Si cambia a gratuita, resetear costo a 0
    if (newTipo === 'gratuita') {
      setCosto('0.00');
    }
  };

  // Submit - DEVOLVER DATOS AL PADRE con tipos
  const handleSubmit = (): void => {
    // Validación básica - SOLO LOS CAMPOS DEL JSON REQUERIDO
    if (!nombre || !tipo) {
      alert('Por favor completa los campos requeridos: Nombre y Tipo');
      return;
    }

    // Validar costo solo si es de pago
    let costoNumerico = 0;
    if (tipo === 'pago') {
      if (!costo || costo.trim() === '') {
        alert('Por favor ingresa un costo para el area de pago');
        return;
      }
      
      costoNumerico = parseFloat(costo);
      if (isNaN(costoNumerico) || costoNumerico < 0) {
        alert('Por favor ingresa un costo válido (número mayor o igual a 0)');
        return;
      }
    }

    // Preparar datos según el modo
    const submitData: CreateAreaComunData | UpdateAreaComunData = mode === "edit" 
      ? {
          // Datos para actualizar
          nombre,
          tipo,
          costo: costoNumerico
        } as UpdateAreaComunData
      : {
          // Datos para crear - ESTRUCTURA EXACTA DEL JSON REQUERIDO
          nombre,
          tipo,
          costo: costoNumerico
        } as CreateAreaComunData;

    // ENVIAR DATOS AL PADRE
    onSubmit(submitData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {mode === "edit" ? 'Editar Area Común' : 'Nueva Area Común'}
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Grid container spacing={3}>
            
            {/* Sección Area Común */}
            <Grid size={12}>
              <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                Datos del Area Común
              </Typography>
            </Grid>

            {/* CAMPOS REQUERIDOS */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                Nombre *
              </Typography>
              <CustomTextField
                fullWidth
                placeholder="Ingrese el nombre del area común"
                value={nombre}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setNombre(e.target.value)}
                size="small"
                required
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                Tipo *
              </Typography>
              <CustomTextField
                fullWidth
                select
                value={tipo}
                onChange={handleTipoChange}
                size="small"
                required
              >
                <MenuItem value="gratuita">Gratuita</MenuItem>
                <MenuItem value="pago">De Pago</MenuItem>
              </CustomTextField>
            </Grid>

            {/* Campo costo solo si es de pago */}
            {tipo === 'pago' && (
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                  Costo *
                </Typography>
                <CustomTextField
                  fullWidth
                  type="number"
                  placeholder="0.00"
                  value={costo}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setCosto(e.target.value)}
                  size="small"
                  required
                  inputProps={{
                    min: 0,
                    step: 0.01
                  }}
                />
              </Grid>
            )}
            
          </Grid>
        </Box>
      </DialogContent>
      
      <DialogActions>
        <Button color="error" onClick={onClose}>
          Cancelar
        </Button>
        <Button onClick={handleSubmit}>
          {mode === "edit" ? 'Actualizar' : 'Crear Area Común'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AreaComunDialogForm;