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
import { useCategorias } from "../hooks";
import { CreateCategoriaData, Categoria, UpdateCategoriaData } from "../types";
import { IconPlus, IconEdit, IconTrash } from "@tabler/icons-react";
import CategoriaDialogForm from "./CategoriaDialogForm";
import ConfirmDialog from "./ConfirmDialog";

// ✅ CONSTANTES OPTIMIZADAS (fuera del componente)
const TABLE_HEADERS = ['Id', 'Nombre', 'Tarifa Mensual', 'Acciones'];

const ROWS_PER_PAGE_OPTIONS = [2, 5, 10, 25, 50];

// ✅ Función para extraer datos (con validaciones seguras)
const getRowData = (categoria: any) => [
  categoria?.id || 'N/A',                                         // ID de la categoría
  categoria?.nombre || 'Sin nombre',                              // Nombre de la categoría
  categoria?.tarifa_mensual ? `$${categoria.tarifa_mensual}` : 'Sin tarifa', // Tarifa formateada
];

export default function CategoriasTable() {
  const {
    categorias,
    loading,
    submitting,   // ✅ Ahora viene del hook
    error,
    page,
    pageSize,
    total,
    changePage,
    changePageSize,
    createCategoria,
    updateCategoria,
    deleteCategoria,
    refetch

  } = useCategorias();

  // ✅ TODOS LOS HOOKS PRIMERO (Reglas de React)
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [selectedCategoria, setSelectedCategoria] = useState<Categoria | null>(null);

  // ✅ Estados para el dialog de confirmación de eliminación
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [categoriaToDelete, setCategoriaToDelete] = useState<number | null>(null);

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

  // ✅ Abrir diálogo para CREAR nueva categoría
  const handleOpenCreate = useCallback(() => {
    setDialogMode("create");
    setSelectedCategoria(null);
    setDialogOpen(true);
  }, []);

  // ✅ Abrir diálogo para EDITAR categoría existente
  const handleOpenEdit = useCallback((categoria: Categoria) => {
    setDialogMode("edit");
    setSelectedCategoria(categoria);
    setDialogOpen(true);
  }, []);

  // ✅ Cerrar diálogo
  const handleCloseDialog = useCallback(() => {
    setDialogOpen(false);
    setSelectedCategoria(null);
  }, []);

  // ✅ MÉTODO ESPECÍFICO PARA CREAR
  const handleCreateCategoria = useCallback(async (formData: CreateCategoriaData) => {
    try {
      console.log('🚀 CREAR - Iniciando creación de categoría...');

      await createCategoria(formData);

      console.log('✅ CREAR - Categoría creada exitosamente');
      await refetch();

      // Mostrar notificación de éxito
      setNotification({
        open: true,
        message: 'Categoría creada exitosamente',
        severity: 'success'
      });

      // Cerrar modal solo si fue exitoso
      setDialogOpen(false);
      setSelectedCategoria(null);

    } catch (error) {
      console.error('❌ ERROR CREAR:', error);

      // Mostrar notificación de error
      setNotification({
        open: true,
        message: 'Error al crear la categoría',
        severity: 'error'
      });

      // Modal permanece abierto para mostrar error
    }
  }, [createCategoria, refetch]);

  // ✅ MÉTODO ESPECÍFICO PARA EDITAR
  const handleEditCategoria = useCallback(async (formData: UpdateCategoriaData) => {
    if (!selectedCategoria) {
      console.error('❌ No hay categoría seleccionada para editar');
      return;
    }

    try {
      console.log('🔄 EDITAR - Iniciando edición de categoría:', selectedCategoria.id);

      await updateCategoria(selectedCategoria.id, formData);

      console.log('✅ EDITAR - Categoría actualizada exitosamente');
      await refetch();

      // Mostrar notificación de éxito
      setNotification({
        open: true,
        message: 'Categoría actualizada exitosamente',
        severity: 'success'
      });

      // Cerrar modal solo si fue exitoso
      setDialogOpen(false);
      setSelectedCategoria(null);

    } catch (error) {
      console.error('❌ ERROR EDITAR:', error);

      // Mostrar notificación de error
      setNotification({
        open: true,
        message: 'Error al actualizar la categoría',
        severity: 'error'
      });

      // Modal permanece abierto para mostrar error
    }
  }, [selectedCategoria, updateCategoria, refetch]);

  // ✅ ABRIR DIALOG DE CONFIRMACIÓN PARA ELIMINAR
  const handleOpenDeleteDialog = useCallback((categoriaId: number) => {
    setCategoriaToDelete(categoriaId);
    setConfirmDialogOpen(true);
  }, []);

  // ✅ CERRAR DIALOG DE CONFIRMACIÓN
  const handleCloseDeleteDialog = useCallback(() => {
    setConfirmDialogOpen(false);
    setCategoriaToDelete(null);
  }, []);

  // ✅ MÉTODO ESPECÍFICO PARA ELIMINAR
  const handleDeleteCategoria = useCallback(async () => {
    if (!categoriaToDelete) return;

    try {
      console.log('🗑️ ELIMINAR - Iniciando eliminación de categoría:', categoriaToDelete);

      await deleteCategoria(categoriaToDelete);

      console.log('✅ ELIMINAR - Categoría eliminada exitosamente');

      // Mostrar notificación de éxito
      setNotification({
        open: true,
        message: 'Categoría eliminada exitosamente',
        severity: 'success'
      });

      // Cerrar dialog de confirmación
      setConfirmDialogOpen(false);
      setCategoriaToDelete(null);

    } catch (error) {
      console.error('❌ ERROR ELIMINAR:', error);

      // Mostrar notificación de error
      setNotification({
        open: true,
        message: 'Error al eliminar la categoría',
        severity: 'error'
      });

      // Cerrar dialog de confirmación de todos modos
      setConfirmDialogOpen(false);
      setCategoriaToDelete(null);
    }
  }, [categoriaToDelete, deleteCategoria]);

  // ✅ Cerrar notificación
  const handleCloseNotification = useCallback(() => {
    setNotification(prev => ({ ...prev, open: false }));
  }, []);

  // ✅ Handler unificado para formulario (decide si crear o editar)
  const handleFormSubmit = useCallback((formData: CreateCategoriaData | UpdateCategoriaData) => {
    if (dialogMode === "create") {
      return handleCreateCategoria(formData as CreateCategoriaData);
    } else {
      return handleEditCategoria(formData as UpdateCategoriaData);
    }
  }, [dialogMode, handleCreateCategoria, handleEditCategoria]);

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
    return categorias.map((categoria) => {
      const rowData = getRowData(categoria);
      return (
        <TableRow key={categoria.id} hover>
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
                onClick={() => handleOpenEdit(categoria)}
                disabled={submitting}
                startIcon={<IconEdit size={16} />}
              >
                Editar
              </Button>
              <Button
                size="small"
                variant="outlined"
                color="error"
                onClick={() => handleOpenDeleteDialog(categoria.id)}
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
  }, [categorias, submitting, handleOpenEdit, handleOpenDeleteDialog]);

  return (
    <>
      <DashboardCard
        title="Gestión de Categorías"
        action={
          <Button
            variant="contained"
            color="primary"
            onClick={handleOpenCreate}
            disabled={submitting}
            startIcon={<IconPlus size={20} />}
          >
            Nueva Categoría
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
              <Table aria-label="tabla de categorías">
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
      <CategoriaDialogForm
        open={dialogOpen}
        onClose={handleCloseDialog}
        mode={dialogMode}
        categoria={selectedCategoria}
        onSubmit={handleFormSubmit}
      />

      {/* ✅ DIALOG DE CONFIRMACIÓN DE ELIMINACIÓN */}
      <ConfirmDialog
        open={confirmDialogOpen}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleDeleteCategoria}
        title="Eliminar Categoría"
        message="¿Estás seguro de que quieres eliminar esta categoría? Esta acción no se puede deshacer."
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
