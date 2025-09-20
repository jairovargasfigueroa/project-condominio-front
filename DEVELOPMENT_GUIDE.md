# Guía de Desarrollo - Spike Next.js Template

## 📝 Convenciones de Código

### Nomenclatura de Archivos

- **Componentes React**: PascalCase (ej: `MyComponent.tsx`)
- **Páginas**: snake_case o kebab-case (ej: `sample-page`, `user-profile`)
- **Utilidades**: camelCase (ej: `formatDate.ts`)
- **Constantes**: SCREAMING_SNAKE_CASE (ej: `API_ENDPOINTS.ts`)

### Estructura de Componentes

```typescript
// 1. Imports externos
import React from "react";
import { Box, Typography } from "@mui/material";

// 2. Imports internos
import { CustomComponent } from "@/components/CustomComponent";

// 3. Tipos/Interfaces
interface ComponentProps {
  title: string;
  children?: React.ReactNode;
}

// 4. Componente
const MyComponent: React.FC<ComponentProps> = ({ title, children }) => {
  return (
    <Box>
      <Typography variant="h6">{title}</Typography>
      {children}
    </Box>
  );
};

export default MyComponent;
```

## 🎨 Guías de UI/UX

### Colores del Tema

- **Primary**: `#0085db` - Para acciones principales
- **Secondary**: `#707a82` - Para elementos secundarios
- **Success**: `#4bd08b` - Para estados exitosos
- **Error**: `#fb977d` - Para errores y alertas
- **Warning**: `#f8c076` - Para advertencias
- **Info**: `#46caeb` - Para información

### Espaciado

- Usa el sistema de spacing de MUI: `spacing(1) = 8px`
- Para márgenes y padding, usa múltiplos de 8px
- Ejemplo: `sx={{ p: 2, m: 1 }}` = padding 16px, margin 8px

### Tipografía

- **Fuente principal**: Plus Jakarta Sans
- **Jerarquía**: h1 > h2 > h3 > h4 > h5 > h6 > body1 > body2 > caption

## 📁 Organización de Archivos

### Componentes

```
src/app/(DashboardLayout)/components/
├── dashboard/          # Componentes específicos del dashboard
├── forms/             # Componentes de formularios
├── shared/            # Componentes reutilizables
└── custom-scroll/     # Componentes especializados
```

### Páginas

```
src/app/
├── (DashboardLayout)/    # Páginas del dashboard
├── authentication/      # Páginas de autenticación
└── layout.tsx          # Layout principal
```

## 🔧 Mejores Prácticas

### TypeScript

- Siempre define tipos para props de componentes
- Usa interfaces para objetos complejos
- Evita `any`, usa `unknown` si es necesario
- Aprovecha la inferencia de tipos cuando sea posible

### Performance

- Usa `React.memo()` para componentes que no cambian frecuentemente
- Implementa `useMemo()` y `useCallback()` para cálculos costosos
- Lazy loading para componentes grandes: `React.lazy()`

### Accesibilidad

- Siempre incluye `alt` en imágenes
- Usa elementos semánticos HTML apropiados
- Implementa navegación por teclado
- Asegura contraste de colores adecuado

### Estado Global

- Usa React Context para estado compartido simple
- Para estado complejo, considera Redux Toolkit o Zustand
- Evita prop drilling excesivo

## 🚀 Scripts de Desarrollo

```bash
# Desarrollo
npm run dev              # Servidor de desarrollo
npm run build           # Build para producción
npm run start           # Servidor de producción

# Mantenimiento
npm run lint            # Verificar código
npm run lint:fix        # Corregir problemas automáticamente
npm run type-check      # Verificar tipos TypeScript
npm run clean           # Limpiar archivos de build
```

## 📊 Componentes Disponibles

### Dashboard

- `<TrafficDistribution />` - Gráfico de distribución de tráfico
- `<ProductSales />` - Gráfico de ventas de productos
- `<UpcomingSchedules />` - Timeline de eventos próximos
- `<Blog />` - Componente de blog/noticias
- `<TopPayingClients />` - Lista de mejores clientes

### Formularios

- `<CustomTextField />` - Campo de texto personalizado
- `<GeneralForm />` - Formulario general con validación
- `<LoginForm />` - Formulario de inicio de sesión

### Layout

- `<Header />` - Cabecera del dashboard
- `<Sidebar />` - Barra lateral de navegación
- `<Footer />` - Pie de página

## 🔒 Seguridad

### Variables de Entorno

- **NUNCA** commits credenciales o API keys
- Usa `.env.local` para desarrollo
- Prefija variables públicas con `NEXT_PUBLIC_`

### Autenticación

- Implementa validación tanto en frontend como backend
- Usa tokens JWT para autenticación
- Implementa protección CSRF si es necesario

## 📱 Responsive Design

### Breakpoints de MUI

- **xs**: 0px - 599px (móviles)
- **sm**: 600px - 959px (tablets pequeñas)
- **md**: 960px - 1279px (tablets)
- **lg**: 1280px - 1919px (desktop)
- **xl**: 1920px+ (desktop grande)

### Ejemplo de uso

```typescript
sx={{
  display: { xs: 'none', md: 'block' },  // Oculto en móvil, visible en tablet+
  padding: { xs: 1, sm: 2, md: 3 },     // Padding progresivo
  fontSize: { xs: '14px', md: '16px' }   // Tamaño de fuente responsivo
}}
```

## 🧪 Testing (Recomendado)

### Estructura de Testing

```
__tests__/
├── components/          # Tests de componentes
├── pages/              # Tests de páginas
├── utils/              # Tests de utilidades
└── setup.ts            # Configuración de testing
```

### Herramientas Sugeridas

- **Jest**: Framework de testing
- **React Testing Library**: Testing de componentes React
- **Cypress**: Testing E2E
- **MSW**: Mock Service Worker para APIs

## 📚 Recursos Adicionales

- [Next.js Documentation](https://nextjs.org/docs)
- [Material-UI Documentation](https://mui.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Best Practices](https://react.dev/learn)

---

¡Mantén este archivo actualizado conforme el proyecto evolucione!
