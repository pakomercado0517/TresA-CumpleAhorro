export interface Member {
  id: number;
  groupId: number;
  name: string;
  phone?: string;
  birthday: string; // Formato: "yyyy-MM-dd"
  photoUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MemberListItem extends Member {
  groupName?: string;
  status: "active" | "pending" | "inactive";
  email?: string; // Para búsqueda, aunque no está en la API
}

export interface MembersSummary {
  totalMembers: number;
  newMembersThisWeek: number;
  birthdaysThisMonth: number;
  nextBirthday?: {
    name: string;
    date: string; // Formato: "yyyy-MM-dd"
  };
  pendingPayments: number;
}












