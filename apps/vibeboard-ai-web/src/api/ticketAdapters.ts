import type {
  ApiAcceptanceCriterionRead,
  ApiTicketDetailRead,
  ApiTicketRead
} from './tickets';
import type {
  AcceptanceCriteria,
  AgileStatus,
  AgentPlan,
  EvidenceType,
  ExecutionEvidence,
  ReviewAcceptanceCriterion,
  ReviewHandoff,
  ReviewRisk,
  VibeStage,
  VibeTicket
} from '../types/vibeTicket';

const DEFAULT_WORKSPACE = 'apps/vibeboard-ai-web';

type TicketLike = ApiTicketRead | ApiTicketDetailRead;

export function toVibeTicketSummary(ticket: ApiTicketRead): VibeTicket {
  return {
    id: ticket.id,
    title: ticket.title,
    vibeStage: ticket.vibeStage || deriveSummaryStage(ticket.status),
    agileStatus: ticket.status as AgileStatus,
    priority: ticket.priority as 'low' | 'medium' | 'high',
    assignee: formatAssignee(ticket.assigneeType, ticket.assigneeId),
    sprint: 'Live backend sync',
    brief: buildBrief(ticket, []),
    review: shouldExposeReview(ticket.status, ticket.acceptanceScore)
      ? buildReview(ticket, [])
      : undefined,
    createdAt: ticket.createdAt,
    updatedAt: ticket.updatedAt
  };
}

export function toVibeTicketDetail(ticket: ApiTicketDetailRead): VibeTicket {
  const acceptanceCriteria = ticket.acceptanceCriteria ?? [];
  const vibeStage = ticket.vibeStage || deriveDetailStage(ticket.status, ticket.previewStatus, acceptanceCriteria);
  const plan = buildPlan(ticket, acceptanceCriteria);
  const evidence = shouldExposeEvidence(ticket.status, ticket.previewStatus)
    ? buildEvidence(ticket)
    : undefined;
  const review = shouldExposeReview(ticket.status, ticket.acceptanceScore)
    ? buildReview(ticket, acceptanceCriteria)
    : undefined;

  return {
    id: ticket.id,
    title: ticket.title,
    vibeStage,
    agileStatus: ticket.status as AgileStatus,
    priority: ticket.priority as 'low' | 'medium' | 'high',
    assignee: formatAssignee(ticket.assigneeType, ticket.assigneeId),
    sprint: 'Live backend sync',
    brief: buildBrief(ticket, acceptanceCriteria),
    plan,
    evidence,
    review,
    createdAt: ticket.createdAt,
    updatedAt: ticket.updatedAt
  };
}

function buildBrief(ticket: TicketLike, acceptanceCriteria: ApiAcceptanceCriterionRead[]) {
  const uiCriteria = mapAcceptanceCriteria(acceptanceCriteria, ticket.status);
  const previewStateText = describePreviewState(ticket.previewStatus, ticket.previewUrl);
  const branchText = ticket.branchName ? `当前工作分支为 ${ticket.branchName}。` : '当前尚未登记工作分支。';
  const description = ticket.description?.trim();
  const evidenceType: EvidenceType[] = ['api_response', 'command', 'agent_decision', 'checkpoint'];

  return {
    originalIdea: description || `该 ticket 已从 Python 后端同步，当前聚焦于“${ticket.title}”的真实状态追踪。`,
    target: ticket.title,
    expectedChange: `${branchText} ${previewStateText}`,
    acceptanceCriteria: uiCriteria,
    constraints: [
      `Ticket 状态由后端维护：${ticket.status}`,
      `验收分数使用后端 acceptanceScore：${formatScore(ticket.acceptanceScore)}/100`,
      ticket.previewUrl ? `Preview URL: ${ticket.previewUrl}` : 'Preview URL 暂未登记'
    ],
    nonGoals: [
      '当前详情页不负责直接修改 ticket 元数据',
      '当前阶段未接入 preview runtime 生命周期控制',
      '当前只消费 timeline 流，不生成 orchestrator 计划'
    ],
    targetWorkspace: ticket.branchName ? `${DEFAULT_WORKSPACE}/${ticket.branchName}` : `${DEFAULT_WORKSPACE}/live`,
    allowedScope: [
      'apps/vibeboard-ai-web/src/views/',
      'apps/vibeboard-ai-web/src/components/',
      'apps/api/src/api/routes/'
    ],
    evidenceType,
    contextPacks: [
      {
        id: `ctx-ticket-${ticket.id}`,
        name: 'Live Ticket Contract',
        description: 'REST ticket detail + websocket timeline contract',
        selected: true,
        items: [`/api/tickets/${ticket.id}`, `/ws/tickets/${ticket.id}`]
      },
      {
        id: `ctx-preview-${ticket.id}`,
        name: 'Preview Surface',
        description: 'Preview URL and backend preview status',
        selected: Boolean(ticket.previewUrl),
        items: [ticket.previewUrl || 'preview:pending', `preview-status:${ticket.previewStatus}`]
      }
    ]
  };
}

