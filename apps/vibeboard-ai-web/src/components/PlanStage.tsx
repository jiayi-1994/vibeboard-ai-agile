import type { AgentPlan } from '../types/vibeTicket';

interface PlanStageProps {
  plan: AgentPlan;
}

export function PlanStage({ plan }: PlanStageProps) {
  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      <AgentUnderstandingSection understanding={plan.agentUnderstanding} />
      <PlanStepsSection steps={plan.steps} />
      <RiskAssessmentSection 
        riskLevel={plan.riskLevel}
        scopeRisk={plan.scopeRisk}
        scopeRiskReason={plan.scopeRiskReason}
        expectedModifiedAreas={plan.expectedModifiedAreas}
      />
      <CheckpointsSection 
        checkpoints={plan.checkpoints}
        autonomyPolicy={plan.autonomyPolicy}
      />
      <TestStrategySection strategy={plan.testStrategy} />
      <ApprovalActions />
    </div>
  );
}

function AgentUnderstandingSection({ understanding }: { understanding: string }) {
  return (
    <section className="border-2 border-on-surface bg-surface-container-lowest brutal-shadow">
      <div className="border-b-2 border-on-surface bg-surface-container p-3 flex items-center gap-2">
        <span className="material-symbols-outlined text-[20px]">psychology</span>
        <h2 className="text-lg font-bold uppercase">Agent 理解</h2>
      </div>
      <div className="p-4">
        <p className="text-sm leading-relaxed border-l-4 border-secondary pl-3 bg-surface-container p-3">
          {understanding}
        </p>
      </div>
    </section>
  );
}

function PlanStepsSection({ steps }: { steps: AgentPlan['steps'] }) {
  return (
    <section className="border-2 border-on-surface bg-surface-container-lowest brutal-shadow">
      <div className="border-b-2 border-on-surface bg-surface-container p-3 flex items-center gap-2">
        <span className="material-symbols-outlined text-[20px]">route</span>
        <h2 className="text-lg font-bold uppercase">执行步骤</h2>
        <span className="ml-auto text-xs bg-on-surface text-surface px-2 py-1 font-bold">
          {steps.length} 步骤
        </span>
      </div>
      <div className="p-4 space-y-3">
        {steps.map((step, index) => (
          <PlanStepCard key={step.id} step={step} index={index} />
        ))}
      </div>
    </section>
  );
}

