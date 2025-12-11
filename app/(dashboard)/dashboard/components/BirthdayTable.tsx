"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formatShortDate } from "@/lib/dashboard-utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import type { BirthdayListItem } from "@/types/dashboard";

interface BirthdayTableProps {
  birthdays: Array<BirthdayListItem>;
  isLoading?: boolean;
}

export function BirthdayTable({
  birthdays,
  isLoading = false,
}: BirthdayTableProps): React.ReactNode {
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredBirthdays = useMemo(() => {
    if (!searchQuery.trim()) return birthdays;

    const query = searchQuery.toLowerCase();
    return birthdays.filter((birthday) => {
      const dateStr = format(
        new Date(birthday.birthdayDate + "T00:00:00"),
        "dd MMM yyyy",
        { locale: es }
      ).toLowerCase();
      return (
        birthday.name.toLowerCase().includes(query) ||
        birthday.groupName.toLowerCase().includes(query) ||
        dateStr.includes(query)
      );
    });
  }, [birthdays, searchQuery]);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(amount);
  };

  const formatFullDate = (dateString: string): string => {
    const date = new Date(dateString + "T00:00:00");
    return format(date, "dd MMM, yyyy", { locale: es });
  };

  const getStatusLabel = (status: "paid" | "pending" | "overdue"): string => {
    const labels = {
      paid: "Pagado",
      pending: "Pendiente",
      overdue: "Vencido",
    };
    return labels[status];
  };

  const getStatusVariant = (
    status: "paid" | "pending" | "overdue"
  ): "paid" | "pending" | "overdue" => {
    return status;
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-10 bg-gray-200 rounded animate-pulse" />
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="space-y-3 p-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-16 bg-gray-100 rounded animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">
          Listado Cronológico de Cumpleaños
        </h2>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <Input
          type="text"
          placeholder="Buscar por grupo, miembro o fecha"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  FECHA
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  NOMBRE DEL MIEMBRO
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  GRUPO
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  MONTO A RECIBIR
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  ESTADO DE PAGO
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  ACCIONES
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBirthdays.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    {searchQuery
                      ? "No se encontraron resultados"
                      : "No hay cumpleaños próximos"}
                  </td>
                </tr>
              ) : (
                filteredBirthdays.map((birthday) => (
                  <tr
                    key={birthday.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatFullDate(birthday.birthdayDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {birthday.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {birthday.groupName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      {formatCurrency(birthday.expectedAmount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={getStatusVariant(birthday.paymentStatus)}>
                        {getStatusLabel(birthday.paymentStatus)}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {birthday.paymentStatus === "paid" ? (
                        <span className="text-gray-500">Completado</span>
                      ) : (
                        <Link href={`/events/${birthday.eventId}/payments`}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-[#22c55e] hover:text-[#22c55e] hover:bg-green-50"
                          >
                            Marcar Pagado
                          </Button>
                        </Link>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
