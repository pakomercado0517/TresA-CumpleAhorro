"use client";

import React, { useEffect, useState } from "react";
import { GroupsHeader } from "./GroupsHeader";
import { GroupsSearch } from "./GroupsSearch";
import { GroupsFilters } from "./GroupsFilters";
import { GroupsSummaryCards } from "./GroupsSummaryCards";
import { GroupsList } from "./GroupsList";
import { GroupsDesktopHeader } from "./GroupsDesktopHeader";
import { GroupsDesktopControls } from "./GroupsDesktopControls";
import { GroupsTable } from "./GroupsTable";
import { CreateGroupModal } from "./CreateGroupModal";
import { EditGroupModal } from "./EditGroupModal";
import { DeleteGroupModal } from "./DeleteGroupModal";
import {
  getGroups,
  getGroupEvents,
  getEventPayments,
  getGroupMembers,
} from "@/lib/api-dashboard";
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

      // Obtener grupos
      const groupsData = await getGroups();

      // Para cada grupo, obtener eventos y calcular información
      const groupItemsPromises = groupsData.map(
        async (
          group
        ): Promise<{
          item: GroupListItem;
          totalPaid: number;
        }> => {
          // Validar que el grupo tenga las propiedades necesarias
          if (
            !group ||
            !group.id ||
            !group.name ||
            group.amountPerBirthday === undefined ||
            group.amountPerBirthday === null
          ) {
            // Retornar un item por defecto si el grupo no es válido
            const year = new Date().getFullYear();
            const paddedId = String(group?.id || 0).padStart(3, "0");
            const groupId = `#GRP-${year}-${paddedId}`;

            return {
              item: {
                id: group?.id || 0,
                name: group?.name || "Grupo sin nombre",
                memberCount: 0,
                amountPerPeriod: group?.amountPerBirthday || 0,
                frequency: "mes",
                progress: 0,
                completedEvents: 0,
                totalEvents: 0,
                nextPaymentDate: null,
                startDate: null,
                totalCollected: 0,
                status: "pending" as const,
                groupId,
              },
              totalPaid: 0,
            };
          }

          try {
            // Obtener miembros del grupo
            const members = await getGroupMembers(group.id);
            const memberCount = members.length;

            const events = await getGroupEvents(group.id);

            // Obtener pagos para cada evento y calcular progreso
            let completedEvents = 0;
            let nextPaymentDate: string | null = null;
            let totalPaidForGroup = 0;
            let startDate: string | null = null;
            const eventDates: Array<string> = [];

            for (const event of events) {
              try {
                const paymentsData = await getEventPayments(event.id);
                eventDates.push(event.birthdayDate);

                if (paymentsData.summary.percentageCompleted >= 100) {
                  completedEvents++;
                }

                // Calcular próximo pago (próximo evento sin completar)
                if (paymentsData.summary.percentageCompleted < 100) {
                  const eventDate = new Date(event.birthdayDate + "T00:00:00");
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);

                  if (eventDate >= today) {
                    if (
                      !nextPaymentDate ||
                      event.birthdayDate < nextPaymentDate
                    ) {
                      nextPaymentDate = event.birthdayDate;
                    }
                  }
                }

                totalPaidForGroup += paymentsData.summary.totalPaid;
              } catch {
                // Error al cargar pagos del evento
              }
            }

            // Calcular fecha de inicio (primer evento)
            if (eventDates.length > 0) {
              const sortedDates = [...eventDates].sort();
              startDate = sortedDates[0];
            }

            // Calcular progreso general (eventos completados / total eventos)
            const progress =
              events.length > 0
                ? Math.round((completedEvents / events.length) * 100)
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
            // Esto es una aproximación, podría mejorarse con datos reales
            const frequency =
              group.amountPerBirthday >= 500 ? "quincena" : "mes";

            // Generar ID formateado (#GRP-YYYY-XXX)
            const year = new Date().getFullYear();
            const paddedId = String(group.id).padStart(3, "0");
            const groupId = `#GRP-${year}-${paddedId}`;

            return {
              item: {
                id: group.id,
                name: group.name,
                memberCount: memberCount,
                amountPerPeriod: group.amountPerBirthday,
                frequency,
                progress,
                completedEvents,
                totalEvents: events.length,
                nextPaymentDate,
                startDate,
                totalCollected: totalPaidForGroup,
                status,
                groupId,
              },
              totalPaid: totalPaidForGroup,
            };
          } catch {
            // Intentar obtener al menos los miembros para mostrar el conteo
            try {
              const members = await getGroupMembers(group.id);
              const year = new Date().getFullYear();
              const paddedId = String(group.id).padStart(3, "0");
              const groupId = `#GRP-${year}-${paddedId}`;

              return {
                item: {
                  id: group.id,
                  name: group.name || "Grupo sin nombre",
                  memberCount: members.length,
                  amountPerPeriod: group.amountPerBirthday || 0,
                  frequency: "mes",
                  progress: 0,
                  completedEvents: 0,
                  totalEvents: 0,
                  nextPaymentDate: null,
                  startDate: null,
                  totalCollected: 0,
                  status: "pending" as const,
                  groupId,
                },
                totalPaid: 0,
              };
            } catch {
              const year = new Date().getFullYear();
              const paddedId = String(group?.id || 0).padStart(3, "0");
              const groupId = `#GRP-${year}-${paddedId}`;

              return {
                item: {
                  id: group?.id || 0,
                  name: group?.name || "Grupo sin nombre",
                  memberCount: 0,
                  amountPerPeriod: group?.amountPerBirthday || 0,
                  frequency: "mes",
                  progress: 0,
                  completedEvents: 0,
                  totalEvents: 0,
                  nextPaymentDate: null,
                  startDate: null,
                  totalCollected: 0,
                  status: "pending" as const,
                  groupId,
                },
                totalPaid: 0,
              };
            }
          }
        }
      );

      const results = await Promise.all(groupItemsPromises);
      const items = results.map((result) => result.item);
      const total = results.reduce((sum, result) => sum + result.totalPaid, 0);

      // Filtrar items inválidos (sin name o groupId válidos)
      const validItems = items.filter(
        (item) =>
          item.name &&
          typeof item.name === "string" &&
          item.name.trim() !== "" &&
          item.groupId &&
          typeof item.groupId === "string" &&
          item.groupId.trim() !== ""
      );

      setGroupListItems(validItems);
      setTotalCollected(total);

      // Calcular próxima fecha de cobro (la más próxima entre todos los grupos)
      const nextDates = items
        .map((item) => item.nextPaymentDate)
        .filter((date): date is string => date !== null)
        .sort();
      setNextCollectionDate(nextDates[0] || null);
    } catch {
      // Error al cargar datos de grupos
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadGroupsData();
  }, []);

  // Filtrar grupos según búsqueda y filtro activo
  const filteredGroups = groupListItems.filter((group) => {
    // Validar que las propiedades necesarias existan y sean strings no vacíos
    if (
      !group.name ||
      typeof group.name !== "string" ||
      group.name.trim() === "" ||
      !group.groupId ||
      typeof group.groupId !== "string" ||
      group.groupId.trim() === ""
    ) {
      return false;
    }

    // Filtro de búsqueda
    const matchesSearch =
      group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.groupId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (group.startDate && group.startDate.includes(searchQuery));

    // Filtro de estado
    let matchesFilter = true;
    if (activeFilter === "active") {
      matchesFilter = group.status === "active";
    } else if (activeFilter === "completed") {
      matchesFilter = group.status === "completed";
    } else if (activeFilter === "pending") {
      matchesFilter = group.status === "pending";
    }

    return matchesSearch && matchesFilter;
  });

  const activeGroupsCount = groupListItems.filter(
    (group) => group.status === "active"
  ).length;

  // Paginación
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedGroups = filteredGroups.slice(startIndex, endIndex);

  const handleFilterClick = (): void => {
    // TODO: Implementar modal de filtros avanzados
  };

  const handleExportClick = (): void => {
    // TODO: Implementar exportación
  };

  const handleCreateGroupSuccess = (): void => {
    // Recargar los datos sin recargar toda la página
    // Resetear la página a 1 para mostrar el grupo recién creado
    setCurrentPage(1);
    // Resetear filtros para asegurar que se muestre el grupo
    setActiveFilter("all");
    setSearchQuery("");
    // Recargar los datos
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
    // Recargar los datos después de editar
    loadGroupsData();
  };

  const handleDeleteSuccess = (): void => {
    // Recargar los datos después de eliminar
    loadGroupsData();
  };

  return (
    <div className="bg-[#f8faf8] pb-20 md:pb-0">
      {/* Mobile Header */}
      <div className="md:hidden">
        <GroupsHeader onCreateGroup={() => setIsCreateModalOpen(true)} />
      </div>

      <main className="pt-3 md:pt-6 px-4 md:px-8 md:max-w-7xl md:mx-auto">
        {/* Desktop Header */}
        <div className="hidden md:block">
          <GroupsDesktopHeader
            onCreateGroup={() => setIsCreateModalOpen(true)}
          />
        </div>

        {/* Desktop Controls */}
        <div className="hidden md:block">
          <GroupsDesktopControls
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onFilterClick={handleFilterClick}
            onExportClick={handleExportClick}
          />
        </div>

        {/* Mobile Search and Filters */}
        <div className="md:hidden">
          <GroupsSearch
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
          <GroupsFilters
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />
        </div>

        {/* Mobile Summary Cards */}
        <div className="md:hidden">
          <GroupsSummaryCards
            totalCollected={totalCollected}
            nextCollectionDate={nextCollectionDate}
          />
        </div>

        {/* Mobile List */}
        <div className="md:hidden">
          <GroupsList
            groups={filteredGroups}
            isLoading={isLoading}
            activeGroupsCount={activeGroupsCount}
            onEditGroup={handleEditGroup}
            onDeleteGroup={handleDeleteGroup}
          />
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block">
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
      </main>

      {/* Create Group Modal */}
      <CreateGroupModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onSuccess={handleCreateGroupSuccess}
      />

      {/* Edit Group Modal */}
      <EditGroupModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        group={selectedGroup}
        onSuccess={handleEditSuccess}
      />

      {/* Delete Group Modal */}
      <DeleteGroupModal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        group={selectedGroup}
        onSuccess={handleDeleteSuccess}
      />
    </div>
  );
}
