import type { Group, Event, Payment } from "@/types/dashboard";
import type { ApiError } from "@/types/auth";
import { getAuthHeaders } from "./auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    const error = data as ApiError;
    throw new Error(
      Array.isArray(error.error) ? error.error.join(", ") : error.error
    );
  }

  return data as T;
}

export async function getGroups(): Promise<Array<Group>> {
  const response = await fetchApi<{ message: string; groups: Array<Group> }>(
    "/groups"
  );
  return response.groups;
}

export async function getGroupEvents(groupId: number): Promise<Array<Event>> {
  const response = await fetchApi<{
    message: string;
    events: Array<Event>;
  }>(`/groups/${groupId}/events`);
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

