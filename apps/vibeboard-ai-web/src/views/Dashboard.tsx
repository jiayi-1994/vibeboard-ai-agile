export function Dashboard() {
  return (
    <div className="flex flex-col gap-8 h-full overflow-y-auto">
      <header className="flex justify-between items-end border-b-4 border-on-surface pb-4">
        <div>
          <h1 className="text-4xl font-bold text-on-surface tracking-tighter uppercase">PROJECT DASHBOARD</h1>
          <p className="text-sm font-bold text-on-surface-variant mt-2 bg-surface-container inline-block px-2 border border-on-surface tracking-wider">SESSION_ID: 0x8F9A2B | STATUS: NOMINAL</p>
        </div>
        <div className="flex gap-2">
          <div className="w-4 h-4 bg-primary border border-on-surface"></div>
          <div className="w-4 h-4 bg-primary border border-on-surface"></div>
          <div className="w-4 h-4 bg-tertiary border border-on-surface"></div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KPIBox title="首个证据生成时间" value="42.8" unit="s" icon="timer" iconColor="text-surface-container opacity-50" />
        <KPIBox title="活跃代理小队" value="4" unit="/4" icon="groups" iconColor="text-surface-container opacity-50" />
        <KPIBox title="验收通过率" value="98.5" unit="%" icon="verified" isPrimary iconColor="text-primary opacity-20" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 flex-1">
        <section className="xl:col-span-8 bg-surface border-2 border-on-surface brutal-shadow flex flex-col">
          <div className="border-b-2 border-on-surface p-3 bg-surface-container flex justify-between items-center">
            <h2 className="text-lg font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined">memory</span>
              AGENT SQUAD HUD
            </h2>
            <span className="px-2 py-0.5 bg-primary text-white text-[10px] border border-on-surface uppercase font-bold tracking-wider">SYNCED</span>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
            <AgentCard name="PLANNER_01" role="架构与规划" task="解析用户需求并生成技术规范文档。" progress="100%" color="bg-secondary" icon="architecture" />
            <AgentCard name="CODER_02" role="代码实现" task="正在把用户 idea 转成可验收实现。" progress="65%" color="bg-on-surface" textColor="text-surface" activePulse icon="code" highlightBg />
            <AgentCard name="TESTER_03" role="测试与验证" task="等待 CODER_02 提交模块构建。" progress="0%" color="bg-tertiary" icon="bug_report" />
            <AgentCard name="REVIEWER_04" role="代码审查" task="待机中。" progress="0%" color="bg-error" icon="fact_check" />
          </div>
        </section>

        <section className="xl:col-span-4 bg-surface border-2 border-on-surface brutal-shadow flex flex-col">
          <div className="border-b-2 border-on-surface p-3 bg-surface-container flex justify-between items-center">
            <h2 className="text-lg font-bold text-on-surface">项目健康度</h2>
            <span className="material-symbols-outlined text-primary">monitor_heart</span>
          </div>
          <div className="p-6 flex flex-col gap-6 flex-1">
            <div className="text-center p-4 border-2 border-on-surface bg-surface-bright">
              <div className="text-2xl font-bold text-primary tracking-widest uppercase">STABLE</div>
              <div className="text-xs text-on-surface-variant mt-1 font-bold">NO CRITICAL ERRORS DETECTED</div>
            </div>
            
            <div className="flex flex-col gap-4">
              <Meter label="API RATE LIMIT" percent="24%" bars={3} color="bg-primary" />
              <Meter label="CONTEXT WINDOW" percent="68%" bars={7} color="bg-secondary" />
            </div>

            <button className="mt-auto w-full py-2 border-2 border-on-surface text-sm font-bold uppercase hover:bg-on-surface hover:text-surface transition-colors">
              生成健康报告
            </button>
          </div>
        </section>

        <section className="xl:col-span-12 bg-on-surface border-2 border-on-surface brutal-shadow flex flex-col h-64 mt-2">
          <div className="border-b border-surface p-2 bg-on-surface-variant flex items-center gap-2 text-surface">
            <div className="w-3 h-3 bg-error border border-surface"></div>
            <div className="w-3 h-3 bg-secondary border border-surface"></div>
            <div className="w-3 h-3 bg-primary border border-surface"></div>
            <span className="text-xs ml-2 font-bold uppercase tracking-wider">TERMINAL // 实时任务日志</span>
          </div>
          <div className="p-4 text-xs font-mono text-primary-fixed-dim overflow-y-auto flex flex-col gap-1 leading-relaxed dark-scroll">
            <div><span className="text-tertiary-fixed-dim">[10:42:01]</span> <span className="text-secondary-fixed">SYSTEM:</span> 初始化迭代任务 #992 Alpha 构建.</div>
            <div><span className="text-tertiary-fixed-dim">[10:42:05]</span> <span className="text-secondary-fixed">PLANNER_01:</span> 开始解析 README.md 及用户需求...</div>
            <div><span className="text-tertiary-fixed-dim">[10:42:18]</span> <span className="text-secondary-fixed">PLANNER_01:</span> 生成组件树结构完成. 派发任务至 CODER_02.</div>
            <div><span className="text-tertiary-fixed-dim">[10:42:20]</span> <span className="text-primary-fixed">CODER_02:</span> 接收组件 [TopNavBar, SideNavBar]. 开始构建骨架.</div>
            <div><span className="text-tertiary-fixed-dim">[10:42:45]</span> <span className="text-primary-fixed">CODER_02:</span> 注入 Tailwind CSS 配置. 应用 Brutalism 样式标记.</div>
            <div><span className="text-tertiary-fixed-dim">[10:43:10]</span> <span className="text-primary-fixed">CODER_02:</span> 仪表盘主视图构建中... 渲染 KPI 模块...</div>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-surface">_</span> <span className="w-2 h-4 bg-primary-fixed-dim animate-pulse"></span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function KPIBox({ title, value, unit, icon, isPrimary, iconColor }: any) {
  return (
    <div className={`border-2 border-on-surface p-4 brutal-shadow flex flex-col justify-between h-32 relative overflow-hidden ${isPrimary ? 'bg-primary-container text-on-primary-container' : 'bg-surface'}`}>
      <div className="text-sm font-bold uppercase">{title}</div>
      <div className={`text-4xl font-bold mt-auto ${isPrimary ? 'text-on-primary-container' : 'text-primary'}`}>{value}<span className="text-2xl">{unit}</span></div>
      <span className={`material-symbols-outlined absolute -right-4 -bottom-4 text-[80px] select-none ${iconColor}`}>{icon}</span>
    </div>
  );
}

function AgentCard({ name, role, task, progress, color, textColor, activePulse, highlightBg, icon }: any) {
  return (
    <div className={`border-2 border-on-surface p-4 flex flex-col gap-3 relative ${highlightBg ? 'bg-[#F2EBD3]' : ''}`}>
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 ${color} ${textColor || 'text-white'} flex items-center justify-center border border-on-surface`}>
            <span className="material-symbols-outlined text-sm">{icon}</span>
          </div>
          <div>
            <div className="text-sm font-bold leading-tight uppercase">{name}</div>
            <div className={`text-xs ${color.replace('bg-', 'text-')}`}>{role}</div>
          </div>
        </div>
        <div className={`w-2 h-2 ${activePulse ? 'bg-primary animate-pulse' : 'bg-primary'}`}></div>
      </div>
      <div className="text-xs border-t border-dashed border-on-surface pt-2 h-16">
        <span className="text-on-surface-variant font-bold">当前任务:</span> {task}
      </div>
      <div className="w-full bg-surface-container h-2 mt-auto border border-on-surface">
        <div className={`h-full ${activePulse ? 'bg-primary' : color}`} style={{ width: progress }}></div>
      </div>
    </div>
  );
}

function Meter({ label, percent, bars, color }: any) {
  return (
    <div>
      <div className="flex justify-between text-xs font-bold mb-1 uppercase">
        <span>{label}</span>
        <span>{percent}</span>
      </div>
      <div className="flex h-4 border border-on-surface gap-[1px] bg-on-surface p-[1px]">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className={`flex-1 ${i < bars ? color : 'bg-surface'}`}></div>
        ))}
      </div>
    </div>
  );
}