function PlanStepCard({ step, index }: { step: AgentPlan['steps'][0]; index: number }) {
  const riskColors = {
    low: 'border-on-surface bg-surface',
    medium: 'border-secondary bg-secondary-container',
    high: 'border-error bg-error-container'
  };

  return (
    <div className={`border-2 ${riskColors[step.risk]} p-4`}>
      <div className="flex items-start gap-3 mb-3">
        <div className="w-8 h-8 border-2 border-on-surface bg-on-surface text-surface flex items-center justify-center font-bold shrink-0">
          {index + 1}
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-base mb-1">{step.goal}</h3>
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-[10px] px-2 py-1 uppercase font-bold
              ${step.risk === 'high' ? 'bg-error text-white' : 
                step.risk === 'medium' ? 'bg-secondary text-white' : 
                'bg-surface-variant text-on-surface'}
            `}>
              风险: {step.risk}
            </span>
            {step.requiresCheckpoint && (
              <span className="text-[10px] bg-primary text-white px-2 py-1 uppercase font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-[12px]">flag</span>
                需要检查点
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
        <div>
          <div className="font-bold text-on-surface-variant mb-1 uppercase">预期输出</div>
          <div className="border border-on-surface bg-surface p-2">
            {step.expectedOutput}
          </div>
        </div>
        <div>
          <div className="font-bold text-on-surface-variant mb-1 uppercase">完成信号</div>
          <div className="border border-on-surface bg-surface p-2">
            {step.completionSignal}
          </div>
        </div>
        <div>
          <div className="font-bold text-on-surface-variant mb-1 uppercase">步骤 ID</div>
          <div className="border border-on-surface bg-surface p-2 font-mono">
            {step.id}
          </div>
        </div>
      </div>
    </div>
  );
}

function RiskAssessmentSection({ 
  riskLevel, 
  scopeRisk, 
  scopeRiskReason,
  expectedModifiedAreas 
}: { 
  riskLevel: AgentPlan['riskLevel'];
  scopeRisk: boolean;
  scopeRiskReason?: string;
  expectedModifiedAreas: string[];
}) {
  const riskLevelColors = {
    low: 'bg-surface-variant text-on-surface',
    medium: 'bg-secondary text-white',
    high: 'bg-error text-white'
  };

  return (
    <section className="border-2 border-on-surface bg-surface-container-lowest brutal-shadow">
      <div className="border-b-2 border-on-surface bg-surface-container p-3 flex items-center gap-2">
        <span className="material-symbols-outlined text-[20px]">warning</span>
        <h2 className="text-lg font-bold uppercase">风险评估</h2>
        <span className={`ml-auto text-xs px-3 py-1 uppercase font-bold ${riskLevelColors[riskLevel]}`}>
          整体风险: {riskLevel}
        </span>
      </div>
      <div className="p-4 space-y-4">
        {scopeRisk && (
          <div className="border-2 border-error bg-error-container p-3 flex items-start gap-2">
            <span className="material-symbols-outlined text-error text-[20px] mt-0.5">error</span>
            <div className="flex-1">
              <div className="font-bold text-sm mb-1">⚠️ 作用域风险警告</div>
              <div className="text-sm">{scopeRiskReason}</div>
            </div>
          </div>
        )}

        <div>
          <h3 className="text-xs uppercase font-bold text-on-surface-variant mb-2">
            预期修改区域 ({expectedModifiedAreas.length})
          </h3>
          <div className="space-y-1">
            {expectedModifiedAreas.map((area, idx) => {
              const isNew = area.includes('(new)');
              const isModified = area.includes('(modified)');
              return (
                <div key={idx} className="flex items-center gap-2 text-sm">
                  <span className={`material-symbols-outlined text-[16px] ${isNew ? 'text-primary' : 'text-secondary'}`}>
                    {isNew ? 'add_circle' : 'edit'}
                  </span>
                  <span className="font-mono flex-1">{area.replace(/\s*\((new|modified)\)/, '')}</span>
                  <span className={`text-[10px] px-2 py-0.5 uppercase font-bold ${isNew ? 'bg-primary text-white' : 'bg-secondary text-white'}`}>
                    {isNew ? 'NEW' : 'MODIFIED'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function CheckpointsSection({ 
  checkpoints, 
  autonomyPolicy 
}: { 
  checkpoints: string[];
  autonomyPolicy: AgentPlan['autonomyPolicy'];
}) {
  const policyColors = {
    full: 'bg-primary text-white',
    checkpoint: 'bg-secondary text-white',
    approval_required: 'bg-error text-white'
  };

  const policyLabels = {
    full: '完全自主',
    checkpoint: '检查点确认',
    approval_required: '需要审批'
  };

  return (
    <section className="border-2 border-on-surface bg-surface-container-lowest brutal-shadow">
      <div className="border-b-2 border-on-surface bg-surface-container p-3 flex items-center gap-2">
        <span className="material-symbols-outlined text-[20px]">flag</span>
        <h2 className="text-lg font-bold uppercase">检查点与自主策略</h2>
        <span className={`ml-auto text-xs px-3 py-1 uppercase font-bold ${policyColors[autonomyPolicy]}`}>
          {policyLabels[autonomyPolicy]}
        </span>
      </div>
      <div className="p-4">
        {checkpoints.length > 0 ? (
          <div className="space-y-2">
            {checkpoints.map((checkpoint, idx) => (
              <div key={idx} className="flex items-start gap-2 border border-on-surface bg-surface p-3">
                <span className="material-symbols-outlined text-primary text-[20px] mt-0.5">flag</span>
                <span className="text-sm flex-1">{checkpoint}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-sm text-on-surface-variant text-center py-4 border border-dashed border-on-surface">
            无需检查点 - Agent 将完全自主执行
          </div>
        )}
      </div>
    </section>
  );
}

function TestStrategySection({ strategy }: { strategy: string }) {
  return (
    <section className="border-2 border-on-surface bg-surface-container-lowest brutal-shadow">
      <div className="border-b-2 border-on-surface bg-surface-container p-3 flex items-center gap-2">
        <span className="material-symbols-outlined text-[20px]">science</span>
        <h2 className="text-lg font-bold uppercase">测试策略</h2>
      </div>
      <div className="p-4">
        <p className="text-sm leading-relaxed border-l-4 border-tertiary pl-3 bg-surface-container p-3">
          {strategy}
        </p>
      </div>
    </section>
  );
}

function ApprovalActions() {
  return (
    <section className="border-2 border-on-surface bg-primary-container brutal-shadow">
      <div className="p-6 flex flex-col md:flex-row items-center gap-4">
        <div className="flex-1">
          <h3 className="text-lg font-bold mb-1">准备好批准此计划了吗？</h3>
          <p className="text-sm text-on-surface-variant">
            批准后，Agent 将开始执行。您可以在证据阶段监控进度。
          </p>
        </div>
        <div className="flex gap-3 shrink-0">
          <button className="px-6 py-3 border-2 border-on-surface bg-surface hover:bg-surface-variant font-bold uppercase transition-colors">
            请求修改
          </button>
          <button className="px-6 py-3 border-2 border-on-surface bg-primary text-white hover:bg-primary-container hover:text-on-primary-container font-bold uppercase brutal-shadow active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all">
            批准并开始
          </button>
        </div>
      </div>
    </section>
  );
}
