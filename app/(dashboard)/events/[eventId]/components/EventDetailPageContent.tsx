"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { DynamicHeader } from "@/components/layout/DynamicHeader";
import { Calendar } from "lucide-react";
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
  createPayment,
  deletePayment,
} from "@/lib/api-dashboard";
import type { Event } from "@/types/dashboard";

interface Member {
  id: number;
  name: string;
  photoUrl?: string;
}

interface EventPayment {
  id: number;
  memberId: number;
  amount: number;
  datePaid: string;
  proofUrl: string | null;
}

export function EventDetailPageContent(): React.ReactNode {
  const params = useParams();
  const router = useRouter();
  const eventId = Number(params.eventId);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [event, setEvent] = useState<Event | null>(null);
  const [payments, setPayments] = useState<Array<EventPayment>>([]);
  const [members, setMembers] = useState<Array<Member>>([]);
  const [summary, setSummary] = useState({
    totalPaid: 0,
    totalExpected: 0,
    percentageCompleted: 0,
  });
  const [amountPerPerson, setAmountPerPerson] = useState<number>(0);
  const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false);

  useEffect(() => {
    const loadEventData = async (): Promise<void> => {
      try {
        setIsLoading(true);

        /**
         * OPTIMIZACIÓN: Endpoint único para obtener todo el detalle del evento
         * 
         * Se utiliza GET /api/events/:event_id para obtener en una sola petición:
         * - Información del evento (id, memberId, groupId, birthdayDate, expectedAmount)
         * - Información del miembro del cumpleaños (id, name, photoUrl)
         * - Información del grupo (id, amountPerBirthday)
         * - Lista completa de miembros del grupo (id, name, photoUrl)
         * - Lista de pagos del evento (id, memberId, amount, datePaid, proofUrl)
         * - Resumen financiero calculado (totalPaid, totalExpected, percentageCompleted)
         * 
         * Esta optimización elimina la necesidad de múltiples peticiones:
         * - Antes: 1 (getEvent) + 1 (getEventPayments) + 1 (getGroupMembers) + 1 (getGroups) = 4 peticiones
         * - Ahora: 1 petición única con toda la información
         * 
         * Beneficios:
         * - Reducción drástica de peticiones HTTP (de 4 a solo 1)
         * - Datos consistentes y sincronizados
         * - Mejor experiencia de usuario (carga más rápida)
         * - Menor carga en el servidor y mejor escalabilidad
         */
        const eventData = await getEvent(eventId);

        // Mapear evento a la estructura esperada por el componente
        setEvent({
          id: eventData.event.id,
          memberId: eventData.event.memberId,
          groupId: eventData.event.groupId,
          birthdayDate: eventData.event.birthdayDate,
          expectedAmount: eventData.event.expectedAmount,
          createdAt: "",
          updatedAt: "",
          member: {
            id: eventData.event.member.id,
            groupId: eventData.event.groupId,
            name: eventData.event.member.name,
            phone: undefined,
            birthday: "",
            photoUrl: eventData.event.member.photoUrl || undefined,
            createdAt: "",
            updatedAt: "",
          },
        });

        // Establecer pagos
        setPayments(eventData.payments);

        // Establecer miembros
        setMembers(
          eventData.members.map((m) => ({
            id: m.id,
            name: m.name,
            photoUrl: m.photoUrl || undefined,
          }))
        );

        // Establecer resumen (ya viene calculado del backend)
        setSummary({
          totalPaid: eventData.summary.totalPaid,
          totalExpected: eventData.summary.totalExpected,
          percentageCompleted: eventData.summary.percentageCompleted,
        });

        // Establecer monto por persona
        setAmountPerPerson(eventData.group.amountPerBirthday);
      } catch {
        // Handle error silently or show user-friendly message
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
  };

  const handleDownloadPDF = (): void => {
    // TODO: Implementar descarga de PDF
  };

  const handleViewPublic = (): void => {
    // TODO: Implementar vista pública
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
    if (isProcessingPayment) {
      console.log("⏳ Ya hay un pago en proceso, ignorando...");
      return;
    }

    setIsProcessingPayment(true);
    
    try {
      if (paid) {
        // Crear pago
        const today = new Date().toISOString().split("T")[0];
        const paymentData = {
          memberId,
          amount: amountPerPerson,
          datePaid: today,
        };
        
        await createPayment(eventId, paymentData);
      } else {
        // Eliminar pago
        const payment = payments.find((p) => p.memberId === memberId);
        
        if (payment) {
          await deletePayment(payment.id);
        }
      }

      // Recargar datos del evento (una sola petición con toda la información)
      const eventData = await getEvent(eventId);
      
      setPayments(eventData.payments);
      setSummary({
        totalPaid: eventData.summary.totalPaid,
        totalExpected: eventData.summary.totalExpected,
        percentageCompleted: eventData.summary.percentageCompleted,
      });
    } catch {
      // Recargar datos para asegurar consistencia
      try {
        const eventData = await getEvent(eventId);
        setPayments(eventData.payments);
        setSummary({
          totalPaid: eventData.summary.totalPaid,
          totalExpected: eventData.summary.totalExpected,
          percentageCompleted: eventData.summary.percentageCompleted,
        });
      } catch {
        // Handle error silently
      }
    } finally {
      setIsProcessingPayment(false);
    }
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
  };

  if (isLoading || !event) {
    return (
      <div className="bg-[#f8faf8] min-h-screen pb-20 overflow-x-hidden">
        {/* Mobile Loading */}
        <div className="md:hidden">
          <DynamicHeader title="Detalle del Evento" icon={Calendar} />
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
        <DynamicHeader 
          title={event?.member?.name ? `Cumpleaños de ${event.member.name}` : "Detalle del Evento"} 
          icon={Calendar} 
        />
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
          isLoading={isProcessingPayment}
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
          isLoading={isProcessingPayment}
        />
      </main>
    </div>
  );
}

