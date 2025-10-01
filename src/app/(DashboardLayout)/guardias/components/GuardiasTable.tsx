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
import { useGuardias } from "../hooks";
import { CreateGuardiaData, Guardia, UpdateGuardiaData } from "../types";
import { IconPlus } from "@tabler/icons-react";
import GuardiaDialogForm from "./GuardiaDialogForm";
import ConfirmDialog from "./ConfirmDialog";

// ✅ CONSTANTES OPTIMIZADAS (fuera del componente)
const TABLE_HEADERS = ['Foto', 'Id', 'Usuario', 'Nombre', 'Apellido', 'Email', 'Estado', 'Acciones'];

const ROWS_PER_PAGE_OPTIONS = [2, 5, 10, 25, 50];

// ✅ Función para extraer datos (con validaciones seguras)
const getRowData = (guardia: any) => [
  guardia?.usuario?.foto_perfil_url || null,                       // URL de la foto
  guardia?.id || 'N/A',                                            // ID del guardia
  guardia?.usuario?.username || 'Sin usuario',                     // Nombre de usuario
  guardia?.usuario?.first_name || 'Sin nombre',                    // Nombre
  guardia?.usuario?.last_name || 'Sin apellido',                   // Apellido  
  guardia?.usuario?.email || 'Sin email',                          // Email del usuario
  guardia?.usuario?.is_active ? 'Activo' : 'Inactivo',             // Estado activo/inactivo
];

