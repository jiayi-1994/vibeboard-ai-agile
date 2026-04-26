---
date: 2026-04-26
topic: vibe-ticket-three-stage-product-shape
---

# Vibe Ticket 三段式产品形态和页面结构

## Problem Frame

VibeBoard 当前已经从“Vite 预览看板”调整为“vibe coding 敏捷追踪工作台”，但 Vibe Ticket 的核心页面仍偏传统任务详情：左侧任务简报、右侧预览、底部终端日志。这个形态能表达“AI 在执行”，但还不能充分表达 vibe coding 的真实闭环：用户从模糊 idea 出发，Agent 生成计划，人类确认边界，执行过程中持续产生证据，最后按验收与风险做 Review。

三段式 Vibe Ticket 要解决的问题是：让每张任务卡从一开始就承载 **Idea Brief → Agent Plan → Execution Evidence**，而不是只在执行后补充日志。它应该成为人类和 AI Agent 共同工作的控制台。

---

## Actors

- A1. Founder / 技术 PM：提出 idea、定义预期变化、确认验收结果，不一定读代码。
- A2. 全栈开发者：补充技术边界、接管 Agent、处理风险和失败。
- A3. AI Agent Operator：配置 Agent 自治等级、监控执行、处理冲突和 checkpoint。
- A4. AI Agent：读取上下文、生成计划、执行修改、产出证据和总结。
- A5. Reviewer / QA：根据运行证据、验收结果和风险摘要决定 Approve 或 Request changes。

---

## Product Shape

Vibe Ticket 采用三段式，而不是单一详情页：

```text
Vibe Ticket
  ├─ Stage 1: Idea Brief
  │   ├─ 原始 idea / prompt
  │   ├─ 目标用户与期望变化
  │   ├─ 验收标准
  │   ├─ 约束 / 非目标
  │   ├─ 目标 workspace / 允许修改范围
  │   └─ 推荐 Context Pack
  │
  ├─ Stage 2: Agent Plan
  │   ├─ Agent 理解摘要
  │   ├─ 分步骤计划
  │   ├─ 预计修改范围
  │   ├─ 风险与 checkpoint
  │   ├─ 将运行的检查
  │   └─ Approve / Ask revision / Split ticket
  │
  └─ Stage 3: Execution Evidence
      ├─ Plan-step evidence tree
      ├─ Live workspace / API / test / log evidence
      ├─ Patch and file changes
      ├─ User corrections
      ├─ Acceptance status
      └─ Review handoff
```

核心原则：

1. **Brief 是锚点**：所有计划、执行和 Review 都回到用户原始意图与验收标准。
2. **Plan 是闸门**：Agent 不直接进入黑盒执行，先让人类确认理解、范围和风险。
3. **Evidence 是状态来源**：任务状态由执行证据、检查结果和 Review 决策共同驱动。

---

## Key Flows

- F1. Idea 进入 Vibe Ticket
  - **Trigger:** 用户从 Board 点击 Create Vibe Ticket，或从聊天/brainstorm 结果转入任务。
  - **Actors:** A1, A2, A4
  - **Steps:**
    1. 用户输入原始 idea 或粘贴 prompt。
    2. 系统引导补齐目标用户、期望变化、验收标准、约束、非目标。
    3. 系统推荐可能相关的 Context Pack。
    4. 用户选择目标 workspace、允许修改范围和 evidence type。
    5. Ticket 状态进入 Ready for Plan。
  - **Outcome:** Ticket 有足够上下文让 Agent 生成计划，而不是直接猜测实现。
  - **Covered by:** R1, R2, R3, R4, R5

- F2. Agent 生成并确认计划
  - **Trigger:** 用户点击 Generate Agent Plan 或 Assign to AI。
  - **Actors:** A2, A3, A4
  - **Steps:**
    1. Agent 根据 Brief、Context Pack 和 workspace 生成理解摘要。
    2. Agent 输出分步骤计划、预计修改文件/模块、检查命令、风险点。
    3. 系统标出需要人工 checkpoint 的步骤。
    4. 用户可以 Approve plan、Ask revision、Edit scope、Split ticket。
    5. 批准后 Ticket 状态进入 In Progress。
  - **Outcome:** Agent 执行前有明确边界和人类确认记录。
  - **Covered by:** R6, R7, R8, R9, R10

- F3. Agent 执行并沉淀证据
  - **Trigger:** 已批准计划开始执行。
  - **Actors:** A2, A3, A4
  - **Steps:**
    1. 每个 plan step 生成 Evidence Node。
    2. 文件读取、文件修改、命令、测试、日志、截图、API 响应等归入对应 step。
    3. 遇到失败或高风险操作时进入 checkpoint。
    4. 用户可追加纠偏指令，Agent 更新后续步骤。
    5. 验收检查通过阈值后进入 Review。
  - **Outcome:** 用户能看懂 Agent 为什么这么做、做了什么、哪里失败、如何修复。
  - **Covered by:** R11, R12, R13, R14, R15, R16

