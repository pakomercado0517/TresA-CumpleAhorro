# Documentación de la API - Tanda Cumpleañera

Esta documentación describe todas las rutas implementadas, los objetos de request y response, tanto para éxito como para errores.

## 📋 Índice

- [Autenticación](#autenticación)
- [Grupos](#grupos)
- [Miembros](#miembros)
- [Eventos](#eventos)
- [Pagos](#pagos)
- [Manejo de Errores](#manejo-de-errores)

---

## 🔐 Autenticación

### POST /api/auth/register

Registra un nuevo usuario en el sistema.

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```typescript
{
  name: string;        // 2-100 caracteres, solo letras y espacios
  email: string;      // Formato válido, máximo 255 caracteres
  password: string;   // 8-100 caracteres, al menos 1 mayúscula, 1 minúscula y 1 número
}
```

**Ejemplo:**
```json
{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "password": "Password123"
}
```

**Response Success (201):**
```typescript
{
  message: string;
  user: {
    id: number;
    name: string;
    email: string;
    emailVerified: boolean;
    createdAt: string;  // ISO 8601
    updatedAt: string;  // ISO 8601
  };
  token: string;  // JWT token para autenticación
}
```

**Ejemplo:**
```json
{
  "message": "Usuario creado exitosamente",
  "user": {
    "id": 1,
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "emailVerified": false,
    "createdAt": "2024-12-09T10:00:00.000Z",
    "updatedAt": "2024-12-09T10:00:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response Error (400):**
```typescript
{
  error: string | string[];  // Mensaje de error o array de errores de validación
}
```

**Ejemplo:**
```json
{
  "error": "El nombre debe tener entre 2 y 100 caracteres"
}
```

**Response Error (409):**
```typescript
{
  error: string;
}
```

**Ejemplo:**
```json
{
  "error": "El email ya está registrado"
}
```

---

### POST /api/auth/login

Autentica un usuario y retorna un token JWT.

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```typescript
{
  email: string;      // Formato válido
  password: string;   // Requerido
}
```

**Ejemplo:**
```json
{
  "email": "juan@example.com",
  "password": "Password123"
}
```

**Response Success (200):**
```typescript
{
  message: string;
  user: {
    id: number;
    name: string;
    email: string;
    createdAt: string;  // ISO 8601
    updatedAt: string;  // ISO 8601
  };
  token: string;  // JWT token
}
```

**Ejemplo:**
```json
{
  "message": "Login exitoso",
  "user": {
    "id": 1,
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "createdAt": "2024-12-09T10:00:00.000Z",
    "updatedAt": "2024-12-09T10:00:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response Error (400):**
```typescript
{
  error: string | string[];
}
```

**Response Error (401):**
```typescript
{
  error: string;
}
```

**Ejemplo:**
```json
{
  "error": "Credenciales inválidas"
}
```

---

## 👥 Grupos

### GET /api/groups

Lista todos los grupos del usuario autenticado con información completa.

**⚡ Endpoint Optimizado:** Este endpoint devuelve toda la información necesaria en una sola petición, incluyendo miembros, eventos, pagos y estadísticas. Esto reduce significativamente el número de llamadas desde el frontend.

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters (Opcionales):**
```typescript
{
  limit?: number;           // Limitar número de grupos devueltos
  includeMembers?: boolean; // Incluir array de miembros (default: true)
  includeEvents?: boolean;  // Incluir array de eventos (default: true)
  includePayments?: boolean; // Incluir pagos recientes (default: true)
  paymentsLimit?: number;   // Limitar número de pagos recientes (default: 10)
}
```

**Ejemplos de URLs:**
```
GET /api/groups                                    # Respuesta completa
GET /api/groups?limit=5                           # Solo 5 grupos
GET /api/groups?includeMembers=false              # Sin miembros
GET /api/groups?paymentsLimit=3                   # Solo 3 pagos recientes
GET /api/groups?includeEvents=false&limit=1       # Primer grupo sin eventos
```

**Response Success (200):**
```typescript
{
  message: string;
  groups: Array<{
    // Información básica del grupo
    id: number;
    userId: number;
    name: string;
    amountPerBirthday: number;
    description?: string;
    createdAt: string;  // ISO 8601
    updatedAt: string;  // ISO 8601
    
    // Estadísticas del grupo
    memberCount: number;        // Total de miembros en el grupo
    eventCount: number;         // Total de eventos generados
    totalExpected: number;      // Suma de expectedAmount de todos los eventos
    totalPaid: number;          // Total pagado en el grupo
    
    // Miembros del grupo
    members: Array<{
      id: number;
      name: string;
      phone?: string;
      birthday: string;         // Formato: "yyyy-MM-dd"
      photoUrl?: string;
    }>;
    
    // Eventos del grupo
    events: Array<{
      id: number;
      memberId: number;
      memberName: string;       // Nombre del miembro cumpleañero
      birthdayDate: string;     // Formato: "yyyy-MM-dd"
      expectedAmount: number;   // Monto esperado para este evento
      totalPaid: number;        // Total pagado para este evento
    }>;
    
    // Pagos recientes (últimos 10)
    recentPayments: Array<{
      id: number;
      memberId: number;
      memberName: string;       // Nombre del miembro que pagó
      birthdayEventId: number;
      amount: number;
      datePaid: string;         // Formato: "yyyy-MM-dd"
    }>;
  }>;
}
```

**Ejemplo:**
```json
{
  "message": "Grupos obtenidos exitosamente",
  "groups": [
    {
      "id": 1,
      "userId": 1,
      "name": "Grupo de Cumpleaños 2024",
      "amountPerBirthday": 500,
      "description": "Grupo para celebrar cumpleaños del año 2024",
      "createdAt": "2024-12-09T10:00:00.000Z",
      "updatedAt": "2024-12-09T10:00:00.000Z",
      "memberCount": 5,
      "eventCount": 5,
      "totalExpected": 2500,
      "totalPaid": 1500,
      "members": [
        {
          "id": 1,
          "name": "María González",
          "phone": "1234567890",
          "birthday": "1990-03-15",
          "photoUrl": "https://example.com/photo.jpg"
        }
      ],
      "events": [
        {
          "id": 1,
          "memberId": 1,
          "memberName": "María González",
          "birthdayDate": "2025-03-15",
          "expectedAmount": 500,
          "totalPaid": 300
        }
      ],
      "recentPayments": [
        {
          "id": 1,
          "memberId": 2,
          "memberName": "Juan Pérez",
          "birthdayEventId": 1,
          "amount": 100,
          "datePaid": "2024-12-10"
        }
      ]
    }
  ]
}
```

**Response Error (401):**
```typescript
{
  error: string;
}
```

**Ejemplo:**
```json
{
  "error": "Usuario no autenticado"
}
```

**Notas:**
- Este endpoint reemplaza la necesidad de hacer múltiples peticiones a `/api/groups/:groupId/members`, `/api/groups/:groupId/events`, y `/api/groups/:groupId/payments`
- Los pagos recientes están limitados a los últimos 10 para mantener la respuesta manejable
- Todas las estadísticas se calculan en tiempo real
- Los montos están redondeados a 2 decimales

---

### POST /api/groups

Crea un nuevo grupo.

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```typescript
{
  name: string;              // 1-100 caracteres, requerido
  amountPerBirthday: number; // Número positivo mayor a 0, requerido
  description?: string;      // Máximo 500 caracteres, opcional
}
```

**Ejemplo:**
```json
{
  "name": "Grupo de Cumpleaños 2024",
  "amountPerBirthday": 500,
  "description": "Grupo para celebrar cumpleaños del año 2024"
}
```

**Response Success (201):**
```typescript
{
  message: string;
  group: {
    id: number;
    userId: number;
    name: string;
    amountPerBirthday: number;
    description?: string;
    createdAt: string;  // ISO 8601
    updatedAt: string;  // ISO 8601
  };
}
```

**Response Error (400):**
```typescript
{
  error: string | string[];
}
```

**Response Error (401):**
```typescript
{
  error: string;
}
```

---

### GET /api/groups/:id

Obtiene el detalle de un grupo por ID.

**Headers:**
```
Authorization: Bearer {token}
```

**Response Success (200):**
```typescript
{
  message: string;
  group: {
    id: number;
    userId: number;
    name: string;
    amountPerBirthday: number;
    description?: string;
    createdAt: string;  // ISO 8601
    updatedAt: string;  // ISO 8601
  };
}
```

**Response Error (400):**
```typescript
{
  error: string;
}
```

**Ejemplo:**
```json
{
  "error": "ID de grupo inválido"
}
```

**Response Error (404):**
```typescript
{
  error: string;
}
```

**Ejemplo:**
```json
{
  "error": "Grupo no encontrado"
}
```

---

### PUT /api/groups/:id

Actualiza un grupo existente.

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```typescript
{
  name?: string;              // 1-100 caracteres, opcional
  amountPerBirthday?: number; // Número positivo mayor a 0, opcional
  description?: string;      // Máximo 500 caracteres, opcional
}
```

**Ejemplo:**
```json
{
  "name": "Grupo de Cumpleaños 2024 - Actualizado",
  "amountPerBirthday": 600
}
```

**Response Success (200):**
```typescript
{
  message: string;
  group: {
    id: number;
    userId: number;
    name: string;
    amountPerBirthday: number;
    description?: string;
    createdAt: string;  // ISO 8601
    updatedAt: string;  // ISO 8601
  };
}
```

**Response Error (404):**
```typescript
{
  error: string;
}
```

---

### DELETE /api/groups/:id

Elimina un grupo.

**Headers:**
```
Authorization: Bearer {token}
```

**Response Success (200):**
```typescript
{
  message: string;
}
```

**Ejemplo:**
```json
{
  "message": "Grupo eliminado exitosamente"
}
```

**Response Error (404):**
```typescript
{
  error: string;
}
```

---

## 👤 Miembros

### GET /api/groups/:groupId/members

Lista todos los miembros de un grupo.

**Headers:**
```
Authorization: Bearer {token}
```

**Response Success (200):**
```typescript
{
  message: string;
  members: Array<{
    id: number;
    groupId: number;
    name: string;
    phone?: string;
    birthday: string;  // Formato: "yyyy-MM-dd"
    photoUrl?: string;
    createdAt: string;  // ISO 8601
    updatedAt: string;  // ISO 8601
  }>;
}
```

**Response Error (404):**
```typescript
{
  error: string;
}
```

**Ejemplo:**
```json
{
  "error": "Grupo no encontrado"
}
```

---

### POST /api/groups/:groupId/members

Crea un nuevo miembro en un grupo.

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```typescript
{
  name: string;        // 1-100 caracteres, requerido
  phone?: string;      // Máximo 20 caracteres, formato válido, opcional
  birthday: string;    // Formato: "yyyy-MM-dd", no puede ser futura, requerido
  photoUrl?: string;   // URL válida, máximo 500 caracteres, opcional
}
```

**Ejemplo:**
```json
{
  "name": "María González",
  "phone": "1234567890",
  "birthday": "1990-03-15",
  "photoUrl": "https://example.com/photo.jpg"
}
```

**Response Success (201):**
```typescript
{
  message: string;
  member: {
    id: number;
    groupId: number;
    name: string;
    phone?: string;
    birthday: string;  // Formato: "yyyy-MM-dd"
    photoUrl?: string;
    createdAt: string;  // ISO 8601
    updatedAt: string;  // ISO 8601
  };
}
```

**Response Error (400):**
```typescript
{
  error: string | string[];
}
```

**Response Error (404):**
```typescript
{
  error: string;
}
```

---

### GET /api/members/:id

Obtiene el detalle de un miembro por ID.

**Headers:**
```
Authorization: Bearer {token}
```

**Response Success (200):**
```typescript
{
  message: string;
  member: {
    id: number;
    groupId: number;
    name: string;
    phone?: string;
    birthday: string;  // Formato: "yyyy-MM-dd"
    photoUrl?: string;
    createdAt: string;  // ISO 8601
    updatedAt: string;  // ISO 8601
  };
}
```

**Response Error (404):**
```typescript
{
  error: string;
}
```

---

### PUT /api/members/:id

Actualiza un miembro existente.

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```typescript
{
  name?: string;        // 1-100 caracteres, opcional
  phone?: string;       // Máximo 20 caracteres, formato válido, opcional
  birthday?: string;    // Formato: "yyyy-MM-dd", no puede ser futura, opcional
  photoUrl?: string;    // URL válida, máximo 500 caracteres, opcional
}
```

**Ejemplo:**
```json
{
  "name": "María González Actualizada",
  "phone": "0987654321"
}
```

**Response Success (200):**
```typescript
{
  message: string;
  member: {
    id: number;
    groupId: number;
    name: string;
    phone?: string;
    birthday: string;  // Formato: "yyyy-MM-dd"
    photoUrl?: string;
    createdAt: string;  // ISO 8601
    updatedAt: string;  // ISO 8601
  };
}
```

**Response Error (404):**
```typescript
{
  error: string;
}
```

---

### DELETE /api/members/:id

Elimina un miembro.

**Headers:**
```
Authorization: Bearer {token}
```

**Response Success (200):**
```typescript
{
  message: string;
}
```

**Response Error (404):**
```typescript
{
  error: string;
}
```

---

## 🎂 Eventos

### GET /api/groups/:groupId/events

Lista todos los eventos de cumpleaños de un grupo.

**Headers:**
```
Authorization: Bearer {token}
```

**Response Success (200):**
```typescript
{
  message: string;
  events: Array<{
    id: number;
    memberId: number;
    groupId: number;
    birthdayDate: string;  // Formato: "yyyy-MM-dd"
    expectedAmount: number;
    createdAt: string;  // ISO 8601
    updatedAt: string;  // ISO 8601
  }>;
}
```

**Response Error (404):**
```typescript
{
  error: string;
}
```

---

### POST /api/groups/:groupId/events/generate

Genera eventos de cumpleaños para el año actual de todos los miembros del grupo.

**Headers:**
```
Authorization: Bearer {token}
```

**Response Success (200):**
```typescript
{
  message: string;
  eventsCreated: number;
  events: Array<{
    id: number;
    memberId: number;
    groupId: number;
    birthdayDate: string;  // Formato: "yyyy-MM-dd"
    expectedAmount: number;
    createdAt: string;  // ISO 8601
    updatedAt: string;  // ISO 8601
  }>;
}
```

**Ejemplo:**
```json
{
  "message": "Se generaron 5 evento(s) para el año 2024",
  "eventsCreated": 5,
  "events": [
    {
      "id": 1,
      "memberId": 1,
      "groupId": 1,
      "birthdayDate": "2024-03-15",
      "expectedAmount": 2500,
      "createdAt": "2024-12-09T10:00:00.000Z",
      "updatedAt": "2024-12-09T10:00:00.000Z"
    }
  ]
}
```

**Response Error (404):**
```typescript
{
  error: string;
}
```

---

### GET /api/events/:eventId

Obtiene el detalle de un evento por ID, incluyendo información del miembro.

**Headers:**
```
Authorization: Bearer {token}
```

**Response Success (200):**
```typescript
{
  message: string;
  event: {
    id: number;
    memberId: number;
    groupId: number;
    birthdayDate: string;  // Formato: "yyyy-MM-dd"
    expectedAmount: number;
    createdAt: string;  // ISO 8601
    updatedAt: string;  // ISO 8601
    member?: {
      id: number;
      groupId: number;
      name: string;
      phone?: string;
      birthday: string;  // Formato: "yyyy-MM-dd"
      photoUrl?: string;
      createdAt: string;  // ISO 8601
      updatedAt: string;  // ISO 8601
    };
  };
}
```

**Response Error (404):**
```typescript
{
  error: string;
}
```

---

## 💰 Pagos

### GET /api/events/:eventId/payments

Lista todos los pagos de un evento, incluyendo resumen con totales.

**Headers:**
```
Authorization: Bearer {token}
```

**Response Success (200):**
```typescript
{
  message: string;
  event: {
    id: number;
    expectedAmount: number;
    birthdayDate: string;  // Formato: "yyyy-MM-dd"
  };
  payments: Array<{
    id: number;
    birthdayEventId: number;
    memberId: number;
    amount: number;
    datePaid: string;  // Formato: "yyyy-MM-dd"
    proofUrl?: string;
    createdAt: string;  // ISO 8601
    updatedAt: string;  // ISO 8601
    member?: {
      id: number;
      groupId: number;
      name: string;
      phone?: string;
      birthday: string;  // Formato: "yyyy-MM-dd"
      photoUrl?: string;
      createdAt: string;  // ISO 8601
      updatedAt: string;  // ISO 8601
    };
  }>;
  summary: {
    totalPaid: number;
    totalExpected: number;
    remaining: number;
    percentageCompleted: number;  // 0-100
  };
}
```

**Ejemplo:**
```json
{
  "message": "Pagos obtenidos exitosamente",
  "event": {
    "id": 1,
    "expectedAmount": 2000,
    "birthdayDate": "2024-03-15"
  },
  "payments": [
    {
      "id": 1,
      "birthdayEventId": 1,
      "memberId": 2,
      "amount": 500,
      "datePaid": "2024-12-10",
      "proofUrl": "https://example.com/proof.jpg",
      "member": {
        "id": 2,
        "groupId": 1,
        "name": "Juan Pérez",
        "phone": "1234567890",
        "birthday": "1990-05-20",
        "createdAt": "2024-12-09T10:00:00.000Z",
        "updatedAt": "2024-12-09T10:00:00.000Z"
      },
      "createdAt": "2024-12-10T10:00:00.000Z",
      "updatedAt": "2024-12-10T10:00:00.000Z"
    }
  ],
  "summary": {
    "totalPaid": 500,
    "totalExpected": 2000,
    "remaining": 1500,
    "percentageCompleted": 25
  }
}
```

**Response Error (404):**
```typescript
{
  error: string;
}
```

---

### POST /api/events/:eventId/payments

Registra un nuevo pago para un evento.

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```typescript
{
  memberId: number;    // ID del miembro que realiza el pago, requerido
  amount: number;      // Número positivo mayor a 0, requerido
  datePaid: string;    // Formato: "yyyy-MM-dd", no puede ser futura, requerido
  proofUrl?: string;   // URL válida, máximo 500 caracteres, opcional
}
```

**Ejemplo:**
```json
{
  "memberId": 2,
  "amount": 500,
  "datePaid": "2024-12-15",
  "proofUrl": "https://example.com/proof.jpg"
}
```

**Response Success (201):**
```typescript
{
  message: string;
  payment: {
    id: number;
    birthdayEventId: number;
    memberId: number;
    amount: number;
    datePaid: string;  // Formato: "yyyy-MM-dd"
    proofUrl?: string;
    createdAt: string;  // ISO 8601
    updatedAt: string;  // ISO 8601
  };
}
```

**Response Error (400):**
```typescript
{
  error: string;
}
```

**Ejemplo:**
```json
{
  "error": "El miembro no existe o no pertenece al grupo del evento"
}
```

**Response Error (409):**
```typescript
{
  error: string;
}
```

**Ejemplo:**
```json
{
  "error": "Este miembro ya tiene un pago registrado para este evento"
}
```

**Response Error (404):**
```typescript
{
  error: string;
}
```

---

### GET /api/payments/:id

Obtiene el detalle de un pago por ID, incluyendo información del miembro.

**Headers:**
```
Authorization: Bearer {token}
```

**Response Success (200):**
```typescript
{
  message: string;
  payment: {
    id: number;
    birthdayEventId: number;
    memberId: number;
    amount: number;
    datePaid: string;  // Formato: "yyyy-MM-dd"
    proofUrl?: string;
    createdAt: string;  // ISO 8601
    updatedAt: string;  // ISO 8601
    member?: {
      id: number;
      groupId: number;
      name: string;
      phone?: string;
      birthday: string;  // Formato: "yyyy-MM-dd"
      photoUrl?: string;
      createdAt: string;  // ISO 8601
      updatedAt: string;  // ISO 8601
    };
  };
}
```

**Response Error (404):**
```typescript
{
  error: string;
}
```

---

### PUT /api/payments/:id

Actualiza un pago existente.

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```typescript
{
  amount?: number;      // Número positivo mayor a 0, opcional
  datePaid?: string;    // Formato: "yyyy-MM-dd", no puede ser futura, opcional
  proofUrl?: string;    // URL válida, máximo 500 caracteres, opcional
}
```

**Ejemplo:**
```json
{
  "amount": 600,
  "datePaid": "2024-12-16"
}
```

**Response Success (200):**
```typescript
{
  message: string;
  payment: {
    id: number;
    birthdayEventId: number;
    memberId: number;
    amount: number;
    datePaid: string;  // Formato: "yyyy-MM-dd"
    proofUrl?: string;
    createdAt: string;  // ISO 8601
    updatedAt: string;  // ISO 8601
    member?: {
      id: number;
      groupId: number;
      name: string;
      phone?: string;
      birthday: string;  // Formato: "yyyy-MM-dd"
      photoUrl?: string;
      createdAt: string;  // ISO 8601
      updatedAt: string;  // ISO 8601
    };
  };
}
```

**Response Error (404):**
```typescript
{
  error: string;
}
```

---

### DELETE /api/payments/:id

Elimina un pago.

**Headers:**
```
Authorization: Bearer {token}
```

**Response Success (200):**
```typescript
{
  message: string;
}
```

**Ejemplo:**
```json
{
  "message": "Pago eliminado exitosamente"
}
```

**Response Error (404):**
```typescript
{
  error: string;
}
```

---

## 🚨 Manejo de Errores

### Códigos de Estado HTTP

- **200 OK**: Operación exitosa
- **201 Created**: Recurso creado exitosamente
- **400 Bad Request**: Error de validación o datos inválidos
- **401 Unauthorized**: No autenticado o token inválido/expirado
- **404 Not Found**: Recurso no encontrado
- **409 Conflict**: Conflicto (ej: email duplicado, pago duplicado)
- **429 Too Many Requests**: Demasiados intentos (solo en producción)
- **500 Internal Server Error**: Error interno del servidor

### Estructura de Errores

Todos los errores siguen esta estructura:

```typescript
{
  error: string | string[];
}
```

**Ejemplo de error simple:**
```json
{
  "error": "Grupo no encontrado"
}
```

**Ejemplo de error de validación (array):**
```json
{
  "error": [
    "El nombre es requerido",
    "El email debe tener un formato válido"
  ]
}
```

### Errores Comunes

#### 401 Unauthorized
```json
{
  "error": "Token de autenticación requerido"
}
```

```json
{
  "error": "Token expirado"
}
```

```json
{
  "error": "Token inválido"
}
```

#### 400 Bad Request
```json
{
  "error": "ID de grupo inválido"
}
```

```json
{
  "error": "La fecha de cumpleaños no puede ser futura"
}
```

#### 404 Not Found
```json
{
  "error": "Grupo no encontrado"
}
```

```json
{
  "error": "Miembro no encontrado"
}
```

#### 409 Conflict
```json
{
  "error": "El email ya está registrado"
}
```

```json
{
  "error": "Este miembro ya tiene un pago registrado para este evento"
}
```

---

## 📝 Notas Importantes

1. **Autenticación**: Todos los endpoints excepto `/api/auth/*` requieren el header `Authorization: Bearer {token}`

2. **Formato de Fechas**: 
   - Las fechas se envían y reciben en formato `yyyy-MM-dd` (ejemplo: `2024-12-15`)
   - Las fechas de timestamps (createdAt, updatedAt) se envían en formato ISO 8601

3. **Timezones**: 
   - Todas las fechas se manejan en timezone de Veracruz, México (America/Mexico_City)
   - El backend convierte automáticamente entre UTC (base de datos) y Veracruz

4. **Validaciones**:
   - Todos los campos requeridos deben estar presentes
   - Los campos opcionales pueden omitirse o enviarse como `null`
   - Las validaciones se realizan con express-validator

5. **Rate Limiting**: 
   - Solo está activo cuando `NODE_ENV=production`
   - Afecta principalmente a endpoints de autenticación

---

**Última actualización**: 2024-12-09

