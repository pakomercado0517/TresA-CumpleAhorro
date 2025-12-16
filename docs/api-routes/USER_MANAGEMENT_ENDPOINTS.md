# Documentación de Endpoints - Gestión de Usuarios

Esta documentación describe los endpoints disponibles para la gestión de usuarios en la API de Tanda Cumpleañera.

---

## 📋 Tabla de Contenidos

1. [GET /api/users/me](#1-get-apiusersme)
2. [PUT /api/users/me](#2-put-apiusersme)
3. [PUT /api/users/me/password](#3-put-apiusersmepassword)
4. [PUT /api/users/me/avatar](#4-put-apiusersmeavatar)

---

## 🔐 Autenticación

**TODOS** los endpoints de gestión de usuarios requieren autenticación mediante JWT.

**Header requerido:**
```
Authorization: Bearer <token>
```

---

## 1. GET /api/users/me

Obtiene el perfil del usuario autenticado.

### Request

**Método:** `GET`  
**URL:** `/api/users/me`  
**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**No requiere body.**

### Response

**Status Code:** `200 OK`

**Estructura de respuesta:**
```json
{
  "message": "Perfil obtenido exitosamente",
  "user": {
    "id": 1,
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "emailVerified": true,
    "avatarUrl": "https://example.com/avatar.jpg",
    "createdAt": "2024-12-15T04:06:00.782Z",
    "updatedAt": "2024-12-15T04:06:00.782Z"
  }
}
```

**Campos:**
- `message` (string): Mensaje de confirmación
- `user` (object): Objeto con los datos del usuario
  - `id` (number): ID único del usuario
  - `name` (string): Nombre completo del usuario
  - `email` (string): Email del usuario
  - `emailVerified` (boolean): Indica si el email está verificado
  - `avatarUrl` (string | null): URL del avatar del usuario (puede ser `null`)
  - `createdAt` (string): Fecha de creación en formato ISO 8601
  - `updatedAt` (string): Fecha de última actualización en formato ISO 8601

### Errores

**401 Unauthorized:**
```json
{
  "error": "Usuario no autenticado"
}
```

**404 Not Found:**
```json
{
  "error": "Usuario no encontrado"
}
```

**500 Internal Server Error:**
```json
{
  "error": "Error interno del servidor"
}
```

### Ejemplo de uso

```bash
curl -X GET \
  http://localhost:3000/api/users/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## 2. PUT /api/users/me

Actualiza el perfil del usuario autenticado (nombre y/o email).

### Request

**Método:** `PUT`  
**URL:** `/api/users/me`  
**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "name": "Juan Pérez",
  "email": "juan.nuevo@example.com"
}
```

**Notas importantes:**
- Al menos uno de los campos (`name` o `email`) debe estar presente
- Ambos campos son opcionales, pero no puedes enviar un body vacío
- Si actualizas el `email`, el campo `emailVerified` se establecerá automáticamente en `false`
- El `email` debe ser único en el sistema

**Validaciones:**
- `name`: 
  - Opcional
  - Debe tener entre 2 y 100 caracteres
  - Solo puede contener letras y espacios
- `email`:
  - Opcional
  - Debe tener un formato de email válido
  - Máximo 255 caracteres
  - Debe ser único en el sistema

### Response

**Status Code:** `200 OK`

**Estructura de respuesta:**
```json
{
  "message": "Perfil actualizado exitosamente",
  "user": {
    "id": 1,
    "name": "Juan Pérez",
    "email": "juan.nuevo@example.com",
    "emailVerified": false,
    "avatarUrl": "https://example.com/avatar.jpg",
    "createdAt": "2024-12-15T04:06:00.782Z",
    "updatedAt": "2024-12-15T10:30:00.123Z"
  }
}
```

**Campos:**
- `message` (string): Mensaje de confirmación
- `user` (object): Objeto con los datos actualizados del usuario (misma estructura que GET /api/users/me)

### Errores

**400 Bad Request:**
```json
{
  "errors": [
    {
      "field": "name",
      "message": "El nombre debe tener entre 2 y 100 caracteres"
    }
  ]
}
```

**401 Unauthorized:**
```json
{
  "error": "Usuario no autenticado"
}
```

**404 Not Found:**
```json
{
  "error": "Usuario no encontrado"
}
```

**409 Conflict:**
```json
{
  "error": "El email ya está en uso"
}
```

**500 Internal Server Error:**
```json
{
  "error": "Error interno del servidor"
}
```

### Ejemplo de uso

**Actualizar solo el nombre:**
```bash
curl -X PUT \
  http://localhost:3000/api/users/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Juan Carlos Pérez"
  }'
```

**Actualizar solo el email:**
```bash
curl -X PUT \
  http://localhost:3000/api/users/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan.nuevo@example.com"
  }'
```

**Actualizar ambos campos:**
```bash
curl -X PUT \
  http://localhost:3000/api/users/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Juan Carlos Pérez",
    "email": "juan.nuevo@example.com"
  }'
```

---

## 3. PUT /api/users/me/password

Cambia la contraseña del usuario autenticado.

### Request

**Método:** `PUT`  
**URL:** `/api/users/me/password`  
**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "oldPassword": "Password123",
  "newPassword": "NewPassword456"
}
```

**Campos requeridos:**
- `oldPassword` (string): Contraseña actual del usuario
- `newPassword` (string): Nueva contraseña

**Validaciones:**
- `oldPassword`:
  - Requerido
  - Debe ser una cadena de texto
  - Debe coincidir con la contraseña actual del usuario
- `newPassword`:
  - Requerido
  - Debe tener entre 8 y 100 caracteres
  - Debe contener al menos:
    - Una letra minúscula
    - Una letra mayúscula
    - Un número
  - Debe ser diferente a la contraseña actual

### Response

**Status Code:** `200 OK`

**Estructura de respuesta:**
```json
{
  "message": "Contraseña actualizada exitosamente"
}
```

**Campos:**
- `message` (string): Mensaje de confirmación

### Errores

**400 Bad Request:**
```json
{
  "errors": [
    {
      "field": "newPassword",
      "message": "La nueva contraseña debe tener entre 8 y 100 caracteres"
    }
  ]
}
```

O si la nueva contraseña es igual a la actual:
```json
{
  "error": "La nueva contraseña debe ser diferente a la actual"
}
```

**401 Unauthorized:**
```json
{
  "error": "Usuario no autenticado"
}
```

O si la contraseña actual es incorrecta:
```json
{
  "error": "La contraseña actual es incorrecta"
}
```

**404 Not Found:**
```json
{
  "error": "Usuario no encontrado"
}
```

**500 Internal Server Error:**
```json
{
  "error": "Error interno del servidor"
}
```

### Ejemplo de uso

```bash
curl -X PUT \
  http://localhost:3000/api/users/me/password \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "oldPassword": "Password123",
    "newPassword": "NewPassword456"
  }'
```

---

## 4. PUT /api/users/me/avatar

Cambia la URL del avatar del usuario autenticado.

### Request

**Método:** `PUT`  
**URL:** `/api/users/me/avatar`  
**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "avatarUrl": "https://example.com/avatars/user123.jpg"
}
```

**Campos requeridos:**
- `avatarUrl` (string): URL completa del avatar

**Validaciones:**
- `avatarUrl`:
  - Requerido
  - Debe ser una URL válida
  - Máximo 500 caracteres

**Nota:** Este endpoint solo actualiza la URL del avatar. La subida del archivo de imagen debe manejarse por separado en el frontend o mediante otro servicio (por ejemplo, un servicio de almacenamiento en la nube como AWS S3, Cloudinary, etc.).

### Response

**Status Code:** `200 OK`

**Estructura de respuesta:**
```json
{
  "message": "Avatar actualizado exitosamente",
  "user": {
    "id": 1,
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "emailVerified": true,
    "avatarUrl": "https://example.com/avatars/user123.jpg",
    "createdAt": "2024-12-15T04:06:00.782Z",
    "updatedAt": "2024-12-15T10:35:00.456Z"
  }
}
```

**Campos:**
- `message` (string): Mensaje de confirmación
- `user` (object): Objeto con los datos actualizados del usuario (misma estructura que GET /api/users/me)

### Errores

**400 Bad Request:**
```json
{
  "errors": [
    {
      "field": "avatarUrl",
      "message": "La URL del avatar debe ser una URL válida"
    }
  ]
}
```

**401 Unauthorized:**
```json
{
  "error": "Usuario no autenticado"
}
```

**404 Not Found:**
```json
{
  "error": "Usuario no encontrado"
}
```

**500 Internal Server Error:**
```json
{
  "error": "Error interno del servidor"
}
```

### Ejemplo de uso

```bash
curl -X PUT \
  http://localhost:3000/api/users/me/avatar \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "avatarUrl": "https://example.com/avatars/user123.jpg"
  }'
```

**Para eliminar el avatar (establecer en null):**
```bash
curl -X PUT \
  http://localhost:3000/api/users/me/avatar \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "avatarUrl": ""
  }'
```

**Nota:** Si envías una cadena vacía (`""`), el sistema establecerá `avatarUrl` en `null`.

---

## 📝 Notas Importantes

1. **Autenticación:** Todos los endpoints requieren un token JWT válido en el header `Authorization`.

2. **Validación de datos:** Todos los endpoints validan los datos de entrada. Si hay errores de validación, se devuelve un array de errores con el campo y el mensaje correspondiente.

3. **Email único:** El email debe ser único en el sistema. Si intentas actualizar tu email a uno que ya existe, recibirás un error 409 Conflict.

4. **Email verification:** Si actualizas tu email, el campo `emailVerified` se establecerá automáticamente en `false`. Deberás verificar el nuevo email.

5. **Contraseña:** La nueva contraseña debe cumplir con los requisitos de seguridad (mínimo 8 caracteres, al menos una mayúscula, una minúscula y un número).

6. **Avatar URL:** El endpoint de avatar solo actualiza la URL. La subida del archivo debe manejarse por separado.

---

## 🔄 Flujo de Trabajo Recomendado

### Actualizar Perfil Completo

1. **Obtener perfil actual:**
   ```
   GET /api/users/me
   ```

2. **Actualizar nombre y/o email:**
   ```
   PUT /api/users/me
   Body: { "name": "...", "email": "..." }
   ```

3. **Cambiar contraseña (si es necesario):**
   ```
   PUT /api/users/me/password
   Body: { "oldPassword": "...", "newPassword": "..." }
   ```

4. **Actualizar avatar (si es necesario):**
   ```
   PUT /api/users/me/avatar
   Body: { "avatarUrl": "https://..." }
   ```

---

## 📚 Tipos TypeScript (Frontend)

Para facilitar la integración en el frontend, aquí están los tipos TypeScript correspondientes:

```typescript
// Tipos de Request
interface UpdateUserDto {
  name?: string;
  email?: string;
}

interface ChangePasswordDto {
  oldPassword: string;
  newPassword: string;
}

interface ChangeAvatarDto {
  avatarUrl: string;
}

// Tipos de Response
interface UserProfileResponse {
  id: number;
  name: string;
  email: string;
  emailVerified: boolean;
  avatarUrl: string | null;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}

interface GetUserProfileResponse {
  message: string;
  user: UserProfileResponse;
}

interface UpdateUserProfileResponse {
  message: string;
  user: UserProfileResponse;
}

interface ChangePasswordResponse {
  message: string;
}

interface ChangeAvatarResponse {
  message: string;
  user: UserProfileResponse;
}
```

---

**Última actualización:** 2025-01-15

