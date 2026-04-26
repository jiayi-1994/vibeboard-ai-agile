import { useState } from 'react';
import type { ExecutionEvidence, EvidenceNode, AgentPlan } from '../types/vibeTicket';

interface EvidenceStageProps {
  evidence: ExecutionEvidence;
  plan: AgentPlan;
}

export function EvidenceStage({ evidence, plan }: EvidenceStageProps) {
  const [expandedSteps, setExpandedSteps] = useState<Set<string>>(
    new Set(plan.steps.map(s => s.id))
  );

  const toggleStep = (stepId: string) => {
    const newExpanded = new Set(expandedSteps);
    if (newExpanded.has(stepId)) {
      newExpanded.delete(stepId);
    } else {
      newExpanded.add(stepId);
    }
    setExpandedSteps(newExpanded);
  };

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      <EvidenceSummary evidence={evidence} plan={plan} />
      
      <div className="space-y-4">
        {plan.steps.map(step => {
          const stepNodes = evidence.nodes.filter(n => n.planStepId === step.id);
          const isExpanded = expandedSteps.has(step.id);
          
          return (
            <StepEvidenceGroup
              key={step.id}
              step={step}
              nodes={stepNodes}
              isExpanded={isExpanded}
              onToggle={() => toggleStep(step.id)}
            />
          );
        })}
      </div>
    </div>
  );
}

function EvidenceSummary({ evidence, plan }: { evidence: ExecutionEvidence; plan: AgentPlan }) {
  const totalNodes = evidence.nodes.length;
  const successNodes = evidence.nodes.filter(n => n.status === 'success').length;
  const failedNodes = evidence.nodes.filter(n => n.status === 'failed').length;
  const runningNodes = evidence.nodes.filter(n => n.status === 'running').length;
  const pendingNodes = evidence.nodes.filter(n => n.status === 'pending').length;

  const completedSteps = plan.steps.filter(step => {
    const stepNodes = evidence.nodes.filter(n => n.planStepId === step.id);
    return stepNodes.length > 0 && stepNodes.every(n => n.status === 'success');
  }).length;

  return (
    <section className="border-2 border-on-surface bg-surface-container-lowest brutal-shadow">
      <div className="border-b-2 border-on-surface bg-surface-container p-3 flex items-center gap-2">
        <span className="material-symbols-outlined text-[20px]">fact_check</span>
        <h2 className="text-lg font-bold uppercase">执行证据概览</h2>
      </div>
      <div className="p-4 grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="border border-on-surface bg-surface p-3">
          <div className="text-2xl font-bold">{totalNodes}</div>
          <div className="text-xs text-on-surface-variant uppercase">总证据节点</div>
        </div>
        <div className="border border-on-surface bg-primary-container p-3">
          <div className="text-2xl font-bold text-primary">{successNodes}</div>
          <div className="text-xs text-on-surface-variant uppercase">成功</div>
        </div>
        <div className="border border-on-surface bg-error-container p-3">
          <div className="text-2xl font-bold text-error">{failedNodes}</div>
          <div className="text-xs text-on-surface-variant uppercase">失败</div>
        </div>
        <div className="border border-on-surface bg-secondary-container p-3">
          <div className="text-2xl font-bold text-secondary">{runningNodes}</div>
          <div className="text-xs text-on-surface-variant uppercase">进行中</div>
        </div>
        <div className="border border-on-surface bg-surface-variant p-3">
          <div className="text-2xl font-bold">{completedSteps} / {plan.steps.length}</div>
          <div className="text-xs text-on-surface-variant uppercase">完成步骤</div>
        </div>
      </div>
    </section>
  );
}

interface StepEvidenceGroupProps {
  step: AgentPlan['steps'][0];
  nodes: EvidenceNode[];
  isExpanded: boolean;
  onToggle: () => void;
}

