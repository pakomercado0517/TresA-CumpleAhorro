import type { Group, Event, Payment } from "@/types/dashboard";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

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

export async function getGroupEvents(groupId: number): Promise<Array<Event>> {
  const response = await fetchApi<{ message: string; events: Array<Event> }>(
    `/groups/${groupId}/events`
  );

  // Log para ver estructura de eventos de grupo
  console.log(`📅 Eventos del grupo ${groupId}:`, response.events);

  return response.events;
}

export async function getEvent(eventId: number): Promise<Event> {
  const response = await fetchApi<{ message: string; event: Event }>(
    `/events/${eventId}`
  );

  // Log para ver estructura de evento individual
  console.log(`📅 Evento individual ${eventId}:`, response.event);

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
    } catch (error) {
      console.error(`Error loading members for group ${group.id}:`, error);
    }
  }

  // Log para ver un ejemplo de miembro recibido
  if (allMembers.length > 0) {
    console.log("👤 Ejemplo de miembro recibido:", allMembers[0]);
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
          } catch (error) {
            console.error(
              `Error loading member ${event.memberId} for event ${event.id}:`,
              error
            );
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
    } catch (error) {
      console.error(`Error loading events for group ${group.id}:`, error);
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
  // Log para ver la petición HTTP completa
  console.log("📤 Petición HTTP para generar eventos:", {
    method: "POST",
    url: `/groups/${groupId}/events/generate`,
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer <token>", // Token agregado automáticamente
    },
    body: null, // No se envía body, solo el groupId en la URL
  });

  const response = await fetchApi<{
    message: string;
    eventsCreated: number;
    events: Array<Event>;
  }>(`/groups/${groupId}/events/generate`, {
    method: "POST",
  });

  console.log("✅ Respuesta del servidor (generateGroupEvents):", response);

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
  console.log("📤 createPayment - Datos a enviar:", {
    eventId,
    data,
    url: `/events/${eventId}/payments`,
    bodyJSON: JSON.stringify(data),
  });
  
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
  
  console.log("✅ createPayment - Respuesta del servidor:", response);
  
  return response.payment;
}

export async function deletePayment(paymentId: number): Promise<void> {
  await fetchApi<{
    message: string;
  }>(`/payments/${paymentId}`, {
    method: "DELETE",
  });
}
