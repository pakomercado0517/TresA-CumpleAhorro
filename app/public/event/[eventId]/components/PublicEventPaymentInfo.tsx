"use client";

import React from "react";
import { Info } from "lucide-react";

export function PublicEventPaymentInfo(): React.ReactNode {
  return (
    <div className="bg-yellow-50 rounded-xl border border-yellow-200 p-6">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className="h-10 w-10 bg-orange-500 rounded-full flex items-center justify-center">
            <Info className="h-5 w-5 text-white" />
          </div>
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-2">
            Información de Pago
          </h3>
          <p className="text-sm text-gray-700 leading-relaxed">
            Contacta directamente al administrador del evento para realizar tu
            aportación. Los pagos son gestionados de forma manual.
          </p>
        </div>
      </div>
    </div>
  );
}