function buildPlan(
  ticket: ApiTicketDetailRead,
  acceptanceCriteria: ApiAcceptanceCriterionRead[]
): AgentPlan {
  const pendingCriteria = acceptanceCriteria.filter(item => item.status !== 'passing').length;
  const previewTracked = ticket.previewStatus !== 'idle' || Boolean(ticket.previewUrl);

  return {
    agentUnderstanding:
      ticket.description?.trim() ||
      '该工单目前只暴露后端 ticket/timeline 契约，前端通过 adapter 将其映射为现有四阶段视图。',
    steps: [
      {
        id: 'brief-sync',
        goal: '同步需求背景与执行边界',
        expectedOutput: '确认标题、描述、优先级与当前后端状态',
        completionSignal: 'Brief 面板可完整呈现 ticket 基础信息',
        risk: 'low',
        requiresCheckpoint: false
      },
      {
        id: 'implementation',
        goal:
          acceptanceCriteria.length > 0
            ? `推进 ${acceptanceCriteria.length} 条验收标准`
            : '推进 ticket 主体实现',
        expectedOutput: '状态、验收标准和执行轨迹持续更新',
        completionSignal: pendingCriteria === 0 ? '全部验收标准已通过' : '至少一条验收标准或 timeline 已被推进',
        risk: ticket.status === 'blocked' ? 'high' : 'medium',
        requiresCheckpoint: ticket.status === 'blocked' || pendingCriteria > 0
      },
      {
        id: 'verification',
        goal: previewTracked ? '汇总 preview 与 timeline 证据' : '汇总交付证据并准备审查',
        expectedOutput: '可用于 handoff 的证据摘要和终端日志',
        completionSignal: ticket.status === 'done' ? 'ticket 已进入 done 状态，可汇总最终证据' : '等待 reducer 与 timeline 事件持续补充交付证据',
        risk: ticket.previewStatus === 'failed' ? 'high' : 'low',
        requiresCheckpoint: ticket.status === 'review'
      }
    ],
    expectedModifiedAreas: [
      'Ticket core metadata (modified)',
      'Acceptance criteria status (modified)',
      'Timeline event feed (modified)',
      ...(ticket.previewUrl ? ['Preview URL registration (modified)'] : [])
    ],
    scopeRisk: ticket.status === 'blocked',
    scopeRiskReason: ticket.status === 'blocked' ? 'Ticket 当前被阻塞，需要先解除依赖或人工确认后再推进。' : undefined,
    riskLevel: ticket.status === 'blocked' ? 'high' : ticket.status === 'review' || ticket.status === 'in_progress' ? 'medium' : 'low',
    checkpoints: [
      ...(pendingCriteria > 0 ? ['存在未通过的验收标准，需要在交付前复核。'] : []),
      ...(ticket.previewStatus === 'failed' ? ['Preview 处于 failed 状态，需要先修复再继续审查。'] : []),
      ...(ticket.previewUrl ? [`Preview 已登记：${ticket.previewUrl}`] : [])
    ],
    autonomyPolicy: ticket.status === 'blocked' || ticket.status === 'review' ? 'checkpoint' : 'full',
    testStrategy: '优先依赖 acceptance criteria、preview 状态与 ledger reducer 派生视图做验证；测试与日志事件由 reducer 统一处理。'
  };
}

function buildEvidence(ticket: ApiTicketDetailRead): ExecutionEvidence {
  return {
    nodes: [],
    rawLogs: [
      {
        time: `[${formatTime(ticket.updatedAt)}]`,
        tag: '[SYSTEM]',
        text:
          ticket.status === 'in_progress' || ticket.status === 'blocked'
            ? '等待 ledger reducer 应用 timeline 事件...'
            : '当前尚无 reducer 派生证据。'
      }
    ]
  };
}

function buildReview(
  ticket: TicketLike,
  acceptanceCriteria: ApiAcceptanceCriterionRead[]
): ReviewHandoff {
  const criteriaReview = mapReviewAcceptanceCriteria(acceptanceCriteria);
  const passedCount = criteriaReview.filter(item => item.met).length;
  const totalCount = criteriaReview.length;
  const normalizedScore = formatScore(ticket.acceptanceScore);
  const acceptanceRatio = totalCount === 0 ? normalizedScore : Math.round((passedCount / totalCount) * 100);
  const hasFailure = acceptanceCriteria.some(item => item.status === 'failing');

  const overallStatus: ReviewHandoff['overallStatus'] =
    hasFailure || ticket.previewStatus === 'failed'
      ? 'fail'
      : totalCount > 0 && passedCount === totalCount
        ? 'pass'
        : ticket.status === 'done'
          ? 'conditional'
          : 'conditional';

  return {
    overallStatus,
    summary:
      overallStatus === 'pass'
        ? '当前 ticket 的后端状态、验收标准与 timeline 证据已经基本对齐，可进入交付节奏。'
        : overallStatus === 'fail'
          ? '当前 ticket 仍存在失败信号，需要先修复 preview / acceptance 问题后再交付。'
          : '当前 ticket 已具备审查基础，但仍需要补齐剩余验收项或稳定性验证。',
    briefSummary: 'Brief 来自后端 ticket detail 聚合契约。',
    planSummary: 'Plan 基础结构来自 ticket detail 与 acceptance criteria；运行时步骤状态由 ledger reducer 接管。',
    evidenceSummary: 'Evidence 与 terminal 视图由 ledger reducer 统一派生。',
    acceptanceCriteria: criteriaReview,
    qualityMetrics: {
      testCoverage: acceptanceRatio,
      codeQuality: normalizedScore,
      documentationCompleteness: ticket.description?.trim() ? 85 : 60,
      performanceBenchmark: ticket.previewStatus === 'running' || ticket.previewStatus === 'stopped' ? 92 : 76
    },
    risks: buildReviewRisks(ticket, acceptanceCriteria),
    changedFiles: [],
    contextPackDraft: {
      prompt: ticket.title,
      finalPlan: 'ticket detail 仅提供基础字段，timeline reducer 负责运行时派生。',
      keyEvidence: [],
      successfulChecks: acceptanceCriteria.filter(item => item.status === 'passing').map(item => item.text),
      conventions: ['REST ticket detail 提供基础字段', 'Timeline reducer 是事件派生字段真源']
    },
    recommendation:
      overallStatus === 'pass'
        ? 'approve'
        : overallStatus === 'fail'
          ? 'reject'
          : 'approve_with_conditions',
    nextSteps: buildNextSteps(ticket, acceptanceCriteria)
  };
}

function buildReviewRisks(ticket: TicketLike, acceptanceCriteria: ApiAcceptanceCriterionRead[]): ReviewRisk[] {
  const risks: ReviewRisk[] = [];

  if (ticket.status === 'blocked') {
    risks.push({
      severity: 'high',
      description: 'Ticket 当前为 blocked，执行链路已暂停。',
      mitigation: '先解除阻塞依赖，再继续推进 acceptance criteria 与 timeline 事件。'
    });
  }

  if (ticket.previewStatus === 'failed') {
    risks.push({
      severity: 'high',
      description: 'Preview 状态为 failed，当前交付证据不稳定。',
      mitigation: '复核 preview runtime 或相关命令输出，直到 preview 恢复可访问。'
    });
  }

  const failingCriteria = acceptanceCriteria.filter(item => item.status === 'failing');
  if (failingCriteria.length > 0) {
    risks.push({
      severity: 'medium',
      description: `存在 ${failingCriteria.length} 条 failing 的验收标准。`,
      mitigation: '逐条修复 failing criterion，并重新运行对应验证。'
    });
  }

  if (!ticket.previewUrl && (ticket.status === 'review' || ticket.status === 'done')) {
    risks.push({
      severity: 'low',
      description: '工单进入 review/done，但尚未登记 preview URL。',
      mitigation: '若需要 UI 验证，请补充 preview URL 或在 timeline 中追加替代证据。'
    });
  }

  return risks;
}

