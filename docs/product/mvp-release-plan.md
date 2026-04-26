# MVP 发布计划

## Release 0.1：Clickable Planning Prototype

目标：验证信息架构和核心流程。

范围：
- 静态 Kanban UI
- Vibe Ticket 详情页
- Workspace Preview 占位
- Timeline mock 数据
- DiffReel mock 页面

验收：用户能看懂完整 vibe coding 追踪工作流，并指出是否愿意用它管理 AI 任务。

## Release 0.2：Local Workspace Preview MVP

目标：证明任务卡可以绑定真实 workspace preview，而不是只停留在文字状态。

范围：
- 项目 / 任务 CRUD
- 本地 workspace 配置
- 启动 / 停止 preview command
- iframe 或证据面板显示运行结果
- 捕获 preview 日志

验收：用户创建任务后能启动示例项目并在卡片中看到运行证据。

## Release 0.3：Agent Timeline MVP

目标：证明 AI 执行过程可观测。

范围：
- AgentRun 模型
- Planning Agent
- Patch 生成草案
- Timeline event
- 用户确认应用 patch

验收：AI 能根据任务生成计划和 patch，用户能看到完整过程。

## Release 0.4：Acceptance MVP

目标：证明自然语言验收可以转成检查。

范围：
- 验收标准 CRUD
- 检查项生成
- DOM / screenshot / log runner
- Playwright runner 草案
- acceptanceScore

验收：至少 3 类 vibe coding 验收标准可以自动检查。

## Release 0.5：DiffReel MVP

目标：证明 Review 可以从代码 diff 转为可理解的行为 / 视觉 diff。

范围：
- before / after 截图或行为证据
- changed files summary
- AI review summary
- Approve / Request changes
- Context Pack 草案

验收：Reviewer 不拉代码也能理解本次变化并做出决策。
