"use client";

import React from "react";
import Link from "next/link";
import { TresALogo } from "@/components/branding/TresALogo";

export function PublicEventFooter(): React.ReactNode {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 py-6 mt-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col gap-2 text-sm text-gray-600 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2">
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
          <div className="flex items-center gap-4 text-sm">
            <Link
              href="#"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Ayuda
            </Link>
            <span className="text-gray-400">•</span>
            <Link
              href="#"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Privacidad
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
