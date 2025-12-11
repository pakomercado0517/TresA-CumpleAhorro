"use client";

import React from "react";
import { PiggyBank, Calendar } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface GroupsSummaryCardsProps {
  totalCollected: number;
  nextCollectionDate: string | null;
}

export function GroupsSummaryCards({
  totalCollected,
  nextCollectionDate,
}: GroupsSummaryCardsProps): React.ReactNode {
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNextCollection = (dateString: string | null): string => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString + "T00:00:00");
      return format(date, "d MMM", { locale: es });
    } catch {
      return "N/A";
    }
  };

  return (
    <div className="grid grid-cols-2 gap-3 md:gap-6 mb-4 md:mb-8">
      <div className="bg-white rounded-lg p-3 md:p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-1.5 md:mb-3">
          <div className="text-[#22c55e]">
            <PiggyBank className="h-5 w-5 md:h-8 md:w-8" />
          </div>
        </div>
        <div className="text-xs md:text-sm text-gray-600 mb-1 md:mb-2">
          Total Recaudado
        </div>
        <div className="text-xl md:text-3xl font-bold text-gray-900">
          {formatCurrency(totalCollected)}
        </div>
      </div>
      <div className="bg-white rounded-lg p-3 md:p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-1.5 md:mb-3">
          <div className="text-[#22c55e]">
            <Calendar className="h-5 w-5 md:h-8 md:w-8" />
          </div>
        </div>
        <div className="text-xs md:text-sm text-gray-600 mb-1 md:mb-2">
          Próximo Cobro
        </div>
        <div className="text-xl md:text-3xl font-bold text-gray-900">
          {formatNextCollection(nextCollectionDate)}
        </div>
      </div>
    </div>
  );
}
