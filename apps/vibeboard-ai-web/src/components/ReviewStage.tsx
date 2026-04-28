import type { ReviewHandoff } from '../types/vibeTicket';

interface ReviewStageProps {
  review: ReviewHandoff;
}

export function ReviewStage({ review }: ReviewStageProps) {
  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      <ReviewSummary review={review} />
      <AcceptanceCriteriaReview criteria={review.acceptanceCriteria} />
      <QualityMetrics metrics={review.qualityMetrics} />
      <RiskAssessment risks={review.risks} />
      <HandoffDecision 
        recommendation={review.recommendation}
        nextSteps={review.nextSteps}
      />
    </div>
  );
}

function ReviewSummary({ review }: { review: ReviewHandoff }) {
  const statusColors = {
    pass: 'bg-primary text-white',
    conditional: 'bg-secondary text-white',
    fail: 'bg-error text-white'
  };

  return (
    <section className="border-2 border-on-surface bg-surface-container-lowest brutal-shadow">
      <div className="border-b-2 border-on-surface bg-surface-container p-3 flex items-center gap-2">
        <span className="material-symbols-outlined text-[20px]">rate_review</span>
        <h2 className="text-lg font-bold uppercase">审查总结</h2>
        <span className={`ml-auto text-xs px-3 py-1 uppercase font-bold ${statusColors[review.overallStatus]}`}>
          {review.overallStatus === 'pass' ? '通过' : 
           review.overallStatus === 'conditional' ? '有条件通过' : '未通过'}
        </span>
      </div>
      <div className="p-4">
        <p className="text-sm leading-relaxed border-l-4 border-primary pl-3 bg-surface-container p-3">
          {review.summary}
        </p>
      </div>
    </section>
  );
}

