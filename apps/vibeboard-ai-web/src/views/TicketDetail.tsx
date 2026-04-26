export function TicketDetail({ id, onBack }: { id: string, onBack: () => void }) {
  return (
    <div className="flex flex-col h-full overflow-hidden bg-surface gap-4">
      <div className="flex-1 border-2 border-on-surface bg-surface-container-lowest flex flex-col md:flex-row overflow-hidden shadow-[4px_4px_0px_0px_#1e1c0d]">
        
        {/* Left Panel: Briefing */}
        <div className="w-full md:w-[45%] flex flex-col border-b-2 md:border-b-0 md:border-r-2 border-on-surface bg-surface">
          <div className="h-10 border-b border-on-surface bg-surface-container flex items-center px-2 gap-2 shrink-0">
            <button onClick={onBack} className="hover:bg-surface-variant p-1 border border-transparent hover:border-on-surface">
              <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            </button>
            <span className="text-xs uppercase tracking-wider font-bold">Ticket Details</span>
            <div className="ml-auto flex gap-1">
              <button className="w-6 h-6 border border-on-surface hover:bg-surface-variant flex items-center justify-center"><span className="material-symbols-outlined text-[16px]">edit</span></button>
              <button className="w-6 h-6 border border-on-surface hover:bg-surface-variant flex items-center justify-center"><span className="material-symbols-outlined text-[16px]">more_horiz</span></button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="text-xs bg-on-surface text-surface px-2 py-1 uppercase">{id}</span>
                <span className="text-xs border border-on-surface text-on-surface px-2 py-1 bg-surface-variant flex items-center gap-1 uppercase font-bold">
                  <div className="w-2 h-2 bg-primary"></div> IN_PROGRESS
                </span>
                <span className="text-xs border border-error text-error px-2 py-1 bg-error-container uppercase font-bold">PRIORITY: HIGH</span>
              </div>
              <h1 className="text-3xl font-bold text-on-surface tracking-tight leading-tight">实现身份验证流程</h1>
            </div>

            <div className="grid grid-cols-2 gap-1 border-y border-on-surface py-2 text-xs">
              <div className="flex flex-col gap-1 border-r border-on-surface border-dashed pr-2">
                <span className="text-on-surface-variant">ASSIGNEE</span>
                <span className="font-bold flex items-center gap-1 uppercase"><span className="material-symbols-outlined text-[14px]">smart_toy</span> Agent-007</span>
              </div>
              <div className="flex flex-col gap-1 pl-2">
                <span className="text-on-surface-variant">SPRINT</span>
                <span className="font-bold uppercase">Iteration 14 (Alpha)</span>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-xs uppercase border-b border-on-surface border-dotted pb-1 flex items-center gap-1 font-bold">
                <span className="material-symbols-outlined text-[16px]">subject</span> 任务简报
              </h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                需要在客户端和服务器之间建立安全的身份验证机制。目前前端路由处于完全开放状态，必须实现基于 JWT 的登录拦截。Agent 需要生成对应的登录界面，对接 `/api/v1/auth/login` 端点，并在成功后将 Token 注入到本地存储及全局请求头中。
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-xs uppercase border-b border-on-surface border-dotted pb-1 flex items-center gap-1 font-bold">
                <span className="material-symbols-outlined text-[16px]">check_box</span> 验收标准
              </h3>
              <div className="flex flex-col gap-2 mt-2">
                <CheckItem text="生成基础登录表单 UI 组件 (账号/密码)" checked />
                <CheckItem text="集成 Axios 请求库并配置拦截器" checked />
                <CheckItem text="实现 Vue/React 路由守卫拦截未授权访问" active />
                <CheckItem text="处理 401 Unauthorized 错误响应并清空本地态" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel: Preview */}
        <div className="w-full md:w-[55%] flex flex-col bg-surface-container-low min-h-[400px]">
          <div className="h-12 border-b border-on-surface bg-surface-variant flex items-center px-2 gap-4 shrink-0">
            <div className="flex gap-1">
              <div className="w-3 h-3 border border-on-surface bg-surface-container-highest"></div>
              <div className="w-3 h-3 border border-on-surface bg-surface-container-highest"></div>
              <div className="w-3 h-3 border border-on-surface bg-surface-container-highest"></div>
            </div>
            <div className="flex gap-1">
              <button className="text-on-surface hover:bg-surface-container p-1"><span className="material-symbols-outlined text-[18px]">arrow_back</span></button>
              <button className="text-on-surface hover:bg-surface-container p-1"><span className="material-symbols-outlined text-[18px]">refresh</span></button>
            </div>
            <div className="flex-1 border-t border-l border-b border-r-[2px] border-b-[2px] border-on-surface bg-surface-container-lowest h-8 flex items-center px-2 gap-2 shadow-[1px_1px_0px_0px_#1e1c0d]">
              <span className="material-symbols-outlined text-[14px] text-primary">lock</span>
              <span className="text-xs text-on-surface font-mono">http://localhost:5173/login<span className="w-[6px] h-[12px] bg-on-surface inline-block ml-1 animate-pulse align-middle"></span></span>
            </div>
            <div className="flex items-center gap-2 px-2 border-l border-on-surface h-full">
              <span className="text-[10px] uppercase font-bold tracking-wider bg-primary text-white px-1 py-0.5 border border-on-surface">PREVIEW LIVE</span>
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center relative overflow-hidden bg-surface-dim pixel-checker p-4">
            <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
              <span className="text-[80px] md:text-[120px] font-black rotate-[-15deg] uppercase">Live Preview</span>
            </div>
            
            {/* Mock Login UI replacing iframe for visual */}
            <div className="w-full max-w-[360px] border-2 border-on-surface bg-surface-container-lowest shadow-[8px_8px_0px_0px_#1e1c0d] p-6 flex flex-col relative z-10 transition-transform hover:scale-[1.02]">
              <div className="absolute -top-3 -right-3 bg-primary-container text-white border-2 border-on-surface px-2 py-1 text-[10px] font-mono shadow-[2px_2px_0px_0px_#1e1c0d]">
                COMPONENT: AuthForm.tsx
              </div>
              <div className="text-center mb-6">
                <span className="material-symbols-outlined text-[48px] text-on-surface mb-2">security</span>
                <h2 className="text-2xl font-bold uppercase">系统验证</h2>
                <p className="text-xs text-on-surface-variant mt-1 font-bold">请输入操作员凭证</p>
              </div>
              <div className="space-y-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold uppercase">OPERATOR_ID</label>
                  <input className="border-t-[2px] border-l-[2px] border-b border-r border-on-surface bg-surface p-2 text-base focus:outline-none focus:bg-surface-container-lowest h-10 shadow-inner" type="text" defaultValue="admin_user"/>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold uppercase">ACCESS_CODE</label>
                  <input className="border-t-[2px] border-l-[2px] border-b border-r border-on-surface bg-surface p-2 text-base focus:outline-none focus:bg-surface-container-lowest h-10 shadow-inner" type="password" defaultValue="••••••••"/>
                </div>
                <button className="w-full mt-2 h-12 bg-on-surface text-surface font-bold text-base uppercase border-2 border-on-surface shadow-[4px_4px_0px_0px_#2eb086] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all flex items-center justify-center gap-2">
                  <span>初始化连接</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Terminal */}
      <div className="min-h-[200px] h-1/4 bg-on-surface flex flex-col relative">
        <div className="h-8 border-b border-on-surface-variant bg-inverse-surface flex items-center px-2 gap-2 shrink-0">
          <span className="material-symbols-outlined text-[14px] text-primary-fixed">terminal</span>
          <span className="text-[10px] text-surface uppercase font-bold tracking-widest">Agent Execution Terminal</span>
          <div className="ml-auto flex gap-2">
            <span className="flex items-center gap-1 text-[10px] text-surface font-bold">
              <div className="w-2 h-2 bg-primary-fixed animate-pulse"></div> RUNNING
            </span>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-2 text-xs font-mono space-y-1 dark-scroll">
          <TermLine time="[14:22:01]" tag="[SYSTEM]" text="Task TKT-492 initialized. Parsing requirements..." tagColor="text-secondary-fixed" />
          <TermLine time="[14:22:03]" tag="[AGENT]" text="Scaffolded AuthForm.tsx component. Added basic layout." tagColor="text-primary-fixed" />
          <TermLine time="[14:22:05]" tag="[PREVIEW]" text="Workspace evidence updated: /src/components/AuthForm.tsx" tagColor="text-surface-dim" textColor="text-tertiary-fixed" />
          <TermLine time="[14:22:15]" tag="[AGENT]" text="Implementing React Router navigation guards..." tagColor="text-primary-fixed" active />
        </div>
      </div>
    </div>
  );
}

