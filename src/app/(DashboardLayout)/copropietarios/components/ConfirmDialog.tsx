"use client";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box
} from '@mui/material';
import { IconAlertTriangle } from '@tabler/icons-react';

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  submitting?: boolean;
}

const ConfirmDialog = ({
  open,
  onClose,
  onConfirm,
  title = "Confirmar acción",
  message = "¿Estás seguro de que quieres continuar?",
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  submitting = false
}: ConfirmDialogProps) => {
  
  const handleConfirm = () => {
    onConfirm();
    // No cerramos aquí, dejamos que el padre maneje el cierre
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle sx={{ pb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconAlertTriangle 
            size={24} 
            color="orange"
          />
          <Typography variant="h6" component="span">
            {title}
          </Typography>
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <Typography variant="body1" color="textSecondary">
          {message}
        </Typography>
      </DialogContent>
      
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button 
          onClick={onClose}
          disabled={submitting}
          color="inherit"
        >
          {cancelText}
        </Button>
        <Button 
          onClick={handleConfirm}
          disabled={submitting}
          color="error"
          variant="contained"
        >
          {submitting ? 'Procesando...' : confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;