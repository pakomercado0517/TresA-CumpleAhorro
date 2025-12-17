"use client";

import React from "react";
import { Calendar } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import Image from "next/image";

interface PublicEventHeroProps {
  memberName: string;
  photoUrl: string | null;
  birthdayDate: string;
  status: {
    label: string;
    value: "active" | "completed" | "pending" | "upcoming";
  };
}

export function PublicEventHero({
  memberName,
  photoUrl,
  birthdayDate,
  status,
}: PublicEventHeroProps): React.ReactNode {
  // Formatear fecha a "Viernes, 24 de Noviembre"
  const formattedDate = format(
    new Date(birthdayDate + "T00:00:00"),
    "EEEE, d 'de' MMMM",
    { locale: es }
  );
  const capitalizedDate =
    formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

  // Determinar color del badge según el estado
  const getStatusColor = (): string => {
    switch (status.value) {
      case "active":
        return "bg-[#22c55e]";
      case "completed":
        return "bg-green-600";
      case "pending":
        return "bg-yellow-500";
      case "upcoming":
        return "bg-blue-500";
      default:
        return "bg-[#22c55e]";
    }
  };

  return (
    <div className="relative bg-gradient-to-b from-[#16a34a] to-white pt-12 pb-8 px-6 md:px-8">
      {/* Patrón de puntos decorativo */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle, #ffffff 1px, transparent 1px)`,
          backgroundSize: "20px 20px",
        }}
      ></div>

      <div className="relative flex flex-col items-center">
        {/* Avatar del cumpleañero */}
        <div className="relative mb-4">
          <div className="h-24 w-24 md:h-32 md:w-32 rounded-full bg-white p-1 shadow-lg">
            {photoUrl ? (
              <div className="h-full w-full rounded-full overflow-hidden relative">
                <Image
                  src={photoUrl}
                  alt={memberName}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="h-full w-full rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-3xl md:text-4xl font-bold text-gray-500">
                  {memberName.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>
          {/* Icono decorativo */}
          <div className="absolute -bottom-1 -right-1 h-8 w-8 bg-[#22c55e] rounded-lg flex items-center justify-center shadow-md">
            <div className="h-4 w-4 bg-white rounded-sm"></div>
          </div>
        </div>

        {/* Título del evento */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 text-center">
          Cumpleaños de {memberName}
        </h1>

        {/* Fecha */}
        <div className="flex items-center gap-2 text-gray-700 mb-3">
          <Calendar className="h-5 w-5" />
          <span className="text-lg">{capitalizedDate}</span>
        </div>

        {/* Badge de estado */}
        <div className="flex items-center gap-2">
          <div className={`h-2 w-2 rounded-full ${getStatusColor()}`}></div>
          <span className="text-sm font-semibold text-gray-800">
            {status.label}
          </span>
        </div>
      </div>
    </div>
  );
}

