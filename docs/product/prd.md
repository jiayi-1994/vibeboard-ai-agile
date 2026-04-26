# PRD：VibeBoard AI Agile

版本：0.2  
日期：2026-04-26  
状态：Draft

## 1. 产品摘要

VibeBoard AI Agile 是一个面向 vibe coding 的敏捷追踪工作台。它把传统任务卡片升级为“Vibe Ticket”：每张卡片绑定一个产品意图、AI Agent 执行过程、上下文资产、运行证据、可执行验收标准和 Review 结果。

产品核心不是 Vite，也不是替代 Jira / Linear 的全部项目管理能力，而是在 AI Agent 参与开发时，提供一个更接近真实交付状态的协作界面。

## 2. 问题陈述

### 2.1 当前问题

vibe coding 常常从一句想法、一次 prompt 或一段聊天开始，但交付过程会快速失去结构：

- Agent 在后台快速改代码，但人类难以判断它是否理解意图、是否越界、是否产生隐患。
- 任务状态依赖人工更新，容易滞后或不可信。
- prompt、计划、patch、终端日志、测试结果和 Review 结论散落在不同工具里。
- PM / Reviewer 往往要等 PR 完成后才能看到真实行为或 UI 效果。
- 自然语言验收标准不能直接驱动进度。
- AI 生成代码的质量、上下文、失败原因难以沉淀和复用。

### 2.2 目标问题

VibeBoard 优先解决一个具体问题：

> vibe coding 团队如何让人类和 AI Agent 围绕“可追踪的执行证据和可验收的运行结果”协作，而不是围绕静态文字任务协作？

## 3. 目标用户与角色

### 3.1 Primary Persona：Founder / 技术 PM

- 需要快速把想法变成可交互原型或可验证功能。
- 不想阅读完整代码，但希望能清晰验收行为。
- 关心任务是否真的可用，而不是是否被移动到 Done。

### 3.2 Primary Persona：全栈开发者

- 使用 AI Agent 加速前端、后端、集成或测试任务。
- 希望减少写状态更新、解释 PR、手动整理执行记录的时间。
- 需要随时接管或纠正 AI Agent 的实现方向。

### 3.3 Primary Persona：AI Agent Operator

- 同时管理多个 AI Coding Agent。
- 需要看到 Agent 的计划、动作、阻塞点和结果。
- 关心 Agent 是否越界修改、是否通过检查、是否产生高质量代码。

### 3.4 Secondary Persona：Reviewer / QA

- 需要理解本次行为或 UI 变化。
- 需要看到 before / after、验收标准、测试结果和文件摘要。
- 希望不用本地拉分支也能判断是否可接受。

## 4. 产品目标

### 4.1 MVP 目标

验证“Vibe Ticket + Agent Timeline + Live Workspace Preview + 自动验收”能否显著降低 vibe coding 中的状态同步、Review 成本和 AI 执行不透明问题。

### 4.2 成功标准

- 用户能创建 Vibe Ticket，并绑定目标 workspace、目标范围和验收标准。
- 用户能在任务详情页看到 Agent 计划、执行日志、关键文件变化和运行错误。
- 对适合预览的任务，用户能看到 live preview 或等价运行证据。
- 验收标准能被转成至少部分可执行检查。
- Review 页面能让非代码用户理解变化、风险和是否可批准。

### 4.3 非目标

- 不做完整 Jira 替代。
- 不做复杂企业权限 / SSO / 审计。
- 不做生产部署平台。
- 不承诺 AI 全自动完成所有任务。
- 不在 MVP 做大规模多 Agent swarm。
- 不把 Vite 作为产品边界；它只是第一版前端 preview 的技术选项之一。

## 5. 核心价值主张

### 5.1 Vibe Ticket

任务卡片不是只描述工作，而是追踪从 idea、prompt、计划、执行、纠偏到验收的完整 vibe loop。用户打开卡片即可看到意图、上下文、Agent 进度、运行证据和验收结果。

### 5.2 Evidence-Driven Status

任务状态不完全依赖人工拖拽，而由 Agent timeline、preview / test / logs、验收标准和 Review 决策共同驱动。

### 5.3 Observable Agent Work

AI Agent 的每一步关键动作都进入 timeline，让用户知道它计划做什么、改了什么、跑了什么命令、为什么失败。

### 5.4 Visual & Behavioral Review

Review 以用户可感知的行为变化、视觉变化、测试结果和风险摘要为中心，而不是只看代码 diff。

### 5.5 Context Pack Memory

每次成功或失败的任务都沉淀可复用上下文，帮助后续 Agent 复用项目约定、避开失败模式。

## 6. MVP 功能范围

### 6.1 Project Board

