"use client";

import React from "react";
import { Menu } from "lucide-react";

export function EventDetailHeader(): React.ReactNode {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 px-4 py-3 md:hidden w-full overflow-x-hidden">
      <div className="flex items-center justify-between w-full">
        <h1 className="text-base font-bold text-gray-900">
          Tandas de Cumpleaños
        </h1>
        <button
          type="button"
          className="p-1 text-gray-600 hover:text-gray-900"
          aria-label="Menú"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}



