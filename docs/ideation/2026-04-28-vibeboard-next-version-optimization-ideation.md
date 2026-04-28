---
date: 2026-04-28
topic: vibeboard-next-version-optimization
focus: 续做 vibe-agile-agent-flow-fit 的剩余 + U3-U7 落地后的新缺口
mode: repo-grounded
continues_from: docs/ideation/2026-04-26-vibe-agile-agent-flow-fit-ideation.md
---

# Ideation: VibeBoard 下个版本优化方向

承接 `docs/ideation/2026-04-26-vibe-agile-agent-flow-fit-ideation.md`。原 doc 7 个 idea 中 **#1 三段式 / #2 Plan Approval Gate / #3 Evidence Tree / #7 Review 决策台**已在 U3–U7 提交 (`9c2b56e`–`300a70e`) 落地。本次扫两类对象：

1. 原 doc 仍未启动的 **#4 Evidence type renderers / #5 Context Pack pre-load+post-Done generation / #6 Autonomy policy enforcement**
2. U3–U7 真把代码 ship 进 repo 后才暴露出来的新缺口

## Grounding Context

### Codebase Context
- 栈：Vite + React 19 + TS + Tailwind + shadcn/ui (M3 brutalist)；后端 FastAPI + SQLite + Alembic 已搭骨架但 UI 未对接
- 已 ship (U3–U7)：`BriefStage` (idea brief / context pack 卡 / AC / 约束 / 范围)、`AgentPlan` (步骤 + risk/checkpoint flag + autonomyPolicy)、`ExecutionEvidence` (按 planStepId 聚合 + 状态徽章 + terminal drawer)、`ReviewStage` (摘要 + AC 网格 + 4 张质量卡 + risk + 决策按钮)、Kanban 6 列、StageNavigation 线性

### Observable Gaps in Shipped Code
1. Mock-only：`vibeTicketMock.ts` 三张静态票，`adapter.toVibeTicketDetail()` 合成 stage，无 backend 状态同步
2. **WebSocket 失声**：`openTicketTimelineSocket` 只 patch `timelineEvents`，不动 `vibeStage` / `plan.steps[].status` / `evidence.nodes[]` → evidence 节点永卡 `running`
3. **`EvidenceType` enum 在但无 type-specific renderer**（`ui_preview | test_log | api_response | file_change | command | agent_decision | user_correction | checkpoint`）。`EvidenceNode.details?: string` 对 8 种类型一刀切
4. **Context Pack 建模 + 视觉到位但无流程**：无 retrieval API、无注入 Plan、无 Done 后自动生成、无 "本次用了哪些 pack" 回执
5. **Autonomy 字段 + 显示在但执行零落地**：`AutonomyLevel` (plan), `requiresCheckpoint` (plan step + evidence node) 三个 sibling，无中央 evaluator，无 modal 阻塞
6. Review handoff 按钮 `onClick` 未定义
7. Terminal log 不与 evidence node 关联，无 per-step filter / tag 着色
8. `AC.checkType` (`dom | playwright | screenshot | console`) 建模但无 runner 无 result UI；ReviewStage 只拿 `met: boolean`
9. Stage navigation 不 context-aware，可越过 brief 直接点 plan/review
10. Workspace preview 仅有 `previewUrl` + `previewStatus` 字段，无 iframe / 启停 / session lifecycle

### External Context（早 2026）
- GitHub Copilot Cloud Agent (Apr 2026)：plan + diff 双 gate，CodeQL+secret scan 预 PR
- OpenAI Codex Cloud：3 preset (Suggest/Auto-Edit/Full-Auto) + `granular` per-category policy + `auto_review` 子 agent
- Claude Code Background Agents：`/rewind` 检查点回滚；autonomy 用率 750+ session 内从 20%→40%
- Devin 2.x：四实时 tab (Progress/Shell/Browser/Editor)；浏览器点击录像 rich card；child-agent tab；**PR merge rate 67% 作为头条指标**
- Cognition Agent Trace spec：vendor-neutral，每段 code hunk → 起源对话/轨迹 URL
- Aider Architect mode：双模型 split (architect 出方案，editor 落 diff)
- Cline 3.5：每个 file change + terminal command 都需批；每步 checkpoint
- Cursor Mission Control：最多 8 个并行 agent + 步级 checkpoint review
- Linear Agent (Mar 2026 GA)：MCP tool / Copilot 集成 / Asks→Triage Intelligence routing
- AGENTS.md 研究 (Addy Osmani)：人 curated 比 LLM 生成强 3%
- Fly.io Sprites：1-2s cold-start + 300ms checkpoint/restore — 让亚秒 rewind 成为 UI affordance

