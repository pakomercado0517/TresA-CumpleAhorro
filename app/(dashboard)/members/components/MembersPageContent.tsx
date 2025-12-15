"use client";

import React, { useEffect, useState } from "react";
import { MembersHeader } from "./MembersHeader";
import { MembersMobileHeader } from "./MembersMobileHeader";
import { MembersDesktopHeader } from "./MembersDesktopHeader";
import { MembersMobileSummaryCards } from "./MembersMobileSummaryCards";
import { MembersSummaryCards } from "./MembersSummaryCards";
import { MembersMobileControls } from "./MembersMobileControls";
import { MembersControls } from "./MembersControls";
import { MembersMobileTable } from "./MembersMobileTable";
import { MembersTable } from "./MembersTable";
import { CreateMemberModal } from "./CreateMemberModal";
import {
  getAllMembers,
  getGroups,
  getGroupEvents,
  getEventPayments,
} from "@/lib/api-dashboard";
import type { MemberListItem, MembersSummary } from "@/types/members";

export function MembersPageContent(): React.ReactNode {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [members, setMembers] = useState<Array<MemberListItem>>([]);
  const [summary, setSummary] = useState<MembersSummary>({
    totalMembers: 0,
    newMembersThisWeek: 0,
    birthdaysThisMonth: 0,
    pendingPayments: 0,
  });
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const itemsPerPage = 10;

  useEffect(() => {
    const loadMembersData = async (): Promise<void> => {
      try {
        setIsLoading(true);
        setError(null);

        // Obtener todos los miembros
        const allMembers = await getAllMembers();

        // Obtener grupos para calcular resumen
        const groups = await getGroups();

        // Calcular resumen
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const oneWeekAgo = new Date(today);
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        const currentMonth = today.getMonth();

        let newMembersThisWeek = 0;
        let birthdaysThisMonth = 0;
        let nextBirthday: { name: string; date: string } | undefined;
        const upcomingBirthdays: Array<{ name: string; date: string }> = [];

        for (const member of allMembers) {
          // Contar nuevos miembros esta semana
          const createdAt = new Date(member.createdAt);
          if (createdAt >= oneWeekAgo) {
            newMembersThisWeek++;
          }

          // Contar cumpleaños del mes
          const birthday = new Date(member.birthday + "T00:00:00");
          if (birthday.getMonth() === currentMonth) {
            birthdaysThisMonth++;
            upcomingBirthdays.push({
              name: member.name,
              date: member.birthday,
            });
          }
        }

        // Ordenar cumpleaños y obtener el próximo
        upcomingBirthdays.sort((a, b) => a.date.localeCompare(b.date));
        if (upcomingBirthdays.length > 0) {
          nextBirthday = upcomingBirthdays[0];
        }

        // Calcular pagos pendientes
        let pendingPayments = 0;
        for (const group of groups) {
          try {
            const events = await getGroupEvents(group.id);
            for (const event of events) {
              try {
                const paymentsData = await getEventPayments(event.id);
                if (paymentsData.summary.percentageCompleted < 100) {
                  pendingPayments++;
                }
              } catch {
                // Error al cargar pagos del evento
              }
            }
          } catch {
            // Error al cargar eventos del grupo
          }
        }

        // Determinar estado de cada miembro
        const membersWithStatus: Array<MemberListItem> = allMembers.map(
          (member) => {
            // Por ahora, todos están activos. Esto se puede mejorar calculando el estado real
            const status: "active" | "pending" | "inactive" = "active";

            // TODO: Calcular estado real basado en pagos pendientes
            // Por ahora, asumimos que todos están activos

            return {
              ...member,
              status,
            };
          }
        );

        setMembers(membersWithStatus);
        setSummary({
          totalMembers: allMembers.length,
          newMembersThisWeek,
          birthdaysThisMonth,
          nextBirthday,
          pendingPayments,
        });
      } catch (error) {
        // Error al cargar datos de miembros
        console.error("❌ Error al cargar datos de miembros:", error);
        setError(
          error instanceof Error ? error.message : "Error al cargar los miembros"
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadMembersData();
  }, []);

  // Filtrar miembros según búsqueda y mes
  const filteredMembers = members.filter((member) => {
    // Validar que el miembro tenga las propiedades necesarias
    if (!member || !member.name || !member.birthday) {
      return false;
    }

    const matchesSearch =
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (member.phone?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (member.groupName?.toLowerCase() || "").includes(
        searchQuery.toLowerCase()
      );

    // Filtrar por mes de cumpleaños si está seleccionado
    if (selectedMonth) {
      try {
      const birthday = new Date(member.birthday + "T00:00:00");
      const memberMonth = String(birthday.getMonth() + 1).padStart(2, "0");
      if (memberMonth !== selectedMonth) {
          return false;
        }
      } catch {
        // Si hay error al parsear la fecha, excluir el miembro
        return false;
      }
    }

    return matchesSearch;
  });

  // Paginación
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedMembers = filteredMembers.slice(startIndex, endIndex);

  const handleCreateMember = (): void => {
    setIsCreateModalOpen(true);
  };

  const handleCreateMemberSuccess = (): void => {
    // Recargar los datos
    window.location.reload();
  };

  const handleFilterClick = (): void => {
    // TODO: Implementar modal de filtros
  };

  return (
    <div className="bg-[#f8faf8] h-full flex flex-col md:h-auto md:pb-0 overflow-hidden overflow-x-hidden">
      {/* Mobile Header - Fixed */}
      <div className="md:hidden shrink-0 sticky top-0 z-30">
        <MembersHeader onCreateMember={handleCreateMember} />
      </div>

      {/* Mobile Content Container - Flex with calculated height */}
      <div className="md:hidden flex-1 flex flex-col overflow-hidden min-h-0 overflow-x-hidden">
        {/* Fixed Content - No Scroll */}
        <div className="shrink-0 pt-2 px-4 overflow-x-hidden">
          {/* Error Message */}
          {error && (
            <div className="mb-4 rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-800">
              {error}
            </div>
          )}
          
          {/* Mobile Header Content */}
          <MembersMobileHeader
            onCreateMember={handleCreateMember}
            totalMembers={summary.totalMembers}
          />

          {/* Mobile Summary Cards */}
          <MembersMobileSummaryCards summary={summary} />

          {/* Mobile Controls */}
          <MembersMobileControls
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedMonth={selectedMonth}
            onMonthChange={setSelectedMonth}
            onFilterClick={handleFilterClick}
          />
        </div>

        {/* Scrollable Table Area - with padding bottom for BottomNavigation */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden min-h-0 px-4 pb-20">
          <MembersMobileTable
            members={paginatedMembers}
            isLoading={isLoading}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            totalItems={filteredMembers.length}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      {/* Desktop Content */}
      <main className="hidden md:block pt-6 px-8 max-w-7xl mx-auto w-full overflow-x-hidden">
        <MembersDesktopHeader
          onCreateMember={handleCreateMember}
          totalMembers={summary.totalMembers}
        />

        <MembersSummaryCards summary={summary} />

        <MembersControls
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedMonth={selectedMonth}
          onMonthChange={setSelectedMonth}
          onFilterClick={handleFilterClick}
        />

        <MembersTable
          members={paginatedMembers}
          isLoading={isLoading}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          totalItems={filteredMembers.length}
          onPageChange={setCurrentPage}
        />
      </main>

      {/* Create Member Modal */}
      <CreateMemberModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onSuccess={handleCreateMemberSuccess}
      />
    </div>
  );
}
