"use client";

import React from "react";
import { TresABrandGreen } from "@/components/branding/TresABrandGreen";

export function AuthHeader(): React.ReactNode {
  return (
    <header className="flex items-center justify-between px-4 py-4 md:px-8">
      <div className="flex items-center gap-2">
        <TresABrandGreen width={32} height={28} className="flex-shrink-0" />
        <span className="text-xl font-semibold text-gray-700">
          CumpleAhorro
        </span>
      </div>
    </header>
  );
}
