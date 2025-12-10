"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps): JSX.Element | null {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, token } = useAuthStore();
  const [isChecking, setIsChecking] = useState<boolean>(true);
  const [hasChecked, setHasChecked] = useState<boolean>(false);

  useEffect(() => {
    // Verificar autenticación
    const checkAuth = (): void => {
      // Si no está autenticado, redirigir a login
      if (!isAuthenticated || !token) {
        const loginUrl = `/login?redirect=${encodeURIComponent(pathname)}`;
        router.push(loginUrl);
      } else {
        // Si está autenticado, marcar como verificado
        setIsChecking(false);
        setHasChecked(true);
      }
    };

    // Pequeño delay solo en la primera verificación para dar tiempo a Zustand
    // de cargar desde localStorage
    if (!hasChecked) {
      const timer = setTimeout(() => {
        checkAuth();
      }, 100);
      return () => clearTimeout(timer);
    } else {
      // En verificaciones subsecuentes, hacerlo inmediatamente
      checkAuth();
    }
  }, [isAuthenticated, token, router, pathname, hasChecked]);

  // Mostrar loading mientras verifica
  if (isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8faf8]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#22c55e] mb-4"></div>
          <p className="text-gray-600">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  // Si no está autenticado, no mostrar nada (ya se está redirigiendo)
  if (!isAuthenticated || !token) {
    return null;
  }

  return <>{children}</>;
}

