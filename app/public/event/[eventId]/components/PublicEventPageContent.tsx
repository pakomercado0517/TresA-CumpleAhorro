"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getPublicEvent } from "@/lib/api-dashboard";
import { PublicEventHeader } from "./PublicEventHeader";
import { PublicEventHero } from "./PublicEventHero";
import { PublicEventFinancial } from "./PublicEventFinancial";
import { PublicEventPaymentInfo } from "./PublicEventPaymentInfo";
import { PublicEventStats } from "./PublicEventStats";
import { PublicEventShare } from "./PublicEventShare";
import { PublicEventFooter } from "./PublicEventFooter";

interface PublicEventData {
  event: {
    id: number;
    memberId: number;
    groupId: number;
    birthdayDate: string;
    expectedAmount: number;
    member: {
      id: number;
      name: string;
      photoUrl: string | null;
    };
  };
  group: {
    id: number;
    name: string;
    amountPerBirthday: number;
    totalMembers: number;
  };
  members: Array<{
    id: number;
    name: string;
    photoUrl: string | null;
  }>;
  payments: Array<{
    id: number;
    memberId: number;
    amount: number;
    datePaid: string;
    proofUrl: string | null;
  }>;
  summary: {
    totalPaid: number;
    totalExpected: number;
    percentageCompleted: number;
    remaining: number;
  };
  status: {
    label: string;
    value: "active" | "completed" | "pending" | "upcoming";
  };
}

export function PublicEventPageContent(): React.ReactNode {
  const params = useParams();
  const eventId = Number(params.eventId);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [eventData, setEventData] = useState<PublicEventData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadEventData = async (): Promise<void> => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getPublicEvent(eventId);
        setEventData(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Error al cargar el evento"
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (eventId) {
      loadEventData();
    }
  }, [eventId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8faf8] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#22c55e] mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando evento...</p>
        </div>
      </div>
    );
  }

  if (error || !eventData) {
    return (
      <div className="min-h-screen bg-[#f8faf8] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || "Evento no encontrado"}</p>
          <p className="text-gray-600 text-sm">
            El evento que buscas no existe o no está disponible.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8faf8]">
      <PublicEventHeader />
      <main className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <PublicEventHero
            memberName={eventData.event.member.name}
            photoUrl={eventData.event.member.photoUrl}
            birthdayDate={eventData.event.birthdayDate}
            status={eventData.status}
          />
          <div className="p-6 md:p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <PublicEventFinancial
                totalExpected={eventData.summary.totalExpected}
                totalPaid={eventData.summary.totalPaid}
                remaining={eventData.summary.remaining}
                percentageCompleted={eventData.summary.percentageCompleted}
              />
              <PublicEventPaymentInfo />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <PublicEventStats
                participantsCount={eventData.payments.length}
                totalMembers={eventData.group.totalMembers}
                amountPerPerson={eventData.group.amountPerBirthday}
              />
              <PublicEventShare eventId={eventId} />
            </div>
          </div>
        </div>
      </main>
      <PublicEventFooter />
    </div>
  );
}

