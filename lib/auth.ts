import { useAuthStore } from "@/stores/authStore";

/**
 * Obtiene el token de autenticación del store
 */
export function getAuthToken(): string | null {
  return useAuthStore.getState().token;
}

/**
 * Verifica si el usuario está autenticado
 */
export function isAuthenticated(): boolean {
  return useAuthStore.getState().isAuthenticated;
}

/**
 * Obtiene los headers de autenticación para las peticiones API
 */
export function getAuthHeaders(): HeadersInit {
  const token = getAuthToken();
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

