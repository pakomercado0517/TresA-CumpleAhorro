"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { loginUser, registerUser } from "@/lib/api";
import type { LoginRequest, RegisterRequest } from "@/types/auth";

export function useAuth() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setAuth, logout, user, token, isAuthenticated } = useAuthStore();

  const login = async (data: LoginRequest): Promise<void> => {
    const response = await loginUser(data);
    
    // Primero guardamos el estado de autenticación
    setAuth(response.user, response.token);
    
    // Redirigir a la ruta solicitada o al dashboard por defecto
    const redirect = searchParams.get("redirect") || "/dashboard";
    
    // Usar router.push de Next.js para una navegación más fluida
    // El estado ya está guardado en Zustand y localStorage
    router.push(redirect);
  };

  const register = async (data: RegisterRequest): Promise<void> => {
    await registerUser(data);
    // NO redirigir automáticamente - el componente mostrará el mensaje de éxito
    // El usuario puede hacer clic en el botón para ir a login cuando esté listo
  };

  const handleLogout = (): void => {
    logout();
    router.push("/login");
  };

  return {
    user,
    token,
    isAuthenticated,
    login,
    register,
    logout: handleLogout,
  };
}

