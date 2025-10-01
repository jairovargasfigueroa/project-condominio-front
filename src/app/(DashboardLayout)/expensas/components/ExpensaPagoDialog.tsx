"use client";
import { 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField
} from '@mui/material';
import { useState, useEffect } from 'react';
import { UpdateExpensaData, Expensa } from '../types';

interface ExpensaPagoDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: UpdateExpensaData) => Promise<void>;
  expensa: Expensa | null;
  submitting: boolean;
}

const ExpensaPagoDialog = ({ 
  open, 
  onClose, 
  expensa,
  onSubmit,
  submitting
}: ExpensaPagoDialogProps) => {
  // Estados para el formulario
  const [estado, setEstado] = useState<'pendiente' | 'pagado' | 'vencido'>('pendiente');
  const [metodoPago, setMetodoPago] = useState('');
  const [montoPagado, setMontoPagado] = useState<number>(0);

  // Resetear cuando se abre el diálogo
  useEffect(() => {
    if (open && expensa) {
      setEstado(expensa.estado);
      setMetodoPago(expensa.metodo_pago || '');
      setMontoPagado(expensa.monto_pagado || 0);
    }
  }, [open, expensa]);

  // Submit
  const handleSubmit = async (): Promise<void> => {
    if (!expensa) return;

    // Validaciones
    if (estado === 'pagado') {
      if (!metodoPago) {
        alert('Debe seleccionar un método de pago');
        return;
      }
      if (montoPagado <= 0) {
        alert('El monto pagado debe ser mayor a 0');
        return;
      }
    }

    // Preparar datos
    const submitData: UpdateExpensaData = {
      estado,
      metodo_pago: estado === 'pagado' ? metodoPago : undefined,
      monto_pagado: estado === 'pagado' ? montoPagado : 0,
      fecha_pago: estado === 'pagado' ? new Date().toISOString() : undefined
    };

    // Llamar al método padre
    await onSubmit(submitData);
  };

  if (!expensa) return null;

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        <Typography variant="h6">
          Actualizar Estado de Pago
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Vivienda: {expensa.vivienda.numero} - {expensa.vivienda.direccion}
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Estado */}
          <FormControl fullWidth>
            <InputLabel>Estado *</InputLabel>
            <Select
              value={estado}
              onChange={(e) => setEstado(e.target.value as 'pendiente' | 'pagado' | 'vencido')}
              disabled={submitting}
            >
              <MenuItem value="pendiente">Pendiente</MenuItem>
              <MenuItem value="pagado">Pagado</MenuItem>
              <MenuItem value="vencido">Vencido</MenuItem>
            </Select>
          </FormControl>

          {/* Método de pago - Solo si está pagado */}
          {estado === 'pagado' && (
            <FormControl fullWidth>
              <InputLabel>Método de Pago *</InputLabel>
              <Select
                value={metodoPago}
                onChange={(e) => setMetodoPago(e.target.value)}
                disabled={submitting}
              >
                <MenuItem value="efectivo">Efectivo</MenuItem>
                <MenuItem value="tarjeta">Tarjeta</MenuItem>
                <MenuItem value="qr">QR</MenuItem>
              </Select>
            </FormControl>
          )}

          {/* Monto pagado - Solo si está pagado */}
          {estado === 'pagado' && (
            <TextField
              label="Monto Pagado *"
              type="number"
              variant="outlined"
              fullWidth
              value={montoPagado}
              onChange={(e) => setMontoPagado(Number(e.target.value))}
              disabled={submitting}
              InputProps={{
                inputProps: { min: 0, step: 1000 }
              }}
            />
          )}

          {/* Información de la expensa */}
          <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
            <Typography variant="body2" color="textSecondary">
              <strong>Monto Mensual:</strong> ${expensa.vivienda.categoria.tarifa_mensual.toLocaleString()}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              <strong>Monto Pagado:</strong> ${expensa.monto_pagado.toLocaleString()}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              <strong>Fecha Vencimiento:</strong> {new Date(expensa.fecha_vencimiento).toLocaleDateString()}
            </Typography>
            {expensa.vivienda.copropietario && (
              <Typography variant="body2" color="textSecondary">
                <strong>Copropietario:</strong> {expensa.vivienda.copropietario.usuario.first_name} {expensa.vivienda.copropietario.usuario.last_name}
              </Typography>
            )}
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button 
          onClick={onClose}
          disabled={submitting}
        >
          Cancelar
        </Button>
        <Button 
          onClick={handleSubmit}
          variant="contained" 
          color="primary"
          disabled={submitting}
        >
          {submitting ? 'Actualizando...' : 'Actualizar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ExpensaPagoDialog;