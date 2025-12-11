"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Bell, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GroupsHeaderProps {
  onCreateGroup: () => void;
}

export function GroupsHeader({
  onCreateGroup,
}: GroupsHeaderProps): React.ReactNode {
  const router = useRouter();

  const handleBack = (): void => {
    router.back();
  };

  const handleNotifications = (): void => {
    // TODO: Implementar navegación o modal de notificaciones
    console.log("Notifications clicked");
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 md:px-8 md:py-6">
      <div className="flex items-center justify-between md:max-w-7xl md:mx-auto">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleBack}
            className="p-1 text-gray-600 hover:text-gray-900"
            aria-label="Volver"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-lg md:text-2xl font-bold text-gray-900">
            Mis Grupos
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleNotifications}
            className="p-2 text-gray-600 hover:text-gray-900"
            aria-label="Notificaciones"
          >
            <Bell className="h-5 w-5" />
          </button>
          <Button
            onClick={onCreateGroup}
            className="h-9 w-9 md:h-12 md:w-12 rounded-full bg-[#22c55e] hover:bg-[#16a34a] p-0"
            aria-label="Agregar grupo"
          >
            <Plus className="h-5 w-5 text-white" />
          </Button>
        </div>
      </div>
    </header>
  );
}