- F4. Review 和复盘
  - **Trigger:** Ticket 进入 Review。
  - **Actors:** A1, A2, A5, A4
  - **Steps:**
    1. 系统生成 Review Handoff：变化摘要、验收结果、风险摘要、证据链接。
    2. Reviewer 查看 visual / behavior diff、文件摘要、失败或跳过项。
    3. Reviewer 选择 Approve、Request changes、Re-run checks 或 Rollback checkpoint。
    4. Approve 后生成 Context Pack 草案。
  - **Outcome:** Review 决策基于证据而不是“Agent 说完成了”。
  - **Covered by:** R17, R18, R19, R20

---

## Requirements

**Stage 1 — Idea Brief**

- R1. Vibe Ticket 必须保留用户原始 idea / prompt，且在详情页中可回看。
- R2. Brief 必须包含目标、期望变化、验收标准、约束、非目标和目标 workspace。
- R3. Brief 必须支持“允许修改范围”，例如文件夹、模块、组件、接口或用户手动描述的范围。
- R4. Brief 必须支持选择 evidence type，至少包括 UI preview、test/log evidence、API response 三类。
- R5. 创建或编辑 Brief 时，页面应展示推荐 Context Pack，并允许用户选择本次要注入的上下文。

**Stage 2 — Agent Plan**

- R6. Agent Plan 必须先展示 Agent 对用户意图的理解摘要，避免直接进入执行。
- R7. Agent Plan 必须按步骤展示计划，每步说明目标、预计产物和完成信号。
- R8. Agent Plan 必须展示预计修改范围，帮助用户发现越界风险。
- R9. Agent Plan 必须展示风险级别和需要人工确认的 checkpoint。
- R10. 用户必须能对计划执行 Approve、Ask revision、Edit scope、Split ticket 或 Cancel。

**Stage 3 — Execution Evidence**

- R11. Execution Evidence 必须按 plan step 聚合，而不是只按时间排序成终端日志。
- R12. 每个 Evidence Node 至少能承载事件类型、摘要、状态、时间、原始日志或 artifact 链接。
- R13. 文件修改、命令运行、测试结果、preview 状态、用户纠偏和 Agent 决策必须能作为 evidence 被追踪。
- R14. 失败 evidence 必须展示失败原因、原始输出和推荐下一步。
- R15. 用户必须能在执行中追加纠偏指令，并且该指令进入 evidence tree。
- R16. 高风险动作或计划外修改必须触发 checkpoint，而不是静默继续。

**Review and Context Pack**

- R17. Review Handoff 必须汇总 Brief、Plan、Evidence、Acceptance、风险和变更范围。
- R18. Review 页面必须支持 Approve、Request changes、Re-run checks，MVP 可延后 Rollback 的真实执行但应保留入口。
- R19. Request changes 必须回写到 Ticket，并成为下一轮 Agent Plan 或 Execution 的输入。
- R20. Approve 后必须生成 Context Pack 草案，包含原始 prompt、最终计划、关键证据、成功检查和项目约定。

**Page Structure**

- R21. Ticket Detail 页面应以三段式导航呈现：Brief、Plan、Evidence，而不是把所有信息堆在一个长页面。
- R22. 三段式导航应显示每段状态：Incomplete、Ready、Approved、Running、Blocked、Ready for Review、Done。
- R23. Board 卡片应显示当前所在阶段，而不只是传统敏捷列状态。
- R24. Dashboard 应增加 Vibe Loop 相关指标，例如 Ready for Plan、Waiting Approval、Blocked by Checkpoint、Review Ready。

---

## Page Structure

### 1. Ticket Detail 总体布局

推荐采用“阶段导航 + 双栏工作区 + 底部证据抽屉”：

```text
┌─────────────────────────────────────────────────────────────┐
│ Ticket Header: ID / Title / Agile State / Vibe Stage / Risk │
├─────────────────────────────────────────────────────────────┤
│ Stage Nav: [1 Brief] -> [2 Plan] -> [3 Evidence] -> Review  │
├──────────────────────────────┬──────────────────────────────┤
│ Primary Panel                 │ Side Panel                   │
│ 当前阶段主内容                │ Context / Preview / Checks   │
├──────────────────────────────┴──────────────────────────────┤
│ Evidence Drawer / Timeline / Raw Logs                       │
└─────────────────────────────────────────────────────────────┘
```

### 2. Stage 1: Idea Brief 页面

主面板：

- Original idea / prompt
- Problem and expected change
- Acceptance criteria
- Constraints and non-goals
- Allowed change scope
- Evidence type selector

侧栏：

- Recommended Context Packs
- Similar completed tickets
- Workspace summary
- Readiness checklist

主要动作：

- Save brief
- Ask AI to clarify
- Generate Agent Plan

### 3. Stage 2: Agent Plan 页面

主面板：

- Agent understanding summary
- Step-by-step plan
- Expected files / modules touched
- Test and evidence plan
- Risk and checkpoint list

侧栏：

- Brief anchor summary
- Scope diff：计划是否超出 Brief
- Autonomy policy
- Context Packs selected

