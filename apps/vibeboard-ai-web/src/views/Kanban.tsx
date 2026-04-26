import { mockTickets } from '../data/vibeTicketMock';
import type { VibeStage } from '../types/vibeTicket';

export function Kanban({ onTicketSelect }: { onTicketSelect: (id: string) => void }) {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex justify-between items-end mb-6 pb-4 border-b-2 border-on-surface">
        <div>
          <h1 className="text-4xl font-bold text-on-surface mb-1">主流程视图</h1>
          <p className="text-sm font-medium text-on-surface-variant flex items-center gap-2 uppercase tracking-widest">
            <span className="material-symbols-outlined text-[16px]">hub</span>
            CLUSTER_ALPHA // LIVE_FEED
          </p>
        </div>
        <div className="flex gap-4">
          <div className="border border-on-surface bg-surface-container px-3 py-1 flex items-center gap-2 brutal-shadow">
            <div className="w-3 h-3 bg-primary border border-on-surface"></div>
            <span className="text-xs font-bold uppercase tracking-wider">Agent 负载: 78%</span>
          </div>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4 overflow-hidden">
        {/* Column 1 */}
        <div className="flex flex-col border-2 border-on-surface bg-surface-container-low brutal-shadow">
          <div className="p-2 border-b-2 border-on-surface bg-surface-container flex justify-between items-center">
            <div className="flex items-center gap-2 font-bold text-lg">
              <span className="w-3 h-3 bg-tertiary-fixed-dim border border-on-surface"></span>
              待处理 <span className="text-xs text-on-surface-variant">(2)</span>
            </div>
            <button className="material-symbols-outlined hover:text-primary">more_horiz</button>
          </div>
          <div className="flex-1 p-2 overflow-y-auto flex flex-col gap-2">
            <TicketCard id="#VB-089" title="优化数据库索引策略以降低查询延迟" progress={0} tag="DBA" vibeStage="brief" onSelect={onTicketSelect} />
            <TicketCard id="#VB-092" title="解析第三方 API 文档并生成类型定义" progress={0} tag="INTEGRATION" vibeStage="brief" onSelect={onTicketSelect} />
          </div>
        </div>

        {/* Column 2 */}
        <div className="flex flex-col border-2 border-on-surface bg-surface-container-low brutal-shadow">
          <div className="p-2 border-b-2 border-on-surface bg-surface-container flex justify-between items-center">
            <div className="flex items-center gap-2 font-bold text-lg">
              <span className="w-3 h-3 bg-secondary-container border border-on-surface"></span>
              准备就绪 <span className="text-xs text-on-surface-variant">(1)</span>
            </div>
            <button className="material-symbols-outlined hover:text-primary">more_horiz</button>
          </div>
          <div className="flex-1 p-2 overflow-y-auto flex flex-col gap-2">
            <TicketCard id="#VB-085" title="重构登录逻辑，支持 OAuth2.0 协议" progress={15} tag="AUTH" vibeStage="plan" highlight="HIGH" onSelect={onTicketSelect} />
          </div>
        </div>

        {/* Column 3 */}
        <div className="flex flex-col border-2 border-on-surface bg-surface-container-low brutal-shadow">
          <div className="p-2 border-b-2 border-on-surface bg-primary-container text-on-primary-container flex justify-between items-center">
            <div className="flex items-center gap-2 font-bold text-lg">
              <span className="w-3 h-3 bg-white border border-on-surface animate-pulse"></span>
              执行中 <span className="text-xs">(2)</span>
            </div>
            <button className="material-symbols-outlined hover:text-white">more_horiz</button>
          </div>
          <div className="flex-1 p-2 overflow-y-auto flex flex-col gap-2">
            <TicketCard id="#VB-077" title="自动生成单元测试用例 (覆盖率 > 80%)" progress={68} tag="QA/TEST" vibeStage="evidence" agentActive score="72/100" activeBorder onSelect={onTicketSelect} />
            <TicketCard id="#VB-081" title="沉淀组件上下文与验收说明" progress={42} tag="PRODUCT" vibeStage="evidence" score="40/100" onSelect={onTicketSelect} />
          </div>
        </div>

        {/* Column 4 */}
        <div className="flex flex-col border-2 border-on-surface bg-surface-container-low opacity-90 brutal-shadow">
          <div className="p-2 border-b-2 border-on-surface bg-surface-variant flex justify-between items-center">
            <div className="flex items-center gap-2 font-bold text-lg text-on-surface-variant">
              <span className="w-3 h-3 bg-on-surface border border-on-surface"></span>
              已完成 <span className="text-xs">(3)</span>
            </div>
            <button className="material-symbols-outlined hover:text-primary">more_horiz</button>
          </div>
          <div className="flex-1 p-2 overflow-y-auto flex flex-col gap-2">
            <TicketCard id="#VB-070" title="实现用户权限校验中间件" progress={100} tag="BACKEND" vibeStage="review" score="98/100" isDone onSelect={onTicketSelect} />
            <TicketCard id="#VB-068" title="修复移动端导航栏重叠渲染 Bug" progress={100} tag="UI/UX" vibeStage="review" score="95/100" isDone onSelect={onTicketSelect} />
          </div>
        </div>
      </div>
    </div>
  );
}

