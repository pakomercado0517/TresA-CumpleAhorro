"use client";

import React from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MembersMobileHeaderProps {
  onCreateMember: () => void;
  totalMembers: number;
  groupName?: string;
}

export function MembersMobileHeader({
  onCreateMember,
  totalMembers,
  groupName,
}: MembersMobileHeaderProps): React.ReactNode {
  return (
    <div className="mb-3 md:hidden w-full overflow-x-hidden">
      {/* Breadcrumb */}
      <nav className="text-xs text-gray-600 mb-1.5">
        <Link href="/groups" className="hover:text-gray-900">
          Grupos
        </Link>
        {groupName && (
          <>
            <span className="mx-1">/</span>
            <span className="text-gray-900 font-medium">{groupName}</span>
          </>
        )}
      </nav>

      {/* Title */}
      <h1 className="text-lg font-bold text-gray-900 mb-0.5">
        Gestión de Miembros
      </h1>
      <p className="text-xs text-gray-600 mb-3">
        Administrando {totalMembers} {totalMembers === 1 ? "miembro" : "miembros"}
        {groupName && ` en ${groupName}`}
      </p>

      {/* Create Button */}
      <Button
        onClick={onCreateMember}
        className="w-full bg-[#22c55e] hover:bg-[#16a34a] text-white py-2 text-sm"
      >
        <Plus className="h-4 w-4 mr-2" />
        Nuevo Miembro
      </Button>
    </div>
  );
}

