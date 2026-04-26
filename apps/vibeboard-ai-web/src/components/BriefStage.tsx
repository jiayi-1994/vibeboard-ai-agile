import type { IdeaBrief } from '../types/vibeTicket';

interface BriefStageProps {
  brief: IdeaBrief;
}

export function BriefStage({ brief }: BriefStageProps) {
  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      <OriginalIdeaSection brief={brief} />
      <ContextPacksSection contextPacks={brief.contextPacks} />
      <AcceptanceCriteriaSection criteria={brief.acceptanceCriteria} />
      <ConstraintsSection 
        constraints={brief.constraints}
        nonGoals={brief.nonGoals}
      />
      <ScopeSection 
        targetWorkspace={brief.targetWorkspace}
        allowedScope={brief.allowedScope}
        evidenceType={brief.evidenceType}
      />
    </div>
  );
}

function OriginalIdeaSection({ brief }: { brief: IdeaBrief }) {
  return (
    <section className="border-2 border-on-surface bg-surface-container-lowest brutal-shadow">
      <div className="border-b-2 border-on-surface bg-surface-container p-3 flex items-center gap-2">
        <span className="material-symbols-outlined text-[20px]">lightbulb</span>
        <h2 className="text-lg font-bold uppercase">原始想法</h2>
      </div>
      <div className="p-4 space-y-4">
        <div>
          <h3 className="text-xs uppercase font-bold text-on-surface-variant mb-2">用户描述</h3>
          <p className="text-sm leading-relaxed border-l-4 border-primary pl-3 bg-surface-container p-3">
            {brief.originalIdea}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-xs uppercase font-bold text-on-surface-variant mb-2">目标</h3>
            <p className="text-sm border border-on-surface bg-surface p-2">
              {brief.target}
            </p>
          </div>
          <div>
            <h3 className="text-xs uppercase font-bold text-on-surface-variant mb-2">预期变化</h3>
            <p className="text-sm border border-on-surface bg-surface p-2">
              {brief.expectedChange}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function ContextPacksSection({ contextPacks }: { contextPacks: IdeaBrief['contextPacks'] }) {
  return (
    <section className="border-2 border-on-surface bg-surface-container-lowest brutal-shadow">
      <div className="border-b-2 border-on-surface bg-surface-container p-3 flex items-center gap-2">
        <span className="material-symbols-outlined text-[20px]">folder_open</span>
        <h2 className="text-lg font-bold uppercase">上下文包</h2>
        <span className="ml-auto text-xs bg-primary text-white px-2 py-1 font-bold">
          {contextPacks.filter(cp => cp.selected).length} / {contextPacks.length} 已选择
        </span>
      </div>
      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
        {contextPacks.map(pack => (
          <ContextPackCard key={pack.id} pack={pack} />
        ))}
      </div>
    </section>
  );
}

function ContextPackCard({ pack }: { pack: IdeaBrief['contextPacks'][0] }) {
  return (
    <div className={`border-2 p-3 transition-colors
      ${pack.selected ? 'border-primary bg-primary-container' : 'border-on-surface bg-surface'}
    `}>
      <div className="flex items-start gap-2 mb-2">
        <div className={`w-5 h-5 border-2 flex items-center justify-center shrink-0 mt-0.5
          ${pack.selected ? 'border-primary bg-primary' : 'border-on-surface bg-surface-container'}
        `}>
          {pack.selected && (
            <span className="material-symbols-outlined text-white text-[14px]">check</span>
          )}
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-sm mb-1">{pack.name}</h3>
          <p className="text-xs text-on-surface-variant">{pack.description}</p>
        </div>
      </div>
      <div className="mt-3 pt-3 border-t border-on-surface border-dashed">
        <div className="text-[10px] uppercase font-bold text-on-surface-variant mb-1">
          包含文件 ({pack.items.length})
        </div>
        <div className="space-y-1">
          {pack.items.map((item, idx) => (
            <div key={idx} className="text-xs font-mono bg-surface-container px-2 py-1 border border-on-surface">
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AcceptanceCriteriaSection({ criteria }: { criteria: IdeaBrief['acceptanceCriteria'] }) {
  const completed = criteria.filter(c => c.checked).length;
  const total = criteria.length;
  const progress = Math.round((completed / total) * 100);

  return (
    <section className="border-2 border-on-surface bg-surface-container-lowest brutal-shadow">
      <div className="border-b-2 border-on-surface bg-surface-container p-3 flex items-center gap-2">
        <span className="material-symbols-outlined text-[20px]">task_alt</span>
        <h2 className="text-lg font-bold uppercase">验收标准</h2>
        <div className="ml-auto flex items-center gap-3">
          <span className="text-xs font-bold">
            {completed} / {total} 完成
          </span>
          <div className="w-32 h-2 border border-on-surface bg-surface flex">
            <div className="h-full bg-primary" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
      </div>
      <div className="p-4 space-y-2">
        {criteria.map(item => (
          <AcceptanceCriteriaItem key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}

function AcceptanceCriteriaItem({ item }: { item: IdeaBrief['acceptanceCriteria'][0] }) {
  return (
    <label className={`flex items-start gap-3 p-3 cursor-pointer transition-colors border-2
      ${item.active ? 'bg-surface-variant border-primary' : 
        item.checked ? 'bg-surface-container border-on-surface opacity-80' : 
        'border-on-surface border-dashed hover:border-solid hover:bg-surface-container'}
    `}>
      <div className="w-5 h-5 border-2 border-on-surface bg-surface-container-lowest mt-0.5 shrink-0 flex items-center justify-center">
        {item.checked && <div className="w-3 h-3 bg-on-surface"></div>}
        {item.active && <div className="w-3 h-3 bg-primary animate-pulse"></div>}
      </div>
      <span className={`text-sm flex-1 ${item.checked ? 'line-through text-on-surface-variant' : item.active ? 'font-bold' : ''}`}>
        {item.text}
      </span>
      {item.active && (
        <span className="text-xs bg-primary text-white px-2 py-1 uppercase font-bold shrink-0">
          进行中
        </span>
      )}
    </label>
  );
}

function ConstraintsSection({ constraints, nonGoals }: { 
  constraints: string[]; 
  nonGoals: string[]; 
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <section className="border-2 border-on-surface bg-surface-container-lowest brutal-shadow">
        <div className="border-b-2 border-on-surface bg-surface-container p-3 flex items-center gap-2">
          <span className="material-symbols-outlined text-[20px]">lock</span>
          <h2 className="text-sm font-bold uppercase">约束条件</h2>
        </div>
        <div className="p-4 space-y-2">
          {constraints.map((constraint, idx) => (
            <div key={idx} className="flex items-start gap-2 text-sm">
              <span className="material-symbols-outlined text-[16px] text-error mt-0.5">warning</span>
              <span>{constraint}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="border-2 border-on-surface bg-surface-container-lowest brutal-shadow">
        <div className="border-b-2 border-on-surface bg-surface-container p-3 flex items-center gap-2">
          <span className="material-symbols-outlined text-[20px]">block</span>
          <h2 className="text-sm font-bold uppercase">非目标</h2>
        </div>
        <div className="p-4 space-y-2">
          {nonGoals.map((nonGoal, idx) => (
            <div key={idx} className="flex items-start gap-2 text-sm text-on-surface-variant">
              <span className="material-symbols-outlined text-[16px] mt-0.5">close</span>
              <span>{nonGoal}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function ScopeSection({ targetWorkspace, allowedScope, evidenceType }: {
  targetWorkspace: string;
  allowedScope: string[];
  evidenceType: string[];
}) {
  return (
    <section className="border-2 border-on-surface bg-surface-container-lowest brutal-shadow">
      <div className="border-b-2 border-on-surface bg-surface-container p-3 flex items-center gap-2">
        <span className="material-symbols-outlined text-[20px]">settings</span>
        <h2 className="text-lg font-bold uppercase">作用域配置</h2>
      </div>
      <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <h3 className="text-xs uppercase font-bold text-on-surface-variant mb-2">目标工作区</h3>
          <div className="border border-on-surface bg-surface p-2 font-mono text-sm">
            {targetWorkspace}
          </div>
        </div>
        <div>
          <h3 className="text-xs uppercase font-bold text-on-surface-variant mb-2">
            允许修改范围 ({allowedScope.length})
          </h3>
          <div className="space-y-1">
            {allowedScope.map((scope, idx) => (
              <div key={idx} className="border border-on-surface bg-surface px-2 py-1 font-mono text-xs">
                {scope}
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-xs uppercase font-bold text-on-surface-variant mb-2">
            证据类型 ({evidenceType.length})
          </h3>
          <div className="flex flex-wrap gap-1">
            {evidenceType.map((type, idx) => (
              <span key={idx} className="text-[10px] bg-primary text-white px-2 py-1 uppercase font-bold">
                {type.replace('_', ' ')}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
