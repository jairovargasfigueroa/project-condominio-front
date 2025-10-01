"use client";
import {
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Snackbar,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip
} from "@mui/material";
import { useCallback, useMemo, useState } from "react";
import DashboardCard from "../../components/shared/DashboardCard";
import { useExpensas } from "../hooks";
import { UpdateExpensaData, Expensa } from "../types";
import { IconPlus } from "@tabler/icons-react";
import ExpensaPagoDialog from "./ExpensaPagoDialog";

// ✅ CONSTANTES OPTIMIZADAS (igual que en otros módulos)
const TABLE_HEADERS = ['Vivienda', 'Copropietario', 'Monto Mensual', 'Monto Pagado', 'Estado', 'Método de Pago', 'Fecha Vencimiento', 'Acciones'];

const ROWS_PER_PAGE_OPTIONS = [2, 5, 10, 25, 50];

// ✅ Función para obtener color del chip según estado
const getEstadoColor = (estado: string) => {
  switch (estado) {
    case 'pagado': return 'success';
    case 'pendiente': return 'warning';
    case 'vencido': return 'error';
    default: return 'default';
  }
};

// ✅ Función para extraer datos (con validaciones seguras como otros módulos)
const getRowData = (expensa: any) => [
  expensa?.vivienda?.numero || 'N/A',                             // Vivienda
  expensa?.vivienda?.copropietario 
    ? `${expensa.vivienda.copropietario.usuario.first_name} ${expensa.vivienda.copropietario.usuario.last_name}`
    : 'Sin asignar',                                              // Copropietario
  `$${expensa?.vivienda?.categoria?.tarifa_mensual?.toLocaleString() || '0'}`, // Monto Mensual
  `$${expensa?.monto_pagado?.toLocaleString() || '0'}`,           // Monto Pagado
  expensa?.estado || 'pendiente',                                 // Estado
  expensa?.metodo_pago || 'N/A',                                  // Método de Pago
  expensa?.fecha_vencimiento ? new Date(expensa.fecha_vencimiento).toLocaleDateString() : 'N/A', // Fecha Vencimiento
];

