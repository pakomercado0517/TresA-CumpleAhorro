"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TresABrandGreen } from "@/components/branding/TresABrandGreen";

export function LandingHeader(): React.ReactNode {
  return (
    <header className="flex items-center justify-between px-4 py-4 md:px-8 lg:px-12">
      <div className="flex items-center gap-2">
        <TresABrandGreen width={32} height={28} className="flex-shrink-0" />
        <span className="text-xl font-semibold text-gray-700">
          CumpleAhorro
        </span>
      </div>
      <div className="flex items-center gap-3">
        <Link href="/login">
          <Button variant="ghost" className="text-gray-700 hover:bg-gray-100">
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
