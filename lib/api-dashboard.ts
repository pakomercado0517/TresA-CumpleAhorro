import type { Group, Event, Payment } from "@/types/dashboard";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  // Obtener token desde Zustand storage
  let token: string | null = null;

  if (typeof window !== "undefined") {
    const authStorage = localStorage.getItem("auth-storage");
    if (authStorage) {
      try {
        const parsed = JSON.parse(authStorage);
        token = parsed.state?.token || null;
      } catch (error) {
        console.error("Error parsing auth storage:", error);
      }
    }
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...options?.headers,
      Authorization: token ? `Bearer ${token}` : "",
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Error en la petición");
  }

  return response.json();
}

export async function getGroups(): Promise<Array<Group>> {
  const response = await fetchApi<{ message: string; groups: Array<Group> }>(
    "/groups"
  );
  return response.groups;
}

export async function getGroupsOptimized(options?: {
  year?: number;
  limit?: number;
  includeMembers?: boolean;
  includeEvents?: boolean;
  includePayments?: boolean;
  paymentsLimit?: number;
}): Promise<{
  message: string;
  groups: Array<{
    id: number;
    name: string;
    amountPerBirthday: number;
    createdAt: string;
    updatedAt: string;
    memberCount: number;
    eventCount: number;
    totalExpected: number;
    totalPaid: number;
    members: Array<{
      id: number;
      name: string;
      phone?: string;
      birthday: string;
      photoUrl?: string;
    }>;
    events: Array<{
      id: number;
      memberId: number;
      memberName: string;
      birthdayDate: string;
      expectedAmount: number;
      totalPaid: number;
    }>;
    recentPayments: Array<{
      id: number;
      memberId: number;
      memberName: string;
      birthdayEventId: number;
      amount: number;
      datePaid: string;
    }>;
  }>;
}> {
  // Construir query parameters
  const queryParams = new URLSearchParams();
  if (options?.year) {
    queryParams.append("year", options.year.toString());
  }
  if (options?.limit) {
    queryParams.append("limit", options.limit.toString());
  }
  if (options?.includeMembers === false) {
    queryParams.append("includeMembers", "false");
  }
  if (options?.includeEvents === false) {
    queryParams.append("includeEvents", "false");
  }
  if (options?.includePayments === false) {
    queryParams.append("includePayments", "false");
  }
  if (options?.paymentsLimit) {
    queryParams.append("paymentsLimit", options.paymentsLimit.toString());
  }

  const endpoint = queryParams.toString()
    ? `/groups?${queryParams.toString()}`
    : "/groups";

  const response = await fetchApi<{
    message: string;
    groups: Array<{
      id: number;
      name: string;
      amountPerBirthday: number;
      createdAt: string;
      updatedAt: string;
      memberCount: number;
      eventCount: number;
      totalExpected: number;
      totalPaid: number;
      members: Array<{
        id: number;
        name: string;
        phone?: string;
        birthday: string;
        photoUrl?: string;
      }>;
      events: Array<{
        id: number;
        memberId: number;
        memberName: string;
        birthdayDate: string;
        expectedAmount: number;
        totalPaid: number;
      }>;
      recentPayments: Array<{
        id: number;
        memberId: number;
        memberName: string;
        birthdayEventId: number;
        amount: number;
        datePaid: string;
      }>;
    }>;
  }>(endpoint);

  return response;
}

export async function getGroupEvents(groupId: number): Promise<Array<Event>> {
  const response = await fetchApi<{ message: string; events: Array<Event> }>(
    `/groups/${groupId}/events`
  );

  return response.events;
}

export async function getEvent(eventId: number): Promise<Event> {
  const response = await fetchApi<{ message: string; event: Event }>(
    `/events/${eventId}`
  );

  return response.event;
}

export async function getEventPayments(eventId: number): Promise<{
  event: { id: number; expectedAmount: number; birthdayDate: string };
  payments: Array<Payment>;
  summary: {
    totalPaid: number;
    totalExpected: number;
    remaining: number;
    percentageCompleted: number;
  };
}> {
  const response = await fetchApi<{
    message: string;
    event: { id: number; expectedAmount: number; birthdayDate: string };
    payments: Array<Payment>;
    summary: {
      totalPaid: number;
      totalExpected: number;
      remaining: number;
      percentageCompleted: number;
    };
  }>(`/events/${eventId}/payments`);

  return response;
}

export async function getGroupMembers(groupId: number): Promise<
  Array<{
    id: number;
    groupId: number;
    name: string;
    phone?: string;
    birthday: string;
    photoUrl?: string;
    createdAt: string;
    updatedAt: string;
  }>
> {
  const response = await fetchApi<{
    message: string;
    members: Array<{
      id: number;
      groupId: number;
      name: string;
      phone?: string;
      birthday: string;
      photoUrl?: string;
      createdAt: string;
      updatedAt: string;
    }>;
  }>(`/groups/${groupId}/members`);
  return response.members;
}

