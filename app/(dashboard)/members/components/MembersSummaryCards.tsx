"use client";

import React from "react";
import { Users, PartyPopper, Wallet } from "lucide-react";
import type { MembersSummary } from "@/types/members";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface MembersSummaryCardsProps {
  summary: MembersSummary;
}

export function MembersSummaryCards({
  summary,
}: MembersSummaryCardsProps): React.ReactNode {
  const formatNextBirthday = (dateString: string): string => {
    try {
      const date = new Date(dateString + "T00:00:00");
      return format(date, "d MMM", { locale: es });
    } catch {
      return "";
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6">
      {/* Total Miembros */}
      <div className="bg-white rounded-lg p-4 md:p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
            <Users className="h-6 w-6 text-blue-600" />
          </div>
        </div>
        <div className="text-3xl font-bold text-gray-900 mb-1">
          {summary.totalMembers}
        </div>
        <div className="text-sm font-medium text-gray-600 mb-1">
          Total Miembros
        </div>
        {summary.newMembersThisWeek > 0 && (
          <div className="text-xs text-gray-500">
            ↑ +{summary.newMembersThisWeek} esta semana
          </div>
        )}
      </div>

      {/* Cumpleañeros del Mes */}
      <div className="bg-white rounded-lg p-4 md:p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center">
            <PartyPopper className="h-6 w-6 text-purple-600" />
          </div>
        </div>
        <div className="text-3xl font-bold text-gray-900 mb-1">
          {summary.birthdaysThisMonth}
        </div>
        <div className="text-sm font-medium text-gray-600 mb-1">
          Cumpleañeros (Mes)
        </div>
        {summary.nextBirthday && (
          <div className="text-xs text-gray-500">
            Próximo: {summary.nextBirthday.name} ({formatNextBirthday(summary.nextBirthday.date)})
          </div>
        )}
      </div>

      {/* Pagos Pendientes */}
      <div className="bg-white rounded-lg p-4 md:p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <div className="h-12 w-12 rounded-lg bg-orange-100 flex items-center justify-center">
            <Wallet className="h-6 w-6 text-orange-600" />
          </div>
        </div>
        <div className="text-3xl font-bold text-gray-900 mb-1">
          {summary.pendingPayments}
        </div>
        <div className="text-sm font-medium text-gray-600 mb-1">
          Pagos Pendientes
        </div>
        {summary.pendingPayments > 0 && (
          <div className="text-xs text-orange-600 font-medium">
            Acción requerida
          </div>
        )}
      </div>
    </div>
  );
}