function buildNextSteps(ticket: TicketLike, acceptanceCriteria: ApiAcceptanceCriterionRead[]): string[] {
  const steps: string[] = [];
  const pendingCriteria = acceptanceCriteria.filter(item => item.status !== 'passing');
  if (pendingCriteria.length > 0) {
    steps.push(`补齐 ${pendingCriteria.length} 条未通过的验收标准。`);
  }
  if (ticket.previewStatus === 'failed') {
    steps.push('修复 preview failed 状态并补一条成功验证证据。');
  }
  if (!ticket.previewUrl) {
    steps.push('如需要前端验证，请补充 preview URL 或等价运行证据。');
  }
  if (steps.length === 0) {
    steps.push('继续观察 websocket timeline 是否有新的执行/审查事件。');
  }
  return steps;
}

function mapAcceptanceCriteria(
  acceptanceCriteria: ApiAcceptanceCriterionRead[],
  status: TicketLike['status']
): AcceptanceCriteria[] {
  const firstIncomplete = acceptanceCriteria.find(item => item.status !== 'passing')?.id;

  return acceptanceCriteria.map(item => ({
    id: item.id,
    text: item.text,
    checked: item.status === 'passing' || item.status === 'skipped',
    active:
      item.id === firstIncomplete &&
      (status === 'in_progress' || status === 'blocked' || status === 'review')
  }));
}

function mapReviewAcceptanceCriteria(
  acceptanceCriteria: ApiAcceptanceCriterionRead[]
): ReviewAcceptanceCriterion[] {
  return acceptanceCriteria.map(item => ({
    criterion: item.text,
    met: item.status === 'passing' || item.status === 'skipped',
    evidence:
      item.lastRunAt
        ? `最近一次执行时间：${formatTime(item.lastRunAt)}`
        : item.generatedCheck || '尚未记录自动化检查结果',
    gap: item.status === 'failing' || item.status === 'pending' ? item.lastError || '需要继续补齐验证。' : undefined
  }));
}

function deriveSummaryStage(status: TicketLike['status']): VibeStage {
  switch (status) {
    case 'backlog':
      return 'brief';
    case 'ready':
      return 'plan';
    case 'in_progress':
    case 'blocked':
      return 'evidence';
    case 'review':
    case 'done':
      return 'review';
    default:
      return 'brief';
  }
}

function deriveDetailStage(
  status: TicketLike['status'],
  previewStatus: TicketLike['previewStatus'],
  acceptanceCriteria: ApiAcceptanceCriterionRead[]
): VibeStage {
  if (status === 'review' || status === 'done') {
    return 'review';
  }
  if (previewStatus !== 'idle' || status === 'in_progress' || status === 'blocked') {
    return 'evidence';
  }
  if (acceptanceCriteria.length > 0 || status === 'ready') {
    return 'plan';
  }
  return 'brief';
}

function shouldExposeEvidence(
  status: TicketLike['status'],
  previewStatus: TicketLike['previewStatus']
): boolean {
  return previewStatus !== 'idle' || status === 'in_progress' || status === 'blocked';
}

function shouldExposeReview(status: TicketLike['status'], acceptanceScore: number): boolean {
  return status === 'review' || status === 'done' || acceptanceScore > 0;
}

function formatAssignee(assigneeType: TicketLike['assigneeType'], assigneeId: string | null | undefined): string {
  if (assigneeId) {
    return assigneeType ? `${assigneeType}:${assigneeId}` : assigneeId;
  }

  if (assigneeType) {
    return `${assigneeType}:unassigned`;
  }

  return 'unassigned';
}

function formatScore(score: number): number {
  return Math.round(score * 100);
}

function describePreviewState(previewStatus: TicketLike['previewStatus'], previewUrl?: string | null): string {
  if (previewUrl) {
    return `Preview 当前状态为 ${previewStatus}，地址为 ${previewUrl}。`;
  }
  return `Preview 当前状态为 ${previewStatus}。`;
}

function formatTime(value: string): string {
  return new Date(value).toLocaleTimeString('zh-CN', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}
