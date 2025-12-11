"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, User } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";

interface MembersHeaderProps {
  onCreateMember: () => void;
}

export function MembersHeader({
  onCreateMember,
}: MembersHeaderProps): React.ReactNode {
  const router = useRouter();
  const { user } = useAuthStore();

  const handleBack = (): void => {
    router.back();
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 px-4 py-2 md:hidden w-full overflow-x-hidden">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleBack}
            className="p-1 text-gray-600 hover:text-gray-900"
            aria-label="Volver"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <h1 className="text-base font-bold text-gray-900">Miembros</h1>
        </div>
        <div className="h-7 w-7 rounded-full bg-[#22c55e] flex items-center justify-center text-white font-semibold text-xs">
          {user?.name?.charAt(0).toUpperCase() || "U"}
        </div>
      </div>
    </header>
  );
}

