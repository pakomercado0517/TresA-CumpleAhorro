"use client";

import React from "react";
import { Phone, Calendar } from "lucide-react";
import type { MemberListItem } from "@/types/members";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface MembersMobileTableProps {
  members: Array<MemberListItem>;
  isLoading: boolean;
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

export function MembersMobileTable({
  members,
  isLoading,
  currentPage,
  itemsPerPage,
  totalItems,
  onPageChange,
}: MembersMobileTableProps): React.ReactNode {
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

  const getStatusColor = (status: "active" | "pending" | "inactive"): string => {
    const colors = {
      active: "bg-green-500",
      pending: "bg-orange-500",
      inactive: "bg-gray-500",
    };
    return colors[status];
  };

  const generateEmail = (name: string): string => {
    // Generar email basado en el nombre (para demo)
    const normalizedName = name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, ".");
    return `${normalizedName}@gmail.com`;
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="bg-white rounded-lg p-4 border border-gray-200 h-24 animate-pulse"
          />
        ))}
      </div>
    );
  }

  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

  return (
    <div className="space-y-2 md:hidden w-full overflow-x-hidden">
      {/* Member Cards */}
      {members.length === 0 ? (
        <div className="bg-white rounded-lg p-6 border border-gray-200 text-center text-gray-500 text-sm">
          No se encontraron miembros
        </div>
      ) : (
        members.map((member) => (
          <div
            key={member.id}
            className="bg-white rounded-lg p-2.5 border border-gray-200"
          >
            <div className="flex items-start gap-2.5">
              {/* Avatar */}
              {member.photoUrl ? (
                <img
                  src={member.photoUrl}
                  alt={member.name}
                  className="h-10 w-10 rounded-full object-cover flex-shrink-0"
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold text-xs flex-shrink-0">
                  {getInitials(member.name)}
                </div>
              )}

              {/* Member Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-0.5">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs font-semibold text-gray-900 truncate">
                      {member.name}
                    </h3>
                    <p className="text-[10px] text-gray-500 truncate">
                      {generateEmail(member.name)}
                    </p>
                  </div>
                  <div
                    className={`h-1.5 w-1.5 rounded-full ${getStatusColor(member.status)} flex-shrink-0 mt-0.5`}
                  />
                </div>

                {/* Contact Info */}
                <div className="space-y-0.5 mt-1.5">
                  <div className="flex items-center gap-1 text-[10px] text-gray-600">
                    <Phone className="h-2.5 w-2.5 text-gray-400" />
                    <span className="truncate">{formatPhone(member.phone)}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-gray-600">
                    <Calendar className="h-2.5 w-2.5 text-gray-400" />
                    <span>{formatDate(member.birthday)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3">
          <div className="text-xs text-gray-600">
            Mostrando {startIndex + 1}-{endIndex} de {totalItems} miembros
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex-1 sm:flex-none px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Anterior
            </button>
            <button
              type="button"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex-1 sm:flex-none px-3 py-1.5 text-xs font-medium text-white bg-[#22c55e] rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#16a34a]"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

