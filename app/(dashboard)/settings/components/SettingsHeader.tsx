"use client";

import React from "react";
import Link from "next/link";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SettingsHeaderProps {
  onSave: () => void;
  onCancel: () => void;
  isSaving: boolean;
  hasChanges: boolean | (() => boolean);
}

export function SettingsHeader({
  onSave,
  onCancel,
  isSaving,
  hasChanges,
}: SettingsHeaderProps): React.ReactNode {
  return (
    <div className="mb-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-600 mb-4">
        <Link href="/dashboard" className="hover:text-gray-900">
          Cuenta
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900 font-medium">Configuración General</span>
      </nav>

      {/* Header */}
      <div className="mb-6">
        <div className="mb-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Configuración
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Gestiona tu perfil, preferencias y seguridad
          </p>
        </div>
        {/* Botones de acción - Desktop */}
        <div className="hidden sm:flex items-center gap-3">
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={isSaving || (typeof hasChanges === "function" ? !hasChanges() : !hasChanges)}
          >
            Cancelar
          </Button>
          <Button
            onClick={onSave}
            disabled={isSaving || (typeof hasChanges === "function" ? !hasChanges() : !hasChanges)}
            className="bg-[#22c55e] hover:bg-[#16a34a] text-white disabled:opacity-50"
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </div>
      </div>
    </div>
  );
}

