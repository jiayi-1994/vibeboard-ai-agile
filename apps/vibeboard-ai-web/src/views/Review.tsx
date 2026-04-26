export function Review() {
  return (
    <div className="flex-1 h-full flex flex-col lg:flex-row border-2 border-on-surface bg-surface-container-highest overflow-hidden">
      
      {/* Center: Diff Viewer */}
      <section className="flex-1 flex flex-col border-b-2 lg:border-b-0 lg:border-r-2 border-on-surface bg-surface relative min-h-[500px]">
        <div className="h-14 border-b-2 border-on-surface flex items-center justify-between px-4 bg-surface-container-low shrink-0">
          <div className="flex items-center gap-4">
            <span className="text-xl font-bold text-on-surface">UI-902: 优化数据网格密度</span>
            <span className="px-2 py-0.5 border border-on-surface bg-primary-container text-white text-xs font-bold uppercase">待评审</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-on-surface-variant">
            <span className="material-symbols-outlined text-sm">commit</span>
            <span>a7f8b9c</span>
          </div>
        </div>

        <div className="flex-1 relative overflow-hidden bg-surface-dim pixel-checker">
          <div className="absolute top-4 left-4 z-10 border-2 border-on-surface bg-surface px-3 py-1 font-bold text-sm tracking-wider uppercase shadow-[2px_2px_0px_0px_#1e1c0d]">BEFORE (旧版)</div>
          <div className="absolute top-4 right-4 z-10 border-2 border-on-surface bg-primary text-white px-3 py-1 font-bold text-sm tracking-wider uppercase shadow-[2px_2px_0px_0px_#1e1c0d]">AFTER (新版)</div>

          <div className="absolute inset-4 md:inset-8 border-2 border-on-surface bg-surface shadow-[4px_4px_0px_0px_#1e1c0d] flex overflow-hidden">
            {/* Left Before */}
            <div className="w-1/2 h-full border-r border-on-surface relative bg-surface p-4 md:p-8">
              <div className="w-full h-full border border-on-surface flex flex-col opacity-60">
                <div className="h-10 border-b border-on-surface flex items-center px-4 gap-4">
                  <div className="h-4 w-24 bg-tertiary-fixed"></div>
                  <div className="h-4 w-16 bg-tertiary-fixed"></div>
                </div>
                <div className="flex-1 p-4 space-y-4">
                  <div className="h-12 border border-on-surface flex items-center px-4"><div className="h-4 w-1/3 bg-tertiary-fixed"></div></div>
                  <div className="h-12 border border-on-surface flex items-center px-4"><div className="h-4 w-1/2 bg-tertiary-fixed"></div></div>
                  <div className="h-12 border border-on-surface flex items-center px-4"><div className="h-4 w-1/4 bg-tertiary-fixed"></div></div>
                </div>
              </div>
            </div>
            {/* Right After */}
            <div className="w-1/2 h-full relative bg-surface p-4 md:p-8">
              <div className="w-full h-full border-2 border-on-surface flex flex-col bg-surface-container-lowest">
                <div className="h-8 border-b-2 border-on-surface flex items-center px-2 gap-2 bg-secondary-fixed">
                  <div className="h-3 w-20 bg-on-surface"></div>
                  <div className="h-3 w-12 bg-on-surface"></div>
                </div>
                <div className="flex-1 p-2 space-y-1 bg-[#fff9ea]">
                  <div className="h-8 border border-on-surface flex items-center px-2 bg-surface hover:bg-surface-dim"><div className="h-3 w-1/3 bg-primary"></div></div>
                  <div className="h-8 border border-on-surface flex items-center px-2 bg-surface hover:bg-surface-dim"><div className="h-3 w-1/2 bg-primary"></div></div>
                  <div className="h-8 border border-on-surface flex items-center px-2 bg-surface hover:bg-surface-dim"><div className="h-3 w-1/4 bg-primary"></div></div>
                  <div className="h-8 border border-on-surface flex items-center px-2 bg-surface hover:bg-surface-dim"><div className="h-3 w-2/3 bg-primary"></div></div>
                </div>
              </div>
            </div>

            {/* Slider Mock */}
            <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-primary z-20 -translate-x-1/2 flex items-center justify-center cursor-ew-resize">
              <div className="w-6 h-12 bg-surface border-2 border-on-surface flex flex-col items-center justify-center gap-1 shadow-[2px_2px_0px_0px_#1e1c0d]">
                <div className="w-0.5 h-6 bg-on-surface"></div>
                <div className="w-0.5 h-6 bg-on-surface absolute ml-2"></div>
                <div className="w-0.5 h-6 bg-on-surface absolute -ml-2"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="h-12 border-t-2 border-on-surface bg-surface-container-low flex items-center justify-between px-4 shrink-0">
          <div className="flex gap-2">
            <button className="border border-on-surface px-3 py-1 text-xs font-bold uppercase hover:bg-on-surface hover:text-surface">100%</button>
            <button className="border border-on-surface px-3 py-1 text-xs font-bold uppercase hover:bg-on-surface hover:text-surface border-b-2">自适应</button>
          </div>
          <div className="text-xs text-on-surface-variant flex items-center gap-1 font-bold">
            <span className="material-symbols-outlined text-sm">info</span>
            按住 Shift 锁定滑动轴
          </div>
        </div>
      </section>

      {/* Right Sidebar */}
      <aside className="w-full lg:w-80 bg-surface flex flex-col shrink-0 overflow-y-auto">
        <div className="p-6 border-b-2 border-on-surface bg-surface-container-high">
          <h3 className="text-xs text-tertiary mb-2 uppercase font-bold tracking-wider">提请人</h3>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 border border-on-surface bg-primary-fixed-dim"></div>
            <span className="text-base font-bold uppercase">DEV_LEON</span>
          </div>
        </div>

        <div className="p-6 border-b-2 border-on-surface">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">subject</span>
            变更摘要
          </h3>
          <ul className="space-y-3 text-sm text-on-surface-variant">
            <li className="flex items-start gap-2">
              <span className="material-symbols-outlined text-sm mt-0.5">arrow_right</span>
              重构了数据网格的 CSS Grid 布局以提升性能。
            </li>
            <li className="flex items-start gap-2">
              <span className="material-symbols-outlined text-sm mt-0.5">arrow_right</span>
              行高从 48px 压缩至 32px，增加屏幕信息密度。
            </li>
          </ul>
        </div>

        <div className="p-6 border-b-2 border-on-surface flex-1">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">fact_check</span>
            测试结果核对
          </h3>
          <div className="space-y-4">
            <ReviewCheck checked text="响应式断点测试通过" />
            <ReviewCheck checked text="暗黑模式色彩映射正确" />
            <ReviewCheck text="交互热区符合 4px 栅格" />
          </div>
        </div>

        <div className="p-6 bg-surface-container-low mt-auto border-t-2 border-on-surface space-y-3">
          <button className="w-full bg-primary text-white border-2 border-on-surface py-3 font-bold uppercase hover:bg-on-surface hover:text-white shadow-[2px_2px_0px_0px_#1e1c0d] active:shadow-none active:translate-y-[2px] active:translate-x-[2px] flex items-center justify-center gap-2 transition-all duration-75">
            <span className="material-symbols-outlined text-sm">thumb_up</span>
            批准合并 (APPROVE)
          </button>
          <button className="w-full bg-surface text-on-surface border-2 border-on-surface py-3 font-bold uppercase hover:bg-surface-dim shadow-[2px_2px_0px_0px_#1e1c0d] active:shadow-none active:translate-y-[2px] active:translate-x-[2px] flex items-center justify-center gap-2 transition-all duration-75">
            <span className="material-symbols-outlined text-sm">rate_review</span>
            请求修改 (REQUEST CHANGES)
          </button>
        </div>
      </aside>
    </div>
  );
}

function ReviewCheck({ checked, text }: any) {
  return (
    <label className="flex items-center gap-3 cursor-pointer group">
      <div className="w-5 h-5 border-2 border-on-surface bg-surface flex items-center justify-center shrink-0 group-hover:bg-surface-dim">
        {checked && <div className="w-2.5 h-2.5 bg-on-surface"></div>}
      </div>
      <span className={`text-sm tracking-wide ${checked ? 'line-through decoration-on-surface/50 text-on-surface-variant' : 'text-on-surface font-bold'}`}>
        {text}
      </span>
    </label>
  );
}
