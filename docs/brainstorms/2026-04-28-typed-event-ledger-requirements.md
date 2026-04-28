---
date: 2026-04-28
topic: typed-event-ledger
---

# Typed Event Ledger + Live Reducer

## Problem Frame

VibeBoard 三段式 UI 已 ship (U3–U7)，但驱动状态的 transport 仍很薄：后端 `TimelineEvent` 表 + 单条 WS 广播，前端 `ticketAdapters.ts` 在 fetch 时一次性合成 `vibeStage / plan.steps / evidence.nodes`，WS 到达时只把事件追加进 `timelineEvents[]`，**不重算派生状态**。可观察后果：evidence 节点状态卡 `running`、`vibeStage` 不会自演进、终端日志与 evidence 节点失联、debug 时无回看途径。

solo-dev 单人 dogfood 场景下最先疼的是：起一次 agent run，evidence 节点卡 `running` 但命令早已完成，page reload 也救不回来（adapter 没法表达节点终态），只能去 `apps/api/.data/vibeboard.db` 里刨日志。这次把 ledger 升级为单一真源 + 客户端 reducer 派生 + 时间拖条回看，把"拖到那一秒看节点状态"做成原生交互。下游 ideas (#3 AC Runner / #4 Evidence Renderer / #5 Context Pack post-Done / #6 Workspace Sandbox) 在此基础上扩 event kind 或 renderer 即可，避免各自重发明状态合成。

---

## Key Flows

- F1. 实时派生状态
  - **Trigger:** 任意 agent / mock 脚本 emit 一条 typed event 到 `POST /tickets/:id/timeline-events`
  - **Steps:**
    1. 后端持久化事件，assign per-ticket monotonic `sequence`
    2. 后端广播 `{type:'timeline.event', event:{kind, sequence, payload, createdAt}}` 给该 ticket 全部 WS 订阅
    3. 前端 reducer 按 `sequence` 顺序 fold，更新 `vibeStage / plan.steps[].status / evidence.nodes[].status / evidence.rawLogs`
    4. 所有视图（StageNavigation / Plan / Evidence / TerminalDrawer / Kanban 列）从 reducer state 重渲，无需 refetch
  - **Outcome:** Evidence 节点 running → success/failed 状态翻转立即反映；vibeStage 自演进；终端日志与 evidence 节点共享 `nodeId` 关联
  - **Covered by:** R1, R2, R3, R6, R7

- F2. 时间拖条回看 (scrubber)
  - **Trigger:** Solo dev 在 TicketDetail 顶部展开 scrubber，拖到时刻 t（事件序号 t）
  - **Steps:**
    1. UI 把 reducer "查询时刻" 切到 `sequence ≤ t` 子集
    2. EvidenceTree / Plan / TerminalDrawer 以 t 时刻状态重渲
    3. Dev 看到节点何时变 running、payload 是啥、何时（如果）转 success
    4. 拖回最末点（或点 "返回实时"）恢复实时模式
  - **Outcome:** 不查 DB，肉眼定位 stuck 现场
  - **Covered by:** R4, R5, R9, R10

- F3. 重连 / 迟到加入
  - **Trigger:** 浏览器窗口休眠后唤醒，或 ws 短暂断开
  - **Steps:**
    1. 客户端用 `?since=<lastAppliedSequence>` 重订阅 ws
    2. 后端按序 emit 缺失事件，全部派完后 emit `{type:'timeline.live'}`
    3. Reducer 无重复 fold，状态对齐当前
  - **Outcome:** 长连接断不会丢派生状态
  - **Covered by:** R8

---

## Requirements

**Event taxonomy（MVP 子集）**

- R1. v1 event kind 必含: `StagePatch | PlanStepStatusPatch | EvidenceNodePatch | TerminalLogAppend | Checkpoint`。每 kind 声明式 payload schema 落进 OpenAPI（FastAPI Pydantic discriminated union），前端 `api.generated.ts` 自动出 typed reducer 输入。
- R2. v1 不端到端落地 `AutonomyPromptOpened` / `UserCorrection`（Schema 可预留 placeholder kind 或干脆 v2 再加，参见 Scope Boundaries）。
- R3. `EvidenceNodePatch.payload` 必含 `nodeId, status: pending|running|success|failed`，可选 `summary, details, artifactPath, failureReason, requiresCheckpoint, planStepId, evidenceType`，覆盖现有 `EvidenceNode` interface 全部字段。同样原则套用其它 Patch kind（payload schema 是 evidence 字段的真源）。

**Reducer 派生（非存储字段）**

- R4. `vibeStage` 不再是 `Ticket` 表的存储字段，改由 reducer 从 `StagePatch` 折叠得出。Kanban 列归属服务端从同一 reducer（或后端等价计算）派生答复。
- R5. `EvidenceStage / PlanStage / TerminalDrawer` 必须读 reducer state；`ticketAdapters.ts` 不再合成 `vibeStage / plan / evidence`。Adapter 仅保留与"非事件派生"字段（`IdeaBrief`、`ReviewHandoff` 中由后端聚合的部分）的同步。

**事件序与 transport**

- R6. 每事件持有 `(ticketId, sequence: int, kind, payload, createdAt)`。`sequence` 由后端 assign，per-ticket 单调递增，作为派生顺序权威。客户端按 `sequence` 严格升序 fold，乱序到达需排序后再 fold。
- R7. 任何 evidence / plan / stage / terminal 派生显示必须接 ledger reducer。新增视图禁止从 `getTicketDetail` 回填同一字段。这是结构纪律而非偏好。

**Reconnect / 迟到加入**

- R8. WS 端点接受 `?since=<sequence>`：缺省 = 全量回放；指定 = emit `(since, ∞)` 的事件再切 live。replay 完成 emit `{type:'timeline.live'}` 边界标记。客户端持有 `lastAppliedSequence`。

**Scrubber UI**

- R9. TicketDetail 顶部增时间拖条组件，刻度由事件分布生成，hover 显示该事件 kind + 摘要。拖动 = 切换 reducer 查询时刻；末点 = 实时模式。
- R10. 回放模式与实时模式视觉可区分：banner "回放中 t=… (sequence n/N)" + "返回实时" 按钮，避免 dev 误判 UI 是当前还是过去。

**Solo-dev demo guarantee**

- R11. "起一次 agent run，shell 命令悬挂 5 秒后完成 emit `EvidenceNodePatch{status:'success'}`；前端节点从 running 自动转绿，无需刷新；终端日志与 evidence 节点用 `nodeId` 关联可双向高亮" — 必须一次跑通，v1 主验收。
- R12. "命令故意失败，dev 拖 scrubber 回到 running 那一刻，看到节点 status=running、payload 含命令行；拖到末点显示 failed + failureReason" — 必须一次跑通，v1 次验收。

---

## Acceptance Examples

- AE1. **Covers R1, R3, R6, R11.** Given ticket 在 `evidence` 阶段、step `s1`、节点 `n1` 处于 running；when 后端 emit `EvidenceNodePatch{nodeId:'n1', status:'success', summary:'tests pass'}`；then WS 订阅客户端 reducer 把 `evidence.nodes[n1].status` 改为 success，UI 渲染绿勾，整个过程无任何 HTTP fetch 触发。
- AE2. **Covers R4, R5.** Given 新建 ticket 无 stage 信号；when emit `StagePatch{stage:'plan'}` 然后 `StagePatch{stage:'evidence'}`；then Kanban 列归属与 TicketDetail 当前 tab 都由 reducer 派生，分别落到 plan 列与 evidence 列，期间不发生 `PATCH /tickets/:id` 修改 stage 字段的请求。
- AE3. **Covers R8.** Given 客户端 `lastAppliedSequence=42`；when WS 重连用 `?since=42`；then 后端按序 emit sequence 43..N 全部事件，结尾 emit `timeline.live`；客户端 reducer 一致到达当前态，事件不重复 fold。
- AE4. **Covers R9, R10.** Given EvidenceTree 当前显示 12 节点，最末 sequence=200；when dev 拖 scrubber 到 sequence=120；then UI 重渲 sequence ≤ 120 的派生快照，banner "回放中 t=2026-04-28 10:24:13 (120/200)" 显示，"返回实时" 按钮可点；点击 → 状态恢复 sequence=200。
- AE5. **Covers R7.** Given dev 加新组件 "当前 step 标题"；when 实现该组件；then 它必须 subscribe reducer state；CR 阶段任何引入 `getTicketDetail` 来回填同字段的 PR 应被驳回（结构纪律）。

---

## Success Criteria

- 一次"卡 running"调试无需打开 SQLite / 后端日志，全程在 TicketDetail 完成定位（R11 / R12 验收）。
- AE1 / AE2 / AE3 / AE4 全通过 = 下游 `/ce-plan` 不必再发明事件契约、reducer 边界、scrubber 行为。
- 后续 ideas (#3 AC Runner / #4 Evidence Renderer / #5 Context Pack post-Done / #6 Workspace) 接入只需扩 event kind 或 renderer，**不需要再改派生路径**——以新 idea 的 plan 是否触碰 `ticketAdapters.ts` 或 reducer fold 顺序判定。

---

## Scope Boundaries

- v1 不端到端落地 `AutonomyPromptOpened` / `UserCorrection`（autonomy 执行与人工修正反馈是 idea #2 的活）。
- v1 不做 fork/branch 时间线（多 agent take 比对，留 idea #7）。
- v1 不做 server-authoritative 多客户端冲突解决（solo dev 自用无并发订阅竞态需求）。
- v1 不做 ledger 归档 / 保留策略（永久保 SQLite，dev 自己手动 reset `apps/api/.data/vibeboard.db`）。
- v1 不做基于 ledger 的 Cognition Agent Trace 风格 export（留下版本）。
- v1 不做向后兼容桥：旧 9 值 `TimelineEventType` enum 与新 typed kind 不共存——直接重定义 + 重置本地 SQLite。
- v1 Rewind UI 只做 scrubber；不做 checkpoint-only 跳转列表，不做 bisect 工具（Phase 2 已决）。
- v1 不优化 >10k 事件场景下的 cold-open replay 性能（事件量级达到再处理；solo dev 量级几百到几千足够）。

---

## Key Decisions

- **事件源派生而非存储派生字段**。理由：solo dev 自用，无服务端读放大压力；强约束让所有 view 接同一查询，避免现有 4-source（`vibeStage` 字段 / `timelineEvents[]` / `plan.steps` 合成 / `evidence.nodes` 合成）失同步重现。
- **`sequence` per ticket 而非全局**。理由：单 ticket 内顺序权威即可，避免跨 ticket 同步成本，SQLite 单文件下实现简单。
- **重置 SQLite 而非迁移旧事件**。理由：dogfood 阶段旧 9 值 timeline event 数据无保留价值，迁移开销高于价值。
- **`ticketAdapters.ts` 退役**。Adapter 不再合成 `vibeStage / plan / evidence`；最多保留与非事件派生字段的同步。
- **Rewind UX = scrubber**。理由：直接命中 demo 场景（找节点何时卡住）；强迫 reducer 派生干净（这是 ledger 的核心赌注）；checkpoint-only 太小漏 stuck 现场，bisect 谓词难按钮化。

---

## Dependencies / Assumptions

- ✅ 后端 plan `docs/plans/2026-04-27-002-feat-python-backend-architecture-plan.md` 已 status: completed，`apps/api/src/api/websocket/timeline_ws.py` 与 `models/timeline.py` 存在。
- 假设：现有 `TimelineEvent` 表 schema 能通过 enum 扩展 + JSON payload 覆盖新 kind 需求，无需新表（`type` enum 改为新 kind set，`payload` 仍 JSON）。**需在 plan 阶段 grep 旧 enum 命中点确认重置可行**。
- 假设：solo dev 自用 = 无鉴权、无多租户、无配额。新事件 ingest 接口与现有 `POST /tickets/:id/timeline-events` 一样无 auth 即可。
- 假设：全量回放在前端 cold open 不是性能瓶颈（solo dev 单 ticket 几百到几千事件量级）；超界限留下版本处理。
- 假设：当前前端 React state 管理（`useState` + adapter）可替换为 reducer 模式而不引入新依赖（或加轻量如 Zustand）；选型留 plan。

---

## Outstanding Questions

### Resolve Before Planning

（无 — 关键产品决策都已就位）

### Deferred to Planning

- [Affects R1, R3][Technical] 旧 9 值 `TimelineEventType` (`plan|file_read|file_write|command|test|preview|comment|decision|error`) 是替换还是 enum 扩展共存？倾向：替换 + 重置 SQLite（已在 Scope）；plan 阶段 grep 旧 enum 命中点出 migration 清单。
- [Affects R2, R6][Technical] `sequence` 实现：`(ticketId, ordinal int)` 复合主键，还是单独 `sequence` column + 后端事务保 monotonic？SQLite 锁行为细节留 plan。
- [Affects R5][Technical] 前端 reducer 落地选型：纯 React `useReducer` vs Zustand vs 其它？基于现有 state 管理评估。
- [Affects R4][Technical] 移除 `Ticket.vibeStage` 是否同步影响 `Ticket.status`（agile 维度）？倾向保留 `status` 作 agile 维度独立于 `vibeStage`，但 Kanban 列分类逻辑要复核。
- [Affects R8][Needs research] 全量回放 cold open 在前端是否需 chunked stream（避免单 WS 消息过大）？事件量级量测后判。
- [Affects R9][Technical] scrubber 刻度算法：均匀 vs 按事件密度？UX 实现验证后定。
- [Affects R6][Technical] 客户端乱序到达事件的 fold 策略：拒收并 `?since=` 重订 vs 内部缓冲重排？plan 阶段定。

---

## Next Steps

-> `/ce-plan` for structured implementation planning
