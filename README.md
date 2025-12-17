# 🎂 Tanda Cumpleañera - Frontend

Sistema de gestión de tandas de cumpleaños desarrollado con Next.js. Permite a los administradores visualizar, gestionar y compartir información relacionada con pagos y cumpleaños de manera eficiente.

## 📋 Descripción

Tanda Cumpleañera es una aplicación web **mobile-first** diseñada para facilitar la gestión de tandas de cumpleaños. El sistema permite crear grupos, agregar miembros, gestionar eventos de cumpleaños, registrar pagos y compartir información de manera sencilla.

### Características Principales

- ✅ **Autenticación completa**: Registro, login, recuperación de contraseña y verificación de email
- 📊 **Dashboard interactivo**: Visualización de métricas y listado cronológico de cumpleaños
- 👥 **Gestión de grupos**: Crear, editar y eliminar grupos de cumpleaños
- 🎉 **Gestión de eventos**: Visualizar y gestionar eventos de cumpleaños
- 💰 **Control de pagos**: Registrar pagos, subir comprobantes y llevar seguimiento
- 📱 **Diseño responsive**: Optimizado para mobile y desktop
- 🔒 **Rutas protegidas**: Sistema de autenticación y protección de rutas

## 🛠️ Stack Tecnológico

### Core

- **Next.js 16+** (App Router)
- **React 19+**
- **TypeScript** (strict mode)
- **Tailwind CSS 4**

### UI/UX

- **shadcn/ui** - Componentes de UI accesibles
- **Radix UI** - Componentes base accesibles
- **Lucide React** - Iconos
- **date-fns** - Manipulación de fechas

### Estado y Formularios

- **Zustand** - Estado global
- **React Hook Form** - Manejo de formularios
- **Zod** - Validación de esquemas

### Utilidades

- **class-variance-authority** - Variantes de componentes
- **tailwind-merge** - Merge de clases de Tailwind

## 📦 Requisitos Previos

- **Node.js** 18+
- **pnpm** (recomendado) o npm/yarn
- Backend API corriendo (ver documentación del backend)

## 🚀 Instalación

1. **Clonar el repositorio**

```bash
git clone <repository-url>
cd frontend
```

2. **Instalar dependencias**

```bash
pnpm install
# o
npm install
# o
yarn install
```

3. **Configurar variables de entorno**

Crea un archivo `.env.local` en la raíz del proyecto:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

4. **Ejecutar el servidor de desarrollo**

```bash
pnpm dev
# o
npm run dev
# o
yarn dev
```

5. **Abrir en el navegador**

