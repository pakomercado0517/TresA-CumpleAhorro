"use client";

import React from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MembersDesktopHeaderProps {
  onCreateMember: () => void;
  totalMembers: number;
}

export function MembersDesktopHeader({
  onCreateMember,
  totalMembers,
}: MembersDesktopHeaderProps): React.ReactNode {
  return (
    <div className="mb-6">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-600 mb-4">
        <Link href="/groups" className="hover:text-gray-900">
          Grupos
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900 font-medium">Gestión de Miembros</span>
      </nav>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Gestión de Miembros
          </h1>
          <p className="text-gray-600">
            Administrando {totalMembers} {totalMembers === 1 ? "miembro" : "miembros"}
          </p>
        </div>
        <Button
          onClick={onCreateMember}
          className="bg-[#22c55e] hover:bg-[#16a34a] text-white"
        >
          <Plus className="h-5 w-5 mr-2" />
          Nuevo Miembro
        </Button>
      </div>
    </div>
  );
}












