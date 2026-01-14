# Guía de Integración Frontend - Refresh Tokens

Esta guía explica cómo integrar el nuevo sistema de autenticación con Refresh Tokens en el frontend.

---

## 📋 Resumen de Cambios en la API

### ❌ Antes (Sistema Antiguo)

```typescript
// Response de login/register
{
  "user": { ... },
  "token": "eyJhbGc..."  // Un solo token de 7 días
}

// Uso en requests
headers: { "Authorization": "Bearer <token>" }
```

### ✅ Ahora (Sistema Nuevo)

```typescript
// Response de login/register
{
  "user": { ... },
  "accessToken": "eyJhbGc...",   // Token corto (15 min)
  "refreshToken": "eyJhbGc..."   // Token largo (30 días)
}

// Uso en requests
headers: { "Authorization": "Bearer <accessToken>" }
```

---

## 🔑 Nuevos Endpoints

| Endpoint | Método | Descripción | Auth |
|----------|--------|-------------|------|
| `/api/auth/register` | POST | Registrar usuario | ❌ |
| `/api/auth/login` | POST | Iniciar sesión | ❌ |
| `/api/auth/refresh` | POST | Renovar access token | ❌ |
| `/api/auth/logout` | POST | Cerrar sesión actual | ❌ |
| `/api/auth/logout-all` | POST | Cerrar todas las sesiones | ✅ |
| `/api/auth/sessions` | GET | Ver sesiones activas | ✅ |
| `/api/auth/sessions/:id` | DELETE | Cerrar sesión específica | ✅ |

---

## 📦 Tipos TypeScript

Agrega estos tipos a tu proyecto frontend:

```typescript
// types/auth.ts

export interface User {
  id: number;
  name: string;
  email: string;
  emailVerified: boolean;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
}

export interface Session {
  id: number;
  deviceInfo: string | null;
  ipAddress: string | null;
  lastUsed: string;
  createdAt: string;
  current: boolean;
}

export interface SessionsResponse {
  sessions: Session[];
}
```

---

## 💾 Almacenamiento de Tokens

### Opción 1: localStorage (Más Simple)

```typescript
// utils/token-storage.ts

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

export const tokenStorage = {
  // Guardar tokens
  setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  },

  // Obtener access token
  getAccessToken(): string | null {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },

  // Obtener refresh token
  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  // Actualizar solo access token
  setAccessToken(accessToken: string): void {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  },

  // Limpiar tokens (logout)
  clearTokens(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },

  // Verificar si hay tokens
  hasTokens(): boolean {
    return !!this.getAccessToken() && !!this.getRefreshToken();
  }
};
```

### Opción 2: Memoria + localStorage (Más Seguro)

```typescript
// utils/token-storage.ts

// Access token en memoria (más seguro contra XSS)
let accessToken: string | null = null;

const REFRESH_TOKEN_KEY = 'refreshToken';

export const tokenStorage = {
  setTokens(newAccessToken: string, refreshToken: string): void {
    accessToken = newAccessToken;
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  },

  getAccessToken(): string | null {
    return accessToken;
  },

  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  setAccessToken(newAccessToken: string): void {
    accessToken = newAccessToken;
  },

  clearTokens(): void {
    accessToken = null;
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },

  hasTokens(): boolean {
    return !!accessToken && !!this.getRefreshToken();
  },

  // Restaurar access token del refresh (para cuando se recarga la página)
  needsRefresh(): boolean {
    return !accessToken && !!this.getRefreshToken();
  }
};
```

---

## 🔄 Servicio de Autenticación

### Con Fetch API

