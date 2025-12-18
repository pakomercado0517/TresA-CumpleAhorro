"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function HeroSection(): React.ReactNode {
  return (
    <section className="px-4 py-12 md:py-16 lg:py-20">
      <div className="mx-auto max-w-4xl text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4 md:text-5xl lg:text-6xl">
          Gestiona tus{" "}
          <span className="text-[#22c55e]">
            Eventos de Ahorro de Cumpleaños
          </span>{" "}
          de forma sencilla
        </h1>
        <p className="text-lg text-gray-600 mb-8 md:text-xl lg:mb-12 max-w-2xl mx-auto">
          Organiza, gestiona y comparte las tandas de cumpleaños de tu grupo.
          Lleva el control de pagos, eventos y miembros en un solo lugar.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/register">
            <Button
              size="lg"
              className="w-full sm:w-auto bg-[#22c55e] hover:bg-[#16a34a] text-white px-8 py-6 text-base"
            >
              Comenzar gratis
            </Button>
          </Link>
          <Link href="/login">
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-6 text-base"
            >
              Iniciar sesión
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
