"use client";

import React, { useEffect, useState } from "react";
import { DynamicHeader } from "@/components/layout/DynamicHeader";
import { Users } from "lucide-react";
import { GroupsSearch } from "./GroupsSearch";
import { GroupsFilters } from "./GroupsFilters";
import { GroupsSummaryCards } from "./GroupsSummaryCards";
import { GroupsList } from "./GroupsList";
import { Plus } from "lucide-react";
import { GroupsDesktopControls } from "./GroupsDesktopControls";
import { GroupsTable } from "./GroupsTable";
import { CreateGroupModal } from "./CreateGroupModal";
import { EditGroupModal } from "./EditGroupModal";
import { DeleteGroupModal } from "./DeleteGroupModal";
import { getGroupsOptimized } from "@/lib/api-dashboard";
import type { GroupListItem } from "@/types/groups";

type FilterType = "all" | "active" | "completed" | "pending";

export function GroupsPageContent(): React.ReactNode {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [groupListItems, setGroupListItems] = useState<Array<GroupListItem>>(
    []
  );
  const [totalCollected, setTotalCollected] = useState<number>(0);
  const [nextCollectionDate, setNextCollectionDate] = useState<string | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [selectedGroup, setSelectedGroup] = useState<GroupListItem | null>(
    null
  );

  const loadGroupsData = async (): Promise<void> => {
    try {
      setIsLoading(true);

      /**
       * OPTIMIZACIÓN: Petición única para obtener toda la información de grupos
       *
       * Se utiliza GET /api/groups?limit=10 para obtener en una sola petición:
       * - Información básica de los grupos (id, name, amountPerBirthday, etc.)
       * - Estadísticas calculadas (memberCount, eventCount, totalExpected, totalPaid)
       * - Array completo de miembros (members[])
       * - Array completo de eventos (events[]) con totalPaid por evento
       * - Array de pagos recientes (recentPayments[])
       *
       * El parámetro limit=10 limita la respuesta a los primeros 10 grupos.
       * Próximamente se implementará filtrado adicional para otras opciones.
       *
       * Esta optimización reduce significativamente el número de peticiones HTTP:
       * - Antes: 1 + (N × 3) peticiones (getGroups + getMembers + getEvents + getPayments por grupo)
       * - Ahora: 1 petición única
       *
       * Beneficios:
       * - Menor latencia (una sola petición HTTP)
       * - Datos consistentes (todos obtenidos en el mismo momento)
       * - Mejor rendimiento y escalabilidad
       */
      const response = await getGroupsOptimized({ limit: 10 });
      const groupsData = response.groups;

      // Procesar cada grupo con los datos ya cargados
      const groupItems: Array<GroupListItem> = groupsData.map((group) => {
        // Calcular eventos completados
        let completedEvents = 0;
        let nextPaymentDate: string | null = null;
        const eventDates: Array<string> = [];

        for (const event of group.events) {
          eventDates.push(event.birthdayDate);

          const percentageCompleted =
            event.expectedAmount > 0
              ? Math.round((event.totalPaid / event.expectedAmount) * 100)
              : 0;

          if (percentageCompleted >= 100) {
            completedEvents++;
          }

          // Calcular próximo pago (próximo evento sin completar)
          if (percentageCompleted < 100) {
            const eventDate = new Date(event.birthdayDate + "T00:00:00");
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (eventDate >= today) {
              if (!nextPaymentDate || event.birthdayDate < nextPaymentDate) {
                nextPaymentDate = event.birthdayDate;
              }
            }
          }
        }

        // Calcular fecha de inicio (primer evento)
        const startDate =
          eventDates.length > 0 ? [...eventDates].sort()[0] : null;

        // Calcular progreso general (eventos completados / total eventos)
        const progress =
          group.eventCount > 0
            ? Math.round((completedEvents / group.eventCount) * 100)
            : 0;

        // Determinar estado del grupo
        let status: "active" | "pending" | "completed";
        if (progress === 100) {
          status = "completed";
        } else if (progress > 0) {
          status = "active";
        } else {
          status = "pending";
        }

        // Determinar frecuencia de pago basado en el monto
        const frequency = group.amountPerBirthday >= 500 ? "quincena" : "mes";

        // Generar ID formateado (#GRP-YYYY-XXX)
        const year = new Date().getFullYear();
        const paddedId = String(group.id).padStart(3, "0");
        const groupId = `#GRP-${year}-${paddedId}`;

        return {
          id: group.id,
          name: group.name,
          memberCount: group.memberCount,
          amountPerPeriod: group.amountPerBirthday,
          frequency,
          progress,
          completedEvents,
          totalEvents: group.eventCount,
          nextPaymentDate,
          startDate,
          totalCollected: group.totalPaid,
          status,
          groupId,
        };
      });

      // Calcular totales
      const totalCollectedAmount = groupsData.reduce(
        (sum, group) => sum + group.totalPaid,
        0
      );

      // Calcular próxima fecha de cobro (la más cercana de todos los grupos)
      const nextDates = groupItems
        .map((item) => item.nextPaymentDate)
        .filter((date): date is string => date !== null)
        .sort();

      setGroupListItems(groupItems);
      setTotalCollected(totalCollectedAmount);
      setNextCollectionDate(nextDates.length > 0 ? nextDates[0] : null);
    } catch {
      // Handle error silently or show user-friendly message
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadGroupsData();
  }, []);

  const handleCreateSuccess = (): void => {
    loadGroupsData();
  };

  const handleEditGroup = (group: GroupListItem): void => {
    setSelectedGroup(group);
    setIsEditModalOpen(true);
  };

  const handleDeleteGroup = (group: GroupListItem): void => {
    setSelectedGroup(group);
    setIsDeleteModalOpen(true);
  };

  const handleEditSuccess = (): void => {
    loadGroupsData();
    setSelectedGroup(null);
  };

  const handleDeleteSuccess = (): void => {
    loadGroupsData();
    setSelectedGroup(null);
  };

  // Filtrar grupos por búsqueda
  const filteredGroups = groupListItems.filter((group) => {
    const matchesSearch = group.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesFilter =
      activeFilter === "all" || group.status === activeFilter;
    return matchesSearch && matchesFilter;
  });

  // Paginación
  const totalPages = Math.ceil(filteredGroups.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedGroups = filteredGroups.slice(startIndex, endIndex);

  // Calcular estadísticas para los filtros
  const activeCount = groupListItems.filter(
    (g) => g.status === "active"
  ).length;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <DynamicHeader title="Grupos" icon={Users} />

      {/* Contenido principal */}
      <div className="flex-1 overflow-auto">
        <div className="p-4 lg:p-6 space-y-6">
          {/* Tarjetas de resumen */}
          <GroupsSummaryCards
            totalCollected={totalCollected}
            nextCollectionDate={nextCollectionDate}
          />

          {/* Búsqueda y filtros Mobile */}
          <div className="lg:hidden space-y-4">
            <GroupsSearch
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
            <GroupsFilters
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
            />
          </div>

          {/* Controles Desktop */}
          <div className="hidden lg:block">
            <GroupsDesktopControls
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onFilterClick={() => {}}
              onExportClick={() => {}}
              onCreateGroup={() => setIsCreateModalOpen(true)}
            />
          </div>

          {/* Lista de grupos */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Cargando grupos...
                </p>
              </div>
            </div>
          ) : filteredGroups.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <p className="text-muted-foreground">
                  {searchQuery || activeFilter !== "all"
                    ? "No se encontraron grupos con los filtros aplicados"
                    : "No hay grupos creados aún"}
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Vista Mobile */}
              <div className="lg:hidden">
                <GroupsList
                  groups={paginatedGroups}
                  isLoading={isLoading}
                  activeGroupsCount={activeCount}
                  onEditGroup={handleEditGroup}
                  onDeleteGroup={handleDeleteGroup}
                />
              </div>

              {/* Vista Desktop */}
              <div className="hidden lg:block">
                <GroupsTable
                  groups={paginatedGroups}
                  isLoading={isLoading}
                  currentPage={currentPage}
                  itemsPerPage={itemsPerPage}
                  totalItems={filteredGroups.length}
                  onPageChange={setCurrentPage}
                  onEditGroup={handleEditGroup}
                  onDeleteGroup={handleDeleteGroup}
                />
              </div>

              {/* Paginación */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-6">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 rounded-md border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent"
                  >
                    Anterior
                  </button>
                  <span className="text-sm text-muted-foreground">
                    Página {currentPage} de {totalPages}
                  </span>
                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 rounded-md border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent"
                  >
                    Siguiente
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Botón flotante para crear grupo (Mobile) */}
      <div className="lg:hidden fixed bottom-20 right-4 z-40">
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="h-14 w-14 rounded-full bg-[#22c55e] hover:bg-[#16a34a] text-white shadow-lg flex items-center justify-center transition-all hover:scale-110"
          aria-label="Crear grupo"
        >
          <Plus className="h-6 w-6" />
        </button>
      </div>

      {/* Modales */}
      <CreateGroupModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onSuccess={handleCreateSuccess}
      />

      {selectedGroup && (
        <>
          <EditGroupModal
            open={isEditModalOpen}
            onOpenChange={setIsEditModalOpen}
            group={selectedGroup}
            onSuccess={handleEditSuccess}
          />

          <DeleteGroupModal
            open={isDeleteModalOpen}
            onOpenChange={setIsDeleteModalOpen}
            group={selectedGroup}
            onSuccess={handleDeleteSuccess}
          />
        </>
      )}
    </div>
  );
}
