"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Calendar,
  User,
  Settings,
  LogOut,
} from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

interface SidebarItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

const sidebarItems: SidebarItem[] = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    href: "/groups",
    label: "Grupos",
    icon: <Users className="h-5 w-5" />,
  },
  {
    href: "/events",
    label: "Eventos",
    icon: <Calendar className="h-5 w-5" />,
  },
  {
    href: "/members",
    label: "Miembros",
    icon: <User className="h-5 w-5" />,
  },
  {
    href: "/settings",
    label: "Configuración",
    icon: <Settings className="h-5 w-5" />,
  },
];

export function Sidebar(): React.ReactNode {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuthStore();
  const { logout } = useAuth();

  const handleLogout = (): void => {
    logout();
  };

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 min-h-screen">
      {/* User Profile */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-[#22c55e] flex items-center justify-center text-white font-semibold">
            {user?.name?.charAt(0).toUpperCase() || "A"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {user?.name || "Admin Name"}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {user?.email || "admin@example.com"}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {sidebarItems.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                    isActive
                      ? "bg-green-50 text-[#22c55e] font-medium"
                      : "text-gray-700 hover:bg-gray-50"
                  )}
                >
                  <span
                    className={cn(
                      isActive ? "text-[#22c55e]" : "text-gray-500"
                    )}
                  >
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <LogOut className="h-5 w-5 text-gray-500" />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
}
