import { create } from 'zustand';
import type { ApiTimelineEventRead } from '../api/tickets';
import type { VibeTicket } from '../types/vibeTicket';
import { deriveLedgerSnapshot } from './ledgerReducer';

interface LedgerState {
  ticket: VibeTicket | null;
  events: ApiTimelineEventRead[];
  lastAppliedSequence: number;
  isLive: boolean;
  playbackSequence: number | null;

  setTicket: (ticket: VibeTicket) => void;
  addEvent: (event: ApiTimelineEventRead) => void;
  setEvents: (events: ApiTimelineEventRead[]) => void;
  setLive: (isLive: boolean) => void;
  setPlaybackSequence: (seq: number | null) => void;
  reset: () => void;
}

export const useLedgerStore = create<LedgerState>((set, get) => ({
  ticket: null,
  events: [],
  lastAppliedSequence: 0,
  isLive: false,
  playbackSequence: null,

  setTicket: (ticket) => set({ ticket }),

  addEvent: (event) => {
    const { events } = get();
    const deduped = new Map(events.map((item) => [item.sequence, item]));
    deduped.set(event.sequence, event);
    const newEvents = Array.from(deduped.values()).sort((left, right) => left.sequence - right.sequence);
    const lastContiguousSequence = computeLastContiguousSequence(newEvents);

    set({
      events: newEvents,
      lastAppliedSequence: lastContiguousSequence,
    });
  },

  setEvents: (events) => {
    const sortedEvents = [...events].sort((left, right) => left.sequence - right.sequence);
    set({
      events: sortedEvents,
      lastAppliedSequence: computeLastContiguousSequence(sortedEvents),
    });
  },

  setLive: (isLive) => set({ isLive }),

  setPlaybackSequence: (seq) => set({ playbackSequence: seq }),

  reset: () => set({
    ticket: null,
    events: [],
    lastAppliedSequence: 0,
    isLive: false,
    playbackSequence: null,
  }),
}));

export const useDerivedTicket = () => {
  const { ticket, events, playbackSequence } = useLedgerStore();

  if (!ticket) return null;

  const snapshot = deriveLedgerSnapshot(ticket, events, playbackSequence);
  return {
    ...ticket,
    vibeStage: snapshot.vibeStage,
    plan: snapshot.plan,
    evidence: snapshot.evidence,
  } satisfies VibeTicket;
};

function computeLastContiguousSequence(events: ApiTimelineEventRead[]): number {
  let expected = 1;
  for (const event of events) {
    if (event.sequence !== expected) {
      return expected - 1;
    }
    expected += 1;
  }

  return expected - 1;
}
