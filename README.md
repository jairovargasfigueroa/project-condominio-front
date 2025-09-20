# Spike Next.js Free Admin Template

Este es un dashboard administrativo moderno construido con Next.js 15, TypeScript, Material-UI y otras tecnologías modernas.

## 🚀 Características

- **Next.js 15** con App Router
- **TypeScript** para type safety
- **Material-UI (MUI)** para componentes UI modernos
- **Responsive Design** que funciona en todos los dispositivos
- **Dashboard Components** pre-construidos
- **Iconos** de Tabler Icons y Iconify
- **Charts** con ApexCharts
- **Tema personalizable** con soporte para modo claro/oscuro

## 📋 Requisitos Previos

- Node.js 18.0 o superior
- npm, yarn o pnpm

## 🛠️ Instalación

1. Clona o descarga el proyecto
2. Navega al directorio del proyecto:

   ```bash
   cd spike-nextjs-free-main/package
   ```

3. Instala las dependencias:

   ```bash
   npm install
   # o
   yarn install
   # o
   pnpm install
   ```

4. (Opcional) Copia el archivo de variables de entorno:
   ```bash
   cp .env.local.example .env.local
   ```

## 🚀 Desarrollo

Ejecuta el servidor de desarrollo:

```bash
npm run dev
# o
yarn dev
# o
pnpm dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver el resultado.

## 📁 Estructura del Proyecto

```
src/
├── app/                          # App Router de Next.js
│   ├── (DashboardLayout)/        # Layout del dashboard
│   │   ├── components/           # Componentes del dashboard
│   │   ├── layout/               # Header, Sidebar, Footer
│   │   └── page.tsx             # Página principal del dashboard
│   ├── authentication/          # Páginas de autenticación
│   ├── context/                 # Contextos de React
│   └── layout.tsx               # Layout principal
├── utils/                       # Utilidades y temas
└── public/                      # Archivos estáticos
```

## 🎨 Personalización

### Tema

Puedes personalizar los colores y el tema editando:

- `src/utils/theme/DefaultColors.tsx` - Colores principales del tema
- `src/utils/theme.ts` - Configuración básica del tema

### Componentes

Los componentes del dashboard están en:

- `src/app/(DashboardLayout)/components/dashboard/` - Componentes principales
- `src/app/(DashboardLayout)/components/shared/` - Componentes compartidos

## 📦 Scripts Disponibles

- `npm run dev` - Ejecuta el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run start` - Ejecuta la aplicación construida
- `npm run lint` - Ejecuta el linter

## 🔧 Tecnologías Utilizadas

- **Framework:** Next.js 15
- **Lenguaje:** TypeScript
- **UI Library:** Material-UI (MUI)
- **Icons:** Tabler Icons, Iconify
- **Charts:** ApexCharts
- **Styling:** Emotion (CSS-in-JS)
- **Fonts:** Plus Jakarta Sans (Google Fonts)

## 📱 Responsive Design

El template está completamente optimizado para:

- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (< 768px)

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la [MIT License](LICENSE).

## 🆘 Soporte

Si encuentras algún problema o tienes preguntas:

1. Revisa la documentación
2. Busca en los issues existentes
3. Crea un nuevo issue si es necesario

## 🔗 Enlaces Útiles

- [Next.js Documentation](https://nextjs.org/docs)
- [Material-UI Documentation](https://mui.com/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Tabler Icons](https://tabler-icons.io/)

---

Desarrollado con ❤️ usando Next.js y Material-UI
