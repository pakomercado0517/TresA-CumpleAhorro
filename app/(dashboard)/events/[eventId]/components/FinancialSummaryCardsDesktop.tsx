"use client";

import React from "react";

interface FinancialSummaryCardsDesktopProps {
  amountPerPerson: number;
  totalExpected: number;
  totalReceived: number;
}

export function FinancialSummaryCardsDesktop({
  amountPerPerson,
  totalExpected,
  totalReceived,
}: FinancialSummaryCardsDesktopProps): React.ReactNode {
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      {/* Monto por Persona */}
      <div className="bg-white rounded-lg p-6">
        <p className="text-sm text-gray-600 mb-2">Monto por Persona</p>
        <p className="text-2xl font-bold text-gray-900">
          {formatCurrency(amountPerPerson)}
        </p>
      </div>

      {/* Total Esperado */}
      <div className="bg-white rounded-lg p-6">
        <p className="text-sm text-gray-600 mb-2">Total Esperado</p>
        <p className="text-2xl font-bold text-gray-900">
          {formatCurrency(totalExpected)}
        </p>
      </div>

      {/* Total Recibido */}
      <div className="bg-white rounded-lg p-6">
        <p className="text-sm text-gray-600 mb-2">Total Recibido</p>
        <p className="text-2xl font-bold text-gray-900">
          {formatCurrency(totalReceived)}
        </p>
      </div>
    </div>
  );
}





