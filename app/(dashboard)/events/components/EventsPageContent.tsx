"use client";

import React, { useEffect, useState, useMemo } from "react";
import { EventsHeader } from "./EventsHeader";
import { EventsFilters } from "./EventsFilters";
import { EventsList } from "./EventsList";
import { EventsDesktopHeader } from "./EventsDesktopHeader";
import { EventsDesktopFilters } from "./EventsDesktopFilters";
import { EventsDesktopList } from "./EventsDesktopList";
import { CreateEventModal } from "./CreateEventModal";
import { getAllEvents, getEventPayments, getGroups } from "@/lib/api-dashboard";
import type { EventListItem } from "@/types/events";
import type { Group } from "@/types/dashboard";

type FilterType = "all" | "in-progress" | "completed";
type SortType = "date-asc" | "date-desc" | "name-asc" | "name-desc";

export function EventsPageContent(): React.ReactNode {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<SortType>("date-asc");
  const [events, setEvents] = useState<Array<EventListItem>>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const loadEventsData = async (): Promise<void> => {
      try {
        setIsLoading(true);

        // Obtener todos los eventos
        const allEvents = await getAllEvents();

        // Obtener grupos para calcular amountPerPerson y memberCount
        const groups = await getGroups();
        const groupsMap = new Map(groups.map((g) => [g.id, g]));

        // Obtener pagos para cada evento y calcular estado
        const eventsWithPayments: Array<EventListItem> = await Promise.all(
          allEvents.map(async (event) => {
            try {
              const paymentsData = await getEventPayments(event.id);
              const totalPaid = paymentsData.summary.totalPaid;
              const percentageCompleted =
                paymentsData.summary.percentageCompleted;
              const group = groupsMap.get(event.groupId);

              // Determinar estado del evento
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              const eventDate = new Date(event.birthdayDate + "T00:00:00");
              eventDate.setHours(0, 0, 0, 0);

              let paymentStatus: EventListItem["paymentStatus"];

              if (percentageCompleted >= 100) {
                paymentStatus = "completed";
              } else if (eventDate < today) {
                // Evento pasado pero no completado
                paymentStatus = "pending";
              } else if (totalPaid > 0) {
                // Evento futuro con pagos
                paymentStatus = "active";
              } else {
                // Evento futuro sin pagos
                paymentStatus = "upcoming";
              }

              return {
                ...event,
                paymentStatus,
                totalPaid,
                percentageCompleted,
                memberCount: group
                  ? Math.round(event.expectedAmount / group.amountPerBirthday)
                  : undefined,
                amountPerPerson: group?.amountPerBirthday,
              };
            } catch (error) {
              console.error(
                `Error loading payments for event ${event.id}:`,
                error
              );
              // Si hay error, asumir que no hay pagos
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              const eventDate = new Date(event.birthdayDate + "T00:00:00");
              eventDate.setHours(0, 0, 0, 0);

              return {
                ...event,
                paymentStatus:
                  eventDate >= today ? "upcoming" : "pending",
                totalPaid: 0,
                percentageCompleted: 0,
                memberCount: undefined,
                amountPerPerson: groupsMap.get(event.groupId)?.amountPerBirthday,
              };
            }
          })
        );

        // Ordenar eventos por fecha (más próximos primero)
        eventsWithPayments.sort((a, b) => {
          return a.birthdayDate.localeCompare(b.birthdayDate);
        });

        setEvents(eventsWithPayments);
      } catch (error) {
        console.error("Error loading events data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadEventsData();
  }, []);

  // Filtrar y ordenar eventos
  const filteredAndSortedEvents = useMemo(() => {
    let filtered: Array<EventListItem> = [];

    // Aplicar filtro por estado
    switch (activeFilter) {
      case "all":
        filtered = events;
        break;
      case "in-progress":
        filtered = events.filter(
          (e) => e.paymentStatus === "active" || e.paymentStatus === "pending"
        );
        break;
      case "completed":
        filtered = events.filter((e) => e.paymentStatus === "completed");
        break;
    }

    // Aplicar búsqueda
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((event) => {
        const memberName = event.member?.name?.toLowerCase() || "";
        const eventDate = event.birthdayDate;
        return memberName.includes(query) || eventDate.includes(query);
      });
    }

    // Aplicar ordenamiento
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "date-asc":
          return a.birthdayDate.localeCompare(b.birthdayDate);
        case "date-desc":
          return b.birthdayDate.localeCompare(a.birthdayDate);
        case "name-asc":
          return (a.member?.name || "").localeCompare(b.member?.name || "");
        case "name-desc":
          return (b.member?.name || "").localeCompare(a.member?.name || "");
        default:
          return 0;
      }
    });

    return sorted;
  }, [activeFilter, searchQuery, sortBy, events]);

  const handleSearchClick = (): void => {
    // TODO: Implementar búsqueda
    console.log("Search clicked");
  };

  const handleNotificationsClick = (): void => {
    // TODO: Implementar notificaciones
    console.log("Notifications clicked");
  };

  const handleCreateEvent = (): void => {
    setIsCreateModalOpen(true);
  };

  const handleCreateEventSuccess = (): void => {
    // Recargar los datos
    window.location.reload();
  };

  return (
    <div className="bg-[#f8faf8] h-full flex flex-col md:h-auto md:pb-0 overflow-hidden overflow-x-hidden">
      {/* Mobile Header */}
      <div className="md:hidden flex-shrink-0 sticky top-0 z-30">
        <EventsHeader
          onSearchClick={handleSearchClick}
          onNotificationsClick={handleNotificationsClick}
        />
      </div>

      {/* Mobile Content Container */}
      <div className="md:hidden flex-1 flex flex-col overflow-hidden min-h-0 overflow-x-hidden">
        {/* Filters */}
        <div className="flex-shrink-0">
          <EventsFilters
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />
        </div>

        {/* Scrollable Events List */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden min-h-0">
          <EventsList events={filteredAndSortedEvents} isLoading={isLoading} />
        </div>
      </div>

      {/* Floating Action Button */}
      <button
        type="button"
        onClick={handleCreateEvent}
        className="fixed bottom-20 right-4 md:hidden h-14 w-14 bg-gray-900 rounded-full flex items-center justify-center shadow-lg hover:bg-gray-800 transition-colors z-40"
        aria-label="Crear evento"
      >
        <span className="text-white text-2xl font-light">+</span>
      </button>

      {/* Desktop Content */}
      <main className="hidden md:block pt-6 px-8 max-w-7xl mx-auto w-full overflow-x-hidden">
        <EventsDesktopHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onNotificationsClick={handleNotificationsClick}
          onCreateEvent={handleCreateEvent}
        />

        <EventsDesktopFilters
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />

        <EventsDesktopList
          events={filteredAndSortedEvents}
          isLoading={isLoading}
        />
      </main>

      {/* Create Event Modal */}
      <CreateEventModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onSuccess={handleCreateEventSuccess}
      />
    </div>
  );
}

