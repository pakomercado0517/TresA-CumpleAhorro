"use client";

import React from "react";
import Link from "next/link";
import { TresALogo } from "@/components/branding/TresALogo";

export function LandingFooter(): React.ReactNode {
  const year = new Date().getFullYear();

  return (
    <footer className="px-4 py-8 md:py-12 border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-[#22c55e] rounded-md flex items-center justify-center">
              <div className="h-4 w-4 bg-white rounded-sm"></div>
            </div>
            <span className="text-lg font-semibold text-gray-700">
              CumpleAhorro
            </span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 text-sm text-gray-600">
            <Link
              href="/login"
              className="hover:text-[#22c55e] transition-colors"
            >
              Iniciar sesión
            </Link>
            <Link
              href="/register"
              className="hover:text-[#22c55e] transition-colors"
            >
              Crear cuenta
            </Link>
          </div>
        </div>
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <span>CumpleAhorro</span>
              <span className="text-gray-400">•</span>
              <span>Hecho por</span>
              <TresALogo width={20} height={20} className="inline-block" />
              <span className="font-semibold">TresA Design</span>
            </div>
          </div>
          <p className="mt-3 text-center text-xs text-gray-500">
            © {year} TresA Design. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
