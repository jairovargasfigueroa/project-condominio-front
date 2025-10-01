"use client";
import { 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Box,
  Typography
} from '@mui/material';
import { useState, useEffect } from 'react';
import CustomTextField from '../../components/forms/theme-elements/CustomTextField';
import { CreateCopropietarioData, UpdateCopropietarioData, Copropietario } from '../types';

interface CopropietarioDialogFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateCopropietarioData | UpdateCopropietarioData | FormData) => Promise<void>;
  mode: "create" | "edit";
  initialData?: Copropietario | null;
  submitting: boolean;
}

const CopropietarioDialogForm = ({ 
  open, 
  onClose, 
  mode = "create", 
  initialData, 
  onSubmit,
  submitting
}: CopropietarioDialogFormProps) => {
  // Estados simples para cada campo (patrón AuthLogin)
  // CAMPOS REQUERIDOS
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // CAMPOS OPCIONALES
  const [telefono, setTelefono] = useState('');
  const [observaciones, setObservaciones] = useState('');
  
  // ESTADOS PARA FOTO
  const [foto, setFoto] = useState<File | null>(null);
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);

  // Función para manejar cambio de archivo
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        alert('Por favor selecciona un archivo de imagen válido');
        return;
      }
      
      // Validar tamaño (5MB máximo)
      if (file.size > 5 * 1024 * 1024) {
        alert('El archivo es muy grande. Máximo 5MB');
        return;
      }
      
      setFoto(file);
      
      // Crear preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setFotoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Resetear cuando se abre el diálogo
  useEffect(() => {
    if (open) {
      if (mode === "edit" && initialData) {
        // Modo EDITAR - llenar con datos existentes
        setUsername(initialData.usuario.username || '');
        setEmail(initialData.usuario.email || '');
        setTelefono(initialData.usuario.telefono || '');
        setPassword(''); // No mostrar password al editar
        setObservaciones(initialData.observaciones || '');
        // Configurar foto existente si hay
        if (initialData.usuario.foto_perfil_url) {
          setFotoPreview(initialData.usuario.foto_perfil_url);
        } else {
          setFotoPreview(null);
        }
        setFoto(null); // No hay archivo nuevo
      } else {
        // Modo CREAR - formulario vacío
        setUsername('');
        setEmail('');
        setTelefono('');
        setPassword('');
        setObservaciones('');
        setFoto(null);
        setFotoPreview(null);
      }
    }
  }, [open, mode, initialData]);

  // Submit - DEVOLVER DATOS AL PADRE con tipos
  const handleSubmit = async (): Promise<void> => {
    // Validación básica - SOLO LOS CAMPOS DEL JSON REQUERIDO
    if (!username || !email || (mode === "create" && !password)) {
      alert('Por favor completa los campos requeridos: Usuario, Email' + (mode === "create" ? ' y Contraseña' : ''));
      return;
    }

    // Si hay foto, usar FormData
    if (foto) {
      console.log('📎 Enviando con FormData (archivo presente)');
      console.log('🖼️ Archivo detectado:', foto.name, foto.type, foto.size);
      const formData = new FormData();
      
      // Campos de usuario con formato plano
      formData.append('usuario_username', username);
      formData.append('usuario_email', email);
      if (mode === "create" && password) {
        formData.append('usuario_password', password);
      }
      formData.append('usuario_telefono', telefono || '');
      
      // Campos específicos del copropietario
      formData.append('observaciones', observaciones || '');
      
      // Archivo
      formData.append('usuario_foto_perfil', foto);
      console.log('📁 Archivo agregado a FormData:', foto instanceof File);
      
      // Debug: verificar contenido de FormData
      console.log('🔍 Contenido de FormData:');
      for (let [key, value] of formData.entries()) {
        console.log(`  ${key}:`, value instanceof File ? `[File: ${value.name}]` : value);
      }
      
      console.log('📤 Enviando FormData con archivo - formato plano');
      await onSubmit(formData);
      return;
    }

    // Sin foto, usar JSON normal
    const submitData: CreateCopropietarioData | UpdateCopropietarioData = mode === "edit" 
      ? {
          // Datos para actualizar (sin password obligatorio)
          usuario: {
            username,
            email,
            telefono: telefono || ''
          },
          observaciones: observaciones || ''
        } as UpdateCopropietarioData
      : {
          // Datos para crear - ESTRUCTURA EXACTA DEL JSON REQUERIDO
          usuario: {
            username,
            email,
            password
          }
        } as CreateCopropietarioData;

    // Llamar al método padre
    await onSubmit(submitData);
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        component: 'form',
        onSubmit: (e: React.FormEvent<HTMLFormElement>) => {
          e.preventDefault();
          handleSubmit();
        },
      }}
    >
      <DialogTitle>
        <Typography variant="h6">
          {mode === "create" ? "Nuevo Copropietario" : "Editar Copropietario"}
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Usuario */}
          <CustomTextField
            id="username"
            label="Nombre de Usuario *"
            variant="outlined"
            fullWidth
            value={username}
            onChange={(e: any) => setUsername(e.target.value)}
            disabled={submitting}
          />

          {/* Email */}
          <CustomTextField
            id="email"  
            label="Email *"
            type="email"
            variant="outlined"
            fullWidth
            value={email}
            onChange={(e: any) => setEmail(e.target.value)}
            disabled={submitting}
          />

          {/* Password - Solo en modo crear */}
          {mode === "create" && (
            <CustomTextField
              id="password"
              label="Contraseña *"
              type="password"
              variant="outlined"
              fullWidth
              value={password}
              onChange={(e: any) => setPassword(e.target.value)}
              disabled={submitting}
            />
          )}

          {/* Teléfono - Opcional */}
          <CustomTextField
            id="telefono"
            label="Teléfono"
            variant="outlined"
            fullWidth
            value={telefono}
            onChange={(e: any) => setTelefono(e.target.value)}
            disabled={submitting}
          />

          {/* Observaciones - Opcional */}
          <CustomTextField
            id="observaciones"
            label="Observaciones"
            variant="outlined"
            fullWidth
            multiline
            rows={3}
            value={observaciones}
            onChange={(e: any) => setObservaciones(e.target.value)}
            disabled={submitting}
          />

          {/* Foto de Perfil */}
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Foto de Perfil
            </Typography>
            <Button
              variant="outlined"
              component="label"
              fullWidth
              disabled={submitting}
              sx={{ mb: 2 }}
            >
              Seleccionar Foto
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleFileChange}
              />
            </Button>
            
            {fotoPreview && (
              <Box sx={{ textAlign: 'center', mb: 2 }}>
                <img
                  src={fotoPreview}
                  alt="Preview"
                  style={{
                    maxWidth: '150px',
                    maxHeight: '150px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    border: '1px solid #ddd'
                  }}
                />
                <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                  {foto ? `Archivo: ${foto.name}` : 'Foto actual'}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button 
          onClick={onClose}
          disabled={submitting}
        >
          Cancelar
        </Button>
        <Button 
          type="submit"
          variant="contained" 
          color="primary"
          disabled={submitting}
        >
          {submitting ? 'Guardando...' : (mode === "create" ? "Crear" : "Actualizar")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CopropietarioDialogForm;