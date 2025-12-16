"use client";

import React, { useEffect, useState } from "react";
import { SummaryCards } from "./SummaryCards";
import { BirthdayList } from "./BirthdayList";
import { BirthdayTable } from "./BirthdayTable";
import { getDashboard } from "@/lib/api-dashboard";
import type { BirthdayListItem } from "@/types/dashboard";

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

        /**
         * OPTIMIZACIÓN: Endpoint único para obtener todo el dashboard
         *
         * Se utiliza GET /api/dashboard para obtener en una sola petición:
         * - Resumen calculado (upcomingBirthdays, paymentsToday, totalPaymentsToday, totalGroups)
         * - Lista de próximos cumpleaños (ordenados por fecha, limitados a 10 por defecto)
         * - Estado de pago calculado para cada evento (paid/pending/overdue)
         *
         * Esta optimización elimina la necesidad de múltiples peticiones:
         * - Antes: 1 (getGroups) + N (getGroupEvents) + M (getEvent) + M (getEventPayments) = 1 + N + 2M peticiones
         * - Ahora: 1 petición única con toda la información
         *
         * Beneficios:
         * - Reducción drástica de peticiones HTTP (de 1+N+2M a solo 1)
         * - Resumen calculado en el backend (más eficiente)
         * - Estado de pago calculado en el backend
         * - Solo trae los próximos cumpleaños (no todos los eventos)
         * - Datos consistentes y sincronizados
         * - Mejor experiencia de usuario (carga más rápida)
         * - Menor carga en el servidor y mejor escalabilidad
         */
        const dashboardData = await getDashboard({
          limit: 10, // Límite de cumpleaños próximos a mostrar
          days: 30, // Rango de días para considerar "próximos"
          includePhotoUrl: true, // Incluir fotos de miembros
        });

        // Establecer resumen (ya viene calculado del backend)
        setSummary({
          upcomingBirthdays: dashboardData.summary.upcomingBirthdays,
          paymentsToday: dashboardData.summary.paymentsToday,
          totalGroups: dashboardData.summary.totalGroups,
          totalPaymentsToday: dashboardData.summary.totalPaymentsToday,
        });

        // Mapear cumpleaños próximos a BirthdayListItem
        const birthdayList: Array<BirthdayListItem> =
          dashboardData.upcomingBirthdays.map((birthday) => ({
            id: birthday.id,
            eventId: birthday.eventId,
            memberId: birthday.memberId,
            name: birthday.name,
            groupName: birthday.groupName,
            birthdayDate: birthday.birthdayDate,
            photoUrl: birthday.photoUrl || undefined,
            paymentStatus: birthday.paymentStatus,
            expectedAmount: birthday.expectedAmount,
          }));

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
      <div className="hidden md:block px-4 md:px-8 w-full max-w-full">
        <div className="w-full max-w-full overflow-x-auto">
          <BirthdayTable birthdays={birthdays} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}
