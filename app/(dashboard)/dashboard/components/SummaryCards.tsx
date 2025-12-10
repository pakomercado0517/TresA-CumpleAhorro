"use client";

import { Cake, Wallet, Users } from "lucide-react";

interface SummaryCardProps {
  icon: JSX.Element;
  value: number | string;
  label: string;
  title?: string;
}

function SummaryCard({
  icon,
  value,
  label,
  title,
}: SummaryCardProps): JSX.Element {
  return (
    <div className="bg-white rounded-lg p-4 md:p-6 shadow-sm border border-gray-200">
      {title && (
        <div className="text-sm font-medium text-gray-600 mb-2">{title}</div>
      )}
      <div className="flex items-center justify-between mb-3">
        <div className="text-[#22c55e]">{icon}</div>
      </div>
      <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
        {value}
      </div>
      <div className="text-sm text-gray-600">{label}</div>
    </div>
  );
}

interface SummaryCardsProps {
  upcomingBirthdays: number;
  paymentsToday: number;
  totalGroups: number;
  totalPaymentsToday?: number;
}

export function SummaryCards({
  upcomingBirthdays,
  paymentsToday,
  totalGroups,
  totalPaymentsToday,
}: SummaryCardsProps): JSX.Element {
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 px-4 md:px-0 mb-6">
      <SummaryCard
        icon={<Cake className="h-6 w-6" />}
        value={upcomingBirthdays}
        label="en los próximos 30 días"
        title="Cumpleaños Próximos"
      />
      <SummaryCard
        icon={<Wallet className="h-6 w-6" />}
        value={
          totalPaymentsToday !== undefined
            ? formatCurrency(totalPaymentsToday)
            : paymentsToday
        }
        label={
          totalPaymentsToday !== undefined
            ? `de ${paymentsToday} transacciones`
            : "Pagos Hoy"
        }
        title="Pagos del Día"
      />
      <SummaryCard
        icon={<Users className="h-6 w-6" />}
        value={totalGroups}
        label="grupos activos"
        title="Grupos Creados"
      />
    </div>
  );
}