Navega a [http://localhost:3000](http://localhost:3000)

## 🔧 Variables de Entorno

### Configuración

1. **Copia el archivo de ejemplo:**
   ```bash
   cp .env.example .env.local
   ```

2. **Edita `.env.local` con tus valores:**
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001/api
   ```

3. **Reinicia el servidor de desarrollo**

### Variables Disponibles

| Variable              | Descripción                    | Ejemplo                     | Requerida |
| --------------------- | ------------------------------ | --------------------------- | --------- |
| `NEXT_PUBLIC_API_URL` | URL base de la API del backend | `http://localhost:3001/api` | ✅ Sí     |

### Para Producción

Configura las siguientes variables en tu plataforma de despliegue (Vercel, Netlify, etc.):

```env
NEXT_PUBLIC_API_URL=https://api.tu-dominio.com/api
```

**Nota:** Las variables con prefijo `NEXT_PUBLIC_` son accesibles en el cliente. No incluyas información sensible aquí.

## 📜 Scripts Disponibles

```bash
# Desarrollo
pnpm dev          # Inicia el servidor de desarrollo

# Producción
pnpm build        # Construye la aplicación para producción
pnpm start        # Inicia el servidor de producción

# Linting
pnpm lint         # Ejecuta ESLint
```

## 📁 Estructura del Proyecto

```
frontend/
├── app/                      # App Router de Next.js
│   ├── (auth)/              # Rutas de autenticación
│   │   ├── login/
│   │   ├── register/
│   │   ├── forgot-password/
│   │   └── reset-password/
│   ├── (dashboard)/         # Rutas protegidas del dashboard
│   │   └── dashboard/
│   └── page.tsx             # Landing page
├── components/              # Componentes reutilizables
│   ├── auth/                # Componentes de autenticación
│   ├── layout/              # Layout components (Header, Sidebar, etc.)
│   └── ui/                  # Componentes UI base (shadcn/ui)
├── hooks/                   # Custom React hooks
│   └── useAuth.ts           # Hook de autenticación
├── lib/                     # Utilidades y helpers
│   ├── api.ts               # Funciones de API
│   ├── api-dashboard.ts     # API específica del dashboard
│   ├── auth.ts              # Utilidades de autenticación
│   └── utils.ts             # Utilidades generales
├── stores/                  # Zustand stores
│   └── authStore.ts         # Store de autenticación
├── types/                   # Tipos TypeScript
│   ├── auth.ts              # Tipos de autenticación
│   └── dashboard.ts         # Tipos del dashboard
├── docs/                    # Documentación
│   ├── api-routes/          # Documentación de API
│   └── DATE_HANDLING_FRONTEND.md
├── middleware.ts            # Middleware de Next.js
└── README.md
```

## 🎨 Características de Diseño

### Mobile-First

El diseño está optimizado para dispositivos móviles primero, con mejoras progresivas para desktop.

### Componentes UI

- Componentes accesibles basados en Radix UI
- Sistema de diseño consistente con Tailwind CSS
- Modo claro (dark mode pendiente)

### Responsive

- **Mobile**: Navegación inferior, lista de cumpleaños simplificada
- **Desktop**: Sidebar lateral, tabla completa de cumpleaños

## 🔐 Autenticación

El sistema incluye:

- ✅ Registro de usuarios
- ✅ Login con JWT
- ✅ Recuperación de contraseña
- ✅ Verificación de email
- ✅ Protección de rutas
- ✅ Persistencia de sesión (localStorage)

## 📚 Documentación Adicional

- [Documentación de la API](./docs/api-routes/API_DOCUMENTATION.md)
- [Manejo de Fechas](./docs/DATE_HANDLING_FRONTEND.md)
- [Flujo de Email](./docs/EMAIL_FLOW_FRONTEND.md)
- [Reglas del Proyecto](./.cursor/rules/rules.mdc)

## 🏗️ Arquitectura

### Principios de Diseño

1. **Tipado Robusto**: Sin uso de `any`, tipos explícitos en todo el código
2. **Modularización**: Cada ruta tiene su carpeta `components/` específica
3. **page.tsx como anfitrión**: Solo renderiza componentes, sin lógica de negocio
4. **Componentes reutilizables**: En `components/` para uso global
5. **Hooks personalizados**: Lógica reutilizable en `hooks/`

### Manejo de Estado

- **Zustand**: Para estado global (autenticación)
- **React Hook Form**: Para formularios
- **Estado local**: `useState` para estado simple del componente

### Manejo de Fechas

- Formato al enviar: `yyyy-MM-dd`
- Formato al recibir: `yyyy-MM-dd` (fechas) o ISO 8601 (timestamps)
- Utilidad: `date-fns` con locale español
- **Importante**: El backend maneja las conversiones de timezone

## 🧪 Desarrollo

### Convenciones de Código

- **Componentes**: PascalCase (`UserCard.tsx`)
- **Hooks**: camelCase con prefijo `use` (`useAuth.ts`)
- **Utilidades**: camelCase (`formatDate.ts`)
- **Tipos**: PascalCase (`User.ts`)
- **Constantes**: UPPER_SNAKE_CASE (`API_BASE_URL`)

### Path Aliases

```typescript
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import type { User } from "@/types/auth";
```

### Checklist Antes de Commit

- [ ] No hay uso de `any` o tipos genéricos sin especificar
- [ ] `page.tsx` solo actúa como anfitrión
- [ ] Componentes en sus carpetas correspondientes
- [ ] Errores manejados correctamente
- [ ] Loading states implementados
- [ ] Validaciones en formularios
- [ ] Tipos TypeScript definidos
- [ ] Imports ordenados y usando path aliases

## 🚢 Despliegue

### Build de Producción

```bash
pnpm build
pnpm start
```

### Variables de Entorno en Producción

Asegúrate de configurar `NEXT_PUBLIC_API_URL` con la URL de tu API en producción.

## 📝 Licencia

Este proyecto es privado.

## 👥 Contribución

Este es un proyecto privado. Para contribuciones, contacta al equipo de desarrollo.

---

**Desarrollado con ❤️ usando Next.js y TypeScript**
