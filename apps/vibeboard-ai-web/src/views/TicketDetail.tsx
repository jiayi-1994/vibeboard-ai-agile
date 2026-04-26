import { useState } from 'react';
import type { VibeTicket, VibeStage } from '../types/vibeTicket';
import { mockAuthTicket } from '../data/vibeTicketMock';
import { BriefStage } from '../components/BriefStage';
import { PlanStage } from '../components/PlanStage';
import { EvidenceStage } from '../components/EvidenceStage';
import { ReviewStage } from '../components/ReviewStage';

interface TicketDetailProps {
  id?: string;
  onBack: () => void;
}

export function TicketDetail({ id, onBack }: TicketDetailProps) {
  const ticket = mockAuthTicket;
  const [currentStage, setCurrentStage] = useState<VibeStage>(ticket.vibeStage);
  const [drawerOpen, setDrawerOpen] = useState(true);

  return (
    <div className="flex flex-col h-full overflow-hidden bg-surface">
      <TicketHeader ticket={ticket} onBack={onBack} />
      
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
        />
      </div>
    </div>
  );
}

interface TicketHeaderProps {
  ticket: VibeTicket;
  onBack: () => void;
}

function TicketHeader({ ticket, onBack }: TicketHeaderProps) {
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
            ${ticket.agileStatus === 'in_progress' ? 'border-on-surface bg-surface-variant' : 'border-outline bg-surface-container'}
          `}>
            <div className={`w-2 h-2 ${ticket.agileStatus === 'in_progress' ? 'bg-primary' : 'bg-tertiary'}`}></div>
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
  logs: Array<{
    time: string;
    tag: string;
    text: string;
    tagColor?: string;
    textColor?: string;
    active?: boolean;
  }>;
}

function TerminalDrawer({ isOpen, onToggle, logs }: TerminalDrawerProps) {
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
            <div className="w-2 h-2 bg-primary-fixed animate-pulse"></div> RUNNING
          </span>
        </div>
      </div>

      {isOpen && (
        <div className="flex-1 overflow-y-auto p-2 text-xs font-mono space-y-1 dark-scroll">
          {logs.map((log, index) => (
            <TermLine key={index} {...log} />
          ))}
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

export default TicketDetail;