主要动作：

- Approve plan
- Ask revision
- Edit scope
- Split ticket
- Cancel

### 4. Stage 3: Execution Evidence 页面

主面板：

- Evidence Tree grouped by plan step
- 当前 running step
- Failed / blocked step
- User correction thread

侧栏：按 evidence type 动态变化：

- UI 任务：Live preview / screenshots / console errors
- API 任务：request / response / schema check
- Test 任务：test result / coverage / failure logs
- CLI 任务：command output / artifact links

底部抽屉：

- Raw terminal logs
- File changes
- Agent decisions
- Checkpoint history

主要动作：

- Add instruction
- Pause agent
- Resume from checkpoint
- Run checks
- Move to Review

### 5. Review Handoff 页面

页面区块：

- What changed
- Why it changed：回到 Brief 和 Plan
- Evidence summary
- Acceptance results
- Risk summary
- Changed files summary
- Context Pack draft
- Decision bar：Approve / Request changes / Re-run checks / Rollback checkpoint

---

## Acceptance Examples

- AE1. **Covers R1, R2, R6.** Given 用户输入“给 Dashboard 加暗黑模式”，when 用户生成 Agent Plan，then 页面先展示 Agent 对目标、验收标准和非目标的理解摘要，而不是直接开始改代码。
- AE2. **Covers R8, R9, R10.** Given Agent Plan 预计修改认证中间件但 Brief 只允许改 UI，when 用户查看 Plan，then 页面标出 scope risk，并允许用户要求改计划或扩展范围。
- AE3. **Covers R11, R13, R15.** Given Agent 执行到第二步失败，when 用户打开 Evidence，then 能看到该步骤的读取文件、修改 diff、命令输出、失败原因和用户追加纠偏。
- AE4. **Covers R4, R17.** Given 任务是 API 行为修改而不是 UI 修改，when 进入 Review，then Review Handoff 展示 API request/response 和测试日志，而不是强制展示 iframe preview。
- AE5. **Covers R19, R20.** Given Reviewer 选择 Request changes，when Agent 重新生成计划，then 上轮 Review 意见成为新 Plan 的输入；Approve 后生成 Context Pack 草案。

---

## Success Criteria

- 用户能从一个模糊 idea 创建出结构化 Vibe Ticket，而不需要先写完整规格。
- Agent 执行前，用户能看懂并确认它打算做什么、会改哪里、风险在哪里。
- 执行中，用户能通过 Evidence Tree 回答“Agent 做了什么、为什么失败、我在哪里纠偏”。
- Review 时，非代码用户能基于运行证据和验收结果做 Approve / Request changes。
- 下游 `ce-plan` 不需要再发明三段式页面结构、主要状态、核心动作或验收行为。

---

## Scope Boundaries

- MVP 不做完整 Jira / Linear 替代。
- MVP 不做复杂企业权限、审计、SSO。
- MVP 不做真正多 Agent swarm 调度，只表达单 Ticket 内的 Agent 可观测和 checkpoint。
- MVP 不要求所有 evidence type 都真实可执行；UI preview、test/log evidence、API response 三类先形成产品形态即可。
- MVP 不要求自动 rollback 真实执行，但 Review 页面应保留 rollback/checkpoint 概念。
- Vite 不作为产品边界；前端原型仍可用 Vite 构建。

---

## Key Decisions

- 三段式命名采用 **Idea Brief → Agent Plan → Execution Evidence**：比“Create / Execute / Review”更贴合 vibe coding 的认知过程。
- Ticket Detail 采用阶段导航：降低单页信息过载，并让用户明确当前卡在哪个 vibe loop 阶段。
- Timeline 升级为 Evidence Tree：按 plan step 聚合比按时间滚动更适合 Review 和复盘。
- Context Pack 前移到 Brief 和 Plan：上下文不是完成后档案，而是下一次 Agent 成功率的输入。
- Review Handoff 独立于 Evidence 页面：Review 是决策场景，不只是证据浏览场景。

---

## Dependencies / Assumptions

- 假设第一版用户愿意接受比普通任务卡略重的创建流程，以换取更可靠的 Agent 执行。
- 假设 Agent 第一阶段仍以“生成计划和 patch，人工确认”为主，不追求全自动。
- 假设任务可以绑定 workspace 和允许修改范围；具体绑定方式留给后续计划设计。
- 假设 UI 原型优先表达产品形态，真实运行能力可分阶段补齐。

---

## Outstanding Questions

### Resolve Before Planning

- 无。

### Deferred to Planning

- [Affects R5][Technical] Context Pack 推荐第一版用手动选择、关键词匹配还是 AI 检索？
- [Affects R12][Technical] Evidence artifact 的存储和展示格式如何设计？
- [Affects R16][Technical] checkpoint 风险规则第一版如何落地？
- [Affects R23][Design] Board 卡片如何同时表达 agile status 和 vibe stage 而不显得拥挤？

---

## Next Steps

-> `/ce-plan` 为三段式 Vibe Ticket 页面改造制定实施计划。
