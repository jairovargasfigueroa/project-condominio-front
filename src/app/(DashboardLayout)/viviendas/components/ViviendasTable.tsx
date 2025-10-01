"use client";
import {
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  TablePagination,
  Alert,
  CircularProgress,
  Button,
  Snackbar,
} from "@mui/material";
import { useCallback, useMemo, useState } from "react";
import DashboardCard from "../../components/shared/DashboardCard";
import { useViviendas } from "../hooks";
import { CreateViviendaData, Vivienda, UpdateViviendaData, ViviendaDetalles } from "../types";
import { IconPlus } from "@tabler/icons-react";
import ViviendaDialogForm from "./ViviendaDialogForm";
import ConfirmDialog from "./ConfirmDialog";
import { ViviendaDetallesDialog } from "./ViviendaDetallesDialog";
import { viviendasService } from "../services";

// ✅ CONSTANTES OPTIMIZADAS (fuera del componente)
const TABLE_HEADERS = ['Id', 'Número', 'Dirección', 'Categoría', 'Copropietario', 'Acciones'];

const ROWS_PER_PAGE_OPTIONS = [2, 5, 10, 25, 50];

// ✅ Función para extraer datos (con validaciones seguras)
const getRowData = (vivienda: any) => [
  vivienda?.id || 'N/A',                                          // ID de la vivienda
  vivienda?.numero || 'Sin número',                               // Número de la vivienda
  vivienda?.direccion || 'Sin dirección',                         // Dirección de la vivienda
  vivienda?.categoria?.nombre || 'Sin categoría',                 // Categoría de la vivienda
  vivienda?.copropietario?.usuario?.username || 'Sin asignar',    // Copropietario asignado
];

