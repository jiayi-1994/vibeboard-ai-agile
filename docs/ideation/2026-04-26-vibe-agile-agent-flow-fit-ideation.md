---
date: 2026-04-26
topic: vibe-agile-agent-flow-fit
focus: 当前产品设计是否符合 vibe coding 的敏捷 AI Agent 流程开发
mode: repo-grounded
---

# Ideation: VibeBoard 是否贴合 vibe coding 敏捷 AI Agent 流程

## Verdict

当前设计 **方向基本正确，但还没有完全贴合真实 vibe coding 敏捷 AI Agent 流程**。

综合评分：**72 / 100**

- **强项**：产品定位已经从 Vite 专用看板转成 vibe coding 敏捷追踪；核心闭环覆盖 idea、Vibe Ticket、Agent Timeline、运行证据、自动验收、Review、Context Pack。
- **主要缺口**：当前更像“带 Agent 可观测的敏捷看板”，还不够像“vibe coding 过程控制台”。最缺的是 idea/prompt intake、计划确认、执行证据树、风险门禁、Context Pack 检索入口，以及非 UI 任务的运行证据模型。

## Grounding Context

### Codebase Context

- `README.md` 已明确定位为“面向 vibe coding 场景的敏捷追踪工作台”，并强调从“边聊边改代码的黑盒过程”变成可计划、可观察、可验收、可复盘。
- `docs/product/prd.md` 已覆盖 Vibe Ticket、Evidence-Driven Status、Observable Agent Work、Visual & Behavioral Review、Context Pack Memory。
- `docs/product/feature-specs.md` 已定义 Agent Execution Timeline、Executable Acceptance Criteria、DiffReel Review、Context Pack。
- `docs/technical/data-model.md` 已有 `AgentRun`、`TimelineEvent`、`PreviewSession`、`DiffReel`、`ContextPack` 草案，但 `Task` 缺少 vibe brief / source prompt / constraints / non-goals / expected outcome 等字段。
- `apps/vibeboard-ai-web/src/views/TicketDetail.tsx` 有任务简报、验收标准、preview 和 terminal，但还没有计划确认、patch 审批、证据树、风险门禁这些关键交互。
- `apps/vibeboard-ai-web/src/views/Agents.tsx` 有多 Agent 监控和冲突提示，但与具体任务状态、变更范围和审批策略的关系还不清晰。

### External Context

- GitHub Copilot coding agent 的公开文档强调：任务在独立临时开发环境里执行，能探索代码、修改、运行测试/linters，并在 PR 流程里迭代。
- OpenAI Codex cloud 文档强调：任务在单独 sandbox/container 中运行，可以读写和执行代码，后台并行工作，并准备 PR。
- GitHub/Linear 方向都在强化“给 agent 派任务、追踪进度、Review 结果”的 mission-control / activity-timeline 模式。

## Fit Assessment

| 维度 | 当前匹配度 | 判断 |
| --- | --- | --- |
| vibe coding idea → task | 中 | 有 Vibe Ticket 概念，但缺少 idea/prompt intake 和 scope framing。 |
| 敏捷状态流转 | 中高 | Backlog/Ready/In Progress/Review/Done/Blocked 已有，但 readiness gate 不够 agent-native。 |
| Agent 计划与执行 | 中 | 文档有计划和 timeline，UI 缺计划确认、patch 审批、checkpoint。 |
| 运行证据 | 中高 | 已从 Vite 转为 workspace preview，但非 UI 证据类型还不够突出。 |
| 自动验收 | 高 | 验收标准、检查项、通过率设计清晰。 |
| Review 决策 | 中高 | DiffReel 方向对，但缺风险摘要、变更范围、回滚路径。 |
| Context Pack 复利 | 中 | 文档有，但 UI 和流程入口不够核心。 |
| 多 Agent 管控 | 中 | 有 Agents 页面和冲突提示，但缺任务级所有权、锁、权限与自治策略。 |

## Ranked Ideas

### 1. 把 Vibe Ticket 入口改成 “Idea Brief → Agent Plan → Execution” 三段式

**Description:** 任务创建页不要只是标题/描述/验收标准，而要先捕获用户的 vibe：原始 idea、目标用户、期望变化、约束、非目标、参考材料、允许修改范围。创建后由 Agent 生成可确认计划，确认后才进入执行。

**Warrant:** `direct:` `docs/product/prd.md` 已说要追踪从 idea、prompt、计划、执行、纠偏到验收的完整 vibe loop，但当前数据模型的 `Task` 仍主要是传统 task 字段。

**Rationale:** vibe coding 的最大风险不是“没有任务卡”，而是 prompt 和意图在聊天中漂移。把 idea brief 结构化，能让后续 Agent 计划、验收和 Review 都有共同锚点。

**Downsides:** 会让创建任务比普通看板更重，需要设计轻量默认模板。

**Confidence:** 92%

**Complexity:** Medium

**Status:** Unexplored

### 2. 增加 Agent Plan Approval / Checkpoint Gate

**Description:** 在 Ticket Detail 中新增计划面板：Agent 先输出拆解步骤、预计改动文件、风险、检查命令和完成定义。用户可以批准、要求改计划，或只批准部分步骤。执行中遇到高风险行为时进入 checkpoint。

**Warrant:** `direct:` `docs/product/prd.md` 已决策“AI Agent 第一阶段：生成 patch，人工确认后应用”；`docs/technical/agent-design.md` 也要求高风险修改进入人工确认。

**Rationale:** 这会把产品从“看 AI 跑日志”提升为“人类可控地驾驶 Agent”。这正是 vibe coding 与敏捷管理结合时最关键的信任层。

