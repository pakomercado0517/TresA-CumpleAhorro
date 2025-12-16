"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Phone, Calendar, Edit, Trash2, User } from "lucide-react";
import type { MemberListItem } from "@/types/members";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface MembersTableProps {
  members: Array<MemberListItem>;
  isLoading: boolean;
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  hasMore: boolean;
  onNextPage: () => void;
  onPreviousPage: () => void;
  onEdit: (member: MemberListItem) => void;
  onDelete: (member: MemberListItem) => void;
  isDeleting: boolean;
}

export function MembersTable({
  members,
  isLoading,
  currentPage,
  itemsPerPage,
  totalItems,
  hasMore,
  onNextPage,
  onPreviousPage,
  onEdit,
  onDelete,
  isDeleting,
}: MembersTableProps): React.ReactNode {
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString + "T00:00:00");
      return format(date, "dd MMM yyyy", { locale: es });
    } catch {
      return dateString;
    }
  };

  const formatPhone = (phone?: string): string => {
    if (!phone) return "N/A";
    // Formatear teléfono mexicano
    if (phone.length === 10) {
      return `+52 ${phone.slice(0, 2)} ${phone.slice(2, 6)} ${phone.slice(6)}`;
    }
    return phone;
  };

  const getInitials = (name: string): string => {
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const getStatusBadge = (status: "active" | "pending" | "inactive"): React.ReactNode => {
    const variants = {
      active: {
        label: "Activo",
        dotColor: "bg-green-500",
        textColor: "text-green-800",
        bgColor: "bg-green-100",
      },
      pending: {
        label: "Pendiente Pago",
        dotColor: "bg-orange-500",
        textColor: "text-orange-800",
        bgColor: "bg-orange-100",
      },
      inactive: {
        label: "Inactivo",
        dotColor: "bg-gray-500",
        textColor: "text-gray-800",
        bgColor: "bg-gray-100",
      },
    };

    const variant = variants[status];
    return (
      <div className="flex items-center gap-2">
        <div className={`h-2 w-2 rounded-full ${variant.dotColor}`} />
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${variant.bgColor} ${variant.textColor}`}>
          {variant.label}
        </span>
      </div>
    );
  };

  const generateEmail = (name: string): string => {
    // Generar email basado en el nombre (para demo)
    const normalizedName = name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, ".");
    return `${normalizedName}@email.com`;
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="space-y-3 p-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 bg-gray-100 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + members.length, totalItems);
  const canGoPrevious = currentPage > 1;

  return (
    <div className="space-y-4">
      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  MIEMBRO
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  CONTACTO
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  FECHA NAC.
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
              {members.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    No se encontraron miembros
                  </td>
                </tr>
              ) : (
                members.map((member) => (
                  <tr
                    key={member.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {member.photoUrl ? (
                          <img
                            src={member.photoUrl}
                            alt={member.name}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold text-sm">
                            {getInitials(member.name)}
                          </div>
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {member.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {generateEmail(member.name)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-900">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span>{formatPhone(member.phone)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-900">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span>{formatDate(member.birthday)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(member.status)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => onEdit(member)}
                          disabled={isDeleting}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          aria-label="Editar miembro"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDelete(member)}
                          disabled={isDeleting}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          aria-label="Eliminar miembro"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {(canGoPrevious || hasMore) && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Mostrando {startIndex + 1}-{endIndex} de {totalItems} miembros
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onPreviousPage}
              disabled={!canGoPrevious}
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onNextPage}
              disabled={!hasMore}
            >
              Siguiente
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}






