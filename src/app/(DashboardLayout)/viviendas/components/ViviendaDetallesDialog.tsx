import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  Divider,
  CircularProgress
} from '@mui/material';
import { Home as HomeIcon } from '@mui/icons-material';
import { ViviendaDetalles } from '../types';

interface ViviendaDetallesDialogProps {
  open: boolean;
  onClose: () => void;
  viviendaDetalles: ViviendaDetalles | null;
  loading: boolean;
}

export const ViviendaDetallesDialog: React.FC<ViviendaDetallesDialogProps> = ({
  open,
  onClose,
  viviendaDetalles,
  loading
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          <HomeIcon color="primary" />
          <Typography variant="h6">
            Detalles de Vivienda
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        {loading ? (
          <Box display="flex" justifyContent="center" p={3}>
            <CircularProgress />
          </Box>
        ) : viviendaDetalles ? (
          <Box>
            {/* Información Básica */}
            <Typography variant="h6" color="primary" gutterBottom>
              Información General
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', gap: 3, mb: 2 }}>
                <Box>
                  <Typography variant="body2" color="textSecondary">
                    Número:
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {viviendaDetalles.numero}
                  </Typography>
                </Box>
                
                <Box>
                  <Typography variant="body2" color="textSecondary">
                    Categoría:
                  </Typography>
                  <Box sx={{ mt: 0.5 }}>
                    <Chip label={viviendaDetalles.categoria.nombre} color="primary" size="small" />
                  </Box>
                </Box>
              </Box>
              
              <Box>
                <Typography variant="body2" color="textSecondary">
                  Dirección:
                </Typography>
                <Typography variant="body1">
                  {viviendaDetalles.direccion}
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Copropietario */}
            <Typography variant="h6" color="primary" gutterBottom>
              Copropietario
            </Typography>
            
            {viviendaDetalles.copropietario ? (
              <Box sx={{ mb: 3 }}>
                <Typography variant="body1" fontWeight="bold">
                  {viviendaDetalles.copropietario.usuario.first_name} {viviendaDetalles.copropietario.usuario.last_name}
                </Typography>
                {viviendaDetalles.copropietario.usuario.email && (
                  <Typography variant="body2" color="textSecondary">
                    {viviendaDetalles.copropietario.usuario.email}
                  </Typography>
                )}
              </Box>
            ) : (
              <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
                Sin copropietario asignado
              </Typography>
            )}

            <Divider sx={{ my: 2 }} />

            {/* Residentes */}
            <Box display="flex" alignItems="center" gap={1} sx={{ mb: 2 }}>
              <Typography variant="h6" color="primary">
                Residentes
              </Typography>
              <Chip 
                label={`${viviendaDetalles.cantidad_residentes} residente${viviendaDetalles.cantidad_residentes !== 1 ? 's' : ''}`}
                color="secondary" 
                size="small" 
              />
            </Box>
            
            {viviendaDetalles.residentes_actuales.length > 0 ? (
              <Box>
                {viviendaDetalles.residentes_actuales.map((residente, index) => (
                  <Box key={residente.id} sx={{ mb: 2 }}>
                    <Typography variant="body1" fontWeight="bold">
                      {residente.usuario.first_name} {residente.usuario.last_name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Zona: {residente.zona}
                    </Typography>
                    {residente.usuario.email && (
                      <Typography variant="body2" color="textSecondary">
                        {residente.usuario.email}
                      </Typography>
                    )}
                    {index < viviendaDetalles.residentes_actuales.length - 1 && (
                      <Divider sx={{ mt: 1 }} />
                    )}
                  </Box>
                ))}
              </Box>
            ) : (
              <Typography variant="body2" color="textSecondary">
                Sin residentes registrados
              </Typography>
            )}
          </Box>
        ) : null}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};
