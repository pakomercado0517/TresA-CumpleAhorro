"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { EventDetailHeader } from "./EventDetailHeader";
import { EventInfoCard } from "./EventInfoCard";
import { EventInfoCardDesktop } from "./EventInfoCardDesktop";
import { FinancialSummaryCards } from "./FinancialSummaryCards";
import { FinancialSummaryCardsDesktop } from "./FinancialSummaryCardsDesktop";
import { ProgressSection } from "./ProgressSection";
import { ProgressSectionDesktop } from "./ProgressSectionDesktop";
import { EventActions } from "./EventActions";
import { EventActionsDesktop } from "./EventActionsDesktop";
import { MembersTable } from "./MembersTable";
import { MembersTableDesktop } from "./MembersTableDesktop";
import {
  getEvent,
  getEventPayments,
  getGroupMembers,
  getGroups,
} from "@/lib/api-dashboard";
import type { Event, Payment } from "@/types/dashboard";

interface Member {
  id: number;
  name: string;
  photoUrl?: string;
}

export function EventDetailPageContent(): React.ReactNode {
  const params = useParams();
  const router = useRouter();
  const eventId = Number(params.eventId);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [event, setEvent] = useState<Event | null>(null);
  const [payments, setPayments] = useState<Array<Payment>>([]);
  const [members, setMembers] = useState<Array<Member>>([]);
  const [summary, setSummary] = useState({
    totalPaid: 0,
    totalExpected: 0,
    percentageCompleted: 0,
  });
  const [amountPerPerson, setAmountPerPerson] = useState<number>(0);

  useEffect(() => {
    const loadEventData = async (): Promise<void> => {
      try {
        setIsLoading(true);

        // Obtener evento
        const eventData = await getEvent(eventId);
        setEvent(eventData);

        // Obtener pagos (pueden tener información del miembro con groupId)
        const paymentsData = await getEventPayments(eventId);
        setPayments(paymentsData.payments);
        
        // Usar expectedAmount del evento si está disponible, sino del summary
        const expectedAmount = eventData.expectedAmount ?? paymentsData.event.expectedAmount ?? paymentsData.summary.totalExpected;
        
        setSummary({
          totalPaid: paymentsData.summary.totalPaid,
          totalExpected: expectedAmount,
          percentageCompleted: expectedAmount > 0 
            ? Math.round((paymentsData.summary.totalPaid / expectedAmount) * 100)
            : 0,
        });

        // Intentar obtener groupId desde diferentes fuentes
        let groupId: number | undefined = eventData.groupId;
        
        // Si no viene en el evento, intentar obtenerlo de los pagos
        if (!groupId && paymentsData.payments.length > 0) {
          const paymentWithMember = paymentsData.payments.find(
            (p) => p.member?.groupId
          );
          if (paymentWithMember?.member?.groupId) {
            groupId = paymentWithMember.member.groupId;
          }
        }

        // Si aún no tenemos groupId, buscar en todos los grupos
        if (!groupId) {
          const groups = await getGroups();
          for (const group of groups) {
            try {
              const events = await getGroupEvents(group.id);
              const foundEvent = events.find((e) => e.id === eventId);
              if (foundEvent) {
                groupId = group.id;
                break;
              }
            } catch {
              // Continuar con el siguiente grupo
            }
          }
        }

        // Validar que tengamos groupId
        if (!groupId) {
          throw new Error("No se pudo determinar el grupo del evento");
        }

        // Obtener miembros del grupo
        const groupMembers = await getGroupMembers(groupId);
        setMembers(
          groupMembers.map((m) => ({
            id: m.id,
            name: m.name,
            photoUrl: m.photoUrl,
          }))
        );

        // Obtener monto por persona del grupo
        const groups = await getGroups();
        const group = groups.find((g) => g.id === groupId);
        if (group) {
          setAmountPerPerson(group.amountPerBirthday);
        }
      } catch (error) {
        console.error("Error loading event data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (eventId) {
      loadEventData();
    }
  }, [eventId]);

  const handleEditEvent = (): void => {
    // TODO: Implementar edición de evento
    console.log("Edit event clicked");
  };

  const handleDownloadPDF = (): void => {
    // TODO: Implementar descarga de PDF
    console.log("Download PDF clicked");
  };

  const handleViewPublic = (): void => {
    // TODO: Implementar vista pública
    console.log("View public clicked");
  };

  const handleShareWhatsApp = (): void => {
    // TODO: Implementar compartir por WhatsApp
    const message = encodeURIComponent(
      `¡Hola! Te invito a ver el evento: ${event?.member?.name || "Evento"}`
    );
    const url = `${window.location.origin}/events/${eventId}/public`;
    window.open(`https://wa.me/?text=${message}%20${url}`, "_blank");
  };

  const handlePaymentToggle = async (
    memberId: number,
    paid: boolean
  ): Promise<void> => {
    // TODO: Implementar toggle de pago (crear o eliminar pago)
    console.log(`Toggle payment for member ${memberId}: ${paid}`);
    // Aquí deberías llamar a la API para crear o eliminar el pago
  };

  const handleViewProof = (memberId: number): void => {
    // TODO: Implementar ver comprobante
    const payment = payments.find((p) => p.memberId === memberId);
    if (payment?.proofUrl) {
      window.open(payment.proofUrl, "_blank");
    }
  };

  const handleUploadProof = (memberId: number): void => {
    // TODO: Implementar subir comprobante
    console.log(`Upload proof for member ${memberId}`);
  };

  if (isLoading || !event) {
    return (
      <div className="bg-[#f8faf8] min-h-screen pb-20 overflow-x-hidden">
        {/* Mobile Loading */}
        <div className="md:hidden">
          <EventDetailHeader />
          <div className="px-4 pt-4">
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-lg p-4 animate-pulse"
                >
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Desktop Loading */}
        <main className="hidden md:block pt-8 px-8 max-w-7xl mx-auto w-full">
          <div className="space-y-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white rounded-lg p-6 animate-pulse"
              >
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="bg-[#f8faf8] min-h-screen pb-20 overflow-x-hidden">
      {/* Header */}
      <div className="md:hidden flex-shrink-0 sticky top-0 z-30">
        <EventDetailHeader />
      </div>

      {/* Mobile Content */}
      <div className="px-4 pt-4 md:hidden">
        {/* Title and Description */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Detalle del Cumpleaños
          </h1>
          <p className="text-sm text-gray-600">
            Gestiona toda la información del evento, pagos y participantes.
          </p>
        </div>

        {/* Event Info Card */}
        <EventInfoCard event={event} onEdit={handleEditEvent} />

        {/* Financial Summary Cards */}
        <FinancialSummaryCards
          amountPerPerson={amountPerPerson}
          totalExpected={summary.totalExpected}
          totalReceived={summary.totalPaid}
        />

        {/* Progress Section */}
        <ProgressSection
          totalReceived={summary.totalPaid}
          totalExpected={summary.totalExpected}
          percentageCompleted={summary.percentageCompleted}
        />

        {/* Event Actions */}
        <EventActions
          onDownloadPDF={handleDownloadPDF}
          onViewPublic={handleViewPublic}
          onShareWhatsApp={handleShareWhatsApp}
        />

        {/* Members Table */}
        <MembersTable
          members={members}
          payments={payments}
          onPaymentToggle={handlePaymentToggle}
          isLoading={false}
        />
      </div>

      {/* Desktop Content */}
      <main className="hidden md:block pt-8 px-8 max-w-7xl mx-auto w-full">
        {/* Title and Description */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Detalle del Cumpleaños
          </h1>
          <p className="text-base text-gray-600">
            Gestiona toda la información del evento, pagos y participantes.
          </p>
        </div>

        {/* Event Info Card */}
        <EventInfoCardDesktop event={event} onEdit={handleEditEvent} />

        {/* Financial Summary Cards - Horizontal */}
        <FinancialSummaryCardsDesktop
          amountPerPerson={amountPerPerson}
          totalExpected={summary.totalExpected}
          totalReceived={summary.totalPaid}
        />

        {/* Progress Section */}
        <ProgressSectionDesktop
          totalReceived={summary.totalPaid}
          totalExpected={summary.totalExpected}
          percentageCompleted={summary.percentageCompleted}
        />

        {/* Members Section with Actions */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900">
              Lista de Miembros
            </h3>
            <EventActionsDesktop
              onDownloadPDF={handleDownloadPDF}
              onViewPublic={handleViewPublic}
              onShareWhatsApp={handleShareWhatsApp}
            />
          </div>
        </div>

        {/* Members Table */}
        <MembersTableDesktop
          members={members}
          payments={payments}
          onPaymentToggle={handlePaymentToggle}
          onViewProof={handleViewProof}
          onUploadProof={handleUploadProof}
          isLoading={false}
        />
      </main>
    </div>
  );
}

