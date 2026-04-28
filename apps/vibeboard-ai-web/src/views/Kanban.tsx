import { useEffect, useMemo, useState } from 'react';
import { listTickets } from '../api/tickets';
import { toVibeTicketSummary } from '../api/ticketAdapters';
import type { AgileStatus, VibeStage, VibeTicket } from '../types/vibeTicket';

const columns: Array<{
  stage: VibeStage;
  label: string;
  dotClass: string;
  headerClass?: string;
}> = [
  { stage: 'brief', label: '待处理', dotClass: 'bg-tertiary-fixed-dim' },
  { stage: 'plan', label: '准备就绪', dotClass: 'bg-secondary-container' },
  {
    stage: 'evidence',
    label: '执行中',
    dotClass: 'bg-white animate-pulse',
    headerClass: 'bg-primary-container text-on-primary-container'
  },
  {
    stage: 'review',
    label: '待审查',
    dotClass: 'bg-secondary',
    headerClass: 'bg-secondary-container text-on-secondary-container'
  },
  {
    stage: 'evidence',
    label: '已阻塞',
    dotClass: 'bg-error',
    headerClass: 'bg-error-container text-error'
  },
  {
    stage: 'review',
    label: '已完成',
    dotClass: 'bg-on-surface',
    headerClass: 'bg-surface-variant text-on-surface-variant'
  }
];

