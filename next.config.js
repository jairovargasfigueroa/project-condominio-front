/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuración esencial según filosofía Next.js
  reactStrictMode: true,
  images: { unoptimized: true },

  // Turbopack: La nueva generación de bundling de Next.js 15
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },

  // Experimental features alineadas con Next.js philosophy
  experimental: {
    // @mui/material y @mui/icons-material ya están optimizados por defecto
    // Solo especificamos paquetes adicionales de MUI que no están en la lista
    optimizePackageImports: [
      '@mui/lab',
      '@mui/system',
      '@mui/utils',
    ],
  },
}

module.exports = nextConfig
