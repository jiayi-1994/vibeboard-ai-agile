export function Epic() {
  return (
    <div className="flex flex-col gap-6 h-full overflow-y-auto">
      <header className="mb-2 flex flex-col md:flex-row justify-between md:items-end gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-zinc-900 text-white text-xs px-2 py-1 font-bold uppercase tracking-wider">EPIC-2024-Q3</span>
            <span className="bg-[#2EB086] text-white text-xs px-2 py-1 font-bold uppercase tracking-wider">进行中</span>
          </div>
          <h1 className="text-4xl font-bold text-zinc-900 leading-tight">核心业务重构与微服务化</h1>
          <p className="text-zinc-600 mt-2 max-w-2xl">拆分现有单体架构，实现认证鉴权、订单处理与用户资产中心的独立微服务部署，提升系统扩展性。</p>
        </div>
        <div className="flex gap-4">
          <button className="bg-surface-container-lowest text-zinc-900 brutal-border px-4 py-2 text-sm font-bold uppercase hover:bg-zinc-900 hover:text-white transition-colors">
            编辑 Epic
          </button>
          <button className="bg-[#2EB086] text-white brutal-border px-4 py-2 text-sm font-bold uppercase hover:bg-zinc-900 transition-colors flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">play_arrow</span>
            推进阶段
          </button>
        </div>
      </header>

      {/* Progress */}
      <section className="bg-surface-container-lowest brutal-border p-6 flex flex-col">
        <div className="flex justify-between items-end mb-4">
          <h2 className="text-2xl font-bold text-zinc-900 flex items-center gap-2">
            <span className="material-symbols-outlined">data_usage</span>
            总体进度
          </h2>
          <div className="text-right">
            <span className="text-4xl font-bold text-[#2EB086]">68%</span>
            <span className="text-sm text-zinc-600 block uppercase font-bold tracking-wider mt-1">45/66 故事已完成</span>
          </div>
        </div>
        <div className="h-6 w-full bg-surface-container-high border-2 border-zinc-900 relative overflow-hidden">
          <div className="absolute top-0 left-0 h-full bg-[#2EB086] border-r-2 border-zinc-900 transition-all duration-500" style={{ width: '68%' }}>
            <div className="w-full h-full opacity-20" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, #000 10px, #000 20px)' }}></div>
          </div>
        </div>
        <div className="flex justify-between mt-3 text-xs text-zinc-600 font-bold uppercase tracking-wider">
          <span>01-15 启动</span>
          <span>当前里程碑: Auth 联调</span>
          <span>04-30 交付</span>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
        {/* Story Map */}
        <section className="lg:col-span-2 bg-surface-container-lowest brutal-border flex flex-col min-h-[400px]">
          <div className="p-4 border-b-2 border-on-surface bg-surface-container-low flex justify-between items-center">
            <h3 className="text-lg text-zinc-900 flex items-center gap-2 font-bold tracking-wide">
              <span className="material-symbols-outlined">route</span>
              故事生命周期流转 (Story Map)
            </h3>
            <div className="flex gap-2">
              <span className="bg-zinc-900 text-white text-xs px-2 py-1 font-bold uppercase tracking-wider">视图: 瀑布流</span>
            </div>
          </div>
          <div className="p-6 bg-surface flex flex-nowrap gap-6 flex-1 overflow-x-auto relative min-h-[300px]">
            <div className="absolute top-1/2 left-0 w-max min-w-full h-0.5 bg-zinc-900 -translate-y-1/2 z-0 opacity-20 hidden md:block"></div>

            
            <StoryCol title="需求池 (Backlog)" count={12} color="border-zinc-900">
              <StoryCard id="STORY-89" title="旧版 Token 验证网关迁移适配" />
              <StoryCard id="STORY-92" title="OAuth2.0 社交登录模块集成" />
            </StoryCol>
            
            <StoryCol title="开发中 (Dev)" count={3} color="border-[#2EB086]" titleColor="text-[#2EB086]">
              <div className="bg-[#F2EBD3] brutal-border p-3 border-[#2EB086] cursor-pointer">
                <div className="flex justify-between items-start mb-2">
                  <span className="bg-[#2EB086] text-white text-[10px] px-1 font-bold uppercase tracking-wider">STORY-75</span>
                  <span className="material-symbols-outlined text-[#2EB086] text-sm">code</span>
                </div>
                <p className="text-sm text-zinc-900 leading-snug font-bold">Auth 服务核心鉴权接口研发</p>
                <div className="mt-3 flex items-center gap-2">
                  <div className="w-5 h-5 bg-zinc-800 brutal-border flex items-center justify-center">
                     <span className="material-symbols-outlined text-[12px] text-white">person</span>
                  </div>
                  <span className="text-[10px] text-zinc-600 font-bold">85%</span>
                </div>
              </div>
            </StoryCol>
            
            <StoryCol title="测试验证 (Test)" count={2} color="border-orange-500" titleColor="text-orange-600">
               <StoryCard id="STORY-68" title="JWT 令牌刷新机制异常修复" highlight="BLOCKER" highlightColor="orange" icon="bug_report" />
            </StoryCol>
            
            <StoryCol title="已完成 (Done)" count={45} color="border-zinc-900">
               <StoryCard id="STORY-42" title="数据库表结构设计与建表" isDone />
               <StoryCard id="STORY-45" title="Redis 缓存集群部署" isDone />
            </StoryCol>
          </div>
        </section>

        {/* Context Assets */}
        <section className="lg:col-span-1 bg-surface-container-lowest brutal-border flex flex-col h-full">
          <div className="p-4 border-b-2 border-on-surface bg-zinc-900 text-white flex justify-between items-center">
            <h3 className="text-lg flex items-center gap-2 font-bold tracking-wide">
              <span className="material-symbols-outlined">folder_special</span>
              上下文知识包
            </h3>
          </div>
          <div className="p-4 flex flex-col gap-4 flex-1">
            <p className="text-xs text-zinc-600 mb-2 font-bold">关联资产与架构定义文档，确保开发上下文一致性。</p>
            
            <AssetItem title="Auth 服务架构图 v2.1" desc="Visio / PDF · 包含鉴权时序逻辑" icon="architecture" color="bg-secondary" />
            <AssetItem title="全局加密规则与盐值管理" desc="Wiki 页面 · MD5/RSA 规范说明" icon="enhanced_encryption" color="bg-orange-700" />
            <AssetItem title="OpenAPI 接口契约定义" desc="Swagger JSON · 实时同步中" icon="api" color="bg-blue-800" />

            <button className="mt-auto brutal-border border-dashed border-zinc-400 p-3 flex justify-center items-center gap-2 text-zinc-500 hover:text-zinc-900 hover:border-zinc-900 hover:bg-surface-container-low transition-all">
              <span className="material-symbols-outlined text-sm">add_link</span>
              <span className="text-sm font-bold tracking-wide">绑定新知识库资产</span>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

function StoryCol({ title, count, color, titleColor, children }: any) {
  return (
    <div className="flex flex-col gap-4 z-10 w-64 md:w-72 shrink-0">
      <div className={`text-sm font-bold border-b-2 pb-2 flex justify-between uppercase tracking-wider ${color} ${titleColor || 'text-zinc-900'}`}>
        <span>{title}</span>
        <span className="text-zinc-500">{count}</span>
      </div>
      {children}
    </div>
  );
}

function StoryCard({ id, title, isDone, highlight, highlightColor, icon }: any) {
  return (
    <div className={`bg-white brutal-border p-3 cursor-pointer ${isDone ? 'bg-zinc-100 opacity-70 border-zinc-400' : 'hover:bg-surface-container-low'} ${highlightColor ? `border-${highlightColor}-500` : ''}`}>
      <div className="flex justify-between items-start mb-2">
        <span className={`text-[10px] px-1 font-bold uppercase tracking-wider ${isDone ? 'text-zinc-500 line-through bg-transparent' : highlightColor ? `bg-${highlightColor}-200 text-${highlightColor}-900` : 'bg-zinc-200 text-zinc-800'}`}>
          {id}
        </span>
        {icon ? (
           <span className={`material-symbols-outlined text-sm ${highlightColor ? `text-${highlightColor}-500` : ''}`}>{icon}</span>
        ) : isDone ? (
          <span className="material-symbols-outlined text-zinc-500 text-sm">check_circle</span>
        ) : (
          <span className="w-2 h-2 bg-zinc-400"></span>
        )}
      </div>
      <p className={`text-sm leading-snug font-bold ${isDone ? 'text-zinc-500 line-through font-normal' : 'text-zinc-900'}`}>{title}</p>
      {highlight && (
        <div className={`mt-2 text-[10px] font-bold uppercase tracking-wider bg-${highlightColor}-100 text-${highlightColor}-600 px-1 inline-block border border-${highlightColor}-300`}>
          {highlight}
        </div>
      )}
    </div>
  );
}

function AssetItem({ title, desc, icon, color }: any) {
  return (
    <div className="brutal-border p-3 hover:bg-surface-container-low transition-colors cursor-pointer group flex items-start gap-3">
      <div className={`${color} text-white w-8 h-8 flex justify-center items-center brutal-border shrink-0`}>
        <span className="material-symbols-outlined text-sm">{icon}</span>
      </div>
      <div>
        <h4 className="text-sm text-zinc-900 font-bold group-hover:text-primary transition-colors">{title}</h4>
        <p className="text-xs text-zinc-500 mt-1">{desc}</p>
      </div>
    </div>
  );
}
