import type { ApiTimelineEventRead } from '../api/tickets';

export function selectMaxSequence(events: ApiTimelineEventRead[]): number {
  return events.length > 0 ? events[events.length - 1].sequence : 0;
}

export function selectMinSequence(events: ApiTimelineEventRead[]): number {
  return events.length > 0 ? events[0].sequence : 0;
}

export function selectPlaybackValue(playbackSequence: number | null, maxSequence: number): number {
  return playbackSequence ?? maxSequence;
}

export function selectPlaybackBanner(playbackSequence: number | null, maxSequence: number): string | null {
  if (playbackSequence === null) {
    return null;
  }

  return `回放中 t=sequence ${playbackSequence} (${playbackSequence}/${maxSequence})`;
}
