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
import { useComunicados } from "../hooks";
import { CreateComunicadoData, Comunicado, UpdateComunicadoData } from "../types";
import { IconPlus } from "@tabler/icons-react";
import ComunicadoDialogForm from "./ComunicadoDialogForm";
import ConfirmDialog from "./ConfirmDialog";
import LecturasDialog from "./LecturasDialog";

// ✅ CONSTANTES OPTIMIZADAS (fuera del componente)
const TABLE_HEADERS = ['Id', 'Título', 'Contenido', 'Fecha Publicación', 'Acciones'];

const ROWS_PER_PAGE_OPTIONS = [2, 5, 10, 25, 50];

// ✅ Función para extraer datos (con validaciones seguras)
const getRowData = (comunicado: any) => {
  // 🔍 DEBUG: Ver los datos originales
  console.log(`📝 COMUNICADO DEBUG - Comunicado ${comunicado?.id}:`, {
    comunicado_original: comunicado
  });

  // Formatear fecha
  const fechaFormateada = comunicado?.fecha_publicacion 
    ? new Date(comunicado.fecha_publicacion).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit', 
        year: 'numeric'
      })
    : 'Sin fecha';

  // Truncar contenido si es muy largo
  const contenidoTruncado = comunicado?.contenido 
    ? comunicado.contenido.length > 50 
      ? `${comunicado.contenido.substring(0, 50)}...`
      : comunicado.contenido
    : 'Sin contenido';

  return [
    comunicado?.id || 'N/A',                                      // ID del comunicado
    comunicado?.titulo || 'Sin título',                          // Título del comunicado
    contenidoTruncado,                                           // Contenido truncado
    fechaFormateada,                                             // Fecha formateada
  ];
};

