"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import type { EventListItem } from "@/types/events";

interface EventCardProps {
  event: EventListItem;
}

export function EventCard({ event }: EventCardProps): React.ReactNode {
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString + "T00:00:00");
      const dayName = format(date, "EEEE", { locale: es });
      const dayNameCapitalized =
        dayName.charAt(0).toUpperCase() + dayName.slice(1);
      const dayMonth = format(date, "dd MMM", { locale: es });
      return `${dayMonth} (${dayNameCapitalized})`;
    } catch {
      return dateString;
    }
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusConfig = (
    status: EventListItem["paymentStatus"]
  ): { label: string; className: string } => {
    const configs = {
      active: {
        label: "ACTIVO",
        className: "bg-green-500 text-white",
      },
      pending: {
        label: "PENDIENTE",
        className: "bg-orange-500 text-white",
      },
      completed: {
        label: "COMPLETADO",
        className: "bg-gray-500 text-white",
      },
      upcoming: {
        label: "PRÓXIMO",
        className: "bg-gray-200 text-gray-900",
      },
    };
    return configs[status];
  };

  const statusConfig = getStatusConfig(event.paymentStatus);
  const memberName = event.member?.name || "Sin nombre";
  const eventTitle = `Cumpleaños de ${memberName}`;

  return (
    <Link href={`/events/${event.id}`}>
      <div className="flex items-start gap-3 p-4 bg-white border-b border-gray-100 hover:bg-gray-50 transition-colors">
        {/* Avatar */}
        <div className="h-12 w-12 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
          {event.member?.photoUrl ? (
            <Image
              src={event.member.photoUrl}
              alt={memberName}
              width={48}
              height={48}
              className="object-cover"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-[#22c55e] text-white font-semibold text-lg">
              {memberName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Title and Status */}
          <div className="flex items-start justify-between mb-1">
            <h3 className="font-semibold text-gray-900 text-sm leading-tight">
              {eventTitle}
            </h3>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ml-2 flex-shrink-0 ${statusConfig.className}`}
            >
              {statusConfig.label}
            </span>
          </div>

          {/* Date */}
          <p className="text-xs text-gray-600 mb-2">
            {formatDate(event.birthdayDate)}
          </p>

          {/* Progress Bar - Solo para eventos activos o pendientes */}
          {(event.paymentStatus === "active" ||
            event.paymentStatus === "pending") && (
            <div className="mb-2">
              <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                <div
                  className="bg-[#22c55e] h-2 rounded-full transition-all"
                  style={{ width: `${event.percentageCompleted}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">
                  Recibido: {formatCurrency(event.totalPaid)}
                </span>
                <span className="text-gray-600">
                  Meta: {formatCurrency(event.expectedAmount)}
                </span>
              </div>
            </div>
          )}

          {/* Additional Info - Para eventos próximos */}
          {event.paymentStatus === "upcoming" && (
            <div className="flex items-center gap-3 text-xs text-gray-600">
              {event.amountPerPerson && (
                <span>Cuota: {formatCurrency(event.amountPerPerson)}</span>
              )}
              {event.memberCount && (
                <span>{event.memberCount} Miembros</span>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}