```typescript
// services/auth.service.ts

import { tokenStorage } from '../utils/token-storage';
import type { 
  LoginRequest, 
  RegisterRequest, 
  AuthResponse, 
  RefreshResponse,
  SessionsResponse 
} from '../types/auth';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const authService = {
  /**
   * Iniciar sesión
   */
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error al iniciar sesión');
    }

    const data: AuthResponse = await response.json();
    
    // Guardar tokens
    tokenStorage.setTokens(data.accessToken, data.refreshToken);
    
    return data;
  },

  /**
   * Registrar usuario
   */
  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error al registrar usuario');
    }

    const data: AuthResponse = await response.json();
    
    // Guardar tokens
    tokenStorage.setTokens(data.accessToken, data.refreshToken);
    
    return data;
  },

  /**
   * Renovar access token
   */
  async refreshToken(): Promise<RefreshResponse> {
    const refreshToken = tokenStorage.getRefreshToken();
    
    if (!refreshToken) {
      throw new Error('No hay refresh token');
    }

    const response = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken })
    });

    if (!response.ok) {
      // Refresh token inválido o expirado
      tokenStorage.clearTokens();
      throw new Error('Sesión expirada');
    }

    const data: RefreshResponse = await response.json();
    
    // Actualizar tokens
    tokenStorage.setTokens(data.accessToken, data.refreshToken);
    
    return data;
  },

  /**
   * Cerrar sesión
   */
  async logout(): Promise<void> {
    const refreshToken = tokenStorage.getRefreshToken();
    
    if (refreshToken) {
      try {
        await fetch(`${API_URL}/auth/logout`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken })
        });
      } catch {
        // Ignorar errores de logout (el token puede ya no ser válido)
      }
    }
    
    tokenStorage.clearTokens();
  },

  /**
   * Cerrar todas las sesiones
   */
  async logoutAll(): Promise<void> {
    const accessToken = tokenStorage.getAccessToken();
    
    await fetch(`${API_URL}/auth/logout-all`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    });
    
    tokenStorage.clearTokens();
  },

  /**
   * Obtener sesiones activas
   */
  async getSessions(): Promise<SessionsResponse> {
    const accessToken = tokenStorage.getAccessToken();
    
    const response = await fetch(`${API_URL}/auth/sessions`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (!response.ok) {
      throw new Error('Error al obtener sesiones');
    }

    return response.json();
  },

  /**
   * Cerrar sesión específica
   */
  async revokeSession(sessionId: number): Promise<void> {
    const accessToken = tokenStorage.getAccessToken();
    
    const response = await fetch(`${API_URL}/auth/sessions/${sessionId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (!response.ok) {
      throw new Error('Error al cerrar sesión');
    }
  }
};
```

---

## 🔁 Interceptor de Renovación Automática

### Con Fetch API (Wrapper)

```typescript
// utils/api-client.ts

import { tokenStorage } from './token-storage';
import { authService } from '../services/auth.service';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Flag para evitar múltiples refreshes simultáneos
let isRefreshing = false;
let refreshPromise: Promise<void> | null = null;

/**
 * Wrapper de fetch con renovación automática de tokens
 */
export async function apiFetch(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  // Si necesita refresh inicial (después de recargar página)
  if (tokenStorage.needsRefresh && tokenStorage.needsRefresh()) {
    await refreshTokenIfNeeded();
  }

  const url = endpoint.startsWith('http') ? endpoint : `${API_URL}${endpoint}`;
  
  // Agregar token de autorización
  const accessToken = tokenStorage.getAccessToken();
  const headers = new Headers(options.headers);
  
  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }
  
  if (!headers.has('Content-Type') && options.body) {
    headers.set('Content-Type', 'application/json');
  }

  // Primera llamada
  let response = await fetch(url, { ...options, headers });

  // Si es 401, intentar renovar token
  if (response.status === 401 && tokenStorage.getRefreshToken()) {
    try {
      await refreshTokenIfNeeded();
      
      // Reintentar con nuevo token
      const newAccessToken = tokenStorage.getAccessToken();
      if (newAccessToken) {
        headers.set('Authorization', `Bearer ${newAccessToken}`);
        response = await fetch(url, { ...options, headers });
      }
    } catch {
      // Refresh falló, redirigir a login
      tokenStorage.clearTokens();
      window.location.href = '/login';
      throw new Error('Sesión expirada');
    }
  }

  return response;
}

/**
 * Renueva el token si es necesario (evita múltiples llamadas simultáneas)
 */
async function refreshTokenIfNeeded(): Promise<void> {
  if (isRefreshing) {
    // Si ya se está renovando, esperar a que termine
    return refreshPromise!;
  }

  isRefreshing = true;
  refreshPromise = authService.refreshToken()
    .then(() => {})
    .finally(() => {
      isRefreshing = false;
      refreshPromise = null;
    });

  return refreshPromise;
}

/**
 * Helpers para métodos HTTP comunes
 */
