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
import { useAreasComunes } from "../hooks";
import { CreateAreaComunData, AreaComun, UpdateAreaComunData } from "../types";
import { IconPlus } from "@tabler/icons-react";
import AreaComunDialogForm from "./AreaComunDialogForm";
import ConfirmDialog from "./ConfirmDialog";

// ✅ CONSTANTES OPTIMIZADAS (fuera del componente)
const TABLE_HEADERS = ['Id', 'Nombre', 'Tipo', 'Costo', 'Acciones'];

const ROWS_PER_PAGE_OPTIONS = [2, 5, 10, 25, 50];

// ✅ Función para extraer datos (con validaciones seguras)
const getRowData = (areaComun: any) => {
  // 🔍 DEBUG: Ver el costo original
  console.log(`💰 COSTO DEBUG - Area ${areaComun?.id}:`, {
    costo_original: areaComun?.costo,
    tipo_costo: typeof areaComun?.costo,
    costo_parseado: parseFloat(areaComun?.costo || 0)
  });

  const costoNumerico = parseFloat(areaComun?.costo || 0);
  const costoFormateado = `$${costoNumerico.toFixed(2)}`;

  return [
    areaComun?.id || 'N/A',                                          // ID del area común
    areaComun?.nombre || 'Sin nombre',                               // Nombre del area común
    areaComun?.tipo === 'gratuita' ? 'Gratuita' : 'De Pago',        // Tipo legible
    costoFormateado,                                                 // Costo formateado correctamente
  ];
};

