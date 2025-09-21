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
import { useVehiculos } from "../hooks";
import { CreateVehiculoData, Vehiculo, UpdateVehiculoData } from "../types";
import { IconPlus, IconEdit, IconTrash } from "@tabler/icons-react";
import VehiculoDialogForm from "./VehiculoDialogForm";
import ConfirmDialog from "./ConfirmDialog";

// ✅ CONSTANTES OPTIMIZADAS (fuera del componente)
const TABLE_HEADERS = ['Id', 'Usuario', 'Placa', 'Marca', 'Modelo', 'Color', 'Acciones'];

const ROWS_PER_PAGE_OPTIONS = [2, 5, 10, 25, 50];

// ✅ Función para extraer datos (con validaciones seguras)
const getRowData = (vehiculo: any) => [
  vehiculo?.id || 'N/A',                                          // ID del vehículo
  vehiculo?.usuario?.username || 'Sin usuario',                   // Username del usuario (validación segura)
  vehiculo?.placa || 'Sin placa',                                 // Placa del vehículo
  vehiculo?.marca || 'Sin marca',                                 // Marca del vehículo
  vehiculo?.modelo || 'Sin modelo',                               // Modelo del vehículo
  vehiculo?.color || 'Sin color',                                 // Color del vehículo
];

export default function VehiculosTable() {
  const {
    vehiculos,
    loading,
    submitting,   // ✅ Ahora viene del hook
    error,
    page,
    pageSize,
    total,
    changePage,
    changePageSize,
    createVehiculo,
    updateVehiculo,
    deleteVehiculo,  // 🆕 Agregar deleteVehiculo
    refetch

  } = useVehiculos();

  // ✅ TODOS LOS HOOKS PRIMERO (Reglas de React)
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [selectedVehiculo, setSelectedVehiculo] = useState<Vehiculo | null>(null);

  // ✅ Estados para el dialog de confirmación de eliminación
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [vehiculoToDelete, setVehiculoToDelete] = useState<number | null>(null);

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

  // ✅ Abrir diálogo para CREAR nuevo vehículo
  const handleOpenCreate = useCallback(() => {
    setDialogMode("create");
    setSelectedVehiculo(null);
    setDialogOpen(true);
  }, []);

  // ✅ Abrir diálogo para EDITAR vehículo existente
  const handleOpenEdit = useCallback((vehiculo: Vehiculo) => {
    setDialogMode("edit");
    setSelectedVehiculo(vehiculo);
    setDialogOpen(true);
  }, []);

  // ✅ Cerrar diálogo
  const handleCloseDialog = useCallback(() => {
    setDialogOpen(false);
    setSelectedVehiculo(null);
  }, []);

  // ✅ MÉTODO ESPECÍFICO PARA CREAR
  const handleCreateVehiculo = useCallback(async (formData: CreateVehiculoData) => {
    try {
      console.log('🚀 CREAR - Iniciando creación de vehículo...');

      await createVehiculo(formData);

      console.log('✅ CREAR - Vehículo creado exitosamente');
      await refetch();

      // Mostrar notificación de éxito
      setNotification({
        open: true,
        message: 'Vehículo creado exitosamente',
        severity: 'success'
      });

      // Cerrar modal solo si fue exitoso
      setDialogOpen(false);
      setSelectedVehiculo(null);

    } catch (error) {
      console.error('❌ ERROR CREAR:', error);

      // Mostrar notificación de error
      setNotification({
        open: true,
        message: 'Error al crear el vehículo',
        severity: 'error'
      });

      // Modal permanece abierto para mostrar error
    }
  }, [createVehiculo, refetch]);

  // ✅ MÉTODO ESPECÍFICO PARA EDITAR
  const handleEditVehiculo = useCallback(async (formData: UpdateVehiculoData) => {
    if (!selectedVehiculo) {
      console.error('❌ No hay vehículo seleccionado para editar');
      return;
    }

    try {
      console.log('🔄 EDITAR - Iniciando edición de vehículo:', selectedVehiculo.id);

      await updateVehiculo(selectedVehiculo.id, formData);

      console.log('✅ EDITAR - Vehículo actualizado exitosamente');
      await refetch();

      // Mostrar notificación de éxito
      setNotification({
        open: true,
        message: 'Vehículo actualizado exitosamente',
        severity: 'success'
      });

      // Cerrar modal solo si fue exitoso
      setDialogOpen(false);
      setSelectedVehiculo(null);

    } catch (error) {
      console.error('❌ ERROR EDITAR:', error);

      // Mostrar notificación de error
      setNotification({
        open: true,
        message: 'Error al actualizar el vehículo',
        severity: 'error'
      });

      // Modal permanece abierto para mostrar error
    }
  }, [selectedVehiculo, updateVehiculo, refetch]);

  // ✅ ABRIR DIALOG DE CONFIRMACIÓN PARA ELIMINAR
  const handleOpenDeleteDialog = useCallback((vehiculoId: number) => {
    setVehiculoToDelete(vehiculoId);
    setConfirmDialogOpen(true);
  }, []);

  // ✅ CERRAR DIALOG DE CONFIRMACIÓN
  const handleCloseDeleteDialog = useCallback(() => {
    setConfirmDialogOpen(false);
    setVehiculoToDelete(null);
  }, []);

  // ✅ MÉTODO ESPECÍFICO PARA ELIMINAR (SIN CONFIRMACIÓN AQUÍ)
  const handleDeleteVehiculo = useCallback(async () => {
    if (!vehiculoToDelete) return;

    try {
      console.log('🗑️ ELIMINAR - Iniciando eliminación de vehículo:', vehiculoToDelete);

      // ✅ deleteVehiculo ya maneja todo: elimina, actualiza estado y navega páginas
      await deleteVehiculo(vehiculoToDelete);

      console.log('✅ ELIMINAR - Vehículo eliminado exitosamente');

      // Mostrar notificación de éxito
      setNotification({
        open: true,
        message: 'Vehículo eliminado exitosamente',
        severity: 'success'
      });

      // Cerrar dialog de confirmación
      setConfirmDialogOpen(false);
      setVehiculoToDelete(null);

    } catch (error) {
      console.error('❌ ERROR ELIMINAR:', error);

      // Mostrar notificación de error
      setNotification({
        open: true,
        message: 'Error al eliminar el vehículo',
        severity: 'error'
      });

      // Cerrar dialog de confirmación de todos modos
      setConfirmDialogOpen(false);
      setVehiculoToDelete(null);
    }
  }, [vehiculoToDelete, deleteVehiculo]);

  // ✅ Cerrar notificación
  const handleCloseNotification = useCallback(() => {
    setNotification(prev => ({ ...prev, open: false }));
  }, []);

  // ✅ Handler unificado para formulario (decide si crear o editar)
  const handleFormSubmit = useCallback((formData: CreateVehiculoData | UpdateVehiculoData) => {
    if (dialogMode === "create") {
      return handleCreateVehiculo(formData as CreateVehiculoData);
    } else {
      return handleEditVehiculo(formData as UpdateVehiculoData);
    }
  }, [dialogMode, handleCreateVehiculo, handleEditVehiculo]);

  // ✅ Handler para cambiar página (0-indexed para MUI)
  const handleChangePage = useCallback((_event: unknown, newPage: number) => {
    changePage(newPage + 1); // Convertir a 1-indexed para tu API
  }, [changePage]);

  // ✅ Handler para cambiar rows per page
  const handleChangeRowsPerPage = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const newPageSize = parseInt(event.target.value, 10);
    changePageSize(newPageSize);
  }, [changePageSize]);

  // ✅ Memoizar filas de tabla para evitar re-renders innecesarios
  const tableRows = useMemo(() => {
    return vehiculos.map((vehiculo) => {
      const rowData = getRowData(vehiculo);
      return (
        <TableRow key={vehiculo.id} hover>
          {rowData.map((data, index) => (
            <TableCell key={index}>
              <Typography variant="body2" fontWeight={400}>
                {data}
              </Typography>
            </TableCell>
          ))}
          <TableCell>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                size="small"
                variant="outlined"
                color="primary"
                onClick={() => handleOpenEdit(vehiculo)}
                disabled={submitting}
                startIcon={<IconEdit size={16} />}
              >
                Editar
              </Button>
              <Button
                size="small"
                variant="outlined"
                color="error"
                onClick={() => handleOpenDeleteDialog(vehiculo.id)}
                disabled={submitting}
                startIcon={<IconTrash size={16} />}
              >
                Eliminar
              </Button>
            </Box>
          </TableCell>
        </TableRow>
      );
    });
  }, [vehiculos, submitting, handleOpenEdit, handleOpenDeleteDialog]);

  return (
    <>
      <DashboardCard
        title="Gestión de Vehículos"
        action={
          <Button
            variant="contained"
            color="primary"
            onClick={handleOpenCreate}
            disabled={submitting}
            startIcon={<IconPlus size={20} />}
          >
            Nuevo Vehículo
          </Button>
        }
      >
        {/* ✅ ERROR STATE */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* ✅ LOADING STATE */}
        {loading ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: 200
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <>
            {/* ✅ TABLA */}
            <TableContainer>
              <Table aria-label="tabla de vehículos">
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
                <TableBody>
                  {tableRows}
                </TableBody>
              </Table>
            </TableContainer>

            {/* ✅ PAGINACIÓN */}
            <TablePagination
              rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
              component="div"
              count={total}
              rowsPerPage={pageSize}
              page={page - 1} // Convertir a 0-indexed para MUI
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage="Filas por página:"
              labelDisplayedRows={({ from, to, count }) =>
                `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`
              }
            />
          </>
        )}
      </DashboardCard>

      {/* ✅ DIALOG DE FORMULARIO */}
      <VehiculoDialogForm
        open={dialogOpen}
        onClose={handleCloseDialog}
        mode={dialogMode}
        vehiculo={selectedVehiculo}
        onSubmit={handleFormSubmit}
      />

      {/* ✅ DIALOG DE CONFIRMACIÓN DE ELIMINACIÓN */}
      <ConfirmDialog
        open={confirmDialogOpen}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleDeleteVehiculo}
        title="Eliminar Vehículo"
        message="¿Estás seguro de que quieres eliminar este vehículo? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        loading={submitting}
      />

      {/* ✅ NOTIFICACIONES */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </>
  );
}