function StepEvidenceGroup({ step, nodes, isExpanded, onToggle }: StepEvidenceGroupProps) {
  const allSuccess = nodes.length > 0 && nodes.every(n => n.status === 'success');
  const hasFailure = nodes.some(n => n.status === 'failed');
  const isRunning = nodes.some(n => n.status === 'running');

  const statusColor = hasFailure ? 'border-error bg-error-container' :
                      isRunning ? 'border-secondary bg-secondary-container' :
                      allSuccess ? 'border-primary bg-primary-container' :
                      'border-on-surface bg-surface-container';

  return (
    <section className={`border-2 ${statusColor} brutal-shadow`}>
      <button
        onClick={onToggle}
        className="w-full border-b-2 border-on-surface p-3 flex items-center gap-3 hover:bg-surface-variant transition-colors"
      >
        <span className="material-symbols-outlined text-[20px]">
          {isExpanded ? 'expand_more' : 'chevron_right'}
        </span>
        <div className="flex-1 text-left">
          <h3 className="font-bold text-base">{step.goal}</h3>
          <div className="text-xs text-on-surface-variant mt-1">
            {nodes.length} 个证据节点
          </div>
        </div>
        {allSuccess && (
          <span className="material-symbols-outlined text-primary text-[24px]">check_circle</span>
        )}
        {hasFailure && (
          <span className="material-symbols-outlined text-error text-[24px]">error</span>
        )}
        {isRunning && (
          <span className="material-symbols-outlined text-secondary text-[24px] animate-pulse">pending</span>
        )}
      </button>

      {isExpanded && (
        <div className="p-4 space-y-3">
          {nodes.length === 0 ? (
            <div className="text-sm text-on-surface-variant text-center py-4 border border-dashed border-on-surface">
              此步骤尚未开始执行
            </div>
          ) : (
            nodes.map(node => <EvidenceNodeCard key={node.id} node={node} />)
          )}
        </div>
      )}
    </section>
  );
}

function EvidenceNodeCard({ node }: { node: EvidenceNode }) {
  const typeIcons: Record<string, string> = {
    ui_preview: 'visibility',
    test_log: 'science',
    api_response: 'api',
    file_change: 'edit_document',
    command: 'terminal',
    agent_decision: 'psychology',
    user_correction: 'person',
    checkpoint: 'flag'
  };

  const statusColors = {
    pending: 'border-on-surface bg-surface-container',
    running: 'border-secondary bg-secondary-container',
    success: 'border-primary bg-primary-container',
    failed: 'border-error bg-error-container'
  };

  return (
    <div className={`border-2 ${statusColors[node.status]} p-3`}>
      <div className="flex items-start gap-3 mb-2">
        <div className={`w-8 h-8 border-2 border-on-surface flex items-center justify-center shrink-0
          ${node.status === 'success' ? 'bg-primary' :
            node.status === 'failed' ? 'bg-error' :
            node.status === 'running' ? 'bg-secondary' :
            'bg-surface-variant'}
        `}>
          <span className="material-symbols-outlined text-white text-[16px]">
            {typeIcons[node.type] || 'description'}
          </span>
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs bg-on-surface text-surface px-2 py-0.5 uppercase font-bold">
              {node.type.replace('_', ' ')}
            </span>
            <span className="text-xs text-on-surface-variant font-mono">{node.timestamp}</span>
            {node.requiresCheckpoint && (
              <span className="text-xs bg-primary text-white px-2 py-0.5 uppercase font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-[12px]">flag</span>
                需要检查点
              </span>
            )}
          </div>
          <div className="font-bold text-sm mb-1">{node.summary}</div>
          {node.details && (
            <div className="text-xs text-on-surface-variant">{node.details}</div>
          )}
        </div>

        <div className={`px-2 py-1 text-[10px] uppercase font-bold shrink-0
          ${node.status === 'success' ? 'bg-primary text-white' :
            node.status === 'failed' ? 'bg-error text-white' :
            node.status === 'running' ? 'bg-secondary text-white' :
            'bg-surface-variant text-on-surface'}
        `}>
          {node.status}
        </div>
      </div>

      {node.artifactPath && (
        <div className="mt-2 pt-2 border-t border-on-surface border-dashed">
          <div className="text-[10px] uppercase font-bold text-on-surface-variant mb-1">产物路径</div>
          <div className="text-xs font-mono bg-surface border border-on-surface px-2 py-1">
            {node.artifactPath}
          </div>
        </div>
      )}

      {node.status === 'failed' && node.failureReason && (
        <div className="mt-2 pt-2 border-t border-error">
          <div className="flex items-start gap-2 text-sm">
            <span className="material-symbols-outlined text-error text-[16px] mt-0.5">error</span>
            <div className="flex-1">
              <div className="font-bold text-error mb-1">失败原因</div>
              <div className="text-xs">{node.failureReason}</div>
              {node.recommendedNextStep && (
                <div className="mt-2 text-xs bg-surface border border-error p-2">
                  <span className="font-bold">建议下一步：</span> {node.recommendedNextStep}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
