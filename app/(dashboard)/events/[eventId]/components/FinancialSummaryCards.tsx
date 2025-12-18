"use client";

import React from "react";

interface FinancialSummaryCardsProps {
  amountPerPerson: number;
  totalExpected: number;
  totalReceived: number;
}

export function FinancialSummaryCards({
  amountPerPerson,
  totalExpected,
  totalReceived,
}: FinancialSummaryCardsProps): React.ReactNode {
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="space-y-3 mb-4">
      {/* Monto por Persona */}
      <div className="bg-white rounded-lg p-4">
        <p className="text-sm text-gray-600 mb-1">Monto por Persona</p>
        <p className="text-xl font-bold text-gray-900">
          {formatCurrency(amountPerPerson)}
        </p>
      </div>

      {/* Total Esperado */}
      <div className="bg-white rounded-lg p-4">
        <p className="text-sm text-gray-600 mb-1">Total Esperado</p>
        <p className="text-xl font-bold text-gray-900">
          {formatCurrency(totalExpected)}
        </p>
      </div>

      {/* Total Recibido */}
      <div className="bg-white rounded-lg p-4">
        <p className="text-sm text-gray-600 mb-1">Total Recibido</p>
        <p className="text-xl font-bold text-gray-900">
          {formatCurrency(totalReceived)}
        </p>
      </div>
    </div>
  );
}









