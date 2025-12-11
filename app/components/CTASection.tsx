"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CTASection(): React.ReactNode {
  return (
    <section className="px-4 py-12 md:py-16 lg:py-20">
      <div className="mx-auto max-w-4xl">
        <div className="bg-[#22c55e] rounded-lg p-8 md:p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4 md:text-4xl">
            ¿Listo para comenzar?
          </h2>
          <p className="text-lg mb-8 text-green-50 max-w-2xl mx-auto">
            Únete a Tandas y comienza a gestionar tus tandas de cumpleaños de
            forma profesional y sencilla.
          </p>
          <Link href="/register">
            <Button
              size="lg"
              variant="outline"
              className="bg-white text-[#22c55e] hover:bg-gray-100 border-white px-8 py-6 text-base font-semibold"
            >
              Crear cuenta gratis
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
