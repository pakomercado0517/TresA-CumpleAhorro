"use client";

import React, { useEffect, useState } from "react";
import { SummaryCards } from "./SummaryCards";
import { BirthdayList } from "./BirthdayList";
import { BirthdayTable } from "./BirthdayTable";
import {
  getGroups,
  getGroupEvents,
  getEventPayments,
  getEvent,
} from "@/lib/api-dashboard";
import {
  calculateDashboardSummary,
  getPaymentStatus,
} from "@/lib/dashboard-utils";
import type {
  BirthdayListItem,
  Group,
  Event,
  Payment,
} from "@/types/dashboard";

export function DashboardContent(): React.ReactNode {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [summary, setSummary] = useState({
    upcomingBirthdays: 0,
    paymentsToday: 0,
    totalGroups: 0,
    totalPaymentsToday: 0,
  });
  const [birthdays, setBirthdays] = useState<Array<BirthdayListItem>>([]);

  useEffect(() => {
    const loadDashboardData = async (): Promise<void> => {
      try {
        setIsLoading(true);

        // Obtener grupos
        const groups = await getGroups();

        // Obtener eventos de todos los grupos con información del miembro
        const allEvents: Array<Event & { groupName: string }> = [];
        for (const group of groups) {
          try {
            const events = await getGroupEvents(group.id);
            // Para cada evento, obtener información completa con miembro
            for (const event of events) {
              try {
                const fullEvent = await getEvent(event.id);
                allEvents.push({
                  ...fullEvent,
                  groupName: group.name,
                });
              } catch (error) {
                console.error(`Error loading event ${event.id}:`, error);
                // Si falla, usar el evento sin información del miembro
                allEvents.push({
                  ...event,
                  groupName: group.name,
                });
              }
            }
          } catch (error) {
            console.error(`Error loading events for group ${group.id}:`, error);
          }
        }

        // Obtener pagos de todos los eventos
        const allPayments: Array<Payment> = [];
        const todayStr = new Date().toISOString().split("T")[0];
        let totalPaymentsToday = 0;

        for (const event of allEvents) {
          try {
            const paymentsData = await getEventPayments(event.id);
            allPayments.push(...paymentsData.payments);

            // Calcular total de pagos del día
            const todayPayments = paymentsData.payments.filter(
              (p) => p.datePaid === todayStr
            );
            totalPaymentsToday += todayPayments.reduce(
              (sum, p) => sum + p.amount,
              0
            );
          } catch (error) {
            console.error(
              `Error loading payments for event ${event.id}:`,
              error
            );
          }
        }

        // Calcular resumen
        const calculatedSummary = calculateDashboardSummary(
          allEvents,
          allPayments,
          groups
        );
        setSummary({
          ...calculatedSummary,
          totalPaymentsToday,
        });

        // Crear lista de cumpleaños con información completa
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const birthdayList: Array<BirthdayListItem> = allEvents
          .map((event) => {
            const paymentStatus = getPaymentStatus(event, allPayments);
            return {
              id: event.id,
              eventId: event.id,
              memberId: event.memberId,
              name: event.member?.name || "Sin nombre",
              groupName: event.groupName,
              birthdayDate: event.birthdayDate,
              photoUrl: event.member?.photoUrl,
              paymentStatus,
              expectedAmount: event.expectedAmount,
            };
          })
          .filter((item) => {
            // Filtrar solo eventos futuros o del día de hoy
            const eventDate = new Date(item.birthdayDate + "T00:00:00");
            eventDate.setHours(0, 0, 0, 0);
            return eventDate >= today;
          })
          .sort((a, b) => {
            // Ordenar por fecha de cumpleaños (más próximos primero)
            return a.birthdayDate.localeCompare(b.birthdayDate);
          })
          .slice(0, 10); // Limitar a 10 más próximos

        setBirthdays(birthdayList);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  return (
    <div className="pb-20 md:pb-0">
      <SummaryCards
        upcomingBirthdays={summary.upcomingBirthdays}
        paymentsToday={summary.paymentsToday}
        totalGroups={summary.totalGroups}
        totalPaymentsToday={summary.totalPaymentsToday}
      />
      {/* Mobile: Lista simple */}
      <div className="md:hidden">
        <BirthdayList birthdays={birthdays} isLoading={isLoading} />
      </div>
      {/* Desktop: Tabla completa */}
      <div className="hidden md:block px-4 md:px-8">
        <BirthdayTable birthdays={birthdays} isLoading={isLoading} />
      </div>
    </div>
  );
}
