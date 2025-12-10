# frontend.md

## PRD – Requerimientos Frontend (Next.js + TailwindCSS + TS)

### 1. Objetivo

Implementar la interfaz del sistema de gestión de la tanda de cumpleaños, permitiendo al administrador visualizar, gestionar y compartir la información relacionada a pagos y cumpleaños. Debe ser mobile‑first, rápido, minimalista y fácil de usar.

---

## 2. Tecnologías a usar

- **Next.js latest (App Router)**
- **TypeScript**
- **TailwindCSS**
- **shadcn/ui**
- **Zustand** (para estado simple) o Context API
- **Axios o fetch** para consumo de API
- **QRCode.react** para generar QR
- **jsPDF** para generación de PDF

---

## 3. Vistas del sistema

### 3.1 Login

- Email
- Password
- Validaciones básicas
- Redirección al dashboard

### 3.2 Dashboard

- Widget “Cumpleaños próximos”
- Widget “Pagos del día”
- Widget “Grupos creados”
- Listado cronológico de cumpleaños

### 3.3 Gestión de Grupos

- Lista de grupos
- Crear grupo (modal)
- Editar grupo
- Eliminar grupo (confirmación)

### 3.4 Gestión de Miembros

- Lista de miembros por grupo
- Crear miembro
- Editar miembro
- Eliminar miembro
- Campos:

  - Nombre
  - Teléfono
  - Fecha de nacimiento
  - Foto (opcional)

### 3.5 Vista de Cumpleaños (Evento)

- Foto + nombre del cumpleañero
- Fecha
- Monto por persona
- Totales:

  - Total esperado
  - Total recibido
  - Barra de progreso

- Tabla de miembros:

  - Nombre
  - Estado pago (switch)
  - Botón para subir comprobante

- Botones:

  - Compartir por WhatsApp
  - Ver vista pública
  - Descargar PDF

### 3.6 Vista Pública (sin login)

- Información del cumpleañero
- Monto
- Totales recolectados
- Progreso
- Cuenta bancaria
- QR con enlace
- Responsive obligatorio

---

## 4. Componentes UI

- Navbar
- Sidebar
- Cards de resumen
- Modales (shadcn/ui)
- Tablas
- Inputs, selects, datepickers
- Progress bar
- File uploader (Cloudinary preset)
- Botón “Compartir por WhatsApp”

---

## 5. Estados globales

- Usuario autenticado
- Grupo seleccionado
- Miembros cargados
- Eventos cargados
- Pagos del evento actual

---

## 6. Manejo de PDF

- Generación local con jsPDF
- Diseño corporativo minimalista
- Incluye QR
- Descargable desde botón

---

## 7. Validaciones Frontend

- Campos obligatorios
- Formatos de teléfono y fecha
- Prevención de doble pago marcado
- Prevención de envíos incompletos

---

## 8. Criterios UX

- Mobile first
- Flujos cortos
- Colores claros y consistentes
- Tipografía legible
- Botones grandes para móviles

---
