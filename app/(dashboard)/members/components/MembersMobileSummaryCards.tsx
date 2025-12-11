"use client";

import React from "react";
import { Users, Gift, FileText } from "lucide-react";
import type { MembersSummary } from "@/types/members";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface MembersMobileSummaryCardsProps {
  summary: MembersSummary;
}

export function MembersMobileSummaryCards({
  summary,
}: MembersMobileSummaryCardsProps): React.ReactNode {
  const formatNextBirthday = (dateString: string): string => {
    try {
      const date = new Date(dateString + "T00:00:00");
      return format(date, "d MMM", { locale: es });
    } catch {
      return "";
    }
  };

  return (
    <div className="grid grid-cols-1 gap-2 mb-3 md:hidden w-full overflow-x-hidden">
      {/* Total Miembros */}
      <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
            <Users className="h-4 w-4 text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs text-gray-600 mb-0.5">Total Miembros</div>
            <div className="text-xl font-bold text-gray-900">
              {summary.totalMembers}
            </div>
            {summary.newMembersThisWeek > 0 && (
              <div className="text-[10px] text-gray-500 mt-0.5">
                ↑ +{summary.newMembersThisWeek} esta semana
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cumpleañeros del Mes */}
      <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
            <Gift className="h-4 w-4 text-purple-600" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs text-gray-600 mb-0.5">Cumpleañeros (Mes)</div>
            <div className="text-xl font-bold text-gray-900">
              {summary.birthdaysThisMonth}
            </div>
            {summary.nextBirthday && (
              <div className="text-[10px] text-gray-500 mt-0.5 truncate">
                Próximo: {summary.nextBirthday.name} ({formatNextBirthday(summary.nextBirthday.date)})
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Pagos Pendientes */}
      <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
            <FileText className="h-4 w-4 text-orange-600" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs text-gray-600 mb-0.5">Pagos Pendientes</div>
            <div className="text-xl font-bold text-gray-900">
              {summary.pendingPayments}
            </div>
            {summary.pendingPayments > 0 && (
              <div className="text-[10px] text-orange-600 font-medium mt-0.5">
                Acción requerida
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

