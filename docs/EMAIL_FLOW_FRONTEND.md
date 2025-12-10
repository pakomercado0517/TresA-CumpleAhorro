# Flujo de Emails - Documentación para Frontend

Este documento describe cómo el frontend debe interactuar con el sistema de emails del backend, incluyendo verificación de email y reset de contraseña.

---

## 📋 Tabla de Contenidos

1. [Flujo de Verificación de Email](#flujo-de-verificación-de-email)
2. [Flujo de Reset de Contraseña](#flujo-de-reset-de-contraseña)
3. [Endpoints Disponibles](#endpoints-disponibles)
4. [Manejo de Errores](#manejo-de-errores)
5. [Ejemplos de Implementación](#ejemplos-de-implementación)

---

## 🔐 Flujo de Verificación de Email

### Descripción

Cuando un usuario se registra, el backend envía automáticamente un email de confirmación. El frontend debe permitir al usuario verificar su email haciendo clic en el enlace del email.

### Flujo Completo

```
1. Usuario se registra → POST /api/auth/register
   ↓
2. Backend envía email automáticamente con token
   ↓
3. Usuario recibe email y hace clic en el enlace
   ↓
4. Frontend redirige a: /auth/verify-email?token=xxx
   ↓
5. Frontend llama: GET /api/auth/verify-email?token=xxx
   ↓
6. Backend verifica token y marca email como verificado
   ↓
7. Frontend muestra mensaje de éxito
```

### Endpoint: Verificar Email

**`GET /api/auth/verify-email`**

#### Query Parameters

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `token` | string | Sí | Token de verificación recibido por email |

#### Request Example

```typescript
// URL completa
GET /api/auth/verify-email?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

// Con fetch
const token = new URLSearchParams(window.location.search).get('token');
const response = await fetch(`${API_URL}/api/auth/verify-email?token=${token}`);
```

#### Response Success (200)

```json
{
  "message": "Email verificado exitosamente"
}
```

#### Response Error (400) - Token Expirado

```json
{
  "error": "Token de verificación expirado"
}
```

#### Response Error (400) - Token Inválido

```json
{
  "error": "Token de verificación inválido"
}
```

#### Response Error (404) - Usuario No Encontrado

```json
{
  "error": "Token de verificación inválido o usuario no encontrado"
}
```

### Implementación en Frontend

```typescript
// Ejemplo con React
const VerifyEmailPage = () => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      const params = new URLSearchParams(window.location.search);
      const token = params.get('token');

      if (!token) {
        setStatus('error');
        setMessage('Token de verificación no proporcionado');
        return;
      }

      try {
        const response = await fetch(`${API_URL}/api/auth/verify-email?token=${token}`);
        const data = await response.json();

        if (response.ok) {
          setStatus('success');
          setMessage(data.message);
        } else {
          setStatus('error');
          setMessage(data.error || 'Error al verificar email');
        }
      } catch (error) {
        setStatus('error');
        setMessage('Error de conexión. Por favor intenta nuevamente.');
      }
    };

    verifyEmail();
  }, []);

  return (
    <div>
      {status === 'loading' && <p>Verificando email...</p>}
      {status === 'success' && (
        <div>
          <p>✅ {message}</p>
          <Link to="/login">Ir al login</Link>
        </div>
      )}
      {status === 'error' && (
        <div>
          <p>❌ {message}</p>
          <Link to="/resend-verification">Reenviar email de verificación</Link>
        </div>
      )}
    </div>
  );
};
```

---

## 🔑 Flujo de Reset de Contraseña

### Descripción

Permite a los usuarios restablecer su contraseña cuando la olvidan. El proceso consta de dos pasos:
1. Solicitar reset (envía email con token)
2. Resetear contraseña (usa el token del email)

### Flujo Completo

```
1. Usuario olvida contraseña
   ↓
2. Frontend: POST /api/auth/forgot-password
   Body: { "email": "usuario@example.com" }
   ↓
3. Backend envía email con token de reset
   ↓
4. Usuario recibe email y hace clic en el enlace
   ↓
5. Frontend redirige a: /auth/reset-password?token=xxx
   ↓
6. Usuario ingresa nueva contraseña
   ↓
7. Frontend: POST /api/auth/reset-password
   Body: { "token": "xxx", "password": "NuevaPassword123" }
   ↓
8. Backend valida token y actualiza contraseña
   ↓
9. Frontend muestra mensaje de éxito y redirige a login
```

### Endpoint 1: Solicitar Reset de Contraseña

**`POST /api/auth/forgot-password`**

#### Request Body

```typescript
interface ForgotPasswordRequest {
  email: string;
}
```

#### Request Example

```json
{
  "email": "usuario@example.com"
}
```

#### Response Success (200)

```json
{
  "message": "Si el email existe en nuestro sistema, recibirás un correo con instrucciones para restablecer tu contraseña"
}
```

**Nota:** El mensaje siempre es el mismo, independientemente de si el email existe o no (por seguridad).

#### Response Error (400) - Validación

```json
{
  "errors": [
    {
      "field": "email",
      "message": "El email debe tener un formato válido"
    }
  ]
}
```

### Endpoint 2: Resetear Contraseña

**`POST /api/auth/reset-password`**

#### Request Body

```typescript
interface ResetPasswordRequest {
  token: string;
  password: string;
}
```

#### Request Example

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "password": "NuevaPassword123"
}
```

#### Response Success (200)

```json
{
  "message": "Contraseña restablecida exitosamente"
}
```

#### Response Error (400) - Token Expirado

```json
{
  "error": "Token de reset expirado. Por favor solicita uno nuevo"
}
```

#### Response Error (400) - Token Inválido

```json
{
  "error": "Token de reset inválido"
}
```

#### Response Error (400) - Validación de Contraseña

```json
{
  "errors": [
    {
      "field": "password",
      "message": "La contraseña debe contener al menos una letra minúscula, una mayúscula y un número"
    }
  ]
}
```

#### Response Error (404) - Usuario No Encontrado

```json
{
  "error": "Token de reset inválido o usuario no encontrado"
}
```

### Implementación en Frontend

#### Paso 1: Solicitar Reset

```typescript
// ForgotPasswordPage.tsx
const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const response = await fetch(`${API_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage(data.message);
      } else {
        setStatus('error');
        setMessage(data.error || 'Error al solicitar reset');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Error de conexión. Por favor intenta nuevamente.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <button type="submit" disabled={status === 'loading'}>
        {status === 'loading' ? 'Enviando...' : 'Enviar enlace de reset'}
      </button>
      {status === 'success' && <p>✅ {message}</p>}
      {status === 'error' && <p>❌ {message}</p>}
    </form>
  );
};
```

#### Paso 2: Resetear Contraseña

```typescript
// ResetPasswordPage.tsx
const ResetPasswordPage = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (!token) {
      setStatus('error');
      setMessage('Token no proporcionado');
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setStatus('error');
      setMessage('Las contraseñas no coinciden');
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (!token) {
      setStatus('error');
      setMessage('Token no válido');
      return;
    }

    setStatus('loading');

    try {
      const response = await fetch(`${API_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage(data.message);
        // Redirigir a login después de 2 segundos
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      } else {
        setStatus('error');
        setMessage(data.error || 'Error al resetear contraseña');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Error de conexión. Por favor intenta nuevamente.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Nueva contraseña"
        required
        minLength={8}
      />
      <input
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder="Confirmar contraseña"
        required
        minLength={8}
      />
      <button type="submit" disabled={status === 'loading'}>
        {status === 'loading' ? 'Reseteando...' : 'Resetear contraseña'}
      </button>
      {status === 'success' && <p>✅ {message}</p>}
      {status === 'error' && <p>❌ {message}</p>}
    </form>
  );
};
```

---

## 📧 Endpoints Disponibles

### Resumen de Endpoints

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| `GET` | `/api/auth/verify-email?token=xxx` | Verificar email con token | No |
| `POST` | `/api/auth/forgot-password` | Solicitar reset de contraseña | No |
| `POST` | `/api/auth/reset-password` | Resetear contraseña con token | No |

---

## ⚠️ Manejo de Errores

### Códigos HTTP

| Código | Significado | Acción Recomendada |
|--------|-------------|-------------------|
| `200` | Éxito | Mostrar mensaje de éxito |
| `400` | Error de validación o token inválido/expirado | Mostrar mensaje de error específico |
| `404` | Recurso no encontrado | Mostrar mensaje de error |
| `500` | Error interno del servidor | Mostrar mensaje genérico y sugerir reintentar |

### Errores Comunes

#### Token Expirado

**Causa:** El token de verificación o reset expiró (24h para verificación, 1h para reset)

**Solución:** 
- Para verificación: Permitir reenviar email de verificación
- Para reset: Solicitar un nuevo token

#### Token Inválido

**Causa:** El token no es válido o ya fue usado

**Solución:** Solicitar un nuevo token

#### Email No Verificado

**Nota:** Actualmente el login no requiere email verificado, pero puedes agregar esta validación en el frontend si lo deseas.

---

## 🔄 Flujo de Registro con Email

### Cambios en el Endpoint de Registro

El endpoint `POST /api/auth/register` ahora:

1. ✅ Crea el usuario con `emailVerified: false`
2. ✅ Genera un token de verificación
3. ✅ Envía email automáticamente (no bloquea si falla)
4. ✅ Retorna el usuario con `emailVerified: false`

#### Response Actualizado

```json
{
  "message": "Usuario creado exitosamente",
  "user": {
    "id": 1,
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "emailVerified": false,
    "createdAt": "2024-12-09T23:00:00.000Z",
    "updatedAt": "2024-12-09T23:00:00.000Z"
  }
}
```

### Recomendación para Frontend

Después del registro, mostrar un mensaje como:

```typescript
// Después de registro exitoso
<div>
  <h2>¡Registro exitoso!</h2>
  <p>
    Hemos enviado un email de confirmación a <strong>{user.email}</strong>.
    Por favor verifica tu email para activar tu cuenta.
  </p>
  <p>
    ¿No recibiste el email?{' '}
    <button onClick={handleResendVerification}>
      Reenviar email de verificación
    </button>
  </p>
</div>
```

**Nota:** El endpoint para reenviar email de verificación aún no está implementado, pero puedes agregarlo si lo necesitas.

---

## 📝 Validaciones de Contraseña

### Reglas de Validación

La contraseña debe cumplir:
- ✅ Mínimo 8 caracteres
- ✅ Máximo 100 caracteres
- ✅ Al menos una letra minúscula
- ✅ Al menos una letra mayúscula
- ✅ Al menos un número

### Validación en Frontend (Recomendada)

```typescript
const validatePassword = (password: string): string | null => {
  if (password.length < 8 || password.length > 100) {
    return 'La contraseña debe tener entre 8 y 100 caracteres';
  }
  if (!/[a-z]/.test(password)) {
    return 'La contraseña debe contener al menos una letra minúscula';
  }
  if (!/[A-Z]/.test(password)) {
    return 'La contraseña debe contener al menos una letra mayúscula';
  }
  if (!/\d/.test(password)) {
    return 'La contraseña debe contener al menos un número';
  }
  return null;
};
```

---

## 🔗 URLs de los Emails

### Email de Verificación

El email contiene un enlace como:
```
https://tu-frontend.com/auth/verify-email?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Configuración:** La URL base viene de `FRONTEND_URL` en el `.env` del backend.

### Email de Reset de Contraseña

El email contiene un enlace como:
```
https://tu-frontend.com/auth/reset-password?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Configuración:** La URL base viene de `FRONTEND_URL` en el `.env` del backend.

---

## ✅ Checklist de Implementación

- [ ] Página de verificación de email (`/auth/verify-email`)
- [ ] Página de forgot password (`/auth/forgot-password`)
- [ ] Página de reset password (`/auth/reset-password`)
- [ ] Manejo de errores en todas las páginas
- [ ] Validación de contraseña en frontend
- [ ] Mensajes de éxito/error claros
- [ ] Redirecciones apropiadas después de acciones exitosas
- [ ] Manejo de tokens expirados
- [ ] Opción de reenviar emails (opcional)

---

## 📚 Tipos TypeScript

```typescript
// Tipos para requests
interface ForgotPasswordRequest {
  email: string;
}

interface ResetPasswordRequest {
  token: string;
  password: string;
}

// Tipos para responses
interface VerifyEmailResponse {
  message: string;
}

interface ForgotPasswordResponse {
  message: string;
}

interface ResetPasswordResponse {
  message: string;
}

// Tipos para errores
interface ApiError {
  error: string;
}

interface ValidationError {
  errors: Array<{
    field: string;
    message: string;
  }>;
}
```

---

## 🚀 Próximos Pasos (Opcional)

Funcionalidades que podrías agregar:

1. **Reenviar email de verificación**
   - Endpoint: `POST /api/auth/resend-verification`
   - Body: `{ "email": "usuario@example.com" }`

2. **Validar email verificado en login**
   - Mostrar mensaje si el email no está verificado
   - Opción de reenviar email desde el login

3. **Cambiar email**
   - Permitir cambiar email (requiere verificación del nuevo email)

---

**Última actualización:** Diciembre 2024

