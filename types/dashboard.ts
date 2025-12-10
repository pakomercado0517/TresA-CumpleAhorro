export interface DashboardSummary {
  upcomingBirthdays: number;
  paymentsToday: number;
  totalGroups: number;
}

export interface BirthdayListItem {
  id: number;
  eventId: number;
  memberId: number;
  name: string;
  groupName: string;
  birthdayDate: string; // Formato: "yyyy-MM-dd"
  photoUrl?: string;
  paymentStatus: "paid" | "pending" | "overdue";
  expectedAmount: number;
}

export interface Group {
  id: number;
  userId: number;
  name: string;
  amountPerBirthday: number;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Event {
  id: number;
  memberId: number;
  groupId: number;
  birthdayDate: string; // Formato: "yyyy-MM-dd"
  expectedAmount: number;
  createdAt: string;
  updatedAt: string;
  member?: {
    id: number;
    groupId: number;
    name: string;
    phone?: string;
    birthday: string;
    photoUrl?: string;
    createdAt: string;
    updatedAt: string;
  };
}

export interface Payment {
  id: number;
  birthdayEventId: number;
  memberId: number;
  amount: number;
  datePaid: string; // Formato: "yyyy-MM-dd"
  proofUrl?: string;
  createdAt: string;
  updatedAt: string;
  member?: {
    id: number;
    groupId: number;
    name: string;
    phone?: string;
    birthday: string;
    photoUrl?: string;
    createdAt: string;
    updatedAt: string;
  };
}

