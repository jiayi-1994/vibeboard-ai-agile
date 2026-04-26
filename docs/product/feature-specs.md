# 功能规格与验收标准

## 1. Project Board

### 用户故事

作为用户，我希望创建项目和 Vibe Ticket，并在看板中看到每个任务的执行状态，以便管理人类和 AI Agent 的工作。

### 功能要求

- 支持创建、编辑、删除项目。
- 支持创建、编辑、删除 Vibe Ticket。
- 支持按状态列展示任务。
- 支持任务在状态列之间移动。
- 任务卡显示：标题、状态、优先级、负责人、preview 状态、验收通过率、AI 运行状态。

### 验收标准

- 用户可以创建一个项目并在项目下创建任务。
- 用户可以把任务从 Backlog 移到 Ready。
- 卡片状态变化后刷新页面仍保持正确。
- 卡片能显示 previewStatus 和 acceptanceScore。

## 2. Live Workspace Preview

### 用户故事

作为 PM / Reviewer，我希望在任务卡片里直接看到对应 workspace 的运行证据，以便不用拉代码也能理解进展。

### 功能要求

- 任务详情页提供 Start Preview 按钮。
- 系统启动任务对应 workspace 的 preview command。
- 成功后在 iframe 中展示 preview URL，或展示等价的运行日志/接口响应。
- 失败时展示错误日志。
- 用户可以停止 preview。
- MVP 可用 Vite dev server 作为示例实现，但产品能力不限定 Vite。

### 验收标准

- 点击 Start Preview 后，previewStatus 进入 starting。
- 启动成功后，previewStatus 进入 running，iframe 或证据面板显示结果。
- 启动失败后，previewStatus 进入 failed，并展示 stderr。
- 点击 Stop Preview 后进程停止，状态进入 stopped。

## 3. Agent Execution Timeline

### 用户故事

作为开发者，我希望看到 AI Agent 的完整执行过程，以便判断它是否理解任务、是否越界、是否需要纠偏。

### 功能要求

- 用户可以从任务详情页启动 AgentRun。
- AgentRun 先生成执行计划。
- 用户可以确认计划后执行。
- Timeline 记录 prompt、plan、file_read、file_write、command、test、error、decision、user_instruction。
- 用户可以在执行中追加指令。
- 用户可以取消 AgentRun。

### 验收标准

- 启动 AgentRun 后创建一条 AgentRun 记录。
- Agent 计划显示在 timeline 中。
- 每次文件写入产生 file_write event。
- 每次命令执行产生 command event，并记录 stdout / stderr。
- 取消后 AgentRun 状态进入 cancelled。

## 4. Executable Acceptance Criteria

### 用户故事

作为 PM，我希望自然语言验收标准可以被自动检查，以便任务进度更客观。

### 功能要求

- 用户可以为任务添加多条验收标准。
- 系统可以将验收标准转成检查项草案。
- 用户可以编辑或禁用检查项。
- 系统可以运行检查并保存结果。
- 任务卡显示验收通过率。

### 检查类型

- DOM 文本存在。
- 按钮 / 输入框存在。
- 页面 URL 匹配。
- API 响应匹配。
- Playwright 点击流程。
- Console error 为 0。
- Screenshot diff 小于阈值。

### 验收标准

- 用户添加验收标准后能生成至少一个检查项草案。
- 运行检查后每条标准显示 passing / failing / skipped。
- acceptanceScore 等于 passing 数量 / 可运行检查数量。
- 检查失败时展示失败原因和原始日志。

## 5. DiffReel Review

### 用户故事

作为 Reviewer，我希望看到本次任务的行为变化、视觉变化、文件变化和验收结果，以便快速决定是否批准。

### 功能要求

- 任务进入 Review 时生成 DiffReel。
- DiffReel 包含 before screenshot 和 after screenshot，或等价行为差异证据。
- DiffReel 包含修改文件列表。
- DiffReel 包含 AI 生成的变化摘要。
- DiffReel 包含验收结果快照。
- Reviewer 可以 Approve 或 Request changes。

### 验收标准

- 进入 Review 后能打开 Review 页面。
- Review 页面显示 before / after 截图或行为证据。
- Review 页面显示 changed files summary。
- 点击 Approve 后任务进入 Done。
- 点击 Request changes 后任务回到 In Progress，并生成 timeline event。

## 6. Context Pack

### 用户故事

作为 AI Agent Operator，我希望每次成功任务都沉淀上下文，以便后续类似任务更快更准。

### 功能要求

- Done 后自动生成 Context Pack 草案。
- Context Pack 包含相关文件、成功 prompt、项目约定、检查结果。
- 后续任务可以检索相关 Context Pack。

### 验收标准

- Approve 任务后生成 Context Pack 记录。
- Context Pack 能关联原任务。
- 新任务创建时能显示可能相关的 Context Pack。