export default function ComunicadosTable() {
  const {
    comunicados,
    loading,
    submitting,   // ✅ Ahora viene del hook
    error,
    page,
    pageSize,
    total,
    changePage,
    changePageSize,
    createComunicado,
    updateComunicado,
    deleteComunicado,  // 🆕 Agregar deleteComunicado
    refetch

  } = useComunicados();

  // ✅ TODOS LOS HOOKS PRIMERO (Reglas de React)
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [selectedComunicado, setSelectedComunicado] = useState<Comunicado | null>(null);
  
  // ✅ Estados para el dialog de confirmación de eliminación
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [comunicadoToDelete, setComunicadoToDelete] = useState<string | null>(null);

  // ✅ Estados para el diálogo de lecturas
  const [lecturasDialogOpen, setLecturasDialogOpen] = useState(false);
  const [comunicadoParaLecturas, setComunicadoParaLecturas] = useState<{id: string, titulo: string} | null>(null);

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

  // ✅ Abrir diálogo para CREAR nuevo comunicado
  const handleOpenCreate = useCallback(() => {
    setDialogMode("create");
    setSelectedComunicado(null);
    setDialogOpen(true);
  }, []);

  // ✅ Abrir diálogo para EDITAR comunicado existente
  const handleOpenEdit = useCallback((comunicado: Comunicado) => {
    setDialogMode("edit");
    setSelectedComunicado(comunicado);
    setDialogOpen(true);
  }, []);

  // ✅ Cerrar diálogo
  const handleCloseDialog = useCallback(() => {
    setDialogOpen(false);
    setSelectedComunicado(null);
  }, []);

  // ✅ Abrir diálogo de lecturas
  const handleOpenLecturas = useCallback((comunicado: Comunicado) => {
    setComunicadoParaLecturas({
      id: comunicado.id,
      titulo: comunicado.titulo
    });
    setLecturasDialogOpen(true);
  }, []);

  // ✅ Cerrar diálogo de lecturas
  const handleCloseLecturas = useCallback(() => {
    setLecturasDialogOpen(false);
    setComunicadoParaLecturas(null);
  }, []);

  // ✅ MÉTODO ESPECÍFICO PARA CREAR
  const handleCreateComunicado = useCallback(async (formData: CreateComunicadoData) => {
    try {
      console.log('🚀 CREAR - Iniciando creación de comunicado...');
      
      await createComunicado(formData);
      
      console.log('✅ CREAR - Comunicado creado exitosamente');
      await refetch();
      
      // Mostrar notificación de éxito
      setNotification({
        open: true,
        message: 'Comunicado creado exitosamente',
        severity: 'success'
      });
      
      // Cerrar modal solo si fue exitoso
      setDialogOpen(false);
      setSelectedComunicado(null);
      
    } catch (error) {
      console.error('❌ ERROR CREAR:', error);
      
      // Mostrar notificación de error
      setNotification({
        open: true,
        message: 'Error al crear el comunicado',
        severity: 'error'
      });
      
      // Modal permanece abierto para mostrar error
    }
  }, [createComunicado, refetch]);

  // ✅ MÉTODO ESPECÍFICO PARA EDITAR
  const handleEditComunicado = useCallback(async (formData: UpdateComunicadoData) => {
    if (!selectedComunicado) {
      console.error('❌ No hay comunicado seleccionado para editar');
      return;
    }
    
    try {
      console.log('🔄 EDITAR - Iniciando edición de comunicado:', selectedComunicado.id);
      
      await updateComunicado(selectedComunicado.id, formData);
      
      console.log('✅ EDITAR - Comunicado actualizado exitosamente');
      await refetch();
      
      // Mostrar notificación de éxito
      setNotification({
        open: true,
        message: 'Comunicado actualizado exitosamente',
        severity: 'success'
      });
      
      // Cerrar modal solo si fue exitoso
      setDialogOpen(false);
      setSelectedComunicado(null);
      
    } catch (error) {
      console.error('❌ ERROR EDITAR:', error);
      
      // Mostrar notificación de error
      setNotification({
        open: true,
        message: 'Error al actualizar el comunicado',
        severity: 'error'
      });
      
      // Modal permanece abierto para mostrar error
    }
  }, [selectedComunicado, updateComunicado, refetch]);

  // ✅ ABRIR DIALOG DE CONFIRMACIÓN PARA ELIMINAR
  const handleOpenDeleteDialog = useCallback((comunicadoId: string) => {
    setComunicadoToDelete(comunicadoId);
    setConfirmDialogOpen(true);
  }, []);

  // ✅ CERRAR DIALOG DE CONFIRMACIÓN
  const handleCloseDeleteDialog = useCallback(() => {
    setConfirmDialogOpen(false);
    setComunicadoToDelete(null);
  }, []);

  // ✅ MÉTODO ESPECÍFICO PARA ELIMINAR (SIN CONFIRMACIÓN AQUÍ)
  const handleDeleteComunicado = useCallback(async () => {
    if (!comunicadoToDelete) return;
    
    try {
      console.log('🗑️ ELIMINAR - Iniciando eliminación de comunicado:', comunicadoToDelete);
      
      // ✅ deleteComunicado ya maneja todo: elimina, actualiza estado y navega páginas
      await deleteComunicado(comunicadoToDelete);
      
      console.log('✅ ELIMINAR - Comunicado eliminado exitosamente');
      
      // Mostrar notificación de éxito
      setNotification({
        open: true,
        message: 'Comunicado eliminado exitosamente',
        severity: 'success'
      });
      
      // Cerrar dialog de confirmación
      setConfirmDialogOpen(false);
      setComunicadoToDelete(null);
      
    } catch (error) {
      console.error('❌ ERROR ELIMINAR:', error);
      
      // Mostrar notificación de error
      setNotification({
        open: true,
        message: 'Error al eliminar el comunicado',
        severity: 'error'
      });
      
      // El dialog de confirmación permanece abierto para mostrar el error
    }
  }, [comunicadoToDelete, deleteComunicado]);

  // ✅ MÉTODO COORDINADOR (decide cuál llamar)
  const handleSubmitComunicado = useCallback(async (formData: CreateComunicadoData | UpdateComunicadoData) => {
    if (dialogMode === "edit") {
      await handleEditComunicado(formData as UpdateComunicadoData);
    } else {
      await handleCreateComunicado(formData as CreateComunicadoData);
    }
  }, [dialogMode, handleCreateComunicado, handleEditComunicado]);

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

  // ✅ Rows memoizados - solo si hay comunicados
  const tableRows = useMemo(() => {
    if (!comunicados || comunicados.length === 0) return [];
    
    // 🔍 DEBUG: Ver qué datos llegan del backend
    console.log('📊 TABLA - Comunicados recibidos:', comunicados);
    
    return comunicados.map((comunicado: Comunicado) => {
      const rowData = getRowData(comunicado);
      
      // 🔍 DEBUG: Ver datos procesados para cada fila
      console.log(`📝 TABLA - Comunicado ${comunicado.id}:`, {
        original: comunicado,
        procesado: rowData
      });
      
      return (
        <TableRow key={comunicado.id}>
          {rowData.map((data, index) => (
            <TableCell key={index}>
              <Typography 
                variant={index === 0 ? "body1" : "body2"}
                fontWeight={index === 0 ? 600 : index === 1 ? 500 : 400}
                color="textPrimary"
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
                onClick={() => handleOpenEdit(comunicado)}
              >
                Editar
              </Button>
              <Button 
                size="small" 
                variant="outlined"
                color="info"
                onClick={() => handleOpenLecturas(comunicado)}
              >
                Ver Lecturas
              </Button>
              <Button 
                size="small" 
                variant="outlined" 
                color="error"
                onClick={() => handleOpenDeleteDialog(comunicado.id)}
                disabled={submitting}
              >
                Eliminar
              </Button>
            </Box>
          </TableCell>
        </TableRow>
      );
    });
  }, [comunicados, handleOpenEdit, handleOpenLecturas, handleOpenDeleteDialog, submitting]);

  // ✅ RENDERIZADO CONDICIONAL (después de todos los hooks)
  if (loading) {
    return (
      <DashboardCard title="Comunicados">
        <Box display="flex" justifyContent="center" p={3}>
          <CircularProgress />
        </Box>
      </DashboardCard>
    );
  }

  if (error) {
    return (
      <DashboardCard title="Comunicados">
        <Alert severity="error">{error}</Alert>
      </DashboardCard>
    );
  }

  return (
    <DashboardCard 
      title="Comunicados"
      action={
      <Button 
        variant="contained" 
        color="primary"
        onClick={handleOpenCreate}
        startIcon={<IconPlus />}  // Opcional: icono
      >
        Nuevo Comunicado
      </Button>
    }
    >
      <Box sx={{ overflow: 'auto', width: { xs: '280px', sm: 'auto' } }}>
        <TableContainer>
          <Table
            aria-label="tabla de comunicados"
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
                      No hay comunicados registrados
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
      
      {/* Dialog para crear/editar comunicados */}
      <ComunicadoDialogForm 
        open={dialogOpen}
        mode={dialogMode}
        comunicado={selectedComunicado}
        onClose={handleCloseDialog}
        onSubmit={handleSubmitComunicado}
      />

      {/* Dialog de confirmación para eliminar */}
      <ConfirmDialog
        open={confirmDialogOpen}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleDeleteComunicado}
        title="Eliminar Comunicado"
        message={`¿Estás seguro de que quieres eliminar este comunicado?\n\nEsta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        loading={submitting}
      />

      {/* Dialog para ver lecturas del comunicado */}
      <LecturasDialog
        open={lecturasDialogOpen}
        onClose={handleCloseLecturas}
        comunicadoId={comunicadoParaLecturas?.id || null}
        comunicadoTitulo={comunicadoParaLecturas?.titulo}
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