export default function ViviendasTable() {
  const {
    viviendas,
    loading,
    submitting,   // ✅ Ahora viene del hook
    error,
    page,
    pageSize,
    total,
    changePage,
    changePageSize,
    createVivienda,
    updateVivienda,
    deleteVivienda,
    refetch

  } = useViviendas();

  // ✅ TODOS LOS HOOKS PRIMERO (Reglas de React)
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [selectedVivienda, setSelectedVivienda] = useState<Vivienda | null>(null);
  
  // ✅ Estados para el dialog de confirmación de eliminación
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [viviendaToDelete, setViviendaToDelete] = useState<string | null>(null);

  // ✅ Estados para notificaciones simples
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success'
  });

  // ✅ Estados para el diálogo de detalles
  const [detallesDialogOpen, setDetallesDialogOpen] = useState(false);
  const [viviendaDetalles, setViviendaDetalles] = useState<ViviendaDetalles | null>(null);
  const [loadingDetalles, setLoadingDetalles] = useState(false);

  // ✅ Abrir diálogo para CREAR nueva vivienda
  const handleOpenCreate = useCallback(() => {
    setDialogMode("create");
    setSelectedVivienda(null);
    setDialogOpen(true);
  }, []);

  // ✅ Abrir diálogo para EDITAR vivienda existente
  const handleOpenEdit = useCallback((vivienda: Vivienda) => {
    setDialogMode("edit");
    setSelectedVivienda(vivienda);
    setDialogOpen(true);
  }, []);

  // ✅ Cerrar diálogo
  const handleCloseDialog = useCallback(() => {
    setDialogOpen(false);
    setSelectedVivienda(null);
  }, []);

  // ✅ MÉTODO ESPECÍFICO PARA CREAR
  const handleCreateVivienda = useCallback(async (formData: CreateViviendaData) => {
    try {
      console.log('🚀 CREAR - Iniciando creación de vivienda...');
      
      await createVivienda(formData);
      
      console.log('✅ CREAR - Vivienda creada exitosamente');
      await refetch();
      
      // Mostrar notificación de éxito
      setNotification({
        open: true,
        message: 'Vivienda creada exitosamente',
        severity: 'success'
      });
      
      // Cerrar modal solo si fue exitoso
      setDialogOpen(false);
      setSelectedVivienda(null);
      
    } catch (error) {
      console.error('❌ ERROR CREAR:', error);
      
      // Mostrar notificación de error
      setNotification({
        open: true,
        message: 'Error al crear la vivienda',
        severity: 'error'
      });
      
      // Modal permanece abierto para mostrar error
    }
  }, [createVivienda, refetch]);

  // ✅ MÉTODO ESPECÍFICO PARA EDITAR
  const handleEditVivienda = useCallback(async (formData: UpdateViviendaData) => {
    if (!selectedVivienda) {
      console.error('❌ No hay vivienda seleccionada para editar');
      return;
    }
    
    try {
      console.log('🔄 EDITAR - Iniciando edición de vivienda:', selectedVivienda.id);
      
      await updateVivienda(selectedVivienda.id, formData);
      
      console.log('✅ EDITAR - Vivienda actualizada exitosamente');
      await refetch();
      
      // Mostrar notificación de éxito
      setNotification({
        open: true,
        message: 'Vivienda actualizada exitosamente',
        severity: 'success'
      });
      
      // Cerrar modal solo si fue exitoso
      setDialogOpen(false);
      setSelectedVivienda(null);
      
    } catch (error) {
      console.error('❌ ERROR EDITAR:', error);
      
      // Mostrar notificación de error
      setNotification({
        open: true,
        message: 'Error al actualizar la vivienda',
        severity: 'error'
      });
      
      // Modal permanece abierto para mostrar error
    }
  }, [selectedVivienda, updateVivienda, refetch]);

  // ✅ ABRIR DIALOG DE CONFIRMACIÓN PARA ELIMINAR
  const handleOpenDeleteDialog = useCallback((viviendaId: string) => {
    setViviendaToDelete(viviendaId);
    setConfirmDialogOpen(true);
  }, []);

  // ✅ CERRAR DIALOG DE CONFIRMACIÓN
  const handleCloseDeleteDialog = useCallback(() => {
    setConfirmDialogOpen(false);
    setViviendaToDelete(null);
  }, []);

  // ✅ ABRIR DIÁLOGO DE DETALLES
  const handleOpenDetalles = useCallback(async (viviendaId: string) => {
    try {
      setLoadingDetalles(true);
      setDetallesDialogOpen(true);
      
      const response = await viviendasService.getDetalles(viviendaId);
      setViviendaDetalles(response.data);
    } catch (error) {
      console.error('Error al cargar detalles:', error);
      setNotification({
        open: true,
        message: 'Error al cargar los detalles de la vivienda',
        severity: 'error'
      });
      setDetallesDialogOpen(false);
    } finally {
      setLoadingDetalles(false);
    }
  }, []);

  // ✅ CERRAR DIÁLOGO DE DETALLES
  const handleCloseDetalles = useCallback(() => {
    setDetallesDialogOpen(false);
    setViviendaDetalles(null);
  }, []);

  // ✅ MÉTODO ESPECÍFICO PARA ELIMINAR (SIN CONFIRMACIÓN AQUÍ)
  const handleDeleteVivienda = useCallback(async () => {
    if (!viviendaToDelete) return;
    
    try {
      console.log('🗑️ ELIMINAR - Iniciando eliminación de vivienda:', viviendaToDelete);
      
      // ✅ deleteVivienda ya maneja todo: elimina, actualiza estado y navega páginas
      await deleteVivienda(viviendaToDelete);
      
      console.log('✅ ELIMINAR - Vivienda eliminada exitosamente');
      
      // Mostrar notificación de éxito
      setNotification({
        open: true,
        message: 'Vivienda eliminada exitosamente',
        severity: 'success'
      });
      
      // Cerrar dialog de confirmación
      setConfirmDialogOpen(false);
      setViviendaToDelete(null);
      
    } catch (error) {
      console.error('❌ ERROR ELIMINAR:', error);
      
      // Mostrar notificación de error
      setNotification({
        open: true,
        message: 'Error al eliminar la vivienda',
        severity: 'error'
      });
      
      // El dialog de confirmación permanece abierto para mostrar el error
    }
  }, [viviendaToDelete, deleteVivienda]);

  // ✅ MÉTODO COORDINADOR (decide cuál llamar)
  const handleSubmitVivienda = useCallback(async (formData: CreateViviendaData | UpdateViviendaData) => {
    if (dialogMode === "edit") {
      await handleEditVivienda(formData as UpdateViviendaData);
    } else {
      await handleCreateVivienda(formData as CreateViviendaData);
    }
  }, [dialogMode, handleCreateVivienda, handleEditVivienda]);

  // ✅ Cerrar notificación
  const handleCloseNotification = useCallback(() => {
    setNotification(prev => ({ ...prev, open: false }));
  }, []);

  // ✅ Handlers optimizados con useCallback
  const handleChangePage = useCallback((
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    changePage(newPage + 1); // +1 porque MUI usa base 0 y la API base 1
  }, [changePage]);

  // ✅ Manejar cambio de tamaño de página optimizado
  const handleChangeRowsPerPage = useCallback((
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const newPageSize = parseInt(event.target.value, 10);
    changePageSize(newPageSize);
  }, [changePageSize]);

  // ✅ Headers memoizados (se crean una sola vez)
  const tableHeaders = useMemo(() => (
    TABLE_HEADERS.map((header, index) => (
      <TableCell key={index}>
        <Typography variant="subtitle2" fontWeight={600}>
          {header}
        </Typography>
      </TableCell>
    ))
  ), []);

  // ✅ Rows memoizados - solo si hay viviendas
  const tableRows = useMemo(() => {
    if (!viviendas || viviendas.length === 0) return [];
    
    return viviendas.map((vivienda: Vivienda) => {
      const rowData = getRowData(vivienda);
      
      return (
        <TableRow key={vivienda.id}>
          {rowData.map((data, index) => (
            <TableCell key={index}>
              {index === 3 && vivienda.categoria ? (
                // Celda especial para categoría con tarifa
                <Box>
                  <Typography variant="body2" fontWeight={500}>
                    {vivienda.categoria.nombre}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    ${vivienda.categoria.tarifa_mensual}
                  </Typography>
                </Box>
              ) : (
                <Typography 
                  variant={index === 0 ? "body1" : "body2"}
                  fontWeight={index === 0 ? 600 : index === 1 ? 500 : 400}
                  color={index === 2 ? "primary.main" : "textPrimary"}
                >
                  {data}
                </Typography>
              )}
            </TableCell>
          ))}
          {/* ✅ Celda de Acciones */}
          <TableCell>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Button 
                size="small" 
                variant="contained" 
                color="info"
                onClick={() => handleOpenDetalles(vivienda.id)}
                disabled={loadingDetalles}
              >
                Ver Detalles
              </Button>
              <Button 
                size="small" 
                variant="outlined" 
                onClick={() => handleOpenEdit(vivienda)}
              >
                Editar
              </Button>
              <Button 
                size="small" 
                variant="outlined" 
                color="error"
                onClick={() => handleOpenDeleteDialog(vivienda.id)}
                disabled={submitting}
              >
                Eliminar
              </Button>
            </Box>
          </TableCell>
        </TableRow>
      );
    });
  }, [viviendas, handleOpenEdit, handleOpenDeleteDialog, handleOpenDetalles, submitting, loadingDetalles]);

  // ✅ RENDERIZADO CONDICIONAL (después de todos los hooks)
  if (loading) {
    return (
      <DashboardCard title="Viviendas">
        <Box display="flex" justifyContent="center" p={3}>
          <CircularProgress />
        </Box>
      </DashboardCard>
    );
  }

  if (error) {
    return (
      <DashboardCard title="Viviendas">
        <Alert severity="error">{error}</Alert>
      </DashboardCard>
    );
  }

  return (
    <DashboardCard
      title="Viviendas"
      action={
      <Button
        variant="contained"
        color="primary"
        onClick={handleOpenCreate}
        startIcon={<IconPlus />}  // Opcional: icono
      >
        Nueva Vivienda
      </Button>
    }
    >
      <Box sx={{ overflow: 'auto', width: { xs: '280px', sm: 'auto' } }}>
        <TableContainer>
          <Table
            aria-label="tabla de viviendas"
            sx={{
              whiteSpace: "nowrap",
              mt: 2
            }}
          >
            <TableHead>
              <TableRow>
                {tableHeaders}
              </TableRow>
            </TableHead>
            <TableBody>
              {tableRows.length > 0 ? tableRows : (
                <TableRow>
                  <TableCell colSpan={TABLE_HEADERS.length} align="center">
                    <Typography variant="body1" color="textSecondary" py={4}>
                      No hay viviendas registradas
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        <TablePagination
          component="div"
          count={total}
          page={page - 1} // -1 porque MUI usa base 0 y la API base 1
          rowsPerPage={pageSize}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          showFirstButton={true}    // ← Solo agregar esta línea
          showLastButton={true}     // ← Solo agregar esta línea
          rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
          labelRowsPerPage="Filas por página:"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`
          }
        />
      </Box>

      {/* Dialog para crear/editar viviendas */}
      <ViviendaDialogForm
        open={dialogOpen}
        mode={dialogMode}
        vivienda={selectedVivienda}
        onClose={handleCloseDialog}
        onSubmit={handleSubmitVivienda}
      />

      {/* Dialog de confirmación para eliminar */}
      <ConfirmDialog
        open={confirmDialogOpen}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleDeleteVivienda}
        title="Eliminar Vivienda"
        message={`¿Estás seguro de que quieres eliminar esta vivienda?\n\nEsta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        loading={submitting}
      />

      {/* Diálogo de detalles de vivienda */}
      <ViviendaDetallesDialog
        open={detallesDialogOpen}
        onClose={handleCloseDetalles}
        viviendaDetalles={viviendaDetalles}
        loading={loadingDetalles}
      />

      {/* ✅ Notificación simple */}
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

      {/* ✅ Diálogo de Detalles de Vivienda */}
      <ViviendaDetallesDialog
        open={detallesDialogOpen}
        onClose={handleCloseDetalles}
        viviendaDetalles={viviendaDetalles}
        loading={loadingDetalles}
      />

    </DashboardCard>
  );
}
