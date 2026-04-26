export function Settings() {
  return (
    <div className="flex flex-col gap-6 h-full overflow-y-auto">
      <div className="mb-2 border-b-2 border-on-surface pb-4">
        <h2 className="text-4xl font-bold text-on-surface uppercase tracking-tight">系统设置</h2>
        <p className="text-lg text-on-surface-variant font-bold tracking-wide mt-2 uppercase">全局环境与模型配置 (Global Configuration)</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1">
        
        {/* API & Agent Settings */}
        <section className="bg-surface-container-lowest brutal-border p-6 flex flex-col gap-6 h-fit">
          <h3 className="text-2xl font-bold text-on-surface flex items-center gap-2 border-b-2 border-on-surface pb-4 uppercase">
            <span className="material-symbols-outlined text-primary">memory</span>
            AI Agent 核心配置
          </h3>
          
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold uppercase tracking-wider text-on-surface">DEFAULT_MODEL (默认大语言模型)</label>
              <select className="border-2 border-on-surface bg-surface p-3 text-base focus:outline-none focus:bg-surface-container-highest shadow-[2px_2px_0px_0px_#1e1c0d] font-mono appearance-none transition-colors">
                <option>gemini-3.5-pro (Recommended)</option>
                <option>gemini-3.5-flash-8b</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold uppercase tracking-wider text-on-surface">GEMINI_API_KEY</label>
              <input type="password" defaultValue="************************" className="border-t-[2px] border-l-[2px] border-b border-r border-on-surface bg-surface p-3 font-mono text-base focus:outline-none focus:bg-surface-container-lowest shadow-inner" />
              <p className="text-xs text-on-surface-variant font-bold">已通过系统环境变量 (Secrets) 安全注入</p>
            </div>

            <div className="flex flex-col gap-2 mt-2">
              <label className="text-sm font-bold uppercase tracking-wider text-on-surface">AUTONOMY_LEVEL (执行自治度等级)</label>
              <div className="flex gap-4 p-4 border-2 border-on-surface bg-surface-container-low">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="autonomy" className="appearance-none w-4 h-4 border-2 border-on-surface checked:bg-primary checked:border-primary shrink-0" />
                  <span className="font-bold text-sm">严格 (需人类确认每步)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="autonomy" defaultChecked className="appearance-none w-4 h-4 border-2 border-on-surface checked:bg-primary shrink-0" />
                  <span className="font-bold text-sm text-primary">敏捷 (自动提交 PR)</span>
                </label>
              </div>
            </div>
          </div>
          
          <button className="mt-4 bg-primary text-white border-2 border-on-surface py-3 font-bold uppercase hover:bg-on-surface hover:text-white shadow-[2px_2px_0px_0px_#1e1c0d] active:shadow-none active:translate-y-[2px] active:translate-x-[2px] transition-all">
            保存 Agent 配置 (SAVE)
          </button>
        </section>

        {/* Project & Integration Settings */}
        <section className="bg-surface-container-lowest brutal-border p-6 flex flex-col gap-6 h-fit">
          <h3 className="text-2xl font-bold text-on-surface flex items-center gap-2 border-b-2 border-on-surface pb-4 uppercase">
            <span className="material-symbols-outlined text-secondary">webhook</span>
            部署与集成 (Integration)
          </h3>
          
          <div className="flex flex-col gap-4">
             <div className="flex flex-col gap-2">
              <label className="text-sm font-bold uppercase tracking-wider text-on-surface">PREVIEW_PORT</label>
              <input type="number" defaultValue={5173} className="border-t-[2px] border-l-[2px] border-b border-r border-on-surface bg-surface p-3 font-mono text-base focus:outline-none focus:bg-surface-container-lowest shadow-inner" />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold uppercase tracking-wider text-on-surface flex justify-between">
                <span>GITHUB_WEBHOOK_URL</span>
                <span className="text-primary">Connected</span>
              </label>
              <div className="flex">
                <input type="text" readOnly defaultValue="https://hook.vibeboard.ai/gh/..." className="flex-1 border-t-[2px] border-l-[2px] border-b border-r-0 border-on-surface bg-surface-dim p-3 font-mono text-base text-on-surface-variant focus:outline-none shadow-inner" />
                <button className="bg-zinc-900 text-white px-4 border-2 border-zinc-900 border-l-0 hover:bg-surface hover:text-zinc-900 transition-colors">
                  <span className="material-symbols-outlined text-sm">content_copy</span>
                </button>
              </div>
            </div>
            
            <div className="border-2 border-error p-4 bg-error-container mt-4 flex flex-col gap-2">
               <h4 className="font-bold text-error uppercase tracking-wider text-sm flex items-center gap-1">
                 <span className="material-symbols-outlined text-[16px]">warning</span> Danger Zone
               </h4>
               <p className="text-xs text-on-error-container font-bold mb-2">清除所有本地缓存和正在运行的 workspace preview。</p>
               <button className="bg-error text-white border-2 border-error py-2 font-bold uppercase hover:bg-on-error hover:text-error transition-all hover:shadow-[2px_2px_0px_0px_#ba1a1a]">
                  重置工作区 (RESET WORKSPACE)
               </button>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