**Downsides:** 需要定义风险分类和审批 UI；MVP 可以先用静态 mock。

**Confidence:** 90%

**Complexity:** Medium

**Status:** Unexplored

### 3. 把 Timeline 升级成 Evidence Tree，而不是普通日志流

**Description:** Timeline 不只显示事件行，而要按 plan step 聚合证据：输入 prompt、读取文件、修改 diff、命令、stdout/stderr、截图、检查结果、用户纠偏、最终摘要。每个 step 能展开，失败可从 checkpoint 重试。

**Warrant:** `direct:` `docs/product/feature-specs.md` 要记录 prompt、plan、file_read、file_write、command、test、error、decision、user_instruction；当前 `TicketDetail.tsx` 主要还是 terminal mock。

**Rationale:** vibe coding 的 Review 不是只看最终结果，而是要知道 Agent 为什么这么做、哪里失败、哪里被纠偏。Evidence Tree 能减少“AI 黑盒完成”的不信任。

**Downsides:** UI 密度高，容易复杂；建议先做 step 分组和 artifact 链接。

**Confidence:** 88%

**Complexity:** High

**Status:** Unexplored

### 4. 为非 UI 任务定义 “运行证据类型”

**Description:** Workspace Preview 不应只表现为 iframe。给任务增加 evidence type：UI preview、API response、test run、CLI output、database diff、log assertion、screenshot diff。看板卡和 Review 页面根据 evidence type 展示不同证据。

**Warrant:** `direct:` `docs/product/prd.md` 已写“对非 UI 任务，preview 可以替换为测试结果、接口响应、日志或其他运行证据”，但 UI 仍以 preview iframe 为中心。

**Rationale:** 如果目标是全栈 vibe coding 团队，产品必须服务 backend、integration、QA、docs 等任务，否则会退回前端预览工具。

**Downsides:** 会扩大信息架构；MVP 可先支持 UI preview + test/log evidence 三类。

**Confidence:** 86%

**Complexity:** Medium

**Status:** Unexplored

### 5. 把 Context Pack 从“完成后产物”前移为“任务启动前上下文选择器”

**Description:** 创建/执行任务前，系统推荐相关 Context Pack，用户可以选择注入哪些上下文；执行后再生成新的 Pack 草案。Ticket Detail 显示“本次 Agent 使用了哪些上下文”。

**Warrant:** `direct:` `docs/product/product-vision.md` 强调“上下文会复利”；`docs/product/feature-specs.md` 已要求新任务能显示可能相关的 Context Pack。

**Rationale:** vibe coding 的质量高度依赖上下文。只在 Done 后生成 Pack 不够，必须让它参与下一次任务启动，才能形成复利。

**Downsides:** 需要检索/推荐逻辑；原型阶段可用手动选择和 mock 推荐。

**Confidence:** 84%

**Complexity:** Medium

**Status:** Unexplored

### 6. 增加 Agent Autonomy & Risk Policy 作为敏捷流程的一等公民

**Description:** 每个项目/任务可设置自治等级：只读分析、生成计划、生成 patch、自动应用低风险 patch、自动开 PR。风险策略决定哪些操作必须人工确认，例如依赖安装、删除文件、跨模块重构、数据库迁移。

**Warrant:** `direct:` `apps/vibeboard-ai-web/src/views/Settings.tsx` 已有 `AUTONOMY_LEVEL`，但目前只是设置项；`docs/technical/agent-design.md` 已定义高风险修改要确认。

**Rationale:** 敏捷 AI Agent 流程的核心不是“让 Agent 自动做越多越好”，而是让团队能按风险把自动化分级。

**Downsides:** 需要策略解释和默认值；否则用户会被配置吓到。

**Confidence:** 82%

**Complexity:** Medium

**Status:** Unexplored

### 7. 将 Review 页面升级为 “Approve / Request Changes / Re-run / Rollback” 决策台

**Description:** Review 页面除了视觉对比，还应显示：完成定义、验收结果、风险摘要、变更范围、关联 plan step、回滚方式、Context Pack 草案。Reviewer 可以批准、要求修改、重跑检查、回滚到 checkpoint。

**Warrant:** `direct:` `docs/product/prd.md` 要让非代码用户理解变化、风险和是否可批准；当前 `Review.tsx` 已有 Before/After 和 Approve/Request changes，但风险和回滚信息不足。

**Rationale:** 真实团队不会只问“看起来对不对”，还会问“风险在哪、怎么验证、出问题怎么回退”。这是从 demo 原型走向可用工具的关键一步。

**Downsides:** 需要更多后端数据支撑；MVP 可先展示 mock risk summary。

**Confidence:** 80%

**Complexity:** Medium

**Status:** Unexplored

## Rejection Summary

| # | Idea | Reason Rejected |
|---|---|---|
| 1 | 做完整 Jira 替代 | 已被 PRD 明确列为非目标，且会稀释 vibe coding 定位。 |
| 2 | 做 100 Agent swarm 控制台 | 超出 MVP，当前痛点更偏单任务可控与可验收。 |
| 3 | 回到 Vite preview 专用定位 | 用户已明确纠正方向，且会限制全栈 vibe coding 场景。 |
| 4 | 先做复杂企业权限/SSO | 对当前产品差异化帮助小，且 PRD 已列非目标。 |
| 5 | 把 UI 做得更游戏化 | 视觉可加强，但不是当前流程匹配度的最大缺口。 |

## Recommended Next Move

优先进入 `ce-brainstorm` 深挖 **“Vibe Ticket 三段式：Idea Brief → Agent Plan → Execution Evidence”**。这是当前最能把产品从普通 AI 看板拉向真正 vibe coding 敏捷流程的主线。
