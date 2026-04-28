import { useEffect, useRef, useState } from 'react';
import { getTicketDetail, openTicketTimelineSocket } from '../api/tickets';
import { toVibeTicketDetail } from '../api/ticketAdapters';
import type { ApiTicketDetailRead, TicketTimelineSocketMessage } from '../api/tickets';
import type { AgileStatus, TerminalLog, VibeStage, VibeTicket } from '../types/vibeTicket';
import { BriefStage } from '../components/BriefStage';
import { PlanStage } from '../components/PlanStage';
import { EvidenceStage } from '../components/EvidenceStage';
import { ReviewStage } from '../components/ReviewStage';
import { useLedgerStore, useDerivedTicket } from '../store/ledgerStore';
import { selectMaxSequence, selectMinSequence, selectPlaybackBanner, selectPlaybackValue } from '../store/ledgerSelectors';

interface TicketDetailProps {
  id?: string;
  onBack: () => void;
}

export function TicketDetail({ id, onBack }: TicketDetailProps) {
  const normalizedId = normalizeTicketId(id);
  const { 
    setTicket, 
    addEvent, 
    setEvents, 
    setLive, 
    lastAppliedSequence, 
    reset,
    isLive,
    events,
    playbackSequence,
    setPlaybackSequence
  } = useLedgerStore();
  
  const ticket = useDerivedTicket();
  const [loading, setLoading] = useState(Boolean(normalizedId));
  const [error, setError] = useState<string | null>(null);
  const [currentStage, setCurrentStage] = useState<VibeStage>('brief');
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [timelineState, setTimelineState] = useState<'connecting' | 'live' | 'offline'>('connecting');
  const reconnectTimerRef = useRef<number | null>(null);

  const isPlayback = playbackSequence !== null;
  const maxSequence = selectMaxSequence(events);
  const minSequence = selectMinSequence(events);
  const playbackValue = selectPlaybackValue(playbackSequence, maxSequence);
  const playbackBanner = selectPlaybackBanner(playbackSequence, maxSequence);

  useEffect(() => {
    if (!normalizedId) {
      reset();
      setLoading(false);
      setError('未提供 ticket id');
      return;
    }

    let cancelled = false;

    const loadTicket = async () => {
      try {
        setLoading(true);
        setError(null);
        const detail = await getTicketDetail(normalizedId);
        if (!cancelled) {
          setTicket(toVibeTicketDetail(detail));
          if (detail.timelineEvents) {
            setEvents(detail.timelineEvents);
          }
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

    void loadTicket();

    return () => {
      cancelled = true;
    };
  }, [normalizedId]);

  useEffect(() => {
    if (ticket) {
      setCurrentStage(ticket.vibeStage);
    }
  }, [ticket?.id, ticket?.vibeStage]);

  useEffect(() => {
    if (!normalizedId) {
      return;
    }

    let disposed = false;
    let socket: WebSocket | null = null;

    const scheduleReconnect = () => {
      if (disposed || reconnectTimerRef.current !== null) {
        return;
      }
      reconnectTimerRef.current = window.setTimeout(() => {
        reconnectTimerRef.current = null;
        if (!disposed) {
          connect();
        }
      }, 500);
    };

    const connect = () => {
      setLive(false);
      setTimelineState('connecting');
      socket = openTicketTimelineSocket(normalizedId, useLedgerStore.getState().lastAppliedSequence);

      socket.addEventListener('message', event => {
        const message = JSON.parse(event.data) as TicketTimelineSocketMessage;

        if (message.type === 'timeline.live') {
          setLive(true);
          setTimelineState('live');
          return;
        }

        if (message.type === 'timeline.event.created') {
          addEvent(message.data);
        }
      });

      const handleOffline = () => {
        if (disposed) {
          return;
        }
        setLive(false);
        setTimelineState('offline');
        scheduleReconnect();
      };

      socket.addEventListener('close', handleOffline);
      socket.addEventListener('error', handleOffline);
    };

    connect();

    return () => {
      disposed = true;
      if (reconnectTimerRef.current !== null) {
        window.clearTimeout(reconnectTimerRef.current);
        reconnectTimerRef.current = null;
      }
      socket?.close();
    };
  }, [normalizedId, setLive, addEvent]);

  if (loading) {
    return <TicketLoading onBack={onBack} />;
  }

  if (!ticket) {
    return <TicketNotFound id={id} onBack={onBack} error={error} />;
  }

  return (
    <div className={`flex flex-col h-full overflow-hidden bg-surface ${isPlayback ? 'border-4 border-primary' : ''}`}>
      <TicketHeader ticket={ticket} onBack={onBack} />
      
      {events.length > 0 && (
        <div className="bg-surface-container-high border-b-2 border-on-surface p-2 flex flex-col gap-2">
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
              Timeline Scrubber
            </span>
            <input 
              type="range" 
              min={minSequence} 
              max={maxSequence} 
              value={playbackValue}
              onChange={(e) => setPlaybackSequence(parseInt(e.target.value))}
              className="flex-1 h-2 bg-surface-variant rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <span className="text-[10px] font-mono font-bold">
              {playbackValue} / {maxSequence}
            </span>
          </div>
          {playbackBanner && (
            <div className="flex items-center justify-between bg-primary-container border border-primary p-1 px-3">
              <span className="text-[10px] font-bold text-primary uppercase">
                {playbackBanner}
              </span>
              <button 
                onClick={() => setPlaybackSequence(null)}
                className="text-[10px] font-bold bg-primary text-white px-2 py-0.5 hover:bg-primary-variant transition-colors"
              >
                返回实时
              </button>
            </div>
          )}
        </div>
      )}

      <StageNavigation 
        currentStage={currentStage} 
        onStageChange={setCurrentStage}
        ticket={ticket}
      />

      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto">
          {currentStage === 'brief' && <BriefStage brief={ticket.brief} />}
          {currentStage === 'plan' && ticket.plan && <PlanStage plan={ticket.plan} />}
          {currentStage === 'evidence' && ticket.evidence && ticket.plan && (
            <EvidenceStage evidence={ticket.evidence} plan={ticket.plan} />
          )}
          {currentStage === 'review' && ticket.review && <ReviewStage review={ticket.review} />}
        </div>

        <TerminalDrawer 
          isOpen={drawerOpen} 
          onToggle={() => setDrawerOpen(!drawerOpen)}
          logs={ticket.evidence?.rawLogs || []}
          agileStatus={ticket.agileStatus}
          timelineState={timelineState}
        />
      </div>
    </div>
  );
}

function normalizeTicketId(id?: string): string | undefined {
  if (!id) return undefined;
  const legacyMatch = id.match(/^#VB-(\d+)$/);
  return legacyMatch ? `TICKET-${legacyMatch[1]}` : id;
}

function TicketLoading({ onBack }: { onBack: () => void }) {
  return (
    <div className="flex flex-col h-full bg-surface border-2 border-on-surface brutal-shadow">
      <div className="border-b-2 border-on-surface bg-surface-container p-4 flex items-center gap-4">
        <button
          onClick={onBack}
          className="hover:bg-surface-variant p-2 border border-on-surface transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
        </button>
        <div>
          <div className="text-xs uppercase font-bold text-on-surface-variant">Loading ticket</div>
          <h1 className="text-2xl font-bold">正在同步真实工单...</h1>
        </div>
      </div>
      <div className="p-6 grid gap-4">
        <div className="h-5 bg-surface-variant animate-pulse"></div>
        <div className="h-24 bg-surface-variant animate-pulse"></div>
        <div className="h-24 bg-surface-variant animate-pulse"></div>
      </div>
    </div>
  );
}

function TicketNotFound({ id, onBack, error }: { id?: string; onBack: () => void; error?: string | null }) {
  return (
    <div className="flex flex-col h-full bg-surface border-2 border-error brutal-shadow">
      <div className="border-b-2 border-error bg-error-container p-4 flex items-center gap-4">
        <button
          onClick={onBack}
          className="hover:bg-surface-variant p-2 border border-error transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
        </button>
        <div>
          <div className="text-xs uppercase font-bold text-error">Ticket not found</div>
          <h1 className="text-2xl font-bold">未找到工单：{id || 'UNKNOWN'}</h1>
        </div>
      </div>
      <div className="p-6 text-sm text-on-surface-variant">
        <div>请返回看板选择一个存在的 vibe ticket。</div>
        {error && (
          <div className="mt-3 border border-error bg-surface p-3 text-error font-mono text-xs">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}

interface TicketHeaderProps {
  ticket: VibeTicket;
  onBack: () => void;
}

function TicketHeader({ ticket, onBack }: TicketHeaderProps) {
  const statusBadgeClass = getStatusBadgeClass(ticket.agileStatus);

  return (
    <div className="border-b-2 border-on-surface bg-surface-container p-4 flex items-center gap-4">
      <button 
        onClick={onBack} 
        className="hover:bg-surface-variant p-2 border border-transparent hover:border-on-surface transition-colors"
      >
        <span className="material-symbols-outlined text-[20px]">arrow_back</span>
      </button>

      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs bg-on-surface text-surface px-2 py-1 uppercase font-bold">
            {ticket.id}
          </span>
          <span className={`text-xs border px-2 py-1 uppercase font-bold flex items-center gap-1
            ${statusBadgeClass}
          `}>
            <div className={`w-2 h-2 ${getStatusDotClass(ticket.agileStatus)}`}></div>
            {ticket.agileStatus.toUpperCase().replace('_', ' ')}
          </span>
          <span className={`text-xs border px-2 py-1 uppercase font-bold
            ${ticket.priority === 'high' ? 'border-error text-error bg-error-container' : 
              ticket.priority === 'medium' ? 'border-on-surface bg-surface-variant' : 
              'border-outline bg-surface-container'}
          `}>
            PRIORITY: {ticket.priority.toUpperCase()}
          </span>
        </div>
        <h1 className="text-2xl font-bold text-on-surface tracking-tight">{ticket.title}</h1>
      </div>

      <div className="flex gap-2">
        <button className="w-8 h-8 border border-on-surface hover:bg-surface-variant flex items-center justify-center transition-colors">
          <span className="material-symbols-outlined text-[18px]">edit</span>
        </button>
        <button className="w-8 h-8 border border-on-surface hover:bg-surface-variant flex items-center justify-center transition-colors">
          <span className="material-symbols-outlined text-[18px]">more_horiz</span>
        </button>
      </div>
    </div>
  );
}

interface StageNavigationProps {
  currentStage: VibeStage;
  onStageChange: (stage: VibeStage) => void;
  ticket: VibeTicket;
}

function StageNavigation({ currentStage, onStageChange, ticket }: StageNavigationProps) {
  const stages: { id: VibeStage; label: string; icon: string }[] = [
    { id: 'brief', label: '简报', icon: 'description' },
    { id: 'plan', label: '计划', icon: 'route' },
    { id: 'evidence', label: '证据', icon: 'fact_check' },
    { id: 'review', label: '审查', icon: 'rate_review' }
  ];

  const isStageAvailable = (stageId: VibeStage): boolean => {
    if (stageId === 'brief') return true;
    if (stageId === 'plan') return !!ticket.plan;
    if (stageId === 'evidence') return !!ticket.evidence;
    if (stageId === 'review') return !!ticket.review;
    return false;
  };

  return (
    <div className="border-b-2 border-on-surface bg-surface-container-low flex">
      {stages.map((stage, index) => {
        const isActive = currentStage === stage.id;
        const isAvailable = isStageAvailable(stage.id);
        const isCompleted = stages.findIndex(s => s.id === ticket.vibeStage) > index;

        return (
          <button
            key={stage.id}
            onClick={() => isAvailable && onStageChange(stage.id)}
            disabled={!isAvailable}
            className={`flex-1 py-3 px-4 border-r-2 border-on-surface flex items-center justify-center gap-2 transition-colors relative
              ${isActive ? 'bg-primary text-white' : 
                isAvailable ? 'hover:bg-surface-variant' : 
                'opacity-50 cursor-not-allowed'}
            `}
          >
            {isActive && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-white"></div>
            )}
            <span className="material-symbols-outlined text-[20px]">{stage.icon}</span>
            <span className="text-sm font-bold uppercase tracking-wider">{stage.label}</span>
            {isCompleted && (
              <span className="material-symbols-outlined text-[16px]">check_circle</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

interface TerminalDrawerProps {
  isOpen: boolean;
  onToggle: () => void;
  logs: TerminalLog[];
  agileStatus: AgileStatus;
  timelineState: 'connecting' | 'live' | 'offline';
}

function TerminalDrawer({ isOpen, onToggle, logs, agileStatus, timelineState }: TerminalDrawerProps) {
  const indicator = getTimelineIndicator(agileStatus, timelineState);

  return (
    <div 
      className={`border-t-2 border-on-surface bg-on-surface flex flex-col transition-all duration-300
        ${isOpen ? 'h-64' : 'h-10'}
      `}
    >
      <div className="h-10 border-b border-on-surface-variant bg-inverse-surface flex items-center px-3 gap-2 shrink-0">
        <button 
          onClick={onToggle}
          className="hover:bg-on-surface-variant p-1 transition-colors"
        >
          <span className="material-symbols-outlined text-[16px] text-primary-fixed">
            {isOpen ? 'expand_more' : 'expand_less'}
          </span>
        </button>
        <span className="material-symbols-outlined text-[14px] text-primary-fixed">terminal</span>
        <span className="text-[10px] text-surface uppercase font-bold tracking-widest">
          Agent Execution Terminal
        </span>
        <div className="ml-auto flex gap-2">
          <span className="flex items-center gap-1 text-[10px] text-surface font-bold">
            <div className={`w-2 h-2 ${indicator.dotClass} ${indicator.animate ? 'animate-pulse' : ''}`}></div>
            {indicator.label}
          </span>
        </div>
      </div>

      {isOpen && (
        <div className="flex-1 overflow-y-auto p-2 text-xs font-mono space-y-1 dark-scroll">
          {logs.length === 0 ? (
            <div className="border border-dashed border-on-surface-variant p-3 text-surface-dim">
              当前还没有 terminal/timeline 日志，等待后端继续推送事件。
            </div>
          ) : (
            logs.map((log, index) => (
              <TermLine key={index} {...log} />
            ))
          )}
        </div>
      )}
    </div>
  );
}

function TermLine({ time, tag, text, tagColor, textColor, active }: {
  time: string;
  tag: string;
  text: string;
  tagColor?: string;
  textColor?: string;
  active?: boolean;
}) {
  if (active) {
    return (
      <div className="flex text-primary-fixed bg-on-surface-variant px-1 py-0.5 border-l-2 border-primary-fixed">
        <span className="w-[80px] shrink-0 opacity-80">{time}</span>
        <span className="w-[80px] shrink-0 font-bold">{tag}</span>
        <span className="flex-1">
          {text} 
          <span className="animate-pulse bg-primary-fixed w-[6px] h-[12px] inline-block align-middle ml-1"></span>
        </span>
      </div>
    );
  }

  return (
    <div className={`flex text-tertiary-fixed-dim hover:bg-on-surface-variant hover:text-surface px-1 ${textColor || ''}`}>
      <span className="w-[80px] shrink-0 opacity-50">{time}</span>
      <span className={`w-[80px] shrink-0 ${tagColor}`}>{tag}</span>
      <span className="flex-1">{text}</span>
    </div>
  );
}

function dedupeTimelineEvents(events: ApiTicketDetailRead['timelineEvents'] = []) {
  const byId = new Map(events.map(item => [item.id, item]));
  return Array.from(byId.values()).sort(
    (left, right) => new Date(left.createdAt).getTime() - new Date(right.createdAt).getTime()
  );
}

function getStatusBadgeClass(status: AgileStatus) {
  switch (status) {
    case 'in_progress':
      return 'border-on-surface bg-surface-variant';
    case 'review':
      return 'border-secondary bg-secondary-container';
    case 'blocked':
      return 'border-error bg-error-container text-error';
    case 'done':
      return 'border-primary bg-primary-container';
    default:
      return 'border-outline bg-surface-container';
  }
}

function getStatusDotClass(status: AgileStatus) {
  switch (status) {
    case 'in_progress':
      return 'bg-primary';
    case 'review':
      return 'bg-secondary';
    case 'blocked':
      return 'bg-error';
    case 'done':
      return 'bg-primary';
    default:
      return 'bg-tertiary';
  }
}

function getTimelineIndicator(
  agileStatus: AgileStatus,
  timelineState: 'connecting' | 'live' | 'offline'
) {
  if (timelineState === 'connecting') {
    return { label: 'CONNECTING', dotClass: 'bg-secondary-fixed', animate: true };
  }

  if (timelineState === 'offline') {
    return {
      label: agileStatus === 'done' ? 'COMPLETE' : 'OFFLINE',
      dotClass: agileStatus === 'done' ? 'bg-primary-fixed' : 'bg-error',
      animate: false
    };
  }

  if (agileStatus === 'blocked') {
    return { label: 'BLOCKED', dotClass: 'bg-error', animate: true };
  }

  if (agileStatus === 'done') {
    return { label: 'COMPLETE', dotClass: 'bg-primary-fixed', animate: false };
  }

  return { label: 'LIVE', dotClass: 'bg-primary-fixed', animate: true };
}

export default TicketDetail;