### Whitespace（行业空白）
1. AI 输出的 **置信/风险打分** — 没人做 (Copilot/Codex/Devin/top 5 PR reviewer 全没)
2. **团队级 autonomy policy per ticket-type** — 没人把 Anthropic 的实证 autonomy 增长曲线暴露成可配团队规则
3. **Agent Trace 集成 PM workspace** — spec 在，无 PM 工具落地
4. **多 agent WIP 可视化在 PM 层** — Devin 在 agent console，PM 工具空白
5. 每票 Context Pack 作 **可组合一等公民** vs 平面 AGENTS.md
6. 非 UI 证据展示（API diff / DB schema diff / migration rollback preview）业界普遍 immature

### Old Ideation Status
| # | Idea | Status |
|---|---|---|
| 1 | 三段式 Idea Brief → Plan → Execution | **Explored / Shipped** (U3–U7) |
| 2 | Agent Plan Approval / Checkpoint Gate UI | **Partially Explored**（UI 是 / 执行否） |
| 3 | Timeline → Evidence Tree | **Explored / Shipped** (U5) |
| 4 | Evidence type renderers | **Unexplored** — 本次 #4 接力 |
| 5 | Context Pack pre-load + post-Done | **Unexplored** — 本次 #5 接力 |
| 6 | Autonomy & Risk Policy 一等公民 | **Partially Explored**（field 是 / 执行否） — 本次 #2 接力 |
| 7 | Review Approve/Request/Re-run/Rollback 决策台 | **Partially Explored**（UI 是 / 动作 inert） — 本次 #2/#6 接力 |

## Ranked Ideas

### 1. Typed Event Ledger + WebSocket Bus → live single source of truth

**Description:** 用 append-only typed event ledger (`StagePatch | PlanStepStatusPatch | EvidenceNodePatch | TerminalLogAppend | AutonomyPromptOpened | UserCorrection | Checkpoint`) 替换现在 inert 的 `openTicketTimelineSocket`，事件以 trace-node ID 为键。`vibeStage` 变成 ledger 上的 computed view 而非 stored field。Evidence 节点状态、plan step 状态、terminal log 全部通过 ledger reducer 实时 mutate。replay/rewind 自然 free。

**Warrant:** `direct:` `vibeTicket.ts:60-72` `EvidenceNode.details?: string` 对 8 种 EvidenceType 一刀切；grounding gap #2 "WebSocket inert ... Evidence nodes stuck running forever"；gap #9 stage navigation not context-aware；mock adapter 已经 "synthesize stages"，computed view 是这条思路的归宿。`external:` Devin 4-tab 同源事件流；Cognition Agent Trace spec。

**Rationale:** 这是结构 unlock。今天三个本应同源的 surface (`timelineEvents` / `evidence.nodes[]` / `vibeStage`) 各管各的，ledger 让它们成同一查询的投影。idea #3/#4/#5/#6 全部依赖这层不再各自重发明状态合成。

**Downsides:** 后端 FastAPI 需要 emit typed event 而非只持久化对象；前端 reducer fan-out 要小心。先架构后视觉，短期没有用户可见赢。

**Confidence:** 95%
**Complexity:** High
**Status:** Unexplored

---

### 2. Autonomy Policy DSL + Empirical Risk Score + Auto-Reviewer Sub-Agent

**Description:** 把散落的三个 sibling 字段 (`AutonomyLevel` / `PlanStep.requiresCheckpoint` / `EvidenceNode.requiresCheckpoint`) 用一个声明式 DSL 替换，由单一 `evaluate(action, context) → allow|prompt|block` 评估。risk score 模型用团队自己的 merge/revert/correction 历史训练，输出 `confidence ∈ [0,1]` + `risk_breakdown` 喂给 plan step / evidence node / handoff recommendation。auto-reviewer 子 agent 跑在 evidence 流上；human 只在 reviewer confidence < 阈值或 autonomy 违规时升级介入。落地旧 doc #6 的执行 + #7 的真动作。

