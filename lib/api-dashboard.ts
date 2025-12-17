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

/**
 * Obtiene el resumen del dashboard con información optimizada
 * Utiliza GET /api/dashboard para obtener toda la información en una sola petición
 */
export async function getDashboard(options?: {
  limit?: number; // Límite de upcomingBirthdays (default: 10, max: 50)
  days?: number; // Rango de días para próximos cumpleaños (default: 30, max: 365)
  includePhotoUrl?: boolean; // Incluir campo photoUrl (default: true)
}): Promise<{
  message: string;
  summary: {
    upcomingBirthdays: number; // Total de eventos en el rango (no solo los limitados)
    paymentsToday: number; // Cantidad de pagos del día de hoy
    totalPaymentsToday: number; // Suma de montos de pagos del día de hoy
    totalGroups: number; // Total de grupos creados
  };
  upcomingBirthdays: Array<{
    id: number; // ID del evento
    eventId: number;
    memberId: number;
    name: string;
    groupName: string;
    birthdayDate: string; // "yyyy-MM-dd"
    photoUrl?: string | null; // Opcional
    paymentStatus: "paid" | "pending" | "overdue";
    expectedAmount: number;
    totalPaid?: number; // Campo opcional para verificar el cálculo del paymentStatus
  }>;
}> {
  const queryParams = new URLSearchParams();
  if (options?.limit) {
    queryParams.append("limit", options.limit.toString());
  }
  if (options?.days) {
    queryParams.append("days", options.days.toString());
  }
  if (options?.includePhotoUrl === false) {
    queryParams.append("includePhotoUrl", "false");
  }

  const endpoint = queryParams.toString()
    ? `/dashboard?${queryParams.toString()}`
    : "/dashboard";

  const response = await fetchApi<{
    message: string;
    summary: {
      upcomingBirthdays: number;
      paymentsToday: number;
      totalPaymentsToday: number;
      totalGroups: number;
    };
    upcomingBirthdays: Array<{
      id: number;
      eventId: number;
      memberId: number;
      name: string;
      groupName: string;
      birthdayDate: string;
      photoUrl?: string | null;
      paymentStatus: "paid" | "pending" | "overdue";
      expectedAmount: number;
      totalPaid?: number; // Campo opcional para verificar el cálculo del paymentStatus
    }>;
  }>(endpoint);

  return response;
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

/**
 * Obtiene todos los eventos del usuario con información completa
 * Utiliza GET /api/events?year={{año}} para obtener eventos optimizados
 */
export async function getEvents(options?: {
  year?: number;
  status?: "active" | "pending" | "completed" | "upcoming";
  search?: string;
  sortBy?: "date-asc" | "date-desc" | "name-asc" | "name-desc";
  limit?: number;
  offset?: number;
}): Promise<{
  message: string;
  events: Array<{
    id: number;
    memberId: number;
    groupId: number;
    birthdayDate: string; // "yyyy-MM-dd"
    expectedAmount: number;
    totalPaid: number;
    createdAt?: string;
    updatedAt?: string;
    group: {
      id: number;
      name?: string;
      amountPerBirthday: number;
      memberCount: number;
    };
    member: {
      id: number;
      groupId: number;
      name: string;
      phone?: string;
      birthday: string; // "yyyy-MM-dd"
      photoUrl?: string | null;
    };
  }>;
}> {
  const queryParams = new URLSearchParams();
  if (options?.year) {
    queryParams.append("year", options.year.toString());
  }
  if (options?.status) {
    queryParams.append("status", options.status);
  }
  if (options?.search) {
    queryParams.append("search", options.search);
  }
  if (options?.sortBy) {
    queryParams.append("sortBy", options.sortBy);
  }
  if (options?.limit) {
    queryParams.append("limit", options.limit.toString());
  }
  if (options?.offset) {
    queryParams.append("offset", options.offset.toString());
  }

  const endpoint = queryParams.toString()
    ? `/events?${queryParams.toString()}`
    : "/events";

  const response = await fetchApi<{
    message: string;
    events: Array<{
      id: number;
      memberId: number;
      groupId: number;
      birthdayDate: string;
      expectedAmount: number;
      totalPaid: number;
      createdAt?: string;
      updatedAt?: string;
      group: {
        id: number;
        name?: string;
        amountPerBirthday: number;
        memberCount: number;
      };
      member: {
        id: number;
        groupId: number;
        name: string;
        phone?: string;
        birthday: string;
        photoUrl?: string | null;
      };
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

/**
 * Obtiene el detalle completo de un evento
 * Utiliza GET /api/events/:event_id para obtener toda la información en una sola petición
 */
/**
 * Obtiene el detalle de un evento para vista pública (sin autenticación)
 * Utiliza GET /api/public/events/:event_id
 */
export async function getPublicEvent(eventId: number): Promise<{
  message: string;
  event: {
    id: number;
    memberId: number;
    groupId: number;
    birthdayDate: string; // "yyyy-MM-dd"
    expectedAmount: number;
    member: {
      id: number;
      name: string;
      photoUrl: string | null;
    };
  };
  group: {
    id: number;
    name: string;
    amountPerBirthday: number;
    totalMembers: number;
  };
  members: Array<{
    id: number;
    name: string;
    photoUrl: string | null;
  }>;
  payments: Array<{
    id: number;
    memberId: number;
    amount: number;
    datePaid: string; // "yyyy-MM-dd"
    proofUrl: string | null;
  }>;
  summary: {
    totalPaid: number;
    totalExpected: number;
    percentageCompleted: number;
    remaining: number;
  };
  status: {
    label: string;
    value: "active" | "completed" | "pending" | "upcoming";
  };
}> {
  // Para endpoints públicos, no incluimos el token de autenticación
  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

  const response = await fetch(`${API_BASE_URL}/public/events/${eventId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error ||
        `Error al obtener evento público: ${response.statusText}`
    );
  }

  return response.json();
}

/**
 * Obtiene el detalle completo de un evento
 * Utiliza GET /api/events/:event_id para obtener toda la información en una sola petición
 */
export async function getEvent(eventId: number): Promise<{
  event: {
    id: number;
    memberId: number;
    groupId: number;
    birthdayDate: string; // "yyyy-MM-dd"
    expectedAmount: number;
    member: {
      id: number;
      name: string;
      photoUrl: string | null;
    };
  };
  group: {
    id: number;
    amountPerBirthday: number;
  };
  members: Array<{
    id: number;
    name: string;
    photoUrl: string | null;
  }>;
  payments: Array<{
    id: number;
    memberId: number;
    amount: number;
    datePaid: string; // "yyyy-MM-dd"
    proofUrl: string | null;
  }>;
  summary: {
    totalPaid: number;
    totalExpected: number;
    percentageCompleted: number;
  };
}> {
  const response = await fetchApi<{
    event: {
      id: number;
      memberId: number;
      groupId: number;
      birthdayDate: string;
      expectedAmount: number;
      member: {
        id: number;
        name: string;
        photoUrl: string | null;
      };
    };
    group: {
      id: number;
      amountPerBirthday: number;
    };
    members: Array<{
      id: number;
      name: string;
      photoUrl: string | null;
    }>;
    payments: Array<{
      id: number;
      memberId: number;
      amount: number;
      datePaid: string;
      proofUrl: string | null;
    }>;
    summary: {
      totalPaid: number;
      totalExpected: number;
      percentageCompleted: number;
    };
  }>(`/events/${eventId}`);

  return response;
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

/**
 * Obtiene todos los miembros del usuario con información completa y resumen
 * Utiliza GET /api/members con query parameters opcionales para filtrado y paginación
 */
export async function getMembers(options?: {
  search?: string;
  month?: number; // 1-12
  status?: "active" | "pending" | "inactive";
  cursor?: number; // Para paginación
  limit?: number;
  includePhone?: boolean;
  includePhotoUrl?: boolean;
  includeSummary?: boolean;
}): Promise<{
  message: string;
  members: Array<{
    id: number;
    groupId: number;
    name: string;
    phone?: string;
    birthday: string; // "yyyy-MM-dd"
    photoUrl?: string | null;
    createdAt: string; // ISO 8601
    updatedAt: string; // ISO 8601
    groupName: string;
    status: "active" | "pending" | "inactive";
  }>;
  summary?: {
    totalMembers: number;
    newMembersThisWeek: number;
    birthdaysThisMonth: number;
    nextBirthday?: {
      name: string;
      date: string; // "yyyy-MM-dd"
    };
    pendingPayments: number;
  };
}> {
  const queryParams = new URLSearchParams();
  if (options?.search) {
    queryParams.append("search", options.search);
  }
  if (options?.month) {
    queryParams.append("month", options.month.toString());
  }
  if (options?.status) {
    queryParams.append("status", options.status);
  }
  if (options?.cursor) {
    queryParams.append("cursor", options.cursor.toString());
  }
  if (options?.limit) {
    queryParams.append("limit", options.limit.toString());
  }
  if (options?.includePhone === false) {
    queryParams.append("includePhone", "false");
  }
  if (options?.includePhotoUrl === false) {
    queryParams.append("includePhotoUrl", "false");
  }
  if (options?.includeSummary === false) {
    queryParams.append("includeSummary", "false");
  }

  const endpoint = queryParams.toString()
    ? `/members?${queryParams.toString()}`
    : "/members";

  const response = await fetchApi<{
    message: string;
    members: Array<{
      id: number;
      groupId: number;
      name: string;
      phone?: string;
      birthday: string;
      photoUrl?: string | null;
      createdAt: string;
      updatedAt: string;
      groupName: string;
      status: "active" | "pending" | "inactive";
    }>;
    summary?: {
      totalMembers: number;
      newMembersThisWeek: number;
      birthdaysThisMonth: number;
      nextBirthday?: {
        name: string;
        date: string;
      };
      pendingPayments: number;
    };
  }>(endpoint);

  return response;
}

// Mantener getAllMembers por compatibilidad (deprecated)
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

/**
 * Actualiza un miembro existente
 * Utiliza PUT /api/members/:id
 */
export async function updateMember(
  memberId: number,
  data: {
    name?: string;
    phone?: string;
    birthday?: string; // Formato: "yyyy-MM-dd"
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
  }>(`/members/${memberId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return response.member;
}

/**
 * Elimina un miembro
 * Utiliza DELETE /api/members/:id
 */
export async function deleteMember(memberId: number): Promise<void> {
  await fetchApi<{
    message: string;
  }>(`/members/${memberId}`, {
    method: "DELETE",
  });
}

/**
 * Obtiene el perfil del usuario autenticado
 * Utiliza GET /api/users/me
 */
export async function getUserProfile(): Promise<{
  id: number;
  name: string;
  email: string;
  emailVerified: boolean;
  avatarUrl: string | null;
  createdAt: string;
  updatedAt: string;
}> {
  console.log("📡 [API] GET /api/users/me - Obteniendo perfil del usuario");
  const response = await fetchApi<{
    message: string;
    user: {
      id: number;
      name: string;
      email: string;
      emailVerified: boolean;
      avatarUrl: string | null;
      createdAt: string;
      updatedAt: string;
    };
  }>("/users/me", {
    method: "GET",
  });
  console.log("✅ [API] GET /api/users/me - Respuesta recibida:", response);
  return response.user;
}

/**
 * Actualiza el perfil del usuario autenticado (nombre y/o email)
 * Utiliza PUT /api/users/me
 */
export async function updateUserProfile(data: {
  name?: string;
  email?: string;
}): Promise<{
  id: number;
  name: string;
  email: string;
  emailVerified: boolean;
  avatarUrl: string | null;
  createdAt: string;
  updatedAt: string;
}> {
  console.log("📡 [API] PUT /api/users/me - Actualizando perfil");
  console.log("📤 [API] Datos a enviar:", data);
  const response = await fetchApi<{
    message: string;
    user: {
      id: number;
      name: string;
      email: string;
      emailVerified: boolean;
      avatarUrl: string | null;
      createdAt: string;
      updatedAt: string;
    };
  }>("/users/me", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  console.log("✅ [API] PUT /api/users/me - Respuesta recibida:", response);
  return response.user;
}

/**
 * Cambia la contraseña del usuario autenticado
 * Utiliza PUT /api/users/me/password
 */
export async function changeUserPassword(data: {
  oldPassword: string;
  newPassword: string;
}): Promise<{
  message: string;
}> {
  console.log("📡 [API] PUT /api/users/me/password - Cambiando contraseña");
  console.log("📤 [API] Datos a enviar (sin mostrar contraseñas):", {
    oldPassword: "***",
    newPassword: "***",
    tieneOldPassword: !!data.oldPassword,
    tieneNewPassword: !!data.newPassword,
  });
  const response = await fetchApi<{
    message: string;
  }>("/users/me/password", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  console.log(
    "✅ [API] PUT /api/users/me/password - Respuesta recibida:",
    response
  );
  return response;
}

/**
 * Actualiza el avatar del usuario autenticado
 * Utiliza PUT /api/users/me/avatar
 */
export async function updateUserAvatar(data: { avatarUrl: string }): Promise<{
  id: number;
  name: string;
  email: string;
  emailVerified: boolean;
  avatarUrl: string | null;
  createdAt: string;
  updatedAt: string;
}> {
  console.log("📡 [API] PUT /api/users/me/avatar - Actualizando avatar");
  console.log("📤 [API] Datos a enviar:", data);
  const response = await fetchApi<{
    message: string;
    user: {
      id: number;
      name: string;
      email: string;
      emailVerified: boolean;
      avatarUrl: string | null;
      createdAt: string;
      updatedAt: string;
    };
  }>("/users/me/avatar", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  console.log(
    "✅ [API] PUT /api/users/me/avatar - Respuesta recibida:",
    response
  );
  return response.user;
}

/**
 * Actualiza las preferencias del usuario (solo frontend, se guardan en localStorage)
 * Nota: Este endpoint no existe en la API, las preferencias se manejan solo en el frontend
 */
export async function updateUserPreferences(_data: {
  notifications?: {
    paymentAlerts?: boolean;
    eventReminders?: boolean;
    weeklySummary?: boolean;
  };
  language?: string;
  appearance?: "light" | "dark" | "system";
}): Promise<{
  message: string;
}> {
  // Las preferencias se guardan solo en el frontend (Zustand store)
  // Si en el futuro se implementa en el backend, aquí se haría la llamada
  // El parámetro _data está preparado para uso futuro
  return Promise.resolve({
    message: "Preferencias actualizadas (solo frontend)",
  });
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
