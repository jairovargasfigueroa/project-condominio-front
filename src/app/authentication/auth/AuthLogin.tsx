"use client";
import React, { useState } from "react";
import {
  Box,
  Typography,
  FormGroup,
  FormControlLabel,
  Button,
  Stack,
  Checkbox,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth.service";
import CustomTextField from "@/app/(DashboardLayout)/components/forms/theme-elements/CustomTextField";

interface loginType {
  title?: string;
  subtitle?: JSX.Element | JSX.Element[];
  subtext?: JSX.Element | JSX.Element[];
}

const AuthLogin = ({ title, subtitle, subtext }: loginType) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rememberDevice, setRememberDevice] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      setError('Por favor ingresa usuario y contraseña');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const response = await authService.login({
        username: username.trim(),
        password: password,
      });

      console.log('Login exitoso:', response);
      
      // Redirigir al dashboard
      router.push('/');
      
    } catch (error: any) {
      console.error('Error en login:', error);
      setError(
        error.response?.data?.message || 
        error.message || 
        'Error al iniciar sesión. Verifica tus credenciales.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {title ? (
        <Typography
          variant="h2"
          sx={{
            fontWeight: "700",
            mb: 1
          }}>
          {title}
        </Typography>
      ) : null}

      {subtext}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <Box>
            <Typography
              variant="subtitle1"
              component="label"
              htmlFor="username"
              sx={{
                fontWeight: 600,
                mb: "5px"
              }}>
              Username
            </Typography>
            <CustomTextField 
              id="username"
              variant="outlined" 
              fullWidth 
              value={username}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
              disabled={loading}
              autoComplete="username"
            />
          </Box>
          
          <Box>
            <Typography
              variant="subtitle1"
              component="label"
              htmlFor="password"
              sx={{
                fontWeight: 600,
                mb: "5px"
              }}>
              Password
            </Typography>
            <CustomTextField 
              id="password"
              type="password" 
              variant="outlined" 
              fullWidth 
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              disabled={loading}
              autoComplete="current-password"
            />
          </Box>
          
          <Stack
            direction="row"
            sx={{
              justifyContent: "space-between",
              alignItems: "center",
              my: 2
            }}>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox 
                    checked={rememberDevice}
                    onChange={(e) => setRememberDevice(e.target.checked)}
                    disabled={loading}
                  />
                }
                label="Remember this Device"
              />
            </FormGroup>
            <Typography
              sx={{
                fontWeight: "500",
                textDecoration: "none",
                color: "primary.main",
                cursor: "pointer"
              }}>
              Forgot Password ?
            </Typography>
          </Stack>
        </Stack>
        
        <Box sx={{ mt: 3 }}>
          <Button
            color="primary"
            variant="contained"
            size="large"
            fullWidth
            type="submit"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </Button>
        </Box>
      </form>
      
      {subtitle}
    </>
  );
};

export default AuthLogin;
