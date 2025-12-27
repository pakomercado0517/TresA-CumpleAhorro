"use client";

import React from "react";
import { TresALogo } from "@/components/branding/TresALogo";

export function LoginFooter(): React.ReactNode {
  const year = new Date().getFullYear();

  return (
    <footer className="px-4 py-6 text-center">
      <div className="flex flex-col items-center gap-3">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>CumpleAhorro</span>
          <span className="text-gray-400">•</span>
          <span>Hecho por</span>
          <TresALogo width={20} height={20} className="inline-block" />
          <span className="font-semibold">TresA Design</span>
        </div>
        <p className="text-xs text-gray-500">
          © {year} TresA Design. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