export async function createGroup(data: {
  name: string;
  amountPerBirthday: number;
  description?: string;
}): Promise<Group> {
  const response = await fetchApi<{
    message: string;
    group: Group;
  }>("/groups", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return response.group;
}

export async function updateGroup(
  groupId: number,
  data: {
    name?: string;
    amountPerBirthday?: number;
    description?: string;
  }
): Promise<Group> {
  const response = await fetchApi<{
    message: string;
    group: Group;
  }>(`/groups/${groupId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return response.group;
}

export async function deleteGroup(groupId: number): Promise<void> {
  await fetchApi<{
    message: string;
  }>(`/groups/${groupId}`, {
    method: "DELETE",
  });
}

export async function getAllMembers(): Promise<
  Array<{
    id: number;
    groupId: number;
    name: string;
    phone?: string;
    birthday: string;
    photoUrl?: string;
    createdAt: string;
    updatedAt: string;
    groupName?: string;
  }>
> {
  const groups = await getGroups();
  const allMembers: Array<{
    id: number;
    groupId: number;
    name: string;
    phone?: string;
    birthday: string;
    photoUrl?: string;
    createdAt: string;
    updatedAt: string;
    groupName?: string;
  }> = [];

  for (const group of groups) {
    try {
      const members = await getGroupMembers(group.id);
      const membersWithGroupName = members.map((member) => ({
        ...member,
        groupName: group.name,
      }));
      allMembers.push(...membersWithGroupName);
    } catch {
      // Silently handle error for this group
    }
  }

  return allMembers;
}

export async function getMember(memberId: number): Promise<{
  id: number;
  groupId: number;
  name: string;
  phone?: string;
  birthday: string;
  photoUrl?: string;
  createdAt: string;
  updatedAt: string;
}> {
  const response = await fetchApi<{
    message: string;
    member: {
      id: number;
      groupId: number;
      name: string;
      phone?: string;
      birthday: string;
      photoUrl?: string;
      createdAt: string;
      updatedAt: string;
    };
  }>(`/members/${memberId}`);
  return response.member;
}

export async function getAllEvents(): Promise<
  Array<{
    id: number;
    memberId: number;
    groupId: number;
    birthdayDate: string;
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
    groupName?: string;
  }>
> {
  // Obtener todos los grupos y luego todos los eventos
  const groups = await getGroups();
  const allEvents: Array<{
    id: number;
    memberId: number;
    groupId: number;
    birthdayDate: string;
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
    groupName?: string;
  }> = [];

  for (const group of groups) {
    try {
      const events = await getGroupEvents(group.id);
      // Para cada evento, obtener la información del miembro si no está incluida
      for (const event of events) {
        if (!event.member) {
          try {
            const member = await getMember(event.memberId);
            allEvents.push({
              ...event,
              member,
              groupName: group.name,
            });
          } catch {
            allEvents.push({
              ...event,
              groupName: group.name,
            });
          }
        } else {
          allEvents.push({
            ...event,
            groupName: group.name,
          });
        }
      }
    } catch {
      // Silently handle error for this group
    }
  }

  return allEvents;
}

export async function createMember(
  groupId: number,
  data: {
    name: string;
    phone?: string;
    birthday: string; // Formato: "yyyy-MM-dd"
    photoUrl?: string;
  }
): Promise<{
  id: number;
  groupId: number;
  name: string;
  phone?: string;
  birthday: string;
  photoUrl?: string;
  createdAt: string;
  updatedAt: string;
}> {
  const response = await fetchApi<{
    message: string;
    member: {
      id: number;
      groupId: number;
      name: string;
      phone?: string;
      birthday: string;
      photoUrl?: string;
      createdAt: string;
      updatedAt: string;
    };
  }>(`/groups/${groupId}/members`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return response.member;
}

export async function generateGroupEvents(groupId: number): Promise<{
  message: string;
  eventsCreated: number;
  events: Array<Event>;
}> {
  const response = await fetchApi<{
    message: string;
    eventsCreated: number;
    events: Array<Event>;
  }>(`/groups/${groupId}/events/generate`, {
    method: "POST",
  });

  return response;
}

export async function createPayment(
  eventId: number,
  data: {
    memberId: number;
    amount: number;
    datePaid: string; // Formato: "yyyy-MM-dd"
    proofUrl?: string;
  }
): Promise<Payment> {
  const response = await fetchApi<{
    message: string;
    payment: Payment;
  }>(`/events/${eventId}/payments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return response.payment;
}

export async function deletePayment(paymentId: number): Promise<void> {
  await fetchApi<{
    message: string;
  }>(`/payments/${paymentId}`, {
    method: "DELETE",
  });
}

export async function getGroupPayments(groupId: number): Promise<{
  message: string;
  groupId: number;
  groupName: string;
  totalPayments: number;
  totalPaid: number;
  payments: Array<{
    id: number;
    birthdayEventId: number;
    memberId: number;
    amount: number;
    datePaid: string;
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
    event: {
      id: number;
      birthdayDate: string;
      expectedAmount: number;
      memberId: number;
      memberName: string;
    };
  }>;
}> {
  const response = await fetchApi<{
    message: string;
    groupId: number;
    groupName: string;
    totalPayments: number;
    totalPaid: number;
    payments: Array<{
      id: number;
      birthdayEventId: number;
      memberId: number;
      amount: number;
      datePaid: string;
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
      event: {
        id: number;
        birthdayDate: string;
        expectedAmount: number;
        memberId: number;
        memberName: string;
      };
    }>;
  }>(`/groups/${groupId}/payments`);

  return response;
}
