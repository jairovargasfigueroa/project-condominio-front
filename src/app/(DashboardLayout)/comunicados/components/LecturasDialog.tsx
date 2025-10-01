"use client";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Divider,
  Chip,
  CircularProgress,
  Alert
} from '@mui/material';
import { IconUser, IconClock, IconMapPin } from '@tabler/icons-react';
import { useState, useEffect, useCallback } from 'react';
import { comunicadosService } from '../services';
import { LecturaComunicado } from '../types';

interface LecturasDialogProps {
  open: boolean;
  onClose: () => void;
  comunicadoId: string | null;
  comunicadoTitulo?: string;
}

const LecturasDialog = ({ open, onClose, comunicadoId, comunicadoTitulo }: LecturasDialogProps) => {
  const [lecturas, setLecturas] = useState<LecturaComunicado[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLecturas = useCallback(async () => {
    if (!comunicadoId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await comunicadosService.getLecturasByComunicado(comunicadoId);
      
      if (response.success) {
        setLecturas(response.data);
      } else {
        setError('Error al cargar las lecturas');
        setLecturas([]);
      }
    } catch (err) {
      console.error('Error fetching lecturas:', err);
      setError('Error al cargar las lecturas');
      setLecturas([]);
    } finally {
      setLoading(false);
    }
  }, [comunicadoId]);

  useEffect(() => {
    if (open && comunicadoId) {
      fetchLecturas();
    }
  }, [open, comunicadoId, fetchLecturas]);

  const formatFechaLectura = (fecha: string) => {
    return new Date(fecha).toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      scroll="paper"
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconUser size={24} />
          <Box>
            <Typography variant="h6">
              Lecturas del Comunicado
            </Typography>
            {comunicadoTitulo && (
              <Typography variant="body2" color="textSecondary">
                &ldquo;{comunicadoTitulo}&rdquo;
              </Typography>
            )}
          </Box>
        </Box>
      </DialogTitle>
      
      <DialogContent>
        {loading ? (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        ) : lecturas.length === 0 ? (
          <Box textAlign="center" py={4}>
            <Typography variant="body1" color="textSecondary">
              Este comunicado aún no ha sido leído por ningún residente
            </Typography>
          </Box>
        ) : (
          <Box>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
              Total de lecturas: <strong>{lecturas.length}</strong>
            </Typography>
            
            <List sx={{ width: '100%' }}>
              {lecturas.map((lectura, index) => (
                <Box key={lectura.id}>
                  <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                    <ListItemAvatar>
                      <Avatar 
                        src={lectura.residente_info.usuario.foto_perfil_url || undefined}
                        sx={{ bgcolor: 'primary.main' }}
                      >
                        {!lectura.residente_info.usuario.foto_perfil_url && 
                          getInitials(
                            lectura.residente_info.usuario.first_name,
                            lectura.residente_info.usuario.last_name
                          )
                        }
                      </Avatar>
                    </ListItemAvatar>
                    
                    <ListItemText
                      primary={
                        <Typography variant="subtitle1" fontWeight={500}>
                          {lectura.residente_info.usuario.first_name} {lectura.residente_info.usuario.last_name}
                        </Typography>
                      }
                      secondary={
                        <Box sx={{ mt: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                            <IconMapPin size={16} />
                            <Typography variant="body2" color="textSecondary">
                              {lectura.residente_info.zona}
                            </Typography>
                          </Box>
                          
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <IconClock size={16} />
                            <Typography variant="body2" color="textSecondary">
                              Leído el {formatFechaLectura(lectura.fecha_lectura)}
                            </Typography>
                          </Box>
                          
                          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            <Chip 
                              label={lectura.residente_info.usuario.email}
                              size="small"
                              variant="outlined"
                            />
                            {lectura.residente_info.usuario.telefono && (
                              <Chip 
                                label={lectura.residente_info.usuario.telefono}
                                size="small"
                                variant="outlined"
                              />
                            )}
                          </Box>
                        </Box>
                      }
                    />
                  </ListItem>
                  
                  {index < lecturas.length - 1 && <Divider variant="inset" component="li" />}
                </Box>
              ))}
            </List>
          </Box>
        )}
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose}>
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LecturasDialog;