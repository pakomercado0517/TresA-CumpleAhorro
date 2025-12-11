"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import type { EventListItem } from "@/types/events";

interface EventDesktopCardProps {
  event: EventListItem;
}

export function EventDesktopCard({
  event,
}: EventDesktopCardProps): React.ReactNode {
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
      <div className="flex items-start gap-4 p-5 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer">
        {/* Avatar */}
        <div className="h-16 w-16 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
          {event.member?.photoUrl ? (
            <Image
              src={event.member.photoUrl}
              alt={memberName}
              width={64}
              height={64}
              className="object-cover"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-[#22c55e] text-white font-semibold text-xl">
              {memberName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Title and Status */}
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900">
              {eventTitle}
            </h3>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ml-4 flex-shrink-0 ${statusConfig.className}`}
            >
              {statusConfig.label}
            </span>
          </div>

          {/* Date */}
          <p className="text-sm text-gray-600 mb-3">
            {formatDate(event.birthdayDate)}
          </p>

          {/* Progress Bar - Solo para eventos activos o pendientes */}
          {(event.paymentStatus === "active" ||
            event.paymentStatus === "pending") && (
            <div className="mb-3">
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                <div
                  className={cn(
                    "h-2.5 rounded-full transition-all",
                    event.paymentStatus === "active"
                      ? "bg-green-500"
                      : "bg-yellow-500"
                  )}
                  style={{ width: `${event.percentageCompleted}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700 font-medium">
                  RECIBIDO {formatCurrency(event.totalPaid)}
                </span>
                <span className="text-gray-700 font-medium">
                  META {formatCurrency(event.expectedAmount)}
                </span>
              </div>
            </div>
          )}

          {/* Additional Info - Para eventos próximos */}
          {event.paymentStatus === "upcoming" && (
            <div className="flex items-center gap-4 text-sm text-gray-600">
              {event.amountPerPerson && (
                <span className="font-medium">
                  CUOTA IND. {formatCurrency(event.amountPerPerson)}
                </span>
              )}
              {event.memberCount && (
                <span className="font-medium">
                  MIEMBROS {event.memberCount}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

