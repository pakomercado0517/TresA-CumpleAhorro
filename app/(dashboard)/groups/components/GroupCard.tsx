"use client";

import React, { useState } from "react";
import { MoreVertical, Gift, Briefcase, Pencil, Trash2, X } from "lucide-react";
import type { GroupListItem } from "@/types/groups";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface GroupCardProps {
  group: GroupListItem;
  onEdit?: (group: GroupListItem) => void;
  onDelete?: (group: GroupListItem) => void;
}

export function GroupCard({ group, onEdit, onDelete }: GroupCardProps): React.ReactNode {
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNextPayment = (dateString: string | null): string => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString + "T00:00:00");
      return format(date, "d MMM", { locale: es });
    } catch {
      return "";
    }
  };

  const frequencyLabel = group.frequency === "quincena" ? "quincena" : "mes";
  const hasProgress = group.totalEvents > 0 && group.progress > 0;
  const showNextPayment = group.nextPaymentDate && !hasProgress;

  // Icono basado en el nombre del grupo (aproximación simple)
  const getIcon = (): React.ReactNode => {
    if (!group.name) {
      return <Gift className="h-5 w-5 md:h-6 md:w-6 text-[#22c55e]" />;
    }
    if (
      group.name.toLowerCase().includes("oficina") ||
      group.name.toLowerCase().includes("trabajo")
    ) {
      return <Briefcase className="h-5 w-5 md:h-6 md:w-6 text-blue-500" />;
    }
    return <Gift className="h-5 w-5 md:h-6 md:w-6 text-[#22c55e]" />;
  };

  return (
    <div className="bg-white rounded-lg p-3 md:p-6 shadow-sm border border-gray-200 mb-2 md:mb-4">
      <div className="flex items-start justify-between mb-2 md:mb-4">
        <div className="flex items-center gap-2 md:gap-4 flex-1">
          <div className="flex-shrink-0">{getIcon()}</div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm md:text-lg text-gray-900 truncate">
              {group.name}
            </h3>
            <p className="text-xs md:text-base text-gray-600 mt-0.5">
              {group.memberCount} Miembros •{" "}
              {formatCurrency(group.amountPerPeriod)}/{frequencyLabel}
            </p>
          </div>
        </div>
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100"
            aria-label="Más opciones"
          >
            <MoreVertical className="h-4 w-4 md:h-6 md:w-6" />
          </button>
          
          {showMenu && (
            <>
              {/* Overlay para cerrar el menú */}
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowMenu(false)}
              />
              
              {/* Menú desplegable */}
              <div className="absolute right-0 top-8 z-20 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1">
                <button
                  type="button"
                  onClick={() => {
                    setShowMenu(false);
                    if (onEdit) onEdit(group);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                >
                  <Pencil className="h-4 w-4" />
                  Editar grupo
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowMenu(false);
                    if (onDelete) onDelete(group);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Eliminar grupo
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {hasProgress && (
        <div className="mt-2 md:mt-4">
          <div className="flex items-center justify-between mb-1.5 md:mb-3">
            <span className="text-xs md:text-base text-gray-600">Progreso</span>
            <div className="flex items-center gap-1.5 md:gap-3">
              <span className="text-xs md:text-base font-medium text-gray-900">
                {group.completedEvents}/{group.totalEvents}
              </span>
              <div className="h-5 w-5 md:h-7 md:w-7 rounded-full bg-[#22c55e] flex items-center justify-center">
                <span className="text-[10px] md:text-sm font-bold text-white">
                  {group.progress}%
                </span>
              </div>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5 md:h-2.5">
            <div
              className="bg-[#22c55e] h-1.5 md:h-2.5 rounded-full transition-all"
              style={{ width: `${group.progress}%` }}
            />
          </div>
        </div>
      )}

      {showNextPayment && (
        <div className="mt-2 md:mt-4">
          <div className="flex items-center justify-between">
            <span className="text-xs md:text-base text-gray-600">
              Próximo pago
            </span>
            <span className="text-xs md:text-base font-medium text-gray-900">
              {formatNextPayment(group.nextPaymentDate)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
