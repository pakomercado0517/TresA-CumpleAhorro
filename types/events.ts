import type { Event, Payment } from "@/types/dashboard";

export interface EventListItem extends Event {
  groupName?: string;
  paymentStatus: "active" | "pending" | "completed" | "upcoming";
  totalPaid: number;
  percentageCompleted: number;
  memberCount?: number;
  amountPerPerson?: number;
}

export interface EventsByMonth {
  month: string; // "OCTUBRE 2023"
  year: number;
  monthNumber: number;
  events: Array<EventListItem>;
}










