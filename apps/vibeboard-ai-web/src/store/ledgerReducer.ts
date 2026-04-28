import type { ApiTimelineEventRead } from '../api/tickets';
import type { AgentPlan, EvidenceNode, ExecutionEvidence, TerminalLog, VibeStage, VibeTicket } from '../types/vibeTicket';

export interface DerivedLedgerSnapshot {
  vibeStage: VibeStage;
  plan?: AgentPlan;
  evidence?: ExecutionEvidence;
}

export function deriveLedgerSnapshot(
  ticket: VibeTicket,
  events: ApiTimelineEventRead[],
  playbackSequence: number | null
): DerivedLedgerSnapshot {
  const effectiveEvents = playbackSequence !== null
    ? events.filter((event) => event.sequence <= playbackSequence)
    : events;

  let currentStage: VibeStage = ticket.vibeStage;
  const plan = ticket.plan ? clonePlan(ticket.plan) : undefined;
  const evidenceNodes: EvidenceNode[] = [];
  const evidenceNodeById = new Map<string, number>();
  const terminalLogs: TerminalLog[] = [];

  for (const event of effectiveEvents) {
    const { kind, payload, title } = event.event;

    switch (kind) {
      case 'stage_patch': {
        if (payload.stage) {
          currentStage = payload.stage as VibeStage;
        }
        break;
      }
      case 'plan_step_status_patch': {
        if (!plan || !payload.planStepId) {
          break;
        }
        plan.steps = plan.steps.map((step) =>
          step.id === payload.planStepId
            ? {
                ...step,
                completionSignal: payload.summary || step.completionSignal,
                requiresCheckpoint: payload.requiresCheckpoint ?? step.requiresCheckpoint,
                status: payload.status,
              }
            : step
        );
        break;
      }
      case 'evidence_node_patch': {
        if (!payload.nodeId) {
          break;
        }
        const nextNode: EvidenceNode = {
          id: payload.nodeId,
          planStepId: payload.planStepId || 'implementation',
          type: payload.evidenceType || 'command',
          status: payload.status || 'success',
          timestamp: formatTime(event.createdAt),
          summary: payload.summary || title,
          details: payload.details || undefined,
          artifactPath: payload.artifactPath || undefined,
          failureReason: payload.failureReason || undefined,
          requiresCheckpoint: payload.requiresCheckpoint ?? undefined,
        };

        const existingIndex = evidenceNodeById.get(payload.nodeId);
        if (existingIndex !== undefined) {
          evidenceNodes[existingIndex] = { ...evidenceNodes[existingIndex], ...nextNode };
        } else {
          evidenceNodeById.set(payload.nodeId, evidenceNodes.length);
          evidenceNodes.push(nextNode);
        }
        break;
      }
      case 'terminal_log_append': {
        terminalLogs.push({
          time: `[${formatTime(event.createdAt)}]`,
          tag: payload.tag || '[LOG]',
          text: payload.text || title,
          tagColor: payload.tagColor ?? undefined,
          textColor: payload.textColor ?? undefined,
          active: false,
        });
        break;
      }
      case 'checkpoint': {
        evidenceNodes.push({
          id: event.id,
          planStepId: payload.planStepId || 'verification',
          type: 'checkpoint',
          status: 'success',
          timestamp: formatTime(event.createdAt),
          summary: payload.summary || title,
          details: payload.details || undefined,
          requiresCheckpoint: true,
        });
        break;
      }
      case 'command':
      case 'test':
      case 'file_write':
      case 'file_read':
      case 'preview':
      case 'decision':
      case 'comment':
      case 'plan':
      case 'error': {
        evidenceNodes.push(toLegacyEvidenceNode(event));
        break;
      }
    }
  }

  const evidence = {
    nodes: evidenceNodes,
    rawLogs: [
      ...terminalLogs,
      ...evidenceNodes.map(toTerminalLog),
    ].sort((left, right) => left.time.localeCompare(right.time)),
  } satisfies ExecutionEvidence;

  return {
    vibeStage: currentStage,
    plan,
    evidence,
  };
}

function clonePlan(plan: AgentPlan): AgentPlan {
  return {
    ...plan,
    steps: plan.steps.map((step) => ({ ...step })),
    expectedModifiedAreas: [...plan.expectedModifiedAreas],
    checkpoints: [...plan.checkpoints],
  };
}

function toLegacyEvidenceNode(event: ApiTimelineEventRead): EvidenceNode {
  const { kind, payload, title } = event.event;

  return {
    id: event.id,
    planStepId: mapLegacyPlanStep(kind),
    type: mapLegacyEvidenceType(kind),
    status: kind === 'error' ? 'failed' : 'success',
    timestamp: formatTime(event.createdAt),
    summary: title,
    details: summarizePayload(payload),
    artifactPath: findArtifactPath(payload),
    failureReason: kind === 'error' ? summarizePayload(payload) || 'Timeline event reported failure.' : undefined,
    requiresCheckpoint: kind === 'decision' || kind === 'error',
  };
}

function mapLegacyPlanStep(kind: ApiTimelineEventRead['event']['kind']): string {
  switch (kind) {
    case 'plan':
    case 'comment':
    case 'decision':
      return 'brief-sync';
    case 'file_read':
    case 'file_write':
    case 'command':
      return 'implementation';
    default:
      return 'verification';
  }
}

function mapLegacyEvidenceType(kind: ApiTimelineEventRead['event']['kind']): EvidenceNode['type'] {
  switch (kind) {
    case 'file_read':
    case 'file_write':
      return 'file_change';
    case 'test':
      return 'test_log';
    case 'preview':
      return 'ui_preview';
    case 'decision':
      return 'agent_decision';
    case 'comment':
      return 'checkpoint';
    case 'command':
      return 'command';
    case 'error':
      return 'agent_decision';
    default:
      return 'api_response';
  }
}

function toTerminalLog(node: EvidenceNode): TerminalLog {
  const tagLabels: Record<string, string> = {
    ui_preview: '[PREVIEW]',
    test_log: '[TEST]',
    api_response: '[API]',
    file_change: '[FILE]',
    command: '[CMD]',
    agent_decision: '[AGENT]',
    user_correction: '[USER]',
    checkpoint: '[CHECKPOINT]',
  };

  return {
    time: `[${node.timestamp}]`,
    tag: tagLabels[node.type] || '[EVENT]',
    text: node.details ? `${node.summary} // ${node.details}` : node.summary,
    active: node.status === 'running',
  };
}

function summarizePayload(payload: Record<string, unknown>): string | undefined {
  const prioritizedKeys = ['summary', 'stdout', 'stderr', 'message', 'path', 'url', 'command', 'text'];
  const fragments = prioritizedKeys
    .map((key) => payload[key])
    .filter((value): value is string => typeof value === 'string' && value.trim().length > 0);

  if (fragments.length > 0) {
    return fragments.join(' | ');
  }

  try {
    return Object.keys(payload).length > 0 ? JSON.stringify(payload) : undefined;
  } catch {
    return undefined;
  }
}

function findArtifactPath(payload: Record<string, unknown>): string | undefined {
  const candidates = ['path', 'artifactPath', 'url', 'command'];
  for (const key of candidates) {
    const value = payload[key];
    if (typeof value === 'string' && value.trim().length > 0) {
      return value;
    }
  }

  return undefined;
}

function formatTime(value: string): string {
  return new Date(value).toLocaleTimeString('zh-CN', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}
