import type { components } from '../types/api.generated';

export type ApiTicketRead = components['schemas']['TicketRead'];
export type ApiTicketDetailRead = components['schemas']['TicketDetailRead'];
export type ApiTimelineEventRead = components['schemas']['TimelineEventRead'];
export type ApiTimelineEventCreate = components['schemas']['TimelineEventCreate'];
export type ApiAcceptanceCriterionRead = components['schemas']['AcceptanceCriterionRead'];
export type ApiTicketStatus = components['schemas']['TicketStatus'];
export type ApiTimelineEventEnvelope = ApiTimelineEventRead['event'];
export type ApiTimelineEventKind = ApiTimelineEventEnvelope['kind'];

export type TicketTimelineSocketMessage =
  | { type: 'timeline.connected'; ticketId: string }
  | { type: 'timeline.live'; ticketId: string }
  | { type: 'timeline.event.created'; data: ApiTimelineEventRead };

interface ListTicketsParams {
  projectId?: string;
  status?: ApiTicketStatus;
}

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    ...init,
    headers: {
      Accept: 'application/json',
      ...(init?.body ? { 'Content-Type': 'application/json' } : {}),
      ...(init?.headers || {})
    }
  });

  if (!response.ok) {
    let detail = response.statusText;
    try {
      const payload = await response.json();
      detail =
        typeof payload?.detail === 'string'
          ? payload.detail
          : JSON.stringify(payload?.detail ?? payload);
    } catch {
      // ignore JSON parse failure and fall back to status text
    }

    throw new Error(`API ${response.status}: ${detail}`);
  }

  return (await response.json()) as T;
}

export async function listTickets(params: ListTicketsParams = {}): Promise<ApiTicketRead[]> {
  const searchParams = new URLSearchParams();
  if (params.projectId) {
    searchParams.set('projectId', params.projectId);
  }
  if (params.status) {
    searchParams.set('status', params.status);
  }

  const query = searchParams.toString();
  return apiFetch<ApiTicketRead[]>(`/api/tickets/${query ? `?${query}` : ''}`);
}

export async function getTicketDetail(ticketId: string): Promise<ApiTicketDetailRead> {
  return apiFetch<ApiTicketDetailRead>(`/api/tickets/${ticketId}`);
}

export async function listTimelineEvents(ticketId: string): Promise<ApiTimelineEventRead[]> {
  return apiFetch<ApiTimelineEventRead[]>(`/api/tickets/${ticketId}/timeline-events`);
}

export async function createTimelineEvent(
  ticketId: string,
  payload: ApiTimelineEventCreate
): Promise<ApiTimelineEventRead> {
  return apiFetch<ApiTimelineEventRead>(`/api/tickets/${ticketId}/timeline-events`, {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export function openTicketTimelineSocket(ticketId: string, since?: number): WebSocket {
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const url = new URL(`${protocol}//${window.location.host}/ws/tickets/${ticketId}`);
  if (since !== undefined && since > 0) {
    url.searchParams.set('since', since.toString());
  }
  return new WebSocket(url.toString());
}

export function getTimelineEventKind(event: ApiTimelineEventRead): ApiTimelineEventKind {
  return event.event.kind;
}

export function getTimelineEventTitle(event: ApiTimelineEventRead): string {
  return event.event.title;
}

export function getTimelineEventPayload(event: ApiTimelineEventRead): ApiTimelineEventEnvelope['payload'] {
  return event.event.payload;
}