type TicketCardProps = {
  id: string;
  title: string;
  progress: number;
  tag: string;
  vibeStage?: VibeStage;
  highlight?: string;
  agentActive?: boolean;
  score?: string;
  activeBorder?: boolean;
  isDone?: boolean;
  onSelect: (id: string) => void;
};

function TicketCard({ id, title, progress, tag, vibeStage, highlight, agentActive, score, activeBorder, isDone, onSelect }: TicketCardProps) {
  const stageLabels: Record<VibeStage, string> = {
    brief: '简报',
    plan: '计划',
    evidence: '证据',
    review: '审查'
  };

  const stageIcons: Record<VibeStage, string> = {
    brief: 'description',
    plan: 'route',
    evidence: 'fact_check',
    review: 'rate_review'
  };
  return (
    <div 
      className={`border-2 p-2 cursor-pointer transition-colors group relative overflow-hidden flex flex-col
        ${activeBorder ? 'border-primary bg-surface-container-lowest shadow-[2px_2px_0_0_#006c4f]' : 'border-on-surface bg-surface-container-lowest brutal-shadow'}
        ${isDone ? 'opacity-80' : 'hover:bg-surface-bright'}
      `}
      onClick={() => onSelect(id)}
    >
      {activeBorder && (
        <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,108,79,0.05)_50%)] bg-[length:100%_4px] pointer-events-none z-0"></div>
      )}
      <div className="flex justify-between items-start mb-2 border-b border-on-surface pb-2 relative z-10">
        <span className={`text-xs font-bold px-1 border border-on-surface
          ${activeBorder ? 'bg-primary text-white' : (isDone ? 'text-on-surface-variant line-through decoration-on-surface' : 'bg-surface-variant')}
        `}>{id}</span>
        <span className={`w-2 h-2 border border-on-surface relative 
          ${activeBorder ? 'bg-primary animate-ping block absolute right-0 top-1' : isDone ? 'bg-on-surface flex items-center justify-center' : 'bg-tertiary'}`}>
          {isDone && <span className="w-[2px] h-[2px] bg-white"></span>}
        </span>
        {activeBorder && <span className="w-2 h-2 bg-primary border border-on-surface"></span>}
      </div>
      <h3 className={`text-base font-bold mb-3 leading-tight transition-colors relative z-10 flex-1
        ${isDone ? 'text-on-surface-variant' : 'group-hover:text-primary'}
      `}>{title}</h3>
      <div className="flex flex-col gap-1 mb-3 relative z-10">
        <div className={`flex justify-between text-xs font-bold ${isDone ? 'text-on-surface-variant' : ''}`}>
          <span className={agentActive ? 'text-primary' : ''}>{agentActive ? 'Agent 正在执行...' : 'Agent 进度'}</span>
          <span>{progress}%</span>
        </div>
        <div className="w-full h-2 border border-on-surface bg-surface flex">
          <div className="h-full bg-primary" style={{ width: `${progress}%` }}></div>
        </div>
      </div>
      <div className={`flex justify-between items-center pt-2 border-t border-dashed relative z-10 ${isDone ? 'border-outline' : 'border-on-surface'}`}>
        <div className="flex gap-1 flex-wrap">
          <span className={`border px-1 text-[10px] font-bold uppercase ${isDone ? 'border-outline text-on-surface-variant' : 'bg-surface border-on-surface'}`}>{tag}</span>
          {highlight && <span className="bg-surface border border-on-surface px-1 text-[10px] font-bold text-error uppercase">{highlight}</span>}
          {vibeStage && (
            <span className="border border-primary bg-primary-container px-1 text-[10px] font-bold uppercase flex items-center gap-0.5">
              <span className="material-symbols-outlined text-[10px]">{stageIcons[vibeStage]}</span>
              {stageLabels[vibeStage]}
            </span>
          )}
        </div>
        <span className={`text-xs font-bold uppercase overflow-hidden ${isDone || score ? '' : 'text-tertiary'}`}>
          验收: <span className={agentActive ? 'text-primary' : (isDone ? 'text-primary' : '')}>{score || '--'}</span>
        </span>
      </div>
    </div>
  );
}