export default function AreasComunesTable() {
  const {
    areasComunes,
    loading,
    submitting,   // ✅ Ahora viene del hook
    error,
    page,
    pageSize,
    total,
    changePage,
    changePageSize,
    createAreaComun,
    updateAreaComun,
    deleteAreaComun,  // 🆕 Agregar deleteAreaComun
    refetch

  } = useAreasComunes();

  // ✅ TODOS LOS HOOKS PRIMERO (Reglas de React)
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [selectedAreaComun, setSelectedAreaComun] = useState<AreaComun | null>(null);
  
  // ✅ Estados para el dialog de confirmación de eliminación
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [areaComunToDelete, setAreaComunToDelete] = useState<string | null>(null);

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

  // ✅ Abrir diálogo para CREAR nueva area común
  const handleOpenCreate = useCallback(() => {
    setDialogMode("create");
    setSelectedAreaComun(null);
    setDialogOpen(true);
  }, []);

  // ✅ Abrir diálogo para EDITAR area común existente
  const handleOpenEdit = useCallback((areaComun: AreaComun) => {
    setDialogMode("edit");
    setSelectedAreaComun(areaComun);
    setDialogOpen(true);
  }, []);

  // ✅ Cerrar diálogo
  const handleCloseDialog = useCallback(() => {
    setDialogOpen(false);
    setSelectedAreaComun(null);
  }, []);

  // ✅ MÉTODO ESPECÍFICO PARA CREAR
  const handleCreateAreaComun = useCallback(async (formData: CreateAreaComunData) => {
    try {
      console.log('🚀 CREAR - Iniciando creación de area común...');
      
      await createAreaComun(formData);
      
      console.log('✅ CREAR - Area común creada exitosamente');
      await refetch();
      
      // Mostrar notificación de éxito
      setNotification({
        open: true,
        message: 'Area común creada exitosamente',
        severity: 'success'
      });
      
      // Cerrar modal solo si fue exitoso
      setDialogOpen(false);
      setSelectedAreaComun(null);
      
    } catch (error) {
      console.error('❌ ERROR CREAR:', error);
      
      // Mostrar notificación de error
      setNotification({
        open: true,
        message: 'Error al crear el area común',
        severity: 'error'
      });
      
      // Modal permanece abierto para mostrar error
    }
  }, [createAreaComun, refetch]);

  // ✅ MÉTODO ESPECÍFICO PARA EDITAR
  const handleEditAreaComun = useCallback(async (formData: UpdateAreaComunData) => {
    if (!selectedAreaComun) {
      console.error('❌ No hay area común seleccionada para editar');
      return;
    }
    
    try {
      console.log('🔄 EDITAR - Iniciando edición de area común:', selectedAreaComun.id);
      
      await updateAreaComun(selectedAreaComun.id, formData);
      
      console.log('✅ EDITAR - Area común actualizada exitosamente');
      await refetch();
      
      // Mostrar notificación de éxito
      setNotification({
        open: true,
        message: 'Area común actualizada exitosamente',
        severity: 'success'
      });
      
      // Cerrar modal solo si fue exitoso
      setDialogOpen(false);
      setSelectedAreaComun(null);
      
    } catch (error) {
      console.error('❌ ERROR EDITAR:', error);
      
      // Mostrar notificación de error
      setNotification({
        open: true,
        message: 'Error al actualizar el area común',
        severity: 'error'
      });
      
      // Modal permanece abierto para mostrar error
    }
  }, [selectedAreaComun, updateAreaComun, refetch]);

  // ✅ ABRIR DIALOG DE CONFIRMACIÓN PARA ELIMINAR
  const handleOpenDeleteDialog = useCallback((areaComunId: string) => {
    setAreaComunToDelete(areaComunId);
    setConfirmDialogOpen(true);
  }, []);

  // ✅ CERRAR DIALOG DE CONFIRMACIÓN
  const handleCloseDeleteDialog = useCallback(() => {
    setConfirmDialogOpen(false);
    setAreaComunToDelete(null);
  }, []);

  // ✅ MÉTODO ESPECÍFICO PARA ELIMINAR (SIN CONFIRMACIÓN AQUÍ)
  const handleDeleteAreaComun = useCallback(async () => {
    if (!areaComunToDelete) return;
    
    try {
      console.log('🗑️ ELIMINAR - Iniciando eliminación de area común:', areaComunToDelete);
      
      // ✅ deleteAreaComun ya maneja todo: elimina, actualiza estado y navega páginas
      await deleteAreaComun(areaComunToDelete);
      
      console.log('✅ ELIMINAR - Area común eliminada exitosamente');
      
      // Mostrar notificación de éxito
      setNotification({
        open: true,
        message: 'Area común eliminada exitosamente',
        severity: 'success'
      });
      
      // Cerrar dialog de confirmación
      setConfirmDialogOpen(false);
      setAreaComunToDelete(null);
      
    } catch (error) {
      console.error('❌ ERROR ELIMINAR:', error);
      
      // Mostrar notificación de error
      setNotification({
        open: true,
        message: 'Error al eliminar el area común',
        severity: 'error'
      });
      
      // El dialog de confirmación permanece abierto para mostrar el error
    }
  }, [areaComunToDelete, deleteAreaComun]);

  // ✅ MÉTODO COORDINADOR (decide cuál llamar)
  const handleSubmitAreaComun = useCallback(async (formData: CreateAreaComunData | UpdateAreaComunData) => {
    if (dialogMode === "edit") {
      await handleEditAreaComun(formData as UpdateAreaComunData);
    } else {
      await handleCreateAreaComun(formData as CreateAreaComunData);
    }
  }, [dialogMode, handleCreateAreaComun, handleEditAreaComun]);

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

  // ✅ Rows memoizados - solo si hay areas comunes
  const tableRows = useMemo(() => {
    if (!areasComunes || areasComunes.length === 0) return [];
    
    // 🔍 DEBUG: Ver qué datos llegan del backend
    console.log('📊 TABLA - Areas comunes recibidas:', areasComunes);
    
    return areasComunes.map((areaComun: AreaComun) => {
      const rowData = getRowData(areaComun);
      
      // 🔍 DEBUG: Ver datos procesados para cada fila
      console.log(`📝 TABLA - Area ${areaComun.id}:`, {
        original: areaComun,
        procesado: rowData
      });
      
      return (
        <TableRow key={areaComun.id}>
          {rowData.map((data, index) => (
            <TableCell key={index}>
              <Typography 
                variant={index === 0 ? "body1" : "body2"}
                fontWeight={index === 0 ? 600 : index === 1 ? 500 : 400}
                color={index === 3 ? "success.main" : "textPrimary"}
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
                onClick={() => handleOpenEdit(areaComun)}
              >
                Editar
              </Button>
              <Button 
                size="small" 
                variant="outlined" 
                color="error"
                onClick={() => handleOpenDeleteDialog(areaComun.id)}
                disabled={submitting}
              >
                Eliminar
              </Button>
            </Box>
          </TableCell>
        </TableRow>
      );
    });
  }, [areasComunes, handleOpenEdit, handleOpenDeleteDialog, submitting]);

  // ✅ RENDERIZADO CONDICIONAL (después de todos los hooks)
  if (loading) {
    return (
      <DashboardCard title="Areas Comunes">
        <Box display="flex" justifyContent="center" p={3}>
          <CircularProgress />
        </Box>
      </DashboardCard>
    );
  }

  if (error) {
    return (
      <DashboardCard title="Areas Comunes">
        <Alert severity="error">{error}</Alert>
      </DashboardCard>
    );
  }

  return (
    <DashboardCard 
      title="Areas Comunes"
      action={
      <Button 
        variant="contained" 
        color="primary"
        onClick={handleOpenCreate}
        startIcon={<IconPlus />}  // Opcional: icono
      >
        Nueva Area Común
      </Button>
    }
    >
      <Box sx={{ overflow: 'auto', width: { xs: '280px', sm: 'auto' } }}>
        <TableContainer>
          <Table
            aria-label="tabla de areas comunes"
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
                      No hay areas comunes registradas
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
      
      {/* Dialog para crear/editar areas comunes */}
      <AreaComunDialogForm 
        open={dialogOpen}
        mode={dialogMode}
        areaComun={selectedAreaComun}
        onClose={handleCloseDialog}
        onSubmit={handleSubmitAreaComun}
      />

      {/* Dialog de confirmación para eliminar */}
      <ConfirmDialog
        open={confirmDialogOpen}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleDeleteAreaComun}
        title="Eliminar Area Común"
        message={`¿Estás seguro de que quieres eliminar esta area común?\n\nEsta acción no se puede deshacer.`}
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