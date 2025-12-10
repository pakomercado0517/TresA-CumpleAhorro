import { format, parseISO, isAfter, isBefore, addDays, startOfToday } from "date-fns";
import { es } from "date-fns/locale";
import type { Event, Payment, Group } from "@/types/dashboard";

/**
 * Calcula el resumen del dashboard
 */
export function calculateDashboardSummary(
  events: Array<Event>,
  payments: Array<Payment>,
  groups: Array<Group>
): {
  upcomingBirthdays: number;
  paymentsToday: number;
  totalGroups: number;
} {
  const today = startOfToday();
  const next30Days = addDays(today, 30);

  // Contar cumpleaños próximos (próximos 30 días)
  const upcomingBirthdays = events.filter((event) => {
    const eventDate = parseISO(event.birthdayDate + "T00:00:00");
    return isAfter(eventDate, today) && isBefore(eventDate, next30Days);
  }).length;

  // Contar pagos del día de hoy
  const todayStr = format(today, "yyyy-MM-dd");
  const paymentsToday = payments.filter(
    (payment) => payment.datePaid === todayStr
  ).length;

  return {
    upcomingBirthdays,
    paymentsToday,
    totalGroups: groups.length,
  };
}

/**
 * Formatea la fecha para mostrar en formato corto (ej: "25 Ago")
 */
export function formatShortDate(dateString: string): string {
  const date = parseISO(dateString + "T00:00:00");
  return format(date, "dd MMM", { locale: es });
}

/**
 * Determina el estado de pago de un evento
 */
export function getPaymentStatus(
  event: Event,
  payments: Array<Payment>
): "paid" | "pending" | "overdue" {
  const eventPayments = payments.filter(
    (p) => p.birthdayEventId === event.id
  );
  const totalPaid = eventPayments.reduce((sum, p) => sum + p.amount, 0);
  const isPaid = totalPaid >= event.expectedAmount;
  const today = startOfToday();
  const eventDate = parseISO(event.birthdayDate + "T00:00:00");
  const isOverdue = isBefore(eventDate, today) && !isPaid;

  if (isPaid) return "paid";
  if (isOverdue) return "overdue";
  return "pending";
}

