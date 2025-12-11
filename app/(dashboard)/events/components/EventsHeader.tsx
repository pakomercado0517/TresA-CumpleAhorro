"use client";

import React from "react";
import { Search, Bell } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";

interface EventsHeaderProps {
  onSearchClick?: () => void;
  onNotificationsClick?: () => void;
}

export function EventsHeader({
  onSearchClick,
  onNotificationsClick,
}: EventsHeaderProps): React.ReactNode {
  const { user } = useAuthStore();

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 px-4 py-3 md:hidden w-full overflow-x-hidden">
      <div className="flex items-center justify-between w-full">
        <h1 className="text-lg font-bold text-gray-900">Eventos</h1>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onSearchClick}
            className="p-1.5 text-gray-600 hover:text-gray-900"
            aria-label="Buscar"
          >
            <Search className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={onNotificationsClick}
            className="relative p-1.5 text-gray-600 hover:text-gray-900"
            aria-label="Notificaciones"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
          </button>
        </div>
      </div>
    </header>
  );
}

