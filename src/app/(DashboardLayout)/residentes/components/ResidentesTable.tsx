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
import { useResidentes } from "../hooks";
import { CreateResidenteData, Residente, UpdateResidenteData } from "../types";
import { IconPlus } from "@tabler/icons-react";
import ResidenteDialogForm from "./ResidenteDialogForm";
import ConfirmDialog from "./ConfirmDialog";

// ✅ CONSTANTES OPTIMIZADAS (fuera del componente)
const TABLE_HEADERS = ['Id', 'Usuario', 'Email', 'Zona', 'Acciones'];

const ROWS_PER_PAGE_OPTIONS = [2, 5, 10, 25, 50];

// ✅ Función para extraer datos (con validaciones seguras)
const getRowData = (residente: any) => [
  residente?.id || 'N/A',                                          // ID del residente
  residente?.usuario?.username || 'Sin usuario',                   // Nombre de usuario (validación segura)
  residente?.usuario?.email || 'Sin email',                       // Email del usuario (validación segura)
  residente?.zona || 'Sin zona',                                  // Zona del residente
];

export default function ResidentesTable() {
  const {
    residentes,
    loading,
    submitting,   // ✅ Ahora viene del hook
    error,
    page,
    pageSize,
    total,
    changePage,
    changePageSize,
    createResidente,
    updateResidente,
    deleteResidente,  // 🆕 Agregar deleteResidente
    refetch

  } = useResidentes();

  // ✅ TODOS LOS HOOKS PRIMERO (Reglas de React)
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [selectedResidente, setSelectedResidente] = useState<Residente | null>(null);
  // ❌ ELIMINADO: const [submitting, setSubmitting] = useState(false); - Ahora viene del hook
  
  // ✅ Estados para el dialog de confirmación de eliminación
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [residenteToDelete, setResidenteToDelete] = useState<string | null>(null);

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

  // ✅ Abrir diálogo para CREAR nuevo residente
  const handleOpenCreate = useCallback(() => {
    setDialogMode("create");
    setSelectedResidente(null);
    setDialogOpen(true);
  }, []);

  // ✅ Abrir diálogo para EDITAR residente existente
  const handleOpenEdit = useCallback((residente: Residente) => {
    setDialogMode("edit");
    setSelectedResidente(residente);
    setDialogOpen(true);
  }, []);

  // ✅ Cerrar diálogo
  const handleCloseDialog = useCallback(() => {
    setDialogOpen(false);
    setSelectedResidente(null);
  }, []);

  // ✅ MÉTODO ESPECÍFICO PARA CREAR
  const handleCreateResidente = useCallback(async (formData: CreateResidenteData) => {
    try {
      // ❌ ELIMINADO: setSubmitting(true); - El hook lo maneja automáticamente
      console.log('🚀 CREAR - Iniciando creación de residente...');
      
      await createResidente(formData);
      
      console.log('✅ CREAR - Residente creado exitosamente');
      await refetch();
      
      // Mostrar notificación de éxito
      setNotification({
        open: true,
        message: 'Residente creado exitosamente',
        severity: 'success'
      });
      
      // Cerrar modal solo si fue exitoso
      setDialogOpen(false);
      setSelectedResidente(null);
      
    } catch (error) {
      console.error('❌ ERROR CREAR:', error);
      
      // Mostrar notificación de error
      setNotification({
        open: true,
        message: 'Error al crear el residente',
        severity: 'error'
      });
      
      // Modal permanece abierto para mostrar error
    }
    // ❌ ELIMINADO: finally con setSubmitting(false) - El hook lo maneja automáticamente
  }, [createResidente, refetch]);

  // ✅ MÉTODO ESPECÍFICO PARA EDITAR
  const handleEditResidente = useCallback(async (formData: UpdateResidenteData) => {
    if (!selectedResidente) {
      console.error('❌ No hay residente seleccionado para editar');
      return;
    }
    
    try {
      // ❌ ELIMINADO: setSubmitting(true); - El hook lo maneja automáticamente
      console.log('🔄 EDITAR - Iniciando edición de residente:', selectedResidente.id);
      
      await updateResidente(selectedResidente.id, formData);
      
      console.log('✅ EDITAR - Residente actualizado exitosamente');
      await refetch();
      
      // Mostrar notificación de éxito
      setNotification({
        open: true,
        message: 'Residente actualizado exitosamente',
        severity: 'success'
      });
      
      // Cerrar modal solo si fue exitoso
      setDialogOpen(false);
      setSelectedResidente(null);
      
    } catch (error) {
      console.error('❌ ERROR EDITAR:', error);
      
      // Mostrar notificación de error
      setNotification({
        open: true,
        message: 'Error al actualizar el residente',
        severity: 'error'
      });
      
      // Modal permanece abierto para mostrar error
    }
    // ❌ ELIMINADO: finally con setSubmitting(false) - El hook lo maneja automáticamente
  }, [selectedResidente, updateResidente, refetch]);

  // ✅ ABRIR DIALOG DE CONFIRMACIÓN PARA ELIMINAR
  const handleOpenDeleteDialog = useCallback((residenteId: string) => {
    setResidenteToDelete(residenteId);
    setConfirmDialogOpen(true);
  }, []);

  // ✅ CERRAR DIALOG DE CONFIRMACIÓN
  const handleCloseDeleteDialog = useCallback(() => {
    setConfirmDialogOpen(false);
    setResidenteToDelete(null);
  }, []);

  // ✅ MÉTODO ESPECÍFICO PARA ELIMINAR (SIN CONFIRMACIÓN AQUÍ)
  const handleDeleteResidente = useCallback(async () => {
    if (!residenteToDelete) return;
    
    try {
      // ❌ ELIMINADO: setSubmitting(true); - El hook lo maneja automáticamente
      console.log('🗑️ ELIMINAR - Iniciando eliminación de residente:', residenteToDelete);
      
      // ✅ deleteResidente ya maneja todo: elimina, actualiza estado y navega páginas
      await deleteResidente(residenteToDelete);
      
      console.log('✅ ELIMINAR - Residente eliminado exitosamente');
      // ❌ NO llamar refetch() aquí - deleteResidente ya manejó todo
      
      // Mostrar notificación de éxito
      setNotification({
        open: true,
        message: 'Residente eliminado exitosamente',
        severity: 'success'
      });
      
      // Cerrar dialog de confirmación
      setConfirmDialogOpen(false);
      setResidenteToDelete(null);
      
    } catch (error) {
      console.error('❌ ERROR ELIMINAR:', error);
      
      // Mostrar notificación de error
      setNotification({
        open: true,
        message: 'Error al eliminar el residente',
        severity: 'error'
      });
      
      // El dialog de confirmación permanece abierto para mostrar el error
    }
    // ❌ ELIMINADO: finally con setSubmitting(false) - El hook lo maneja automáticamente
  }, [residenteToDelete, deleteResidente]);

  // ✅ MÉTODO COORDINADOR (decide cuál llamar)
  const handleSubmitResidente = useCallback(async (formData: CreateResidenteData | UpdateResidenteData) => {
    if (dialogMode === "edit") {
      await handleEditResidente(formData as UpdateResidenteData);
    } else {
      await handleCreateResidente(formData as CreateResidenteData);
    }
  }, [dialogMode, handleCreateResidente, handleEditResidente]);

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

  // ✅ Rows memoizados - solo si hay residentes
  const tableRows = useMemo(() => {
    if (!residentes || residentes.length === 0) return [];
    
    return residentes.map((residente: Residente) => {
      const rowData = getRowData(residente);
      
      return (
        <TableRow key={residente.id}>
          {rowData.map((data, index) => (
            <TableCell key={index}>
              <Typography 
                variant={index === 0 ? "body1" : "body2"}
                fontWeight={index === 0 ? 600 : index === 1 ? 500 : 400}
                color={index === 2 ? "primary.main" : "textPrimary"}
              >
                {data}
              </Typography>
            </TableCell>
          ))}
          {/* ✅ Celda de Acciones */}
          <TableCell>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button 
                size="small" 
                variant="outlined" 
                onClick={() => handleOpenEdit(residente)}
              >
                Editar
              </Button>
              <Button 
                size="small" 
                variant="outlined" 
                color="error"
                onClick={() => handleOpenDeleteDialog(residente.id)}
                disabled={submitting}
              >
                Eliminar
              </Button>
            </Box>
          </TableCell>
        </TableRow>
      );
    });
  }, [residentes, handleOpenEdit, handleOpenDeleteDialog, submitting]);

  // ✅ RENDERIZADO CONDICIONAL (después de todos los hooks)
  if (loading) {
    return (
      <DashboardCard title="Residentes">
        <Box display="flex" justifyContent="center" p={3}>
          <CircularProgress />
        </Box>
      </DashboardCard>
    );
  }

  if (error) {
    return (
      <DashboardCard title="Residentes">
        <Alert severity="error">{error}</Alert>
      </DashboardCard>
    );
  }

  // Si no hay residentes, mostrar mensaje
  if (!residentes || residentes.length === 0) {
    return (
      <DashboardCard title="Residentes">
        <Box display="flex" flexDirection="column" alignItems="center" p={3}>
          <Typography variant="body1" color="textSecondary" mb={2}>
            No hay residentes registrados
          </Typography>
          <Button 
            variant="contained" 
            color="primary"
            onClick={handleOpenCreate}
            startIcon={<IconPlus />}
          >
            Crear Primer Residente
          </Button>
        </Box>
      </DashboardCard>
    );
  }

  return (
    <DashboardCard 
      title="Residentes"
      action={
      <Button 
        variant="contained" 
        color="primary"
        onClick={handleOpenCreate}
        startIcon={<IconPlus />}  // Opcional: icono
      >
        Nuevo Residente
      </Button>
    }
    >
      <Box sx={{ overflow: 'auto', width: { xs: '280px', sm: 'auto' } }}>
        <TableContainer>
          <Table
            aria-label="tabla de residentes"
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
              {tableRows}
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
      
      {/* Dialog para crear/editar residentes */}
      <ResidenteDialogForm 
        open={dialogOpen}
        mode={dialogMode}
        residente={selectedResidente}
        onClose={handleCloseDialog}
        onSubmit={handleSubmitResidente}
      />

      {/* Dialog de confirmación para eliminar */}
      <ConfirmDialog
        open={confirmDialogOpen}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleDeleteResidente}
        title="Eliminar Residente"
        message={`¿Estás seguro de que quieres eliminar este residente?\n\nEsta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        loading={submitting}
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

    </DashboardCard>
  );
}