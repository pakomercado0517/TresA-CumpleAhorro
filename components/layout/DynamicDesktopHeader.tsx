"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Bell, LucideIcon, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/authStore";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

interface ActionButton {
  label: string;
  onClick: () => void;
  icon?: LucideIcon;
  variant?: "default" | "outline" | "ghost";
  className?: string;
  disabled?: boolean;
}

interface DynamicDesktopHeaderProps {
  title: string;
  description?: string;
  breadcrumb?: {
    label: string;
    href: string;
  }[];
  actions?: ActionButton[];
  onNotificationsClick?: () => void;
}

/**
 * Header dinámico reutilizable para todas las pantallas desktop
 * Basado en el diseño del header de Settings
 */
export function DynamicDesktopHeader({
  title,
  description,
  breadcrumb,
  actions,
  onNotificationsClick,
}: DynamicDesktopHeaderProps): React.ReactNode {
  const { user } = useAuthStore();
  const { logout } = useAuth();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const defaultBreadcrumb = [
    { label: "Inicio", href: "/dashboard" },
    { label: title, href: "#" },
  ];

  const breadcrumbItems = breadcrumb || defaultBreadcrumb;

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
    <div className="mb-8">
      {/* Header Superior - Título y Notificaciones */}
      <header className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          {description && (
            <p className="text-sm text-gray-600 mt-1">{description}</p>
          )}
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleNotifications}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Notificaciones"
          >
            <Bell className="h-5 w-5" />
          </button>
          <div className="relative" ref={menuRef}>
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

      {/* Breadcrumb */}
      {breadcrumbItems.length > 0 && (
        <nav className="text-sm text-gray-600 mb-4">
          {breadcrumbItems.map((item, index) => (
            <React.Fragment key={item.href}>
              {index === breadcrumbItems.length - 1 ? (
                <span className="text-gray-900 font-medium">{item.label}</span>
              ) : (
                <>
                  <Link href={item.href} className="hover:text-gray-900">
                    {item.label}
                  </Link>
                  <span className="mx-2">/</span>
                </>
              )}
            </React.Fragment>
          ))}
        </nav>
      )}

      {/* Botones de acción - Si existen */}
      {actions && actions.length > 0 && (
        <div className="flex items-center gap-3 mb-4">
          {actions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Button
                key={index}
                variant={action.variant || "default"}
                onClick={action.onClick}
                disabled={action.disabled}
                className={
                  action.className ||
                  (action.variant === "default"
                    ? "bg-[#22c55e] hover:bg-[#16a34a] text-white"
                    : "")
                }
              >
                {Icon && <Icon className="h-4 w-4 mr-2" />}
                {action.label}
              </Button>
            );
          })}
        </div>
      )}
    </div>
  );
}

