export interface GroupListItem {
  id: number;
  name: string;
  memberCount: number;
  amountPerPeriod: number;
  frequency: "mes" | "quincena";
  progress: number; // 0-100
  completedEvents: number;
  totalEvents: number;
  nextPaymentDate: string | null; // Formato: "yyyy-MM-dd"
  startDate: string | null; // Formato: "yyyy-MM-dd" - fecha del primer evento
  totalCollected: number; // Total recaudado del grupo
  status: "active" | "pending" | "completed"; // Estado del grupo
  groupId: string; // ID formateado como #GRP-YYYY-XXX
}
