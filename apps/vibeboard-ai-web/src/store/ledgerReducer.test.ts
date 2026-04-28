import { describe, expect, it } from 'vitest';
import { deriveLedgerSnapshot } from './ledgerReducer';
import type { ApiTimelineEventRead } from '../api/tickets';
import { mockAuthTicket } from '../data/vibeTicketMock';

function makeEvent(overrides: Partial<ApiTimelineEventRead>): ApiTimelineEventRead {
  return {
    id: 'event-1',
    ticketId: 'ticket-1',
    agentRunId: null,
    sequence: 1,
    createdAt: '2026-04-28T10:00:00Z',
    event: {
      kind: 'command',
      title: 'Run command',
      payload: { command: 'pnpm test' },
    },
    ...overrides,
  } as ApiTimelineEventRead;
}

describe('deriveLedgerSnapshot', () => {
  it('derives stage from stage patch events', () => {
    const snapshot = deriveLedgerSnapshot(mockAuthTicket, [
      makeEvent({
        event: {
          kind: 'stage_patch',
          title: 'Move to plan',
          payload: { stage: 'plan' },
        },
      }),
    ], null);

    expect(snapshot.vibeStage).toBe('plan');
  });

  it('updates a plan step from plan step patch events', () => {
    const snapshot = deriveLedgerSnapshot(mockAuthTicket, [
      makeEvent({
        event: {
          kind: 'plan_step_status_patch',
          title: 'Implementation running',
          payload: {
            planStepId: mockAuthTicket.plan!.steps[1].id,
            status: 'running',
            summary: '正在执行实现',
          },
        },
      }),
    ], null);

    expect(snapshot.plan?.steps[1].completionSignal).toBe('正在执行实现');
    expect(snapshot.plan?.steps[1].status).toBe('running');
  });

  it('rewinds to playback sequence when requested', () => {
    const snapshot = deriveLedgerSnapshot(mockAuthTicket, [
      makeEvent({ sequence: 1, event: { kind: 'stage_patch', title: 'Plan', payload: { stage: 'plan' } } }),
      makeEvent({ sequence: 2, event: { kind: 'stage_patch', title: 'Evidence', payload: { stage: 'evidence' } } }),
    ], 1);

    expect(snapshot.vibeStage).toBe('plan');
  });

  it('folds evidence node patches into the same node', () => {
    const snapshot = deriveLedgerSnapshot(mockAuthTicket, [
      makeEvent({
        sequence: 1,
        event: {
          kind: 'evidence_node_patch',
          title: 'Node started',
          payload: {
            nodeId: 'node-1',
            status: 'running',
            planStepId: 'implementation',
            evidenceType: 'command',
          },
        },
      }),
      makeEvent({
        sequence: 2,
        event: {
          kind: 'evidence_node_patch',
          title: 'Node finished',
          payload: {
            nodeId: 'node-1',
            status: 'success',
            summary: 'tests pass',
            planStepId: 'implementation',
            evidenceType: 'command',
          },
        },
      }),
    ], null);

    expect(snapshot.evidence?.nodes).toHaveLength(1);
    expect(snapshot.evidence?.nodes[0].status).toBe('success');
    expect(snapshot.evidence?.nodes[0].summary).toBe('tests pass');
  });
});
