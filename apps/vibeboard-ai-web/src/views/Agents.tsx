export function Agents() {
  return (
    <div className="flex flex-col gap-6 h-full overflow-y-auto">
      <div className="mb-6 border-b-2 border-on-surface pb-4">
        <h2 className="text-4xl font-bold text-on-surface">Agent 运行中心</h2>
        <p className="text-lg text-on-surface-variant font-bold tracking-wide mt-2">监控 vibe coding 中所有活跃 AI 执行</p>
      </div>

      <div className="bg-error-container brutal-border mb-6 p-4 flex items-start gap-4">
        <span className="material-symbols-outlined text-error" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
        <div>
          <h3 className="font-mono text-sm text-on-error-container font-bold uppercase tracking-wider">警告: 多代理冲突检测</h3>
          <p className="text-xs text-on-error-container mt-1 font-bold">检测到 Agent_Alpha 与 Agent_Beta 在访问 "core_module_v2.py" 时发生读写锁竞争。建议立即介入。</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-surface-container-highest brutal-border p-4 flex flex-col justify-between h-32 relative">
          <span className="text-sm font-bold text-on-surface-variant uppercase tracking-wider">活跃代理总数</span>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-on-surface">42</span>
            <span className="text-xs font-bold text-primary tracking-widest uppercase">/ 50 容量</span>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-surface-dim">
            <div className="h-full bg-primary" style={{ width: '84%' }}></div>
          </div>
        </div>

        <div className="bg-surface-container-highest brutal-border p-4 flex flex-col justify-between h-32">
          <span className="text-sm font-bold text-on-surface-variant uppercase tracking-wider">Token 使用量 (24h)</span>
          <span className="text-4xl font-bold text-on-surface">1.2M</span>
          <div className="flex h-4 gap-1 mt-2">
            <div className="flex-1 bg-primary-container"></div>
            <div className="flex-1 bg-primary-container"></div>
            <div className="flex-1 bg-primary-container"></div>
            <div className="flex-1 bg-surface-dim"></div>
          </div>
        </div>

        <div className="bg-surface-container-highest brutal-border p-4 flex flex-col justify-between h-32">
          <span className="text-sm font-bold text-on-surface-variant uppercase tracking-wider">任务成功率</span>
          <div className="flex items-center justify-between">
            <span className="text-4xl font-bold text-on-surface">94.5%</span>
            <span className="material-symbols-outlined text-primary text-4xl">trending_up</span>
          </div>
          <div className="flex items-end h-8 gap-1 mt-1">
            <div className="w-full bg-primary opacity-50" style={{ height: '60%' }}></div>
            <div className="w-full bg-primary opacity-60" style={{ height: '70%' }}></div>
            <div className="w-full bg-primary opacity-80" style={{ height: '85%' }}></div>
            <div className="w-full bg-primary" style={{ height: '95%' }}></div>
          </div>
        </div>
      </div>

      <div className="bg-surface-container-lowest brutal-border">
        <div className="px-4 py-2 border-b-2 border-on-surface bg-surface-dim flex justify-between items-center">
          <h3 className="text-sm font-bold text-on-surface uppercase tracking-wider">任务执行序列</h3>
          <span className="material-symbols-outlined text-on-surface">sort</span>
        </div>
        <div className="flex flex-col">
          <AgentRow name="AGENT_X99" target="/src/auth/login.ts" state="执行中" stateColor="text-primary border-primary" progress={65} progressColor="bg-primary" />
          <AgentRow name="AGENT_ALPHA" target="core_module_v2.py" state="挂起/冲突" stateColor="text-error border-error" progress={32} progressColor="bg-error" isError />
          <AgentRow name="AGENT_BETA" target="styles/global.css" state="排队中" stateColor="text-on-surface-variant border-outline" progress={0} progressColor="bg-tertiary" />
        </div>
      </div>
    </div>
  );
}

function AgentRow({ name, target, state, stateColor, progress, progressColor, isError }: any) {
  return (
    <div className={`flex flex-col md:flex-row items-start md:items-center p-4 border-b border-outline-variant transition-colors
      ${isError ? 'bg-error-container bg-opacity-20 hover:bg-error-container hover:bg-opacity-30' : 'hover:bg-surface-container-low'}
    `}>
      <div className="flex items-center md:w-1/4 mb-2 md:mb-0">
        <div className={`w-2 h-2 mr-2 ${isError ? 'bg-error' : progress === 0 ? 'bg-tertiary-container' : 'bg-primary'}`}></div>
        <span className="text-sm font-bold text-on-surface uppercase tracking-widest">{name}</span>
      </div>
      <div className="md:w-1/3 mb-2 md:mb-0">
        <span className="text-xs bg-surface-dim px-1 py-0.5 border border-on-surface font-mono">{target}</span>
      </div>
      <div className="md:w-1/6 mb-2 md:mb-0">
        <span className={`text-xs border px-2 py-1 uppercase font-bold tracking-wider ${stateColor}`}>{state}</span>
      </div>
      <div className="md:w-1/4 w-full flex items-center gap-2">
        <div className="flex-1 h-2 bg-surface-dim border border-on-surface">
          <div className={`h-full ${progressColor}`} style={{ width: `${progress}%` }}></div>
        </div>
        <span className={`text-xs font-bold ${isError ? 'text-error' : ''}`}>{progress}%</span>
      </div>
    </div>
  );
}
