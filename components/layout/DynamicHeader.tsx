"use client";

import React, { useState, useRef, useEffect } from "react";
import { Bell, LucideIcon, Settings, LogOut, ChevronDown } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

interface DynamicHeaderProps {
  title: string;
  icon: LucideIcon;
  onNotificationsClick?: () => void;
}

/**
 * Header dinámico reutilizable para todas las pantallas mobile
 * Basado en el diseño del DashboardHeader
 */
export function DynamicHeader({
  title,
  icon: Icon,
  onNotificationsClick,
}: DynamicHeaderProps): React.ReactNode {
  const { user } = useAuthStore();
  const { logout } = useAuth();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  const handleNotifications = (): void => {
    if (onNotificationsClick) {
      onNotificationsClick();
    } else {
      // TODO: Implementar navegación o modal de notificaciones por defecto
      console.log("Notifications clicked");
    }
  };

  const handleSettings = (): void => {
    setIsMenuOpen(false);
    router.push("/settings");
  };

  const handleLogout = (): void => {
    setIsMenuOpen(false);
    logout();
  };

  return (
    <header className="flex items-center justify-between px-4 md:px-8 py-4 md:py-6 bg-white border-b border-gray-200">
      <div className="flex items-center gap-2 md:gap-3">
        <div className="h-8 w-8 md:hidden bg-[#22c55e] rounded-md flex items-center justify-center">
          <Icon className="h-5 w-5 text-white" />
        </div>
        <h1 className="text-xl md:text-3xl font-bold text-gray-900">
          {title}
        </h1>
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleNotifications}
          className="p-2 text-gray-600 hover:text-gray-900"
          aria-label="Notificaciones"
        >
          <Bell className="h-5 w-5" />
        </button>
        {/* Avatar solo en mobile */}
        <div className="relative md:hidden" ref={menuRef}>
          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="h-10 w-10 rounded-full bg-gray-300 overflow-hidden focus:outline-none focus:ring-2 focus:ring-[#22c55e] focus:ring-offset-2"
            aria-label="Menú de usuario"
            aria-expanded={isMenuOpen}
          >
            {user?.email ? (
              <div className="h-full w-full flex items-center justify-center bg-[#22c55e] text-white font-semibold">
                {user.name.charAt(0).toUpperCase()}
              </div>
            ) : (
              <div className="h-full w-full bg-gray-300" />
            )}
          </button>

          {/* Dropdown Menu */}
          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {user?.name || "Usuario"}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user?.email || ""}
                </p>
              </div>
              <button
                type="button"
                onClick={handleSettings}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Settings className="h-4 w-4 text-gray-500" />
                <span>Configuración</span>
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="h-4 w-4 text-red-500" />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

