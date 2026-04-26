# MVP 范围

## MVP 目标

证明一个核心判断：相比普通看板，面向 vibe coding 的 Vibe Ticket、Agent Timeline、运行证据和自动验收能显著减少团队状态同步、Review 成本和 AI 执行不透明问题。

## 必做功能

### 1. Project Board

- 创建项目
- 创建 Vibe Ticket
- 支持状态：Backlog / Ready / In Progress / Review / Done / Blocked
- 卡片字段：标题、描述、验收标准、负责人、人类/AI 标签、优先级、关联分支、目标 workspace、运行证据 URL

### 2. Live Workspace Preview

- 每张卡片可以绑定一个 workspace 和 preview command
- 卡片详情页展示 iframe 预览、日志或等价运行证据
- 支持启动 / 停止 preview runtime
- 展示运行状态：starting / running / failed / stopped
- 捕获 console error、build error、test error 和 stderr
- MVP 可用 Vite dev server 作为示例，但界面和文档统一叫 workspace preview

### 3. Agent Execution Timeline

- 用户可以点击“让 AI 处理此任务”
- Agent 生成执行计划
- Timeline 记录：prompt、计划、读取文件、修改文件、运行命令、测试结果、阻塞问题、用户纠偏
- 支持用户中途追加指令

### 4. Executable Acceptance Criteria

- 用户输入自然语言验收标准
- AI 生成可执行检查草案
- 第一阶段检查类型：DOM 文本、按钮存在、页面路径、截图对比、日志断言、Playwright 步骤
- 卡片显示验收通过率

### 5. DiffReel Review

- 任务进入 Review 时自动生成 Review 页面
- 展示 Before / After 截图或行为差异证据
- 展示修改文件摘要
- 展示验收标准通过情况
- 支持 Approve / Request changes

### 6. Context Pack

- Done 后生成 Context Pack 草案
- 记录成功 prompt、相关文件、项目约定、检查结果和失败模式
- 新任务可检索并复用相关 Context Pack

## 暂不做

- 完整替代 Jira 的复杂报表
- 企业权限 / 审计 / SSO
- 100 Agent swarm
- 复杂 3D Code Radar
- 自动部署生产环境
- 完整 Git 托管平台能力
- 把产品限定为 Vite 项目管理器

## MVP 成功标准

- 用户能创建一个 Vibe Ticket，绑定 workspace，并看到实时运行证据。
- AI 能根据任务描述生成计划并修改示例项目。
- Timeline 能完整解释 Agent 做了什么、为什么失败、如何被纠偏。
- 验收标准能至少部分自动执行并驱动任务进度。
- Review 页面能让非开发者理解本次变化和是否可批准。