export const api = {
  get: (endpoint: string) => apiFetch(endpoint),
  
  post: (endpoint: string, data?: unknown) => apiFetch(endpoint, {
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined
  }),
  
  put: (endpoint: string, data?: unknown) => apiFetch(endpoint, {
    method: 'PUT',
    body: data ? JSON.stringify(data) : undefined
  }),
  
  patch: (endpoint: string, data?: unknown) => apiFetch(endpoint, {
    method: 'PATCH',
    body: data ? JSON.stringify(data) : undefined
  }),
  
  delete: (endpoint: string) => apiFetch(endpoint, {
    method: 'DELETE'
  })
};
```

### Con Axios

```typescript
// utils/axios-client.ts

import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { tokenStorage } from './token-storage';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Crear instancia de Axios
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Flag para evitar múltiples refreshes
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: Error) => void;
}> = [];

// Procesar cola de requests fallidos
const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token!);
    }
  });
  failedQueue = [];
};

// Interceptor de Request: agregar token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = tokenStorage.getAccessToken();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de Response: manejar 401 y renovar token
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Si es 401 y no es un retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      const refreshToken = tokenStorage.getRefreshToken();
      
      // Si no hay refresh token, ir a login
      if (!refreshToken) {
        tokenStorage.clearTokens();
        window.location.href = '/login';
        return Promise.reject(error);
      }

      // Si ya se está renovando, encolar este request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Llamar al endpoint de refresh
        const response = await axios.post(`${API_URL}/auth/refresh`, {
          refreshToken
        });

        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data;
        
        // Guardar nuevos tokens
        tokenStorage.setTokens(newAccessToken, newRefreshToken);

        // Procesar cola de requests pendientes
        processQueue(null, newAccessToken);

        // Reintentar request original
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);

      } catch (refreshError) {
        // Refresh falló
        processQueue(refreshError as Error, null);
        tokenStorage.clearTokens();
        window.location.href = '/login';
        return Promise.reject(refreshError);

      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
```

---

## ⚛️ React: Hook de Autenticación

```typescript
// hooks/useAuth.ts

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { tokenStorage } from '../utils/token-storage';
import { authService } from '../services/auth.service';
import type { User, LoginRequest, RegisterRequest } from '../types/auth';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  logoutAll: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Verificar autenticación al cargar
  useEffect(() => {
    const initAuth = async () => {
      if (tokenStorage.hasTokens()) {
        try {
          // Si solo hay refresh token, renovar
          if (tokenStorage.needsRefresh && tokenStorage.needsRefresh()) {
            await authService.refreshToken();
          }
          
          // Aquí podrías hacer una llamada a /api/auth/me para obtener el usuario
          // Por ahora, marcamos como autenticado
          // const userData = await authService.getMe();
          // setUser(userData);
          
        } catch {
          tokenStorage.clearTokens();
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials: LoginRequest) => {
    const response = await authService.login(credentials);
    setUser(response.user);
  };

  const register = async (userData: RegisterRequest) => {
    const response = await authService.register(userData);
    setUser(response.user);
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const logoutAll = async () => {
    await authService.logoutAll();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        logoutAll
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
}
```

---

## 🖥️ React: Componente de Gestión de Sesiones

```tsx
// components/SessionsManager.tsx

import { useState, useEffect } from 'react';
import { authService } from '../services/auth.service';
import type { Session } from '../types/auth';

export function SessionsManager() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar sesiones
  const loadSessions = async () => {
    try {
      setIsLoading(true);
      const response = await authService.getSessions();
      setSessions(response.sessions);
      setError(null);
    } catch (err) {
      setError('Error al cargar sesiones');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSessions();
  }, []);

  // Cerrar una sesión
  const handleRevokeSession = async (sessionId: number) => {
    try {
      await authService.revokeSession(sessionId);
      setSessions(sessions.filter(s => s.id !== sessionId));
    } catch {
      setError('Error al cerrar sesión');
    }
  };

  // Cerrar todas las sesiones
  const handleLogoutAll = async () => {
    if (confirm('¿Cerrar sesión en todos los dispositivos?')) {
      try {
        await authService.logoutAll();
        // Redirigir a login después de cerrar todas las sesiones
        window.location.href = '/login';
      } catch {
        setError('Error al cerrar sesiones');
      }
    }
  };

  // Formatear fecha
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-MX', {
      dateStyle: 'medium',
      timeStyle: 'short'
    });
  };

  // Parsear User-Agent para mostrar dispositivo
  const parseDevice = (userAgent: string | null): string => {
    if (!userAgent) return 'Dispositivo desconocido';
    
    if (userAgent.includes('iPhone')) return '📱 iPhone';
    if (userAgent.includes('Android')) return '📱 Android';
    if (userAgent.includes('iPad')) return '📱 iPad';
    if (userAgent.includes('Mac')) return '💻 Mac';
    if (userAgent.includes('Windows')) return '💻 Windows';
    if (userAgent.includes('Linux')) return '💻 Linux';
    
    return '🌐 Navegador';
  };

  if (isLoading) {
    return <div>Cargando sesiones...</div>;
  }

  return (
    <div className="sessions-manager">
      <h2>Sesiones Activas</h2>
      
      {error && <div className="error">{error}</div>}
      
      <div className="sessions-list">
        {sessions.map((session) => (
          <div 
            key={session.id} 
            className={`session-item ${session.current ? 'current' : ''}`}
          >
            <div className="session-info">
              <div className="device">
                {parseDevice(session.deviceInfo)}
                {session.current && <span className="badge">Sesión actual</span>}
              </div>
              <div className="details">
                <span>IP: {session.ipAddress || 'Desconocida'}</span>
                <span>Último uso: {formatDate(session.lastUsed)}</span>
              </div>
            </div>
            
            {!session.current && (
              <button 
                onClick={() => handleRevokeSession(session.id)}
                className="btn-revoke"
              >
                Cerrar sesión
              </button>
            )}
          </div>
        ))}
      </div>
      
      {sessions.length > 1 && (
        <button onClick={handleLogoutAll} className="btn-logout-all">
          Cerrar todas las sesiones
        </button>
      )}
    </div>
  );
}
```

### Estilos CSS

```css
/* styles/sessions-manager.css */

.sessions-manager {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.sessions-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 20px;
}

.session-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: #fff;
}

.session-item.current {
  border-color: #4caf50;
  background: #f1f8e9;
}

.session-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.device {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
}

.badge {
  font-size: 12px;
  padding: 2px 8px;
  background: #4caf50;
  color: white;
  border-radius: 4px;
  font-weight: normal;
}

.details {
  display: flex;
  gap: 16px;
  font-size: 14px;
  color: #666;
}

.btn-revoke {
  padding: 8px 16px;
  background: #f44336;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-revoke:hover {
  background: #d32f2f;
}

.btn-logout-all {
  width: 100%;
  margin-top: 20px;
  padding: 12px;
  background: #ff9800;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
}

.btn-logout-all:hover {
  background: #f57c00;
}

.error {
  padding: 12px;
  background: #ffebee;
  color: #c62828;
  border-radius: 8px;
  margin-bottom: 16px;
}
```

---

## 📱 Vue 3: Composable de Autenticación

```typescript
// composables/useAuth.ts

import { ref, computed, onMounted } from 'vue';
import { tokenStorage } from '../utils/token-storage';
import { authService } from '../services/auth.service';
import type { User, LoginRequest, RegisterRequest } from '../types/auth';

const user = ref<User | null>(null);
const isLoading = ref(true);

export function useAuth() {
  const isAuthenticated = computed(() => !!user.value);

  const login = async (credentials: LoginRequest) => {
    const response = await authService.login(credentials);
    user.value = response.user;
  };

  const register = async (userData: RegisterRequest) => {
    const response = await authService.register(userData);
    user.value = response.user;
  };

  const logout = async () => {
    await authService.logout();
    user.value = null;
  };

  const logoutAll = async () => {
    await authService.logoutAll();
    user.value = null;
  };

  // Inicializar autenticación
  onMounted(async () => {
    if (tokenStorage.hasTokens()) {
      try {
        if (tokenStorage.needsRefresh?.()) {
          await authService.refreshToken();
        }
        // Obtener usuario actual si es necesario
      } catch {
        tokenStorage.clearTokens();
      }
    }
    isLoading.value = false;
  });

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    logoutAll
  };
}
```

---

## 🔄 Flujo Visual

```
┌─────────────────────────────────────────────────────────────────┐
│                         FLUJO DE AUTENTICACIÓN                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. LOGIN                                                        │
│  ┌──────┐    POST /auth/login     ┌──────┐                      │
│  │ User │ ─────────────────────►  │ API  │                      │
│  └──────┘                         └──────┘                      │
│                                       │                          │
│                    { accessToken, refreshToken }                 │
│                                       │                          │
│                                       ▼                          │
│                            ┌───────────────────┐                 │
│                            │  localStorage /   │                 │
│                            │     Memoria       │                 │
│                            └───────────────────┘                 │
│                                                                  │
│  2. REQUESTS                                                     │
│  ┌──────┐   GET /groups            ┌──────┐                     │
│  │ User │ ─────────────────────►   │ API  │                     │
│  └──────┘  Authorization: Bearer   └──────┘                     │
│            <accessToken>               │                         │
│                                       │                          │
│                      200 OK / 401 Unauthorized                   │
│                                       │                          │
│                                       ▼                          │
│                                                                  │
│  3. TOKEN EXPIRADO (401)                                        │
│  ┌──────┐   POST /auth/refresh     ┌──────┐                     │
│  │ User │ ─────────────────────►   │ API  │                     │
│  └──────┘  { refreshToken }        └──────┘                     │
│                                       │                          │
│               { newAccessToken, newRefreshToken }                │
│                                       │                          │
│                                       ▼                          │
│                            ┌───────────────────┐                 │
│                            │   Actualizar      │                 │
│                            │     tokens        │                 │
│                            └───────────────────┘                 │
│                                       │                          │
│                                       ▼                          │
│                            ┌───────────────────┐                 │
│                            │  Reintentar       │                 │
│                            │  request original │                 │
│                            └───────────────────┘                 │
│                                                                  │
│  4. LOGOUT                                                       │
│  ┌──────┐   POST /auth/logout      ┌──────┐                     │
│  │ User │ ─────────────────────►   │ API  │                     │
│  └──────┘  { refreshToken }        └──────┘                     │
│                                       │                          │
│                                       ▼                          │
│                            ┌───────────────────┐                 │
│                            │  Limpiar tokens   │                 │
│                            │  Redirigir login  │                 │
│                            └───────────────────┘                 │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## ✅ Checklist de Implementación

