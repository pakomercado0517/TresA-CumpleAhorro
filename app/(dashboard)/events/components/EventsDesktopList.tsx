"use client";

import React from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { EventDesktopCard } from "./EventDesktopCard";
import type { EventListItem, EventsByMonth } from "@/types/events";

interface EventsDesktopListProps {
  events: Array<EventListItem>;
  isLoading?: boolean;
}

export function EventsDesktopList({
  events,
  isLoading = false,
}: EventsDesktopListProps): React.ReactNode {
  // Agrupar eventos por mes
  const groupEventsByMonth = (
    eventsList: Array<EventListItem>
  ): Array<EventsByMonth> => {
    const grouped: Record<string, EventsByMonth> = {};

    eventsList.forEach((event) => {
      try {
        const date = new Date(event.birthdayDate + "T00:00:00");
        const monthKey = format(date, "MMMM yyyy", { locale: es }).toUpperCase();
        const monthNumber = date.getMonth();
        const year = date.getFullYear();

        if (!grouped[monthKey]) {
          grouped[monthKey] = {
            month: monthKey,
            year,
            monthNumber,
            events: [],
          };
        }

        grouped[monthKey].events.push(event);
      } catch (error) {
        console.error("Error grouping event by month:", error);
      }
    });

    // Ordenar por fecha (más recientes primero)
    return Object.values(grouped).sort((a, b) => {
      if (a.year !== b.year) return b.year - a.year;
      return b.monthNumber - a.monthNumber;
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="flex items-start gap-4 p-5 bg-white border border-gray-200 rounded-lg animate-pulse"
          >
            <div className="h-16 w-16 rounded-full bg-gray-200" />
            <div className="flex-1">
              <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-3" />
              <div className="h-2 bg-gray-200 rounded w-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-gray-500">No hay eventos disponibles</p>
      </div>
    );
  }

  const eventsByMonth = groupEventsByMonth(events);

  return (
    <div className="space-y-8">
      {eventsByMonth.map((monthGroup) => (
        <div key={monthGroup.month}>
          <h2 className="text-lg font-bold text-gray-700 mb-4">
            {monthGroup.month}
          </h2>
          <div className="space-y-3">
            {monthGroup.events.map((event) => (
              <EventDesktopCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}