function AcceptanceCriteriaReview({ criteria }: { criteria: ReviewHandoff['acceptanceCriteria'] }) {
  const passedCount = criteria.filter(c => c.met).length;
  const totalCount = criteria.length;

  return (
    <section className="border-2 border-on-surface bg-surface-container-lowest brutal-shadow">
      <div className="border-b-2 border-on-surface bg-surface-container p-3 flex items-center gap-2">
        <span className="material-symbols-outlined text-[20px]">checklist</span>
        <h2 className="text-lg font-bold uppercase">验收标准审查</h2>
        <span className="ml-auto text-xs bg-on-surface text-surface px-2 py-1 font-bold">
          {passedCount} / {totalCount} 通过
        </span>
      </div>
      <div className="p-4 space-y-2">
        {criteria.length === 0 ? (
          <div className="border border-dashed border-on-surface bg-surface p-4 text-sm text-on-surface-variant text-center">
            当前还没有结构化验收标准，审查结论将暂时依赖 acceptance score、preview 状态和 timeline 证据。
          </div>
        ) : (
          criteria.map((criterion, idx) => (
            <div 
              key={idx}
              className={`border-2 p-3 flex items-start gap-3 ${
                criterion.met ? 'border-primary bg-primary-container' : 'border-error bg-error-container'
              }`}
            >
              <span className={`material-symbols-outlined text-[20px] mt-0.5 ${
                criterion.met ? 'text-primary' : 'text-error'
              }`}>
                {criterion.met ? 'check_circle' : 'cancel'}
              </span>
              <div className="flex-1">
                <div className="font-bold text-sm mb-1">{criterion.criterion}</div>
                <div className="text-xs text-on-surface-variant">{criterion.evidence}</div>
                {!criterion.met && criterion.gap && (
                  <div className="mt-2 text-xs bg-surface border border-error p-2">
                    <span className="font-bold text-error">差距：</span> {criterion.gap}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

function QualityMetrics({ metrics }: { metrics: ReviewHandoff['qualityMetrics'] }) {
  return (
    <section className="border-2 border-on-surface bg-surface-container-lowest brutal-shadow">
      <div className="border-b-2 border-on-surface bg-surface-container p-3 flex items-center gap-2">
        <span className="material-symbols-outlined text-[20px]">analytics</span>
        <h2 className="text-lg font-bold uppercase">质量指标</h2>
      </div>
      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <MetricCard 
          label="测试覆盖率"
          value={metrics.testCoverage}
          threshold={80}
          unit="%"
          icon="science"
        />
        <MetricCard 
          label="代码质量评分"
          value={metrics.codeQuality}
          threshold={85}
          unit="/100"
          icon="code"
        />
        <MetricCard 
          label="文档完整性"
          value={metrics.documentationCompleteness}
          threshold={90}
          unit="%"
          icon="description"
        />
        <MetricCard 
          label="性能基准"
          value={metrics.performanceBenchmark}
          threshold={95}
          unit="%"
          icon="speed"
        />
      </div>
    </section>
  );
}

function MetricCard({ label, value, threshold, unit, icon }: {
  label: string;
  value: number;
  threshold: number;
  unit: string;
  icon: string;
}) {
  const isPassing = value >= threshold;

  return (
    <div className={`border-2 p-4 ${isPassing ? 'border-primary bg-primary-container' : 'border-secondary bg-secondary-container'}`}>
      <div className="flex items-center gap-2 mb-2">
        <span className={`material-symbols-outlined text-[16px] ${isPassing ? 'text-primary' : 'text-secondary'}`}>
          {icon}
        </span>
        <div className="text-xs font-bold uppercase text-on-surface-variant">{label}</div>
      </div>
      <div className="flex items-baseline gap-1">
        <div className={`text-3xl font-bold ${isPassing ? 'text-primary' : 'text-secondary'}`}>
          {value}
        </div>
        <div className="text-sm text-on-surface-variant">{unit}</div>
      </div>
      <div className="mt-2 text-[10px] text-on-surface-variant">
        阈值: {threshold}{unit}
      </div>
    </div>
  );
}

function RiskAssessment({ risks }: { risks: ReviewHandoff['risks'] }) {
  return (
    <section className="border-2 border-on-surface bg-surface-container-lowest brutal-shadow">
      <div className="border-b-2 border-on-surface bg-surface-container p-3 flex items-center gap-2">
        <span className="material-symbols-outlined text-[20px]">warning</span>
        <h2 className="text-lg font-bold uppercase">风险评估</h2>
        <span className="ml-auto text-xs bg-on-surface text-surface px-2 py-1 font-bold">
          {risks.length} 个风险
        </span>
      </div>
      <div className="p-4">
        {risks.length === 0 ? (
          <div className="text-sm text-on-surface-variant text-center py-4 border border-dashed border-on-surface">
            未发现风险
          </div>
        ) : (
          <div className="space-y-2">
            {risks.map((risk, idx) => {
              const severityColors = {
                low: 'border-on-surface bg-surface',
                medium: 'border-secondary bg-secondary-container',
                high: 'border-error bg-error-container'
              };

              return (
                <div key={idx} className={`border-2 ${severityColors[risk.severity]} p-3`}>
                  <div className="flex items-start gap-2 mb-2">
                    <span className={`text-[10px] px-2 py-1 uppercase font-bold ${
                      risk.severity === 'high' ? 'bg-error text-white' :
                      risk.severity === 'medium' ? 'bg-secondary text-white' :
                      'bg-surface-variant text-on-surface'
                    }`}>
                      {risk.severity}
                    </span>
                    <div className="flex-1">
                      <div className="font-bold text-sm">{risk.description}</div>
                    </div>
                  </div>
                  <div className="text-xs text-on-surface-variant pl-2 border-l-2 border-on-surface">
                    <span className="font-bold">缓解措施：</span> {risk.mitigation}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

function HandoffDecision({ recommendation, nextSteps }: {
  recommendation: ReviewHandoff['recommendation'];
  nextSteps: string[];
}) {
  const actionColors = {
    approve: 'bg-primary text-white',
    approve_with_conditions: 'bg-secondary text-white',
    reject: 'bg-error text-white'
  };

  const actionLabels = {
    approve: '批准交付',
    approve_with_conditions: '有条件批准',
    reject: '拒绝交付'
  };

  return (
    <section className="border-2 border-on-surface bg-surface-container-lowest brutal-shadow">
      <div className="border-b-2 border-on-surface bg-surface-container p-3 flex items-center gap-2">
        <span className="material-symbols-outlined text-[20px]">gavel</span>
        <h2 className="text-lg font-bold uppercase">交付决策</h2>
      </div>
      <div className="p-4 space-y-4">
        <div className={`border-2 border-on-surface p-4 ${
          recommendation === 'approve' ? 'bg-primary-container' :
          recommendation === 'approve_with_conditions' ? 'bg-secondary-container' :
          'bg-error-container'
        }`}>
          <div className="flex items-center gap-3 mb-3">
            <span className={`material-symbols-outlined text-[32px] ${
              recommendation === 'approve' ? 'text-primary' :
              recommendation === 'approve_with_conditions' ? 'text-secondary' :
              'text-error'
            }`}>
              {recommendation === 'approve' ? 'check_circle' :
               recommendation === 'approve_with_conditions' ? 'pending' :
               'cancel'}
            </span>
            <div>
              <div className="text-xs uppercase font-bold text-on-surface-variant">推荐决策</div>
              <div className="text-xl font-bold">{actionLabels[recommendation]}</div>
            </div>
          </div>
        </div>

        {nextSteps.length > 0 && (
          <div>
            <h3 className="text-xs uppercase font-bold text-on-surface-variant mb-2">
              后续步骤 ({nextSteps.length})
            </h3>
            <div className="space-y-2">
              {nextSteps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-2 border border-on-surface bg-surface p-3">
                  <div className="w-6 h-6 border-2 border-on-surface bg-on-surface text-surface flex items-center justify-center font-bold text-xs shrink-0">
                    {idx + 1}
                  </div>
                  <span className="text-sm flex-1">{step}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-3 pt-4 border-t-2 border-on-surface">
          <button className="flex-1 px-6 py-3 border-2 border-on-surface bg-surface hover:bg-surface-variant font-bold uppercase transition-colors">
            请求修改
          </button>
          <button className={`flex-1 px-6 py-3 border-2 border-on-surface font-bold uppercase brutal-shadow active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all ${actionColors[recommendation]}`}>
            {actionLabels[recommendation]}
          </button>
        </div>
      </div>
    </section>
  );
}