### Configuración Básica
- [ ] Crear tipos TypeScript
- [ ] Implementar tokenStorage
- [ ] Crear authService

### Interceptor de Renovación
- [ ] Implementar wrapper de fetch O interceptor de Axios
- [ ] Manejar múltiples requests simultáneos
- [ ] Redirigir a login cuando refresh falla

### Componentes UI
- [ ] Actualizar formulario de login
- [ ] Actualizar formulario de registro
- [ ] Crear componente de gestión de sesiones
- [ ] Implementar botón de logout

### Testing
- [ ] Probar login (recibe 2 tokens)
- [ ] Probar renovación automática
- [ ] Probar logout
- [ ] Probar gestión de sesiones

---

## ⚠️ Errores Comunes

### 1. "Token expirado" en cada request

**Causa**: El access token está expirando muy rápido (15 min)

**Solución**: Implementar correctamente el interceptor de renovación

### 2. Múltiples llamadas a /refresh

**Causa**: Varios requests simultáneos detectan 401

**Solución**: Usar flag `isRefreshing` y encolar requests

### 3. Loop infinito de refresh

**Causa**: El refresh endpoint también devuelve 401

**Solución**: Excluir `/auth/refresh` del interceptor

### 4. Pérdida de sesión al recargar página

**Causa**: Access token en memoria se pierde al recargar

**Solución**: Implementar `needsRefresh()` para detectar y renovar

---

## 📝 Notas Importantes

1. **No guardes el access token en localStorage** si tu app maneja datos muy sensibles (usa memoria + refresh)

2. **El refresh token debe estar en localStorage** para persistir entre recargas

3. **Implementa el interceptor correctamente** para evitar que el usuario tenga que re-loguearse

4. **Maneja los errores de red** - si no hay conexión, no intentes renovar

5. **Considera implementar retry** con backoff exponencial para errores de red

---

## 🆘 Soporte

Si tienes problemas con la integración:

1. Verifica que el backend esté corriendo con los nuevos endpoints
2. Revisa la consola del navegador para errores
3. Usa las DevTools > Network para ver las requests
4. Verifica que los tokens se estén guardando correctamente

---

**Fecha**: 2026-01-14  
**Versión de API**: 1.0.0 con Refresh Tokens
