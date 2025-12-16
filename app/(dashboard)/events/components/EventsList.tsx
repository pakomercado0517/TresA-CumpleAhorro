"use client";

import React from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { EventCard } from "./EventCard";
import type { EventListItem, EventsByMonth } from "@/types/events";

interface EventsListProps {
  events: Array<EventListItem>;
  isLoading?: boolean;
}

export function EventsList({
  events,
  isLoading = false,
}: EventsListProps): React.ReactNode {
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
      <div className="px-4 space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="flex items-start gap-3 p-4 bg-white rounded-lg border border-gray-200 animate-pulse"
          >
            <div className="h-12 w-12 rounded-full bg-gray-200" />
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-2" />
              <div className="h-2 bg-gray-200 rounded w-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="px-4 py-8 text-center">
        <p className="text-gray-500 text-sm">No hay eventos disponibles</p>
      </div>
    );
  }

  const eventsByMonth = groupEventsByMonth(events);

  return (
    <div className="px-4 pb-20">
      {eventsByMonth.map((monthGroup) => (
        <div key={monthGroup.month} className="mb-6">
          <h2 className="text-sm font-bold text-gray-700 mb-3">
            {monthGroup.month}
          </h2>
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {monthGroup.events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}