用户可以创建项目、创建 Vibe Ticket、移动任务状态，并在看板中看到任务的 preview / AI / 验收状态。

### 6.2 Live Workspace Preview

用户可以在任务详情页启动目标 workspace 的 preview command，并通过 iframe、日志或检查结果查看当前任务对应的运行状态。MVP 示例可以使用 Vite dev server，但产品概念是 workspace preview，不是 Vite 专用能力。

### 6.3 Agent Execution Timeline

用户可以把任务交给 AI Agent，系统记录 Agent 的计划、文件修改、命令运行、测试结果、阻塞点和用户纠偏。

### 6.4 Executable Acceptance Criteria

用户输入自然语言验收标准，系统生成可执行检查草案，并将检查结果反馈到任务进度。

### 6.5 DiffReel Review

任务进入 Review 后，系统生成 before / after 截图、文件摘要、验收结果和 AI 总结，帮助用户做最终判断。

### 6.6 Context Pack

Done 后生成 Context Pack 草案，沉淀 prompt、相关文件、项目约定、检查结果和失败/修复经验。

## 7. 用户旅程

### 7.1 从 idea 到 Vibe Ticket

1. PM 创建任务：`为 Dashboard 添加暗黑模式切换`。
2. PM 输入验收标准：`切换按钮可用；刷新后主题保持；图表颜色适配暗色背景`。
3. 系统创建 Vibe Ticket，并准备目标 workspace、上下文和 preview runtime。
4. 用户打开详情页，看到任务意图、执行入口、上下文包和初始运行证据。

### 7.2 从任务到 AI 执行

1. 用户点击 `Assign to AI`。
2. Agent 生成计划：识别主题状态、样式变量、图表配置。
3. 用户确认计划。
4. Agent 修改文件、运行检查、更新 preview 或运行证据。
5. Timeline 实时显示 Agent 动作和用户纠偏。

### 7.3 从执行到验收

1. 系统运行验收检查。
2. 如果失败，任务保持 In Progress 或 Blocked。
3. 如果通过，任务进入 Review。
4. 系统生成 DiffReel。
5. Reviewer 查看 visual / behavior diff 和验收结果后 Approve。

## 8. 任务状态模型

| 状态 | 含义 | 进入条件 | 离开条件 |
| --- | --- | --- | --- |
| Backlog | 尚未准备执行 | 任务创建 | 用户补齐描述并标记 Ready |
| Ready | 可以执行 | 有目标、上下文、至少一个验收标准 | 分配给人或 AI |
| In Progress | 正在执行 | 人或 AI 开始处理 | 完成检查进入 Review，或失败进入 Blocked |
| Blocked | 执行被阻塞 | preview 启动失败、Agent 失败、缺少上下文 | 用户修复阻塞并恢复 |
| Review | 等待验收 | 运行证据可查看且检查达到阈值 | Approve 进入 Done；Request changes 回 In Progress |
| Done | 已验收 | Reviewer 批准 | 如后续回归，可重新打开 |

## 9. 关键指标

### 9.1 产品指标

- Time to First Evidence：从创建任务到看到第一个可验证证据的时间。
- Acceptance Automation Rate：验收标准中自动检查的比例。
- Review Time：任务进入 Review 到 Approve 的时间。
- Manual Status Update Reduction：人工状态更新次数减少比例。

### 9.2 AI 质量指标

- Agent Success Rate：AI 执行任务成功进入 Review 的比例。
- Human Rewrite Rate：AI 代码被人类大幅重写比例。
- Revert Rate：AI 任务被回滚比例。
- Context Reuse Rate：成功复用 Context Pack 的比例。

## 10. 约束与假设

### 10.1 假设

- 第一批用户愿意把示例 / 内部 workspace 接入系统。
- MVP 阶段可以接受本地或服务端 preview runtime，而不要求完整云隔离。
- 用户愿意先人工确认 AI 计划和 patch，再逐步增加自动化。
- 对非 UI 任务，preview 可以替换为测试结果、接口响应、日志或其他运行证据。

### 10.2 约束

- Agent 写文件必须可追踪、可回滚。
- Preview runtime 必须隔离任务工作区，避免污染原项目。
- 所有自动验收结果必须展示原始日志，不能只给结论。
- Vite 只能作为第一版示例 runtime，不应出现在产品定位或核心命名里。

## 11. 已决策问题

1. MVP preview runtime：Docker 容器优先。
2. 第一版集成：本地 workspace + GitHub。
3. AI Agent 第一阶段：生成 patch，人工确认后应用。
4. 自动验收优先级：先做 DOM / screenshot / 日志检查，再扩展 Playwright。
5. 目标用户优先：全栈开发团队与 AI-assisted product team。