export function Kanban({ onTicketSelect }: { onTicketSelect: (id: string) => void }) {
  const [tickets, setTickets] = useState<VibeTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadTickets = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await listTickets();
        if (!cancelled) {
          setTickets(response.map(toVibeTicketSummary));
        }
      } catch (fetchError) {
        if (!cancelled) {
          setError(fetchError instanceof Error ? fetchError.message : '加载工单失败');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadTickets();

    return () => {
      cancelled = true;
    };
  }, []);

  const activeCount = useMemo(
    () => tickets.filter(ticket => ticket.agileStatus === 'in_progress').length,
    [tickets]
  );
  const agentLoad = tickets.length === 0 ? 0 : Math.round((activeCount / tickets.length) * 100);

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
            <span className="text-xs font-bold uppercase tracking-wider">Agent 负载: {agentLoad}%</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-4 border-2 border-error bg-error-container px-4 py-3 text-sm text-error brutal-shadow">
          无法加载真实工单：{error}
        </div>
      )}

      <div className="flex-1 overflow-x-auto pb-2">
        <div className="grid min-w-[1560px] grid-cols-6 gap-4 h-full">
        {columns.map(column => {
          const ticketsInColumn = tickets.filter(ticket => {
            if (column.label === '已阻塞') return ticket.agileStatus === 'blocked';
            if (column.label === '已完成') return ticket.agileStatus === 'done';
            if (column.label === '执行中') return ticket.vibeStage === 'evidence' && ticket.agileStatus !== 'blocked' && ticket.agileStatus !== 'done';
            if (column.label === '待审查') return ticket.vibeStage === 'review' && ticket.agileStatus !== 'done';
            return ticket.vibeStage === column.stage;
          });
          const isDoneColumn = column.label === '已完成';

          return (
            <div
              key={`${column.label}-${column.stage}`}
              className={`flex flex-col border-2 border-on-surface bg-surface-container-low brutal-shadow ${isDoneColumn ? 'opacity-90' : ''}`}
            >
              <div className={`p-2 border-b-2 border-on-surface flex justify-between items-center ${column.headerClass || 'bg-surface-container'}`}>
                <div className="flex items-center gap-2 font-bold text-lg">
                  <span className={`w-3 h-3 ${column.dotClass} border border-on-surface`}></span>
                  {column.label} <span className="text-xs">({ticketsInColumn.length})</span>
                </div>
                <button className="material-symbols-outlined hover:text-primary">more_horiz</button>
              </div>
              <div className="flex-1 p-2 overflow-y-auto flex flex-col gap-2">
                {loading ? (
                  Array.from({ length: 2 }).map((_, index) => (
                    <div
                      key={`${column.label}-skeleton-${index}`}
                      className="border-2 border-on-surface bg-surface-container-lowest p-3 brutal-shadow animate-pulse"
                    >
                      <div className="h-3 w-16 bg-surface-variant mb-3"></div>
                      <div className="h-4 w-full bg-surface-variant mb-2"></div>
                      <div className="h-4 w-3/4 bg-surface-variant"></div>
                    </div>
                  ))
                ) : ticketsInColumn.length === 0 ? (
                  <div className="border border-dashed border-on-surface bg-surface p-3 text-xs text-on-surface-variant text-center">
                    暂无工单
                  </div>
                ) : (
                  ticketsInColumn.map(ticket => (
                    <TicketCard
                      key={ticket.id}
                      ticket={ticket}
                      onSelect={onTicketSelect}
                    />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
      </div>
    </div>
  );
}

type TicketCardProps = {
  ticket: VibeTicket;
  onSelect: (id: string) => void;
};

function TicketCard({ ticket, onSelect }: TicketCardProps) {
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

  const progressByStage: Record<VibeStage, number> = {
    brief: 10,
    plan: 35,
    evidence: 70,
    review: 100
  };

  const progress = ticket.agileStatus === 'done' ? 100 : progressByStage[ticket.vibeStage];
  const tag = compactTag(ticket.brief.targetWorkspace.split('/').pop() || ticket.assignee);
  const score = ticket.review ? `${Math.round(ticket.review.qualityMetrics.codeQuality)}/100` : undefined;
  const isDone = ticket.agileStatus === 'done';
  const agentActive = ticket.agileStatus === 'in_progress';
  const blocked = ticket.agileStatus === 'blocked';
  const activeBorder = agentActive || blocked;
  const highlight = ticket.priority === 'high' ? 'HIGH' : undefined;

  return (
    <div 
      className={`border-2 p-2 cursor-pointer transition-colors group relative overflow-hidden flex flex-col
        ${agentActive ? 'border-primary bg-surface-container-lowest shadow-[2px_2px_0_0_#006c4f]' : blocked ? 'border-error bg-error-container/30 shadow-[2px_2px_0_0_#ba1a1a]' : 'border-on-surface bg-surface-container-lowest brutal-shadow'}
        ${isDone ? 'opacity-80' : 'hover:bg-surface-bright'}
      `}
      onClick={() => onSelect(ticket.id)}
    >
      {activeBorder && (
        <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,108,79,0.05)_50%)] bg-[length:100%_4px] pointer-events-none z-0"></div>
      )}
      <div className="flex justify-between items-start mb-2 border-b border-on-surface pb-2 relative z-10">
        <span className={`text-xs font-bold px-1 border border-on-surface
          ${activeBorder ? 'bg-primary text-white' : (isDone ? 'text-on-surface-variant line-through decoration-on-surface' : 'bg-surface-variant')}
        `}>{ticket.id}</span>
        <span className={`w-2 h-2 border border-on-surface relative 
          ${activeBorder ? 'bg-primary animate-ping block absolute right-0 top-1' : isDone ? 'bg-on-surface flex items-center justify-center' : 'bg-tertiary'}`}>
          {isDone && <span className="w-[2px] h-[2px] bg-white"></span>}
        </span>
        {activeBorder && <span className="w-2 h-2 bg-primary border border-on-surface"></span>}
      </div>
      <h3 className={`text-base font-bold mb-3 leading-tight transition-colors relative z-10 flex-1
        ${isDone ? 'text-on-surface-variant' : 'group-hover:text-primary'}
      `}>{ticket.title}</h3>
      <div className="flex flex-col gap-1 mb-3 relative z-10">
        <div className={`flex justify-between text-xs font-bold ${isDone ? 'text-on-surface-variant' : ''}`}>
          <span className={agentActive ? 'text-primary' : blocked ? 'text-error' : ''}>
            {agentActive ? 'Agent 正在执行...' : blocked ? 'Agent 已阻塞' : 'Agent 进度'}
          </span>
          <span>{progress}%</span>
        </div>
        <div className="w-full h-2 border border-on-surface bg-surface flex">
          <div className={`h-full ${blocked ? 'bg-error' : 'bg-primary'}`} style={{ width: `${progress}%` }}></div>
        </div>
      </div>
      <div className={`flex justify-between items-center pt-2 border-t border-dashed relative z-10 ${isDone ? 'border-outline' : 'border-on-surface'}`}>
        <div className="flex gap-1 flex-wrap">
          <span className={`border px-1 text-[10px] font-bold uppercase ${isDone ? 'border-outline text-on-surface-variant' : 'bg-surface border-on-surface'}`}>{tag}</span>
          {highlight && <span className="bg-surface border border-on-surface px-1 text-[10px] font-bold text-error uppercase">{highlight}</span>}
          <span className="border border-primary bg-primary-container px-1 text-[10px] font-bold uppercase flex items-center gap-0.5">
            <span className="material-symbols-outlined text-[10px]">{stageIcons[ticket.vibeStage]}</span>
            {stageLabels[ticket.vibeStage]}
          </span>
        </div>
        <span className={`text-xs font-bold uppercase overflow-hidden ${isDone || score ? '' : 'text-tertiary'}`}>
          验收: <span className={agentActive ? 'text-primary' : (isDone ? 'text-primary' : '')}>{score || '--'}</span>
        </span>
      </div>
    </div>
  );
}

function compactTag(value: string) {
  const normalized = value.replace(/[^a-zA-Z0-9_-]/g, '').toUpperCase();
  if (normalized.length <= 16) {
    return normalized;
  }
  return `${normalized.slice(0, 13)}...`;
}
