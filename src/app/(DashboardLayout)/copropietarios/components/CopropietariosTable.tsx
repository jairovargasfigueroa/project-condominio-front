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
import { useCopropietarios } from "../hooks";
import { CreateCopropietarioData, Copropietario, UpdateCopropietarioData } from "../types";
import { IconPlus } from "@tabler/icons-react";
import CopropietarioDialogForm from "./CopropietarioDialogForm";
import ConfirmDialog from "./ConfirmDialog";


// ✅ CONSTANTES OPTIMIZADAS (fuera del componente)
const TABLE_HEADERS = ['Foto', 'Id', 'Usuario', 'Email', 'Acciones'];

const ROWS_PER_PAGE_OPTIONS = [2, 5, 10, 25, 50];

// ✅ Función para extraer datos (con validaciones seguras)
const getRowData = (copropietario: any) => [
  copropietario?.usuario?.foto_perfil_url || null,                    // URL de la foto
  copropietario?.id || 'N/A',                                          // ID del copropietario
  copropietario?.usuario?.username || 'Sin usuario',                   // Nombre de usuario (validación segura)
  copropietario?.usuario?.email || 'Sin email',                       // Email del usuario (validación segura)
];

export default function CopropietariosTable() {
  const {
    copropietarios,
    loading,
    submitting,   // ✅ Ahora viene del hook
    error,
    page,
    pageSize,
    total,
    changePage,
    changePageSize,
    createCopropietario,
    updateCopropietario,
    deleteCopropietario,  // 🆕 Agregar deleteCopropietario
    refetch

  } = useCopropietarios();

  // ✅ TODOS LOS HOOKS PRIMERO (Reglas de React)
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [selectedCopropietario, setSelectedCopropietario] = useState<Copropietario | null>(null);
  
  // ✅ Estados para el dialog de confirmación de eliminación
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [copropietarioToDelete, setCopropietarioToDelete] = useState<string | null>(null);

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

  // ✅ Abrir diálogo para CREAR nuevo copropietario
  const handleOpenCreate = useCallback(() => {
    setDialogMode("create");
    setSelectedCopropietario(null);
    setDialogOpen(true);
  }, []);

  // ✅ Abrir diálogo para EDITAR copropietario
  const handleOpenEdit = useCallback((copropietario: Copropietario) => {
    setDialogMode("edit");
    setSelectedCopropietario(copropietario);
    setDialogOpen(true);
  }, []);

  // ✅ Cerrar diálogo
  const handleCloseDialog = useCallback(() => {
    setDialogOpen(false);
    setSelectedCopropietario(null);
  }, []);

  // ✅ MÉTODO ESPECÍFICO PARA CREAR
  const handleCreateCopropietario = useCallback(async (formData: CreateCopropietarioData | FormData) => {
    try {
      console.log('🚀 CREAR - Iniciando creación de copropietario...');
      
      await createCopropietario(formData);
      
      console.log('✅ CREAR - Copropietario creado exitosamente');
      await refetch();
      
      // Mostrar notificación de éxito
      setNotification({
        open: true,
        message: 'Copropietario creado exitosamente',
        severity: 'success'
      });
      
      // Cerrar modal solo si fue exitoso
      setDialogOpen(false);
      setSelectedCopropietario(null);
      
    } catch (error) {
      console.error('❌ ERROR CREAR:', error);
      
      // Mostrar notificación de error
      setNotification({
        open: true,
        message: 'Error al crear el copropietario',
        severity: 'error'
      });
      
      // Modal permanece abierto para mostrar error
    }
  }, [createCopropietario, refetch]);

  // ✅ MÉTODO ESPECÍFICO PARA EDITAR
  const handleEditCopropietario = useCallback(async (formData: UpdateCopropietarioData | FormData) => {
    if (!selectedCopropietario) return;
    
    try {
      console.log('🔄 EDITAR - Iniciando edición de copropietario...', selectedCopropietario.id);
      
      await updateCopropietario(selectedCopropietario.id, formData);
      
      console.log('✅ EDITAR - Copropietario editado exitosamente');
      await refetch();
      
      // Mostrar notificación de éxito
      setNotification({
        open: true,
        message: 'Copropietario actualizado exitosamente',
        severity: 'success'
      });
      
      // Cerrar modal solo si fue exitoso
      setDialogOpen(false);
      setSelectedCopropietario(null);
      
    } catch (error) {
      console.error('❌ ERROR EDITAR:', error);
      
      // Mostrar notificación de error
      setNotification({
        open: true,
        message: 'Error al actualizar el copropietario',
        severity: 'error'
      });
      
      // Modal permanece abierto para mostrar error
    }
  }, [selectedCopropietario, updateCopropietario, refetch]);

  // ✅ ABRIR DIALOG DE CONFIRMACIÓN PARA ELIMINAR
  const handleOpenDeleteDialog = useCallback((copropietarioId: string) => {
    setCopropietarioToDelete(copropietarioId);
    setConfirmDialogOpen(true);
  }, []);

  // ✅ CERRAR DIALOG DE CONFIRMACIÓN
  const handleCloseDeleteDialog = useCallback(() => {
    setConfirmDialogOpen(false);
    setCopropietarioToDelete(null);
  }, []);

  // ✅ MÉTODO ESPECÍFICO PARA ELIMINAR
  const handleDeleteCopropietario = useCallback(async () => {
    if (!copropietarioToDelete) return;
    
    try {
      console.log('🗑️ ELIMINAR - Iniciando eliminación...', copropietarioToDelete);
      
      await deleteCopropietario(copropietarioToDelete);
      
      console.log('✅ ELIMINAR - Copropietario eliminado exitosamente');
      
      // Mostrar notificación de éxito
      setNotification({
        open: true,
        message: 'Copropietario eliminado exitosamente',
        severity: 'success'
      });
      
      // Cerrar dialog de confirmación
      setConfirmDialogOpen(false);
      setCopropietarioToDelete(null);
      
    } catch (error) {
      console.error('❌ ERROR ELIMINAR:', error);
      
      // Mostrar notificación de error
      setNotification({
        open: true,
        message: 'Error al eliminar el copropietario',
        severity: 'error'
      });
      
      // Cerrar dialog de confirmación aunque haya error
      setConfirmDialogOpen(false);
      setCopropietarioToDelete(null);
    }
  }, [copropietarioToDelete, deleteCopropietario]);

  // ✅ CERRAR NOTIFICACIÓN
  const handleCloseNotification = useCallback(() => {
    setNotification(prev => ({ ...prev, open: false }));
  }, []);

  // ✅ SUBMIT UNIFICADO DEL FORM
  const handleSubmit = useCallback(async (formData: CreateCopropietarioData | UpdateCopropietarioData | FormData) => {
    if (dialogMode === "create") {
      await handleCreateCopropietario(formData as CreateCopropietarioData | FormData);
    } else {
      await handleEditCopropietario(formData as UpdateCopropietarioData | FormData);
    }
  }, [dialogMode, handleCreateCopropietario, handleEditCopropietario]);

  // ✅ CAMBIO DE PÁGINA
  const handlePageChange = useCallback((_: unknown, newPage: number) => {
    console.log('📄 Cambio de página:', newPage + 1);
    changePage(newPage + 1);
  }, [changePage]);

  // ✅ CAMBIO DE TAMAÑO DE PÁGINA
  const handlePageSizeChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const newSize = parseInt(event.target.value, 10);
    console.log('📏 Cambio de tamaño de página:', newSize);
    changePageSize(newSize);
  }, [changePageSize]);

  // ✅ Headers memoizados (constante, no cambia)
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

  // ✅ Mensaje de tabla vacía memoizado
  const emptyMessage = useMemo(() => (
    <TableRow>
      <TableCell colSpan={TABLE_HEADERS.length} align="center">
        <Typography variant="body2" color="textSecondary" sx={{ py: 3 }}>
          No hay copropietarios registrados
        </Typography>
      </TableCell>
    </TableRow>
  ), []);

  // ✅ Rows memoizados - solo si hay copropietarios
  const tableRows = useMemo(() => {
    if (!copropietarios || copropietarios.length === 0) return [];
    
    return copropietarios.map((copropietario: Copropietario) => {
      const rowData = getRowData(copropietario);
      
      return (
        <TableRow key={copropietario.id}>
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
                  color={index === 3 ? "primary.main" : "textPrimary"}
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
                onClick={() => handleOpenEdit(copropietario)}
              >
                Editar
              </Button>
              <Button 
                size="small" 
                variant="outlined" 
                color="error"
                onClick={() => handleOpenDeleteDialog(copropietario.id)}
                disabled={submitting}
              >
                Eliminar
              </Button>
            </Box>
          </TableCell>
        </TableRow>
      );
    });
  }, [copropietarios, handleOpenEdit, handleOpenDeleteDialog, submitting]);

  // ✅ RENDERIZADO CONDICIONAL (después de todos los hooks)
  if (loading) {
    return (
      <DashboardCard title="Copropietarios">
        <Box display="flex" justifyContent="center" p={3}>
          <CircularProgress />
        </Box>
      </DashboardCard>
    );
  }

  if (error) {
    return (
      <DashboardCard title="Copropietarios">
        <Alert severity="error">{error}</Alert>
      </DashboardCard>
    );
  }

  return (
    <DashboardCard
      title="Copropietarios"
      action={
      <Button
        variant="contained"
        color="primary"
        onClick={handleOpenCreate}
        startIcon={<IconPlus />}  // Opcional: icono
      >
        Nuevo Copropietario
      </Button>
      }
    >
      {/* ✅ Tabla con datos */}
      <Box sx={{ overflow: 'auto', width: { xs: '280px', sm: 'auto' } }}>
        <Table
          aria-label="tabla de copropietarios"
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

      {/* ✅ Paginación - Solo mostrar si hay datos */}
      {total > 0 && (
        <TablePagination
          component="div"
          count={total}
          page={page - 1} // MUI usa 0-based, nosotros 1-based
          onPageChange={handlePageChange}
          rowsPerPage={pageSize}
          onRowsPerPageChange={handlePageSizeChange}
          rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
          labelRowsPerPage="Filas por página:"
          labelDisplayedRows={({ from, to, count }) => 
            `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`
          }
        />
      )}

      {/* ✅ Modal de creación/edición */}
      <CopropietarioDialogForm
        open={dialogOpen}
        onClose={handleCloseDialog}
        onSubmit={handleSubmit}
        mode={dialogMode}
        initialData={selectedCopropietario}
        submitting={submitting}
      />

      {/* ✅ Dialog de confirmación para eliminar */}
      <ConfirmDialog
        open={confirmDialogOpen}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleDeleteCopropietario}
        title="Confirmar eliminación"
        message="¿Estás seguro de que deseas eliminar este copropietario?"
        submitting={submitting}
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