"use client";

import React from "react";
import Link from "next/link";

export function PublicEventFooter(): React.ReactNode {
  return (
    <footer className="bg-white border-t border-gray-200 py-6 mt-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-600 text-center md:text-left">
            Plataforma de gestión de tandas
          </p>
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

