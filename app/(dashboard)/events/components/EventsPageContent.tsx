"use client";

import React, { useEffect, useState, useMemo } from "react";
import { DynamicHeader } from "@/components/layout/DynamicHeader";
import { Calendar } from "lucide-react";
import { EventsFilters } from "./EventsFilters";
import { EventsList } from "./EventsList";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { EventsDesktopFilters } from "./EventsDesktopFilters";
import { EventsDesktopList } from "./EventsDesktopList";
import { CreateEventModal } from "./CreateEventModal";
import { getEvents } from "@/lib/api-dashboard";
import type { EventListItem } from "@/types/events";

type FilterType = "all" | "in-progress" | "completed";
type SortType = "date-asc" | "date-desc" | "name-asc" | "name-desc";

export function EventsPageContent(): React.ReactNode {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<SortType>("date-asc");
  const [selectedYear, setSelectedYear] = useState<number | null>(new Date().getFullYear());
  const [events, setEvents] = useState<Array<EventListItem>>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const loadEventsData = async (): Promise<void> => {
      try {
        setIsLoading(true);

        /**
         * OPTIMIZACIÓN: Endpoint dedicado para eventos
         * 
         * Se utiliza GET /api/events?year={{año_seleccionado}} para obtener en una sola petición:
         * - Todos los eventos del usuario filtrados por el año seleccionado
         * - Información completa del miembro asociado a cada evento (nombre, foto, etc.)
         * - Información del grupo (amountPerBirthday, memberCount) para cada evento
         * - totalPaid calculado por evento (ya incluido en events[])
         * 
         * Esta optimización elimina la necesidad de múltiples peticiones:
         * - Antes: 1 (getAllEvents) + 1 (getGroups) + N (getGroupPayments por grupo) = 2 + N peticiones
         * - Ahora: 1 petición única con endpoint dedicado para eventos
         * 
         * El filtro year={{año_seleccionado}} permite filtrar eventos por año específico,
         * reduciendo el tamaño de la respuesta y mejorando el rendimiento.
         * 
         * Beneficios:
         * - Reducción drástica de peticiones HTTP (de 2+N a solo 1)
         * - Estructura de datos más directa y fácil de procesar
         * - Datos consistentes y sincronizados
         * - Mejor experiencia de usuario (carga más rápida)
         * - Menor carga en el servidor y mejor escalabilidad
         */
        const response = await getEvents({ 
          year: selectedYear || undefined 
        });
        const eventsData = response.events;

        // Mapear eventos de la respuesta a EventListItem
        const allEvents: Array<EventListItem> = eventsData.map((event) => {
          // Calcular porcentaje completado
          const percentageCompleted =
            event.expectedAmount > 0
              ? Math.round((event.totalPaid / event.expectedAmount) * 100)
              : 0;

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
          } else if (event.totalPaid > 0) {
            // Evento futuro con pagos
            paymentStatus = "active";
          } else {
            // Evento futuro sin pagos
            paymentStatus = "upcoming";
          }

          // Calcular memberCount basado en expectedAmount y amountPerBirthday
          const memberCount =
            event.group.amountPerBirthday > 0
              ? Math.round(event.expectedAmount / event.group.amountPerBirthday)
              : undefined;

          return {
            id: event.id,
            groupId: event.groupId,
            memberId: event.memberId,
            birthdayDate: event.birthdayDate,
            expectedAmount: event.expectedAmount,
            createdAt: event.createdAt || "",
            updatedAt: event.updatedAt || "",
            paymentStatus,
            totalPaid: event.totalPaid,
            percentageCompleted,
            memberCount,
            amountPerPerson: event.group.amountPerBirthday,
            member: {
              id: event.member.id,
              groupId: event.member.groupId,
              name: event.member.name,
              phone: event.member.phone,
              birthday: event.member.birthday,
              photoUrl: event.member.photoUrl || undefined,
              createdAt: "",
              updatedAt: "",
            },
            groupName: event.group.name,
          };
        });

        // Ordenar eventos por fecha (más próximos primero)
        allEvents.sort((a, b) => {
          return a.birthdayDate.localeCompare(b.birthdayDate);
        });

        setEvents(allEvents);
      } catch {
        // Handle error silently or show user-friendly message
      } finally {
        setIsLoading(false);
      }
    };

    loadEventsData();
  }, [selectedYear]);

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
      {/* Header */}
      <div className="flex-shrink-0 sticky top-0 z-30">
        <DynamicHeader title="Eventos" icon={Calendar} />
      </div>

      {/* Mobile Content Container */}
      <div className="md:hidden flex-1 flex flex-col overflow-hidden min-h-0 overflow-x-hidden">
        {/* Filters */}
        <div className="flex-shrink-0">
          <EventsFilters
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            selectedYear={selectedYear}
            onYearChange={setSelectedYear}
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
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900">Eventos Activos</h1>
            <div className="flex items-center gap-3">
              {/* Search Bar */}
              <div className="relative w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Buscar por nombre o fecha..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* New Event Button */}
              <button
                type="button"
                onClick={handleCreateEvent}
                className="bg-gray-900 hover:bg-gray-800 text-white flex items-center gap-2 px-4 py-2 rounded-md transition-colors"
              >
                <Plus className="h-5 w-5" />
                Nuevo Evento
              </button>
            </div>
          </div>
        </div>

        <EventsDesktopFilters
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          sortBy={sortBy}
          onSortChange={setSortBy}
          selectedYear={selectedYear}
          onYearChange={setSelectedYear}
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

