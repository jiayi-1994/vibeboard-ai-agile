import { ReactNode } from 'react';

type NavItemProp = {
  icon: string;
  label: string;
  isActive?: boolean;
  onClick: () => void;
  fillIcon?: boolean;
};

function NavItem({ icon, label, isActive, onClick, fillIcon }: NavItemProp) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 font-bold tracking-wider transition-all duration-75 text-left
        ${isActive 
          ? 'bg-[#2EB086] text-white border-2 border-zinc-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[1px]' 
          : 'text-zinc-800 border-b border-zinc-200 hover:bg-[#F2EBD3] active:translate-x-[1px]'
        }`}
    >
      <span className={`material-symbols-outlined ${fillIcon || isActive ? 'icon-fill' : ''}`}>{icon}</span>
      <span>{label}</span>
    </button>
  );
}

export function SideNav({ currentView, setView }: { currentView: string, setView: (v: string) => void }) {
  return (
    <aside className="bg-[#F5F5DC] border-r-2 border-zinc-900 flex flex-col w-64 h-screen fixed left-0 top-0 pt-20 z-40 hidden md:flex">
      <div className="p-4 border-b-2 border-zinc-900 flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-zinc-900 brutal-border flex items-center justify-center overflow-hidden shrink-0">
          <span className="material-symbols-outlined text-white text-xl">account_circle</span>
        </div>
        <div>
          <div className="font-bold text-zinc-900 text-sm tracking-wider uppercase">OPERATOR_01</div>
          <div className="text-xs text-[#2EB086] font-bold flex items-center gap-1">
            <div className="w-2 h-2 bg-[#2EB086] border border-zinc-900"></div>系统已就绪
          </div>
        </div>
      </div>
      
      <nav className="flex-1 flex flex-col px-2 gap-1 uppercase text-sm">
        <NavItem 
          icon="dashboard" 
          label="战报仪表盘" 
          isActive={currentView === 'dashboard'} 
          onClick={() => setView('dashboard')} 
        />
        <NavItem 
          icon="view_kanban" 
          label="看板终端" 
          isActive={currentView === 'kanban'} 
          onClick={() => setView('kanban')} 
        />
        <NavItem 
          icon="memory" 
          label="AI 助手" 
          isActive={currentView === 'agents'} 
          onClick={() => setView('agents')} 
        />
        <NavItem 
          icon="list_alt" 
          label="迭代任务" 
          isActive={currentView === 'epic' || currentView === 'ticket'} 
          onClick={() => setView('epic')} 
        />
        <NavItem 
          icon="visibility" 
          label="变更审查" 
          isActive={currentView === 'review'} 
          onClick={() => setView('review')} 
        />
        <NavItem 
          icon="settings_input_component" 
          label="系统设置" 
          isActive={currentView === 'settings'} 
          onClick={() => setView('settings')} 
        />
      </nav>

      <div className="p-4 mt-auto border-t-2 border-zinc-900 bg-[#F5F5DC]">
        <button className="w-full bg-surface-container-lowest text-zinc-900 brutal-border px-4 py-3 font-bold text-sm tracking-wider uppercase hover:bg-[#F2EBD3] shadow-[2px_2px_0px_0px_#1e1c0d] active:shadow-none active:translate-x-[1px] active:translate-y-[1px] transition-all flex justify-center items-center gap-2">
          <span className="material-symbols-outlined text-sm">add</span>
          新建迭代任务
        </button>
      </div>
    </aside>
  );
}
