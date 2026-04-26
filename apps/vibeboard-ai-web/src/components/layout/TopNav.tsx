export function TopNav() {
  return (
    <nav className="bg-[#F5F5DC] border-b-2 border-zinc-900 flex justify-between items-center w-full px-4 h-16 fixed top-0 z-50">
      <div className="flex items-center gap-4">
        <span className="text-lg font-black tracking-tighter text-zinc-900 font-['Space_Grotesk'] uppercase">VIBEBOARD AI 敏捷追踪中心</span>
      </div>

      <div className="flex items-center gap-6">
        <div className="hidden md:flex items-center brutal-border bg-surface-container-lowest px-2 py-1">
          <span className="material-symbols-outlined text-on-surface-variant text-sm border-none">search</span>
          <input className="bg-transparent border-none focus:ring-0 text-sm font-mono tracking-widest w-48 outline-none placeholder:text-zinc-400" placeholder="SEARCH..." type="text"/>
        </div>

        <div className="flex items-center gap-4 border-l-2 border-zinc-900 pl-4">
          <button className="text-zinc-600 hover:bg-zinc-900 hover:text-white transition-none p-1 flex items-center justify-center active:translate-x-[1px] active:translate-y-[1px]">
            <span className="material-symbols-outlined">terminal</span>
          </button>
          <button className="text-zinc-600 hover:bg-zinc-900 hover:text-white transition-none p-1 flex items-center justify-center active:translate-x-[1px] active:translate-y-[1px]">
            <span className="material-symbols-outlined">settings</span>
          </button>
          <button className="text-zinc-600 hover:bg-zinc-900 hover:text-white transition-none p-1 flex items-center justify-center active:translate-x-[1px] active:translate-y-[1px] relative">
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-1 right-1 w-2 h-2 bg-error border border-zinc-900"></span>
          </button>
        </div>

        <button className="text-[#2EB086] font-bold uppercase border-2 border-[#2EB086] px-4 py-1.5 hover:bg-[#2EB086] hover:text-white active:translate-x-[1px] active:translate-y-[1px] shadow-[2px_2px_0px_0px_rgba(30,28,13,1)] active:shadow-none transition-all">
          系统部署
        </button>
      </div>
    </nav>
  );
}
