"use client";

import React from "react";

interface PublicEventFinancialProps {
  totalExpected: number;
  totalPaid: number;
  remaining: number;
  percentageCompleted: number;
}

export function PublicEventFinancial({
  totalExpected,
  totalPaid,
  remaining,
  percentageCompleted,
}: PublicEventFinancialProps): React.ReactNode {
  // Formatear moneda
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="grid grid-cols-2 gap-6">
        {/* Columna izquierda: Meta Total */}
        <div>
          <p className="text-sm text-gray-500 mb-2">META TOTAL</p>
          <p className="text-3xl font-bold text-gray-900 mb-4">
            {formatCurrency(totalExpected)}
          </p>
          <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
            <div
              className="bg-[#22c55e] h-3 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(percentageCompleted, 100)}%` }}
            ></div>
          </div>
          <p className="text-sm font-semibold text-gray-700">
            {percentageCompleted.toFixed(0)}% Completado
          </p>
        </div>

        {/* Columna derecha: Recolectado */}
        <div>
          <p className="text-sm text-gray-500 mb-2">Recolectado</p>
          <p className="text-3xl font-bold text-[#22c55e] mb-4">
            {formatCurrency(totalPaid)}
          </p>
          <p className="text-sm text-gray-600">
            Faltan {formatCurrency(remaining)}
          </p>
        </div>
      </div>
    </div>
  );
}

