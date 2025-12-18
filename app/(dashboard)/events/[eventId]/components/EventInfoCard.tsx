"use client";

import React from "react";
import Image from "next/image";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import type { Event } from "@/types/dashboard";

interface EventInfoCardProps {
  event: Event;
  onEdit?: () => void;
}

export function EventInfoCard({
  event,
  onEdit,
}: EventInfoCardProps): React.ReactNode {
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString + "T00:00:00");
      return format(date, "dd 'de' MMMM, yyyy", { locale: es });
    } catch {
      return dateString;
    }
  };

  const memberName = event.member?.name || "Sin nombre";
  const eventTitle = `Cumpleaños de ${memberName}`;

  return (
    <div className="bg-white rounded-lg p-4 mb-4">
      <div className="flex items-start gap-4 mb-4">
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

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-bold text-gray-900 mb-1">
            {eventTitle}
          </h2>
          <p className="text-sm text-gray-600">
            Fecha del evento: {formatDate(event.birthdayDate)}
          </p>
        </div>
      </div>

      {/* Edit Button */}
      <Button
        onClick={onEdit}
        variant="outline"
        className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900"
      >
        Editar Evento
      </Button>
    </div>
  );
}









