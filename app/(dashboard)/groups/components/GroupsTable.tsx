"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreVertical, TrendingUp, User, Pencil, Trash2 } from "lucide-react";
import type { GroupListItem } from "@/types/groups";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface GroupsTableProps {
  groups: Array<GroupListItem>;
  isLoading: boolean;
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onEditGroup?: (group: GroupListItem) => void;
  onDeleteGroup?: (group: GroupListItem) => void;
}

export function GroupsTable({
  groups,
  isLoading,
  currentPage,
  itemsPerPage,
  totalItems,
  onPageChange,
  onEditGroup,
  onDeleteGroup,
}: GroupsTableProps): React.ReactNode {
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString: string | null): string => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString + "T00:00:00");
      return format(date, "dd MMM yyyy", { locale: es });
    } catch {
      return "N/A";
    }
  };

  const getRelativeTime = (dateString: string | null): string => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString + "T00:00:00");
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const diffTime = date.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays < 0) {
        const monthsAgo = Math.abs(Math.floor(diffDays / 30));
        if (monthsAgo === 0) {
          return "Finalizado";
        }
        return `Hace ${monthsAgo} ${monthsAgo === 1 ? "mes" : "meses"}`;
      } else if (diffDays === 0) {
        return "Hoy";
      } else if (diffDays === 1) {
        return "Mañana";
      } else {
        return `En ${diffDays} días`;
      }
    } catch {
      return "";
    }
  };

  const getStatusBadge = (
    status: "active" | "pending" | "completed"
  ): React.ReactNode => {
    const variants = {
      active: { label: "Activo", className: "bg-green-100 text-green-800" },
      pending: {
        label: "Pendiente",
        className: "bg-yellow-100 text-yellow-800",
      },
      completed: {
        label: "Completado",
        className: "bg-blue-100 text-blue-800",
      },
    };

    const variant = variants[status];
    return (
      <div className="flex items-center gap-2">
        <div
          className={`h-2 w-2 rounded-full ${
            status === "active"
              ? "bg-green-500"
              : status === "pending"
              ? "bg-yellow-500"
              : "bg-blue-500"
          }`}
        />
        <span
          className={`text-xs font-medium px-2 py-1 rounded-full ${variant.className}`}
        >
          {variant.label}
        </span>
      </div>
    );
  };

  const getTotalAccumulatedInfo = (
    group: GroupListItem
  ): {
    amount: string;
    label: string;
    showTrend: boolean;
  } => {
    if (group.status === "completed") {
      return {
        amount: formatCurrency(group.totalCollected),
        label: "Total distribuido",
        showTrend: false,
      };
    }

    if (group.progress === 100) {
      return {
        amount: formatCurrency(group.totalCollected),
        label: "100% Recaudado",
        showTrend: true,
      };
    }

    if (group.progress > 0) {
      return {
        amount: formatCurrency(group.totalCollected),
        label: `${group.progress}% Recaudado`,
        showTrend: true,
      };
    }

    return {
      amount: formatCurrency(group.totalCollected),
      label: "Pendiente de inicio",
      showTrend: false,
    };
  };

  const renderParticipants = (group: GroupListItem): React.ReactNode => {
    // Mostrar avatares (máximo 3) + contador
    const maxAvatars = 3;
    const showCount = group.memberCount > maxAvatars;

    return (
      <div className="flex items-center gap-2">
        <div className="flex -space-x-2">
          {Array.from({ length: Math.min(maxAvatars, group.memberCount) }).map(
            (_, i) => (
              <div
                key={i}
                className="h-8 w-8 rounded-full bg-[#22c55e] flex items-center justify-center text-white text-xs font-semibold border-2 border-white"
              >
                <User className="h-4 w-4" />
              </div>
            )
          )}
        </div>
        {showCount && (
          <span className="text-sm text-gray-600">
            +{group.memberCount - maxAvatars}
          </span>
        )}
        {!showCount && group.memberCount === 0 && (
          <span className="text-sm text-gray-600">
            {group.memberCount} participantes
          </span>
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="space-y-3 p-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 bg-gray-100 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <div className="space-y-4">
      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  NOMBRE DEL GRUPO
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  PARTICIPANTES
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  INICIO
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  TOTAL ACUMULADO
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  ESTADO
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  ACCIONES
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {groups.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    No se encontraron grupos
                  </td>
                </tr>
              ) : (
                groups.map((group) => {
                  const totalInfo = getTotalAccumulatedInfo(group);
                  return (
                    <tr
                      key={group.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {group.name}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {group.groupId}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">{renderParticipants(group)}</td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm text-gray-900">
                            {formatDate(group.startDate)}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {getRelativeTime(group.startDate)}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-semibold text-gray-900">
                            {totalInfo.amount}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                            {totalInfo.showTrend && (
                              <TrendingUp className="h-3 w-3 text-green-500" />
                            )}
                            <span>{totalInfo.label}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(group.status)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() =>
                              setOpenMenuId(
                                openMenuId === group.id ? null : group.id
                              )
                            }
                            className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100"
                            aria-label="Más opciones"
                          >
                            <MoreVertical className="h-5 w-5" />
                          </button>

                          {openMenuId === group.id && (
                            <>
                              {/* Overlay para cerrar el menú */}
                              <div
                                className="fixed inset-0 z-10"
                                onClick={() => setOpenMenuId(null)}
                              />

                              {/* Menú desplegable */}
                              <div className="absolute right-0 top-10 z-20 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setOpenMenuId(null);
                                    if (onEditGroup) onEditGroup(group);
                                  }}
                                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                >
                                  <Pencil className="h-4 w-4" />
                                  Editar grupo
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setOpenMenuId(null);
                                    if (onDeleteGroup) onDeleteGroup(group);
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
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Mostrando {startIndex + 1} a {endIndex} de {totalItems} resultados
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Siguiente
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
