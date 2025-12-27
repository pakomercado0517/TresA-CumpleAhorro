"use client";

import React from "react";
import { TresABrandGreen } from "@/components/branding/TresABrandGreen";

export function PublicEventHeader(): React.ReactNode {
  return (
    <header className="bg-white border-b border-gray-200 py-4">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <TresABrandGreen width={40} height={36} className="flex-shrink-0" />
          <span className="text-2xl font-bold text-gray-900">CumpleAhorro</span>
        </div>
      </div>
    </header>
  );
}
