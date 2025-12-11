"use client";

import React from "react";
import { Bell, LayoutDashboard } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import Image from "next/image";

export function DashboardHeader(): React.ReactNode {
  const { user } = useAuthStore();

  return (
    <header className="flex items-center justify-between px-4 md:px-8 py-4 md:py-6 bg-white border-b border-gray-200">
      <div className="flex items-center gap-2 md:gap-3">
        <div className="h-8 w-8 md:hidden bg-[#22c55e] rounded-md flex items-center justify-center">
          <LayoutDashboard className="h-5 w-5 text-white" />
        </div>
        <h1 className="text-xl md:text-3xl font-bold text-gray-900">
          <span className="md:hidden">Dashboard</span>
          <span className="hidden md:inline">Dashboard Principal</span>
        </h1>
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="p-2 text-gray-600 hover:text-gray-900"
          aria-label="Notificaciones"
        >
          <Bell className="h-5 w-5" />
        </button>
        <div className="h-10 w-10 rounded-full bg-gray-300 overflow-hidden md:hidden">
          {user?.email ? (
            <div className="h-full w-full flex items-center justify-center bg-[#22c55e] text-white font-semibold">
              {user.name.charAt(0).toUpperCase()}
            </div>
          ) : (
            <div className="h-full w-full bg-gray-300" />
          )}
        </div>
      </div>
    </header>
  );
}