**Warrant:** `direct:` `vibeTicket.ts:9, 45, 71` 三个 sibling autonomy field 无中央 evaluator (gap #5 "Zero enforcement")；ReviewStage 按钮 `onClick` 未定义 (gap #6)；`RiskLevel`、`PlanStep.risk`、`AgentPlan.scopeRisk`、`ReviewQualityMetrics.{testCoverage, codeQuality, documentationCompleteness, performanceBenchmark}` 已建模为 input feature；旧 doc #6 status partially shipped。`external:` Codex Cloud `granular` per-category approval + `auto_review` 子 agent；Anthropic 20→40% autonomy 增长 over 750+ session；Devin 67% PR merge rate 头条；Whitespace #1 (无 PR 风险打分) + #2 (无团队级 autonomy policy)。

**Rationale:** 旧 doc #6 只 ship field 没 ship 执行。这条把活儿做完且升一级到 per-ticket-type empirical rule。Auto-reviewer 解 Review 随票数线性 scale 的瓶颈 — Devin 67% merge rate 可作 SLA 模板；团队拿自己数据训自己阈值。

**Downsides:** 需要先攒一段 trace 历史才能校准（cold start）；reviewer 子 agent 校准不好会比手工 review 更快训出 rubber-stamping。

**Confidence:** 88%
**Complexity:** High
**Status:** Unexplored

---

### 3. AC Runner Contract — checkType 变 typed verifier

**Description:** 把 `AcceptanceCriteria.checkType` (`dom | playwright | screenshot | console`) 从 inert label 升级为一等 runner 接口：`Runner<T extends CheckType> { canRun(ac); run(ac, workspace) → CheckResult }`，`CheckResult` emit typed `EvidenceNode` 并把 `ReviewAcceptanceCriterion.met` 从 `boolean` 升级为 `{status: 'pass'|'fail'|'manual', runId, evidenceRef, latencyMs, screenshotRef?}`。Brief 阶段的 AC 列表实际编译成 agent 自检的 check suite；Review 的 pass/fail 变 computed 而非 asserted。

**Warrant:** `direct:` `vibeTicket.ts` `checkType` enum 已建模、无 runner、无 result UI；gap #8 "Review 只拿 met:boolean — 无 automated/manual 区分、无 failure detail"；ReviewStage AC 网格只渲染 boolean。

**Rationale:** 当前回路不诚实 — agent 自报 met、人凭感觉信。Runner 让 claim 可证伪。配 #1 (runner 写入 ledger) + 喂 #2 (auto-reviewer 读结构化结果)。也是闭合 Brief→Review 闭环的关键一步。

**Downsides:** 每个 runner 是真 implementation 工作量 (Playwright wiring / 截图基线 / DOM assertion engine)。MVP 可只 ship 2 个 runner + 优雅降级。

**Confidence:** 90%
**Complexity:** Medium
**Status:** Unexplored

---

### 4. Evidence Type Renderer Plugins + Verification-Tier Stamping

**Description:** 每种 `EvidenceType` 一个 plugin (`api_response` → OpenAPI diff renderer + replay-against-staging button；`file_change` → hunk-blame view 链回 plan 预测；`ui_preview` → iframe + scrub 时间线；`command` → ANSI 着色 + exit-code badge；`agent_decision` → counterfactual 视图)。每节点 stamp verification tier (`self-claimed | tool-verified | cross-checked | human-confirmed`)；review 可折叠到 "tool-verified+" only。落地旧 doc #4。

**Warrant:** `direct:` gap #3 "EvidenceType enum exists ... but no type-specific renderers. All nodes render identically"；旧 doc #4 status "Not started — enum exists, no renderers"。`external:` Devin 浏览器点击录像 rich playable card；Whitespace #6 "non-UI evidence display ... still mostly shell+test bools elsewhere"；Newsroom fact-checking tier 纪律 (NYT/Lippincott/Silverman)。

**Rationale:** Reviewer 注意力是 binding constraint。40 个 flat node 不可搜；40 个 typed renderer + tier 折叠 = "show me tool-verified API diff，藏 agent self-report"。也是把非 UI 票 (backend / migration / API) 拉出二等公民坑的关键。

**Downsides:** Renderer 数量 = 持续 implementation surface；tier 语义需精确否则信用打折。

**Confidence:** 87%
**Complexity:** Medium-High（增量 per type）
**Status:** Unexplored

---

### 5. Per-Ticket Context Pack as Compounding Trace-Linked Artifact

**Description:** 把 `ContextPack` 升级为 versioned + addressable + composable: `{id, version, parents: ContextPackRef[], scope: PathGlob[], assertions: Rule[], evidence_links: TraceURL[], drift_score}`。Done 时从 trace 自动生成 child pack（成功的 prompt + finalPlan + key evidence + passing checks + diff 中实际遵循的 conventions）。下一票 Brief 阶段按 target+targetWorkspace+allowedScope 检索高分 pack 自动 pre-load；user 审 receipt 而非上前 curate。落地旧 doc #5 + 攻 Whitespace #3+#5。

**Warrant:** `direct:` `IdeaBrief.contextPacks` 建模带 `selected` flag 但无 retrieval/inject/post-Done 流程 (gap #4)；`ReviewHandoff.contextPackDraft` 字段 `{prompt, finalPlan, keyEvidence, successfulChecks, conventions}` schema author 已伸手要这个形状；旧 doc #5 status "Not started"。`external:` Cognition Agent Trace spec (vendor-neutral, code hunks → trajectory URLs)；Addy Osmani AGENTS.md 研究 (人 curated > LLM 生成 3% — 暗示混合：Done 让 LLM 草，Review 时 human 批)。

**Rationale:** 不自动生成 → pack 永远是 folklore。自动生成 → 每张关闭票 emit delta，团队记忆单调增长。配 #1 (events 是 trace 原语) + #4 (typed evidence 是 summarizer 输入)。

**Downsides:** Retrieval 质量 + drift 检测非 trivial；坏 pack 比无 pack 毒性更大 — 需 review-stage approval gate 才能合入 pack registry。

**Confidence:** 85%
**Complexity:** High
**Status:** Unexplored

---

### 6. Workspace Sandbox Primitive + Sub-Second Bisect-Rewind

**Description:** 单一后端抽象 `WorkspaceSession = {id, ticketId, baseImage, branch, ports, state, checkpoints[], rewind(snapshotId)}`。所有 stage 借同一 session：Brief (read-only browse for context discovery)、Plan (dry-run 一步)、Evidence (real exec)、Review (replay/diff against checkpoint)。每个 `requiresCheckpoint` flag 是一个 snapshot。"Bisect & Rollback" 走 evidence tree 找最近 AC + autonomy 都绿的 node、亚秒 restore、把 divergence 作为 Brief constraint 重排。

**Warrant:** `direct:` `previewUrl` + `previewStatus` (idle/starting/running/failed/stopped) 建模但 stub (gap #10)；PRD 列 "Project Board MVP (multi-workspace, persisted previewCommand/testCommand)" + "Live Workspace Preview lifecycle" 未启动；`requiresCheckpoint` 是 flag 没 snapshot 语义。`external:` Fly.io Sprites 1-2s cold-start + 300ms checkpoint/restore；Claude Code `/rewind` 需要相同原语；Cursor Mission Control 8 并行 agent 需 session 隔离。

**Rationale:** 今天 preview / rewind / parallel agents / browser tests / self-test by clicking 五个独立功能在抢同一 workspace。一个 session 原语让它们成五个视图。亚秒 rewind 还把 autonomy 心理倒过来：从 "我必须捕住坏 commit" 变 "让它跑、我挑活下来的"。

**Downsides:** 重 infra 投入 (容器 lifecycle / 端口 / checkpoint 存储)。MVP = 本地 Docker，scale 后再迁。

**Confidence:** 82%
**Complexity:** High
**Status:** Unexplored

---

### 7. Mission Control 多 Agent 控制台 + Take Comping UI

**Description:** Kanban 之上 Mission Console 视图，N 个并行 agent 一行 (current step / autonomy state / token burn rate / container CPU / tool calls/sec / error rate) + FLIGHT 聚合。高风险票 fan out 3-5 个并行 attempt（不同 model / temperature / system prompt preset），每 take 一棵 sibling Evidence subtree。Reviewer 并排 scrub takes，"comp" 出 winning step-output 入 canonical execution；输家的 diff 留作 "alternatives" 注。**依赖 #6 (sandbox session) + #2 (risk score 用于 take 排序) 先落地。**

**Warrant:** `external:` Cursor Agent Mode "Mission Control" 已运行最多 8 并行 agent + 步级 checkpoint review；Devin Child-agent sub-tab；Whitespace #4 "multi-agent WIP visualization in PM layer ... no agile PM tool surfaces concurrent agent occupancy or per-agent token cost accumulation"；music 制作 take comping (Owsinski *The Mixing Engineer's Handbook* ch. 7)。`reasoned:` Cursor 有并行无 comping，是 N 条独立线；comping 把并行从 "更多要读" 变 "best-of-N，reviewer 成本更低"。Devin 67% merge rate 是单次指标；best-of-3 一审应≥90%。

**Rationale:** 在 Whitespace #4 上 first-mover。自然把 token-cost-per-sprint 拉成一等公民列 — 2026 每个团队都需要回答但没 PM 工具暴露。

**Downsides:** 2-versions-out scope。没有 #6 sandbox + #2 risk score 先落地，这是 theatre。token burn ≥ 3× per ticket — 需要 sprint budget UI 否则不可承受。

**Confidence:** 70%
**Complexity:** Very High（依赖 #6, #2）
**Status:** Unexplored

---

## Rejection Summary

| # | Idea | Reason Rejected |
|---|---|---|
| 1 | Empty-state coaching for every section | Slop polish; fails meeting test。 |
| 2 | Inline Brief Editing | 必要 plumbing 但属"假定的活"，非战略级 next-version idea。 |
| 3 | Stage Lock + tooltip | 由 #1 computed-view stage 自然落地。 |
| 4 | Evidence Permalink | 由 #5 trace URL 自然落地。 |
| 5 | Plan-Diff View on Re-plan | 折入 #1 (typed events 显示 plan delta)。 |
| 6 | Pending Decision Inbox | 由 #2 衍生，规模较小。 |
| 7 | Terminal Drawer Filter / Tag color | 折入 #1 (events keyed to nodes)。 |
| 8 | Auto-Brief from Chat | 强但需 Slack/Linear 集成形态 — 单独 ideation。 |
| 9 | Forward-Approval Default | 折入 #6 (亚秒 rewind 让极性翻转可行)。 |
| 10 | Plan Stage Disappears Low-Risk | 早；需 #2 risk score 先有数据再判。 |
| 11 | Evidence Auto-Selected by Diff Shape | 折入 #4 (renderer plugin 自带 dispatch)。 |
| 12 | WebSocket-Driven UI no refresh | 折入 #1。 |
| 13 | Tickets Self-Promote / Stage Computed | 折入 #1。 |
| 14 | Tickets as Agent Contracts | 概念 reframe；#3 + #5 已操作化。 |
| 15 | Plan as Falsifiable Hypothesis | 需 #2 数据历史；折入 #2。 |
| 16 | Ticket as Epic Spawning Children | 与 #7 + epic-as-unit 重叠；单独 brainstorm。 |
| 17 | Newsroom Fact-Check Tiers | 折入 #4 verification-tier stamping。 |
| 18 | Courtroom Chain-of-Custody | 折入 #5 trace artifact (custody = trace stamp)。 |
| 19 | Surgical Pre-Op Timeout | UI ritual；#2 DSL evaluator 触发 prompt 时自然出现。 |
| 20 | Insurance Underwriting | 与 #2 risk score 同目标；吸收。 |
| 21 | Music Comping | 折入 #7 comping UI。 |
| 22 | Quant Trading Retro | 折入 #5 (auto-generated post-Done pack = retro)。 |
| 23 | Bisect-Rollback | 折入 #6。 |
| 24 | Live-Stream Cockpit | 折入 #1 + #6。 |
| 25 | Agent Swarm Race | 折入 #7。 |
| 26 | Autopilot Ticket Lane | 折入 #2 auto-reviewer。 |
| 27 | Evidence-as-Podcast | Off-beat；#4 落地后再考虑作 "low-attention review" 层。 |
| 28 | VibeBoard-as-MCP | 定位押注，非 next-version 优化；单独 ideation。 |
| 29 | Micro-Stage Ledger | 与 #1 同事不同名。 |
| 30 | Epic-as-Unit | 大 reframe；单独 brainstorm 作不同 workflow shape。 |

## Recommended Next Move

**架构 unlock 优先 → brainstorm #1 Typed Event Ledger**：#3/#4/#5/#6 都依赖它。先干这条，剩下落地代价从"重发明状态"降到"加 reducer + renderer"。

**或 快出可见赢 → brainstorm #3 AC Runner Contract**：最小爆炸半径，关掉 Review 的 boolean 假象。
