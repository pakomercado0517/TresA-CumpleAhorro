"use client";

import React from "react";
import { Users, DollarSign } from "lucide-react";

interface PublicEventStatsProps {
  participantsCount: number;
  totalMembers: number;
  amountPerPerson: number;
}

export function PublicEventStats({
  participantsCount,
  totalMembers,
  amountPerPerson,
}: PublicEventStatsProps): React.ReactNode {
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
    <div className="grid grid-cols-2 gap-4">
      {/* Participantes */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
        <div className="flex justify-center mb-3">
          <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
            <Users className="h-6 w-6 text-blue-600" />
          </div>
        </div>
        <p className="text-sm text-gray-500 mb-2">Participantes</p>
        <p className="text-2xl font-bold text-gray-900">
          {participantsCount}/{totalMembers}
        </p>
      </div>

      {/* Monto por Persona */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
        <div className="flex justify-center mb-3">
          <div className="h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center">
            <DollarSign className="h-6 w-6 text-orange-600" />
          </div>
        </div>
        <p className="text-sm text-gray-500 mb-2">Por Persona</p>
        <p className="text-2xl font-bold text-gray-900">
          {formatCurrency(amountPerPerson)}
        </p>
      </div>
    </div>
  );
}

