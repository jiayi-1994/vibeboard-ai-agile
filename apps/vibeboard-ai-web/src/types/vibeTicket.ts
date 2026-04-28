export type VibeStage = 'brief' | 'plan' | 'evidence' | 'review';

export type AgileStatus = 'backlog' | 'ready' | 'in_progress' | 'review' | 'blocked' | 'done';

export type EvidenceType = 'ui_preview' | 'test_log' | 'api_response' | 'file_change' | 'command' | 'agent_decision' | 'user_correction' | 'checkpoint';

export type RiskLevel = 'low' | 'medium' | 'high';

export type AutonomyLevel = 'full' | 'checkpoint' | 'approval_required';

export interface ContextPack {
  id: string;
  name: string;
  description: string;
  selected: boolean;
  items: string[];
}

export interface AcceptanceCriteria {
  id: string;
  text: string;
  checked: boolean;
  active?: boolean;
}

export interface IdeaBrief {
  originalIdea: string;
  target: string;
  expectedChange: string;
  acceptanceCriteria: AcceptanceCriteria[];
  constraints: string[];
  nonGoals: string[];
  targetWorkspace: string;
  allowedScope: string[];
  evidenceType: EvidenceType[];
  contextPacks: ContextPack[];
}

export interface PlanStep {
  id: string;
  goal: string;
  expectedOutput: string;
  completionSignal: string;
  risk: RiskLevel;
  requiresCheckpoint: boolean;
  status?: 'pending' | 'running' | 'success' | 'failed';
}

export interface AgentPlan {
  agentUnderstanding: string;
  steps: PlanStep[];
  expectedModifiedAreas: string[];
  scopeRisk: boolean;
  scopeRiskReason?: string;
  riskLevel: RiskLevel;
  checkpoints: string[];
  autonomyPolicy: AutonomyLevel;
  testStrategy: string;
}

export interface EvidenceNode {
  id: string;
  planStepId: string;
  type: EvidenceType;
  status: 'pending' | 'running' | 'success' | 'failed';
  timestamp: string;
  summary: string;
  details?: string;
  artifactPath?: string;
  failureReason?: string;
  recommendedNextStep?: string;
  requiresCheckpoint?: boolean;
}

export interface ExecutionEvidence {
  nodes: EvidenceNode[];
  rawLogs: TerminalLog[];
}

export interface TerminalLog {
  time: string;
  tag: string;
  text: string;
  tagColor?: string;
  textColor?: string;
  active?: boolean;
}

export interface ReviewAcceptanceCriterion {
  criterion: string;
  met: boolean;
  evidence: string;
  gap?: string;
}

export interface ReviewQualityMetrics {
  testCoverage: number;
  codeQuality: number;
  documentationCompleteness: number;
  performanceBenchmark: number;
}

export interface ReviewRisk {
  severity: RiskLevel;
  description: string;
  mitigation: string;
}

export interface ReviewHandoff {
  overallStatus: 'pass' | 'conditional' | 'fail';
  summary: string;
  briefSummary: string;
  planSummary: string;
  evidenceSummary: string;
  acceptanceCriteria: ReviewAcceptanceCriterion[];
  qualityMetrics: ReviewQualityMetrics;
  risks: ReviewRisk[];
  changedFiles: string[];
  contextPackDraft: {
    prompt: string;
    finalPlan: string;
    keyEvidence: string[];
    successfulChecks: string[];
    conventions: string[];
  };
  recommendation: 'approve' | 'approve_with_conditions' | 'reject';
  nextSteps: string[];
}

export interface VibeTicket {
  id: string;
  title: string;
  vibeStage: VibeStage;
  agileStatus: AgileStatus;
  priority: 'low' | 'medium' | 'high';
  assignee: string;
  sprint: string;
  brief: IdeaBrief;
  plan?: AgentPlan;
  evidence?: ExecutionEvidence;
  review?: ReviewHandoff;
  createdAt: string;
  updatedAt: string;
}