function CheckItem({ text, checked, active }: any) {
  return (
    <label className={`flex items-start gap-2 cursor-pointer p-1 transition-colors border
      ${active ? 'bg-surface-variant border-on-surface' : 'border-transparent hover:border-on-surface border-dashed hover:bg-surface-container'}
    `}>
      <div className="w-4 h-4 border border-on-surface bg-surface-container-lowest mt-0.5 shrink-0 flex items-center justify-center">
        {checked && <div className="w-2 h-2 bg-on-surface"></div>}
        {active && <div className="w-2 h-2 bg-primary animate-pulse"></div>}
      </div>
      <span className={`text-sm ${checked ? 'line-through text-on-surface-variant' : (active ? 'font-bold' : '')}`}>
        {text}
      </span>
    </label>
  );
}

function TermLine({ time, tag, text, tagColor, textColor, active }: any) {
  if (active) {
    return (
      <div className="flex text-primary-fixed bg-on-surface-variant px-1 py-0.5 border-l-2 border-primary-fixed">
        <span className="w-[80px] shrink-0 opacity-80">{time}</span>
        <span className="w-[80px] shrink-0 font-bold">{tag}</span>
        <span className="flex-1">{text} <span className="animate-pulse bg-primary-fixed w-[6px] h-[12px] inline-block align-middle ml-1"></span></span>
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
