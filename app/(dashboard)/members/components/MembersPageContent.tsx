"use client";

import React, { useEffect, useState } from "react";
import { DynamicHeader } from "@/components/layout/DynamicHeader";
import { User } from "lucide-react";
import { Plus } from "lucide-react";
import { MembersMobileSummaryCards } from "./MembersMobileSummaryCards";
import { MembersSummaryCards } from "./MembersSummaryCards";
import { MembersMobileControls } from "./MembersMobileControls";
import { MembersControls } from "./MembersControls";
import { MembersMobileTable } from "./MembersMobileTable";
import { MembersTable } from "./MembersTable";
import { CreateMemberModal } from "./CreateMemberModal";
import { EditMemberModal } from "./EditMemberModal";
import { getMembers, deleteMember } from "@/lib/api-dashboard";
import type { MemberListItem, MembersSummary } from "@/types/members";

export function MembersPageContent(): React.ReactNode {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [members, setMembers] = useState<Array<MemberListItem>>([]);
  const [summary, setSummary] = useState<MembersSummary>({
    totalMembers: 0,
    newMembersThisWeek: 0,
    birthdaysThisMonth: 0,
    pendingPayments: 0,
  });
  const [cursor, setCursor] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [selectedMember, setSelectedMember] = useState<MemberListItem | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const itemsPerPage = 20; // Default del backend

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
         * - Filtrado en el backend (search, month, status)
         * - Paginación basada en cursor (más eficiente que offset)
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
         * - Paginación basada en cursor (mejor rendimiento)
         * - Datos consistentes y sincronizados
         * - Mejor experiencia de usuario (carga más rápida)
         * - Menor carga en el servidor y mejor escalabilidad
         */
        
        // Preparar query parameters para filtrado en el backend
        const monthNumber = selectedMonth ? parseInt(selectedMonth, 10) : undefined;
        const statusFilter = selectedStatus === "all" ? undefined : (selectedStatus as "active" | "pending" | "inactive");
        
        const response = await getMembers({
          search: searchQuery.trim() || undefined, // Búsqueda por nombre de miembro o grupo
          month: monthNumber, // Filtro por mes de cumpleaños (1-12)
          status: statusFilter, // Filtro por estado (active/pending/inactive)
          cursor: cursor, // Paginación basada en cursor
          limit: itemsPerPage, // Límite de resultados (default: 20, max: 100)
          includePhone: true, // Incluir campo phone (default: true)
          includePhotoUrl: true, // Incluir campo photoUrl (default: true)
          includeSummary: true, // Incluir summary calculado (default: true)
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
        
        // Determinar si hay más resultados (si recibimos menos del límite, no hay más)
        setHasMore(membersList.length === itemsPerPage);

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
  }, [searchQuery, selectedMonth, selectedStatus, cursor]); // Recargar cuando cambien los filtros o el cursor

  // Los miembros ya vienen filtrados del backend según searchQuery, selectedMonth y selectedStatus
  // No es necesario filtrar nuevamente en el frontend
  const filteredMembers = members;

  // Handlers para paginación basada en cursor
  const handleNextPage = (): void => {
    if (hasMore) {
      setCursor(cursor + itemsPerPage);
    }
  };

  const handlePreviousPage = (): void => {
    if (cursor > 0) {
      setCursor(Math.max(0, cursor - itemsPerPage));
    }
  };

  // Resetear cursor cuando cambien los filtros
  useEffect(() => {
    setCursor(0);
  }, [searchQuery, selectedMonth, selectedStatus]);

  const handleCreateMember = (): void => {
    setIsCreateModalOpen(true);
  };

  const handleCreateMemberSuccess = (): void => {
    // Recargar los datos
    window.location.reload();
  };

  const handleEditMember = (member: MemberListItem): void => {
    setSelectedMember(member);
    setIsEditModalOpen(true);
  };

  const handleEditMemberSuccess = (): void => {
    setIsEditModalOpen(false);
    setSelectedMember(null);
    // Recargar los datos
    window.location.reload();
  };

  const handleDeleteMember = async (member: MemberListItem): Promise<void> => {
    if (!confirm(`¿Estás seguro de que deseas eliminar a ${member.name}? Esta acción no se puede deshacer.`)) {
      return;
    }

    setIsDeleting(true);
    try {
      await deleteMember(member.id);
      // Recargar los datos
      window.location.reload();
    } catch (err) {
      alert(
        err instanceof Error
          ? err.message
          : "Error al eliminar el miembro"
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-[#f8faf8] h-full flex flex-col md:h-auto md:pb-0 overflow-hidden overflow-x-hidden">
      {/* Header */}
      <div className="shrink-0 sticky top-0 z-30">
        <DynamicHeader title="Miembros" icon={User} />
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
          {/* Mobile Header - Reemplazado por DynamicHeader en la página */}
          {/* <MembersMobileHeader
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
            selectedStatus={selectedStatus}
            onStatusChange={setSelectedStatus}
          />
        </div>

        {/* Scrollable Table Area - with padding bottom for BottomNavigation */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden min-h-0 px-4 pb-20">
          <MembersMobileTable
            members={filteredMembers}
            isLoading={isLoading}
            currentPage={Math.floor(cursor / itemsPerPage) + 1}
            itemsPerPage={itemsPerPage}
            totalItems={summary.totalMembers}
            hasMore={hasMore}
            onNextPage={handleNextPage}
            onPreviousPage={handlePreviousPage}
            onEdit={handleEditMember}
            onDelete={handleDeleteMember}
            isDeleting={isDeleting}
          />
        </div>
      </div>

      {/* Desktop Content */}
      <main className="hidden md:block pt-6 px-8 max-w-7xl mx-auto w-full overflow-x-hidden">

        <MembersSummaryCards summary={summary} />

        <MembersControls
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedMonth={selectedMonth}
          onMonthChange={setSelectedMonth}
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
        />

        <MembersTable
          members={filteredMembers}
          isLoading={isLoading}
          currentPage={Math.floor(cursor / itemsPerPage) + 1}
          itemsPerPage={itemsPerPage}
          totalItems={summary.totalMembers}
          hasMore={hasMore}
          onNextPage={handleNextPage}
          onPreviousPage={handlePreviousPage}
          onEdit={handleEditMember}
          onDelete={handleDeleteMember}
          isDeleting={isDeleting}
        />
      </main>

      {/* Create Member Modal */}
      <CreateMemberModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onSuccess={handleCreateMemberSuccess}
      />

      {/* Edit Member Modal */}
      <EditMemberModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        member={selectedMember}
        onSuccess={handleEditMemberSuccess}
      />
    </div>
  );
}
