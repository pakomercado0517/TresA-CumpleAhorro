"use client";

import Link from "next/link";

export function LandingFooter(): JSX.Element {
  return (
    <footer className="px-4 py-8 md:py-12 border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex flex-col gap-0.5">
              <div className="h-1 w-6 bg-gray-700 rounded-sm"></div>
              <div className="h-1 w-6 bg-gray-700 rounded-sm"></div>
              <div className="h-1 w-6 bg-gray-700 rounded-sm"></div>
            </div>
            <span className="text-lg font-semibold text-gray-700">Tandas</span>
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
        <div className="mt-6 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
          <p>© 2024 Tandas. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}

