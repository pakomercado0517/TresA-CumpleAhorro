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
import { getMembers } from "@/lib/api-dashboard";
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

        /**
         * OPTIMIZACIÓN: Endpoint único para obtener todos los miembros con resumen
         * 
         * Se utiliza GET /api/members para obtener en una sola petición:
         * - Lista completa de miembros con información del grupo (groupName)
         * - Estado calculado de cada miembro (active/pending/inactive)
         * - Resumen calculado (totalMembers, newMembersThisWeek, birthdaysThisMonth, nextBirthday, pendingPayments)
         * 
         * Esta optimización elimina la necesidad de múltiples peticiones:
         * - Antes: 1 (getAllMembers) + 1 (getGroups) + N (getGroupEvents) + M (getEventPayments) = 2 + N + M peticiones
         * - Ahora: 1 petición única con toda la información
         * 
         * Beneficios:
         * - Reducción drástica de peticiones HTTP (de 2+N+M a solo 1)
         * - Resumen calculado en el backend (más eficiente)
         * - Estado de miembros calculado en el backend
         * - Filtrado y búsqueda en el backend (reduce datos transferidos)
         * - Datos consistentes y sincronizados
         * - Mejor experiencia de usuario (carga más rápida)
         * - Menor carga en el servidor y mejor escalabilidad
         */
        
        // Preparar query parameters para filtrado en el backend
        const monthNumber = selectedMonth ? parseInt(selectedMonth, 10) : undefined;
        
        const response = await getMembers({
          search: searchQuery.trim() || undefined, // Búsqueda en el backend
          month: monthNumber, // Filtro por mes en el backend
          includeSummary: true, // Incluir resumen calculado
        });

        // Mapear miembros a MemberListItem
        const membersList: Array<MemberListItem> = response.members.map(
          (member) => ({
            id: member.id,
            groupId: member.groupId,
            name: member.name,
            phone: member.phone,
            birthday: member.birthday,
            photoUrl: member.photoUrl || undefined,
            createdAt: member.createdAt,
            updatedAt: member.updatedAt,
            groupName: member.groupName,
            status: member.status,
          })
        );

        setMembers(membersList);

        // Establecer resumen (ya viene calculado del backend)
        if (response.summary) {
          setSummary({
            totalMembers: response.summary.totalMembers,
            newMembersThisWeek: response.summary.newMembersThisWeek,
            birthdaysThisMonth: response.summary.birthdaysThisMonth,
            nextBirthday: response.summary.nextBirthday,
            pendingPayments: response.summary.pendingPayments,
          });
        }
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
  }, [searchQuery, selectedMonth]); // Recargar cuando cambien los filtros

  // Los miembros ya vienen filtrados del backend según searchQuery y selectedMonth
  // No es necesario filtrar nuevamente en el frontend
  const filteredMembers = members;

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
