"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function LandingHeader(): JSX.Element {
  return (
    <header className="flex items-center justify-between px-4 py-4 md:px-8 lg:px-12">
      <div className="flex items-center gap-2">
        <div className="flex flex-col gap-0.5">
          <div className="h-1 w-6 bg-gray-700 rounded-sm"></div>
          <div className="h-1 w-6 bg-gray-700 rounded-sm"></div>
          <div className="h-1 w-6 bg-gray-700 rounded-sm"></div>
        </div>
        <span className="text-xl font-semibold text-gray-700">Tandas</span>
      </div>
      <div className="flex items-center gap-3">
        <Link href="/login">
          <Button
            variant="ghost"
            className="text-gray-700 hover:bg-gray-100"
          >
            Inicia sesión
          </Button>
        </Link>
        <Link href="/register">
          <Button className="bg-[#22c55e] hover:bg-[#16a34a] text-white">
            Crear cuenta
          </Button>
        </Link>
      </div>
    </header>
  );
}

