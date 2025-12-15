"use client";

import React from "react";

interface ProgressSectionProps {
  totalReceived: number;
  totalExpected: number;
  percentageCompleted: number;
}

export function ProgressSection({
  totalReceived,
  totalExpected,
  percentageCompleted,
}: ProgressSectionProps): React.ReactNode {
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-semibold text-gray-900">
          Progreso de Recaudación
        </h3>
        <span className="text-lg font-bold text-gray-900">
          {percentageCompleted}%
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
        <div
          className="bg-[#22c55e] h-3 rounded-full transition-all"
          style={{ width: `${percentageCompleted}%` }}
        />
      </div>

      {/* Amounts */}
      <p className="text-sm text-gray-600">
        {formatCurrency(totalReceived)} de {formatCurrency(totalExpected)}{" "}
        recibidos
      </p>
    </div>
  );
}




