"use client";

import React from "react";
import { Search, Bell, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface EventsDesktopHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onNotificationsClick?: () => void;
  onCreateEvent: () => void;
}

export function EventsDesktopHeader({
  searchQuery,
  onSearchChange,
  onNotificationsClick,
  onCreateEvent,
}: EventsDesktopHeaderProps): React.ReactNode {
  return (
    <div className="mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold text-gray-900">Eventos Activos</h1>
        <div className="flex items-center gap-3">
          {/* Search Bar */}
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar por nombre o fecha..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Notifications */}
          <button
            type="button"
            onClick={onNotificationsClick}
            className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Notificaciones"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
          </button>

          {/* New Event Button */}
          <Button
            onClick={onCreateEvent}
            className="bg-gray-900 hover:bg-gray-800 text-white flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            Nuevo Evento
          </Button>
        </div>
      </div>
    </div>
  );
}










