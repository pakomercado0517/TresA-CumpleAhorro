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

// Tipos para la respuesta optimizada de GET /api/groups
export interface GroupMemberSummary {
  id: number;
  name: string;
  phone?: string;
  birthday: string; // "yyyy-MM-dd"
  photoUrl?: string;
}

export interface GroupEventSummary {
  id: number;
  memberId: number;
  memberName: string;
  birthdayDate: string; // "yyyy-MM-dd"
  expectedAmount: number;
  totalPaid: number;
}

export interface GroupPaymentSummary {
  id: number;
  memberId: number;
  memberName: string;
  birthdayEventId: number;
  amount: number;
  datePaid: string; // "yyyy-MM-dd"
}

export interface GroupDetailedResponse {
  id: number;
  userId: number;
  name: string;
  amountPerBirthday: number;
  description?: string;
  createdAt: string;
  updatedAt: string;
  memberCount: number;
  eventCount: number;
  totalExpected: number;
  totalPaid: number;
  members: GroupMemberSummary[];
  events: GroupEventSummary[];
  recentPayments: GroupPaymentSummary[];
}

export interface ListGroupsResponse {
  message: string;
  groups: GroupDetailedResponse[];
}
