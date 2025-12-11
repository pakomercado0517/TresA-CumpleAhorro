"use client";

import React from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GroupsDesktopHeaderProps {
  onCreateGroup: () => void;
}

export function GroupsDesktopHeader({
  onCreateGroup,
}: GroupsDesktopHeaderProps): React.ReactNode {

  return (
    <div className="mb-6">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-600 mb-4">
        <Link href="/dashboard" className="hover:text-gray-900">
          Inicio
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900 font-medium">Gestión de Grupos</span>
      </nav>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Gestión de Grupos
          </h1>
          <p className="text-gray-600 max-w-2xl">
            Crea, edita y supervisa las tandas de cumpleaños. Visualiza el estado de los pagos y participantes en tiempo real.
          </p>
        </div>
        <Button
          onClick={onCreateGroup}
          className="bg-[#22c55e] hover:bg-[#16a34a] text-white"
        >
          <Plus className="h-5 w-5 mr-2" />
          Crear Grupo
        </Button>
      </div>
    </div>
  );
}