export default function GuardiasTable() {
  const {
    guardias,
    loading,
    submitting,   // ✅ Ahora viene del hook
    error,
    page,
    pageSize,
    total,
    changePage,
    changePageSize,
    createGuardia,
    updateGuardia,
    deleteGuardia,  // 🆕 Agregar deleteGuardia
    refetch

  } = useGuardias();

  // ✅ TODOS LOS HOOKS PRIMERO (Reglas de React)
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [selectedGuardia, setSelectedGuardia] = useState<Guardia | null>(null);
  
  // ✅ Estados para el dialog de confirmación de eliminación
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [guardiaToDelete, setGuardiaToDelete] = useState<string | null>(null);

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

  // ✅ Abrir diálogo para CREAR nuevo guardia
  const handleOpenCreate = useCallback(() => {
    setDialogMode("create");
    setSelectedGuardia(null);
    setDialogOpen(true);
  }, []);

  // ✅ Abrir diálogo para EDITAR guardia existente
  const handleOpenEdit = useCallback((guardia: Guardia) => {
    setDialogMode("edit");
    setSelectedGuardia(guardia);
    setDialogOpen(true);
  }, []);

  // ✅ Cerrar diálogo
  const handleCloseDialog = useCallback(() => {
    setDialogOpen(false);
    setSelectedGuardia(null);
  }, []);

  // ✅ MÉTODO ESPECÍFICO PARA CREAR
  const handleCreateGuardia = useCallback(async (formData: CreateGuardiaData | FormData) => {
    try {
      console.log('🚀 CREAR - Iniciando creación de guardia...');
      
      await createGuardia(formData);
      
      console.log('✅ CREAR - Guardia creado exitosamente');
      await refetch();
      
      // Mostrar notificación de éxito
      setNotification({
        open: true,
        message: 'Guardia creado exitosamente',
        severity: 'success'
      });
      
      // Cerrar modal solo si fue exitoso
      setDialogOpen(false);
      setSelectedGuardia(null);
      
    } catch (error) {
      console.error('❌ ERROR CREAR:', error);
      
      // Mostrar notificación de error
      setNotification({
        open: true,
        message: 'Error al crear el guardia',
        severity: 'error'
      });
      
      // Modal permanece abierto para mostrar error
    }
  }, [createGuardia, refetch]);

  // ✅ MÉTODO ESPECÍFICO PARA EDITAR
  const handleEditGuardia = useCallback(async (formData: UpdateGuardiaData | FormData) => {
    if (!selectedGuardia) {
      console.error('❌ No hay guardia seleccionado para editar');
      return;
    }
    
    try {
      console.log('🔄 EDITAR - Iniciando edición de guardia:', selectedGuardia.id);
      
      await updateGuardia(selectedGuardia.id, formData);
      
      console.log('✅ EDITAR - Guardia actualizado exitosamente');
      await refetch();
      
      // Mostrar notificación de éxito
      setNotification({
        open: true,
        message: 'Guardia actualizado exitosamente',
        severity: 'success'
      });
      
      // Cerrar modal solo si fue exitoso
      setDialogOpen(false);
      setSelectedGuardia(null);
      
    } catch (error) {
      console.error('❌ ERROR EDITAR:', error);
      
      // Mostrar notificación de error
      setNotification({
        open: true,
        message: 'Error al actualizar el guardia',
        severity: 'error'
      });
      
      // Modal permanece abierto para mostrar error
    }
  }, [selectedGuardia, updateGuardia, refetch]);

  // ✅ ABRIR DIALOG DE CONFIRMACIÓN PARA ELIMINAR
  const handleOpenDeleteDialog = useCallback((guardiaId: string) => {
    setGuardiaToDelete(guardiaId);
    setConfirmDialogOpen(true);
  }, []);

  // ✅ CERRAR DIALOG DE CONFIRMACIÓN
  const handleCloseDeleteDialog = useCallback(() => {
    setConfirmDialogOpen(false);
    setGuardiaToDelete(null);
  }, []);

  // ✅ MÉTODO ESPECÍFICO PARA ELIMINAR (SIN CONFIRMACIÓN AQUÍ)
  const handleDeleteGuardia = useCallback(async () => {
    if (!guardiaToDelete) return;
    
    try {
      console.log('🗑️ ELIMINAR - Iniciando eliminación de guardia:', guardiaToDelete);
      
      // ✅ deleteGuardia ya maneja todo: elimina, actualiza estado y navega páginas
      await deleteGuardia(guardiaToDelete);
      
      console.log('✅ ELIMINAR - Guardia eliminado exitosamente');
      
      // Mostrar notificación de éxito
      setNotification({
        open: true,
        message: 'Guardia eliminado exitosamente',
        severity: 'success'
      });
      
      // Cerrar dialog de confirmación
      setConfirmDialogOpen(false);
      setGuardiaToDelete(null);
      
    } catch (error) {
      console.error('❌ ERROR ELIMINAR:', error);
      
      // Mostrar notificación de error
      setNotification({
        open: true,
        message: 'Error al eliminar el guardia',
        severity: 'error'
      });
      
      // El dialog de confirmación permanece abierto para mostrar el error
    }
  }, [guardiaToDelete, deleteGuardia]);

  // ✅ MÉTODO COORDINADOR (decide cuál llamar)
  const handleSubmitGuardia = useCallback(async (formData: CreateGuardiaData | UpdateGuardiaData | FormData) => {
    if (dialogMode === "edit") {
      await handleEditGuardia(formData as UpdateGuardiaData | FormData);
    } else {
      await handleCreateGuardia(formData as CreateGuardiaData | FormData);
    }
  }, [dialogMode, handleCreateGuardia, handleEditGuardia]);

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

  // ✅ Rows memoizados - solo si hay guardias
  const tableRows = useMemo(() => {
    if (!guardias || guardias.length === 0) return [];
    
    return guardias.map((guardia: Guardia) => {
      const rowData = getRowData(guardia);
      
      return (
        <TableRow key={guardia.id}>
          {rowData.map((data, index) => (
            <TableCell key={index}>
              {index === 0 ? (
                // Celda de foto
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {data ? (
                    <img
                      src={data as string}
                      alt="Foto perfil"
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '1px solid #ddd'
                      }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <Box
                      sx={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        backgroundColor: 'grey.300',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        color: 'grey.600'
                      }}
                    >
                      Sin foto
                    </Box>
                  )}
                </Box>
              ) : (
                // Otras celdas
                <Typography 
                  variant={index === 1 ? "body1" : "body2"}
                  fontWeight={index === 1 ? 600 : index === 2 ? 500 : 400}
                  color={index === 5 ? "primary.main" : index === 6 ? (data === 'Activo' ? 'success.main' : 'error.main') : "textPrimary"}
                >
                  {data}
                </Typography>
              )}
            </TableCell>
          ))}
          {/* ✅ Celda de Acciones */}
          <TableCell>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button 
                size="small" 
                variant="outlined" 
                onClick={() => handleOpenEdit(guardia)}
              >
                Editar
              </Button>
              <Button 
                size="small" 
                variant="outlined" 
                color="error"
                onClick={() => handleOpenDeleteDialog(guardia.id)}
                disabled={submitting}
              >
                Eliminar
              </Button>
            </Box>
          </TableCell>
        </TableRow>
      );
    });
  }, [guardias, handleOpenEdit, handleOpenDeleteDialog, submitting]);

  // ✅ RENDERIZADO CONDICIONAL (después de todos los hooks)
  if (loading) {
    return (
      <DashboardCard title="Guardias">
        <Box display="flex" justifyContent="center" p={3}>
          <CircularProgress />
        </Box>
      </DashboardCard>
    );
  }

  if (error) {
    return (
      <DashboardCard title="Guardias">
        <Alert severity="error">{error}</Alert>
      </DashboardCard>
    );
  }

  return (
    <DashboardCard 
      title="Guardias"
      action={
      <Button 
        variant="contained" 
        color="primary"
        onClick={handleOpenCreate}
        startIcon={<IconPlus />}  // Opcional: icono
      >
        Nuevo Guardia
      </Button>
    }
    >
      <Box sx={{ overflow: 'auto', width: { xs: '280px', sm: 'auto' } }}>
        <TableContainer>
          <Table
            aria-label="tabla de guardias"
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
                      No hay guardias registrados
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
      
      {/* Dialog para crear/editar guardias */}
      <GuardiaDialogForm 
        open={dialogOpen}
        mode={dialogMode}
        guardia={selectedGuardia}
        onClose={handleCloseDialog}
        onSubmit={handleSubmitGuardia}
      />

      {/* Dialog de confirmación para eliminar */}
      <ConfirmDialog
        open={confirmDialogOpen}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleDeleteGuardia}
        title="Eliminar Guardia"
        message={`¿Estás seguro de que quieres eliminar este guardia?\n\nEsta acción no se puede deshacer.`}
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