export default function ExpensasTable() {
  // Estado para filtros de período
  const [mesSeleccionado, setMesSeleccionado] = useState(new Date().getMonth() + 1);
  const [añoSeleccionado, setAñoSeleccionado] = useState(new Date().getFullYear());

  const {
    expensas,
    loading,
    submitting,
    error,
    total,
    estadisticas,
    generarMes,
    updateExpensa,
    refetch
  } = useExpensas(mesSeleccionado, añoSeleccionado);

  // Estados para diálogos
  const [pagoDialogOpen, setPagoDialogOpen] = useState(false);
  const [selectedExpensa, setSelectedExpensa] = useState<Expensa | null>(null);

  // Estados para notificaciones
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success'
  });

  // ✅ Abrir diálogo de pago
  const handleOpenPagoDialog = useCallback((expensa: Expensa) => {
    setSelectedExpensa(expensa);
    setPagoDialogOpen(true);
  }, []);

  // ✅ Cerrar diálogo de pago
  const handleClosePagoDialog = useCallback(() => {
    setPagoDialogOpen(false);
    setSelectedExpensa(null);
  }, []);

  // ✅ Generar expensas del mes
  const handleGenerarMes = useCallback(async () => {
    try {
      await generarMes({ mes: mesSeleccionado, año: añoSeleccionado });
      
      setNotification({
        open: true,
        message: 'Expensas del mes generadas exitosamente',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error al generar expensas:', error);
      setNotification({
        open: true,
        message: 'Error al generar las expensas del mes',
        severity: 'error'
      });
    }
  }, [generarMes, mesSeleccionado, añoSeleccionado]);

  // ✅ Actualizar estado de pago
  const handleUpdatePago = useCallback(async (data: UpdateExpensaData) => {
    if (!selectedExpensa) return;

    try {
      await updateExpensa(selectedExpensa.id, data);
      
      setNotification({
        open: true,
        message: 'Estado de pago actualizado exitosamente',
        severity: 'success'
      });
      
      setPagoDialogOpen(false);
      setSelectedExpensa(null);
    } catch (error) {
      console.error('Error al actualizar pago:', error);
      setNotification({
        open: true,
        message: 'Error al actualizar el estado de pago',
        severity: 'error'
      });
    }
  }, [selectedExpensa, updateExpensa]);

  // ✅ Cerrar notificación
  const handleCloseNotification = useCallback(() => {
    setNotification(prev => ({ ...prev, open: false }));
  }, []);

  // ✅ Headers memoizados
  const tableHeaders = useMemo(() => (
    <TableHead>
      <TableRow>
        {TABLE_HEADERS.map((header, index) => (
          <TableCell key={index}>
            <Typography variant="subtitle2" fontWeight={600}>
              {header}
            </Typography>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  ), []);

  // ✅ Mensaje de tabla vacía
  const emptyMessage = useMemo(() => (
    <TableRow>
      <TableCell colSpan={TABLE_HEADERS.length} align="center">
        <Typography variant="body2" color="textSecondary" sx={{ py: 3 }}>
          No hay expensas para el período seleccionado
        </Typography>
      </TableCell>
    </TableRow>
  ), []);

  // ✅ Rows memoizados
  const tableRows = useMemo(() => {
    if (!expensas || expensas.length === 0) return [];
    
    return expensas.map((expensa: Expensa) => {
      const rowData = getRowData(expensa);
      
      return (
        <TableRow key={expensa.id}>
          {rowData.map((data, index) => (
            <TableCell key={index}>
              {index === 3 ? ( // Estado
                <Chip 
                  label={data} 
                  color={getEstadoColor(data) as any}
                  size="small"
                />
              ) : (
                <Typography 
                  variant="body2"
                  fontWeight={index === 0 ? 500 : 400}
                >
                  {data}
                </Typography>
              )}
            </TableCell>
          ))}
          {/* Acciones */}
          <TableCell>
            <Button 
              size="small" 
              variant="outlined" 
              onClick={() => handleOpenPagoDialog(expensa)}
              disabled={submitting}
            >
              Editar Pago
            </Button>
          </TableCell>
        </TableRow>
      );
    });
  }, [expensas, handleOpenPagoDialog, submitting]);

  // ✅ RENDERIZADO CONDICIONAL
  if (loading) {
    return (
      <DashboardCard title="Expensas">
        <Box display="flex" justifyContent="center" p={3}>
          <CircularProgress />
        </Box>
      </DashboardCard>
    );
  }

  if (error) {
    return (
      <DashboardCard title="Expensas">
        <Alert severity="error">{error}</Alert>
      </DashboardCard>
    );
  }

  return (
    <Box>
      {/* Filtros y controles */}
      <DashboardCard title="Filtros y Controles">
        <Box sx={{ display: 'flex', gap: 3, alignItems: 'center', flexWrap: 'wrap' }}>
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Mes</InputLabel>
            <Select
              value={mesSeleccionado}
              onChange={(e) => setMesSeleccionado(Number(e.target.value))}
            >
              {Array.from({ length: 12 }, (_, i) => (
                <MenuItem key={i + 1} value={i + 1}>
                  {new Date(2024, i).toLocaleDateString('es', { month: 'long' })}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Año</InputLabel>
            <Select
              value={añoSeleccionado}
              onChange={(e) => setAñoSeleccionado(Number(e.target.value))}
            >
              {Array.from({ length: 5 }, (_, i) => {
                const year = new Date().getFullYear() - 2 + i;
                return (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>

          <Button
            variant="contained"
            color="primary"
            onClick={handleGenerarMes}
            startIcon={<IconPlus />}
            disabled={submitting}
          >
            {submitting ? 'Generando...' : 'Generar Expensas del Mes'}
          </Button>
        </Box>
      </DashboardCard>

      {/* Estadísticas */}
      {estadisticas && (
        <Box sx={{ mt: 3 }}>
          <DashboardCard title="Estadísticas">
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              <Box>
                <Typography variant="body2" color="textSecondary">Total</Typography>
                <Typography variant="h6">{estadisticas?.total_expensas || 0}</Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="textSecondary">Pagadas</Typography>
                <Typography variant="h6" color="success.main">{estadisticas?.pagadas || 0}</Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="textSecondary">Pendientes</Typography>
                <Typography variant="h6" color="warning.main">{estadisticas?.pendientes || 0}</Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="textSecondary">Vencidas</Typography>
                <Typography variant="h6" color="error.main">{estadisticas?.vencidas || 0}</Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="textSecondary">Recaudado</Typography>
                <Typography variant="h6" color="success.main">
                  ${(estadisticas?.monto_total_recaudado || 0).toLocaleString()}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="textSecondary">Pendiente</Typography>
                <Typography variant="h6" color="warning.main">
                  ${(estadisticas?.monto_total_pendiente || 0).toLocaleString()}
                </Typography>
              </Box>
            </Box>
          </DashboardCard>
        </Box>
      )}

      {/* Tabla de expensas */}
      <Box sx={{ mt: 3 }}>
      <DashboardCard title={`Expensas - ${new Date(2024, mesSeleccionado - 1).toLocaleDateString('es', { month: 'long' })} ${añoSeleccionado}`}>
        <Box sx={{ overflow: 'auto', width: { xs: '280px', sm: 'auto' } }}>
          <Table
            aria-label="tabla de expensas"
            sx={{
              whiteSpace: "nowrap",
              mt: 2
            }}
          >
            {tableHeaders}
            <TableBody>
              {tableRows.length > 0 ? tableRows : emptyMessage}
            </TableBody>
          </Table>
        </Box>

        {/* Información adicional */}
        {total > 0 && (
          <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
            <Typography variant="body2" color="textSecondary">
              Total de expensas: {total}
            </Typography>
          </Box>
        )}
      </DashboardCard>
      </Box>

      {/* Diálogo de pago */}
      <ExpensaPagoDialog
        open={pagoDialogOpen}
        onClose={handleClosePagoDialog}
        onSubmit={handleUpdatePago}
        expensa={selectedExpensa}
        submitting={submitting}
      />

      {/* Notificación */}
      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}