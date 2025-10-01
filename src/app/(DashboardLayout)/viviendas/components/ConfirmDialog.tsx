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
  loading?: boolean;
}

const ConfirmDialog = ({
  open,
  onClose,
  onConfirm,
  title = "Confirmar acción",
  message = "¿Estás seguro de que quieres continuar?",
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  loading = false
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
          disabled={loading}
          color="inherit"
        >
          {cancelText}
        </Button>
        <Button
          onClick={handleConfirm}
          disabled={loading}
          color="error"
          variant="contained"
        >
          {loading ? 'Procesando...' : confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
