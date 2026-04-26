# UI 信息架构与页面结构：VibeBoard AI Agile

版本：0.1  
用途：供后续设计软件进行页面设计、视觉探索和原型制作  
推荐视觉方向：Pixel Command Center / 像素风 AI 敏捷作战室

## 1. 设计目标

VibeBoard 的 UI 不能像普通企业看板。它要表达三个核心感受：

1. **任务是活的**：卡片不是文本容器，而是承载 idea、prompt、执行、预览、验收和复盘的实体。
2. **AI 是队友**：Agent 不只是后台按钮，而是有状态、有行动轨迹、有风险提示的作战单位。
3. **vibe coding 像作战室**：用户在一个实时指挥界面里看计划、看 agent、看运行证据、看验收、做决策。

## 2. 推荐视觉概念

### 2.1 主推：Pixel Command Center

像素风 + 暗色终端 + RPG 队伍 HUD + 开发者工具。

适合原因：
- 像素风能带来强识别度，避免落入普通 SaaS 看板风格。
- RPG 队伍感适合表达“人类 + AI Agent”的协作。
- 终端/像素边框适合表达开发工具属性。
- 活体任务卡可以设计成“任务芯片 / 运行舱 / 沙盒窗口”。

关键词：
- pixel terminal
- command center
- RPG party HUD
- cyber workshop
- vibe ticket card
- retro-future devtool

### 2.2 备选：Pixel Arcade Board

更偏游戏厅、街机、霓虹色、任务像关卡。

优点：个性强，适合营销展示。  
缺点：可能过度游戏化，削弱专业工具感。

### 2.3 备选：Pixel Tactical OS

更偏战术地图、雷达、军事/科幻 UI。

优点：适合多 Agent 调度和冲突预警。  
缺点：MVP 页面可能显得过重。

## 3. 信息架构总览

```text
App Shell
  ├─ Global Sidebar
  │   ├─ Projects
  │   ├─ Board
  │   ├─ Agent Runs
  │   ├─ Reviews
  │   ├─ Context Packs
  │   └─ Settings
  │
  ├─ Top Command Bar
  │   ├─ Current Project
  │   ├─ Search / Command Palette
  │   ├─ Runtime Status
  │   ├─ Active Agents
  │   └─ Create Task
  │
  └─ Main Workspace
      ├─ Project Dashboard
      ├─ Kanban Board
      ├─ Task Detail / Vibe Ticket
      ├─ Workspace Sandbox
      ├─ Agent Timeline
      ├─ Acceptance Lab
      ├─ DiffReel Review
      └─ Context Pack Library
```

## 4. 全局布局

### 4.1 App Shell

建议采用三段式布局：

```text
┌─────────────────────────────────────────────────────────────┐
│ Top Command Bar                                              │
├──────────────┬──────────────────────────────────────────────┤
│ Global       │ Main Workspace                               │
│ Sidebar      │                                              │
│              │                                              │
│              │                                              │
└──────────────┴──────────────────────────────────────────────┘
```

### 4.2 Global Sidebar

功能：全局导航。  
视觉：像素风垂直工具栏，类似 RPG 菜单或复古操作系统 Dock。

导航项：
- `PROJECTS` 项目
- `BOARD` 看板
- `AGENTS` Agent 运行
- `REVIEWS` Review 队列
- `CONTEXT` 上下文包
- `SETTINGS` 设置

### 4.3 Top Command Bar

功能：当前项目、全局搜索、运行状态、快捷操作。  
视觉：像素终端状态栏。

元素：
- 当前项目名称与环境标签
- Command Palette 输入框：`Search tasks, agents, files...`
- Workspace Runtime 状态：online / degraded / offline
- Active Agents 数量
- Create Task 按钮

## 5. 页面清单

## 5.1 Project Dashboard / 项目首页

### 页面目标

让用户快速理解当前项目健康度、进行中的任务、活跃 Agent、Review 队列。

### 页面结构

```text
Project Dashboard
  ├─ Project Header
  ├─ Runtime Status Strip
  ├─ KPI Cards
  ├─ Active Living Tickets
  ├─ Agent Party HUD
  ├─ Review Queue
  └─ Recent Timeline
```

### 主要区块

#### Project Header

- 项目名称
- Repo / local path
- 默认分支
- 当前运行环境
- Start Workspace / Sync Project 操作

#### Runtime Status Strip

像素风状态条，显示：
- Workspace Runtime：online / starting / failed
- Test Runner：idle / running / failed
- Agent Runtime：ready / busy / error
- Last Sync 时间

#### KPI Cards

- Time to First Evidence
- Active Agents
- Acceptance Pass Rate
- Review Waiting
- Failed Checks

#### Agent Party HUD

把 Agent 展示成 RPG 队友卡：
- Planner Agent
- Coder Agent
- Tester Agent
- Review Agent

每张卡显示：头像、状态、当前任务、风险/血量条、token/上下文条。

## 5.2 Kanban Board / 主看板

### 页面目标

展示任务流转，并让每张任务卡体现 idea、Agent、运行证据和验收状态。

### 页面结构

```text
Kanban Board
  ├─ Board Toolbar
  ├─ Status Columns
  │   ├─ Backlog
  │   ├─ Ready
  │   ├─ In Progress
  │   ├─ Blocked
  │   ├─ Review
  │   └─ Done
  └─ Right Inspector Drawer (optional)
```

### Board Toolbar

- Filter by assignee / agent / priority
- Search tasks
- Group by status / epic / runtime state
- Create Task

### Task Card 信息层级

```text
┌──────────────────────────────┐
│ [TASK-012] Add dark mode      │
│ Priority: High   Owner: AI    │
│                              │
│ Evidence: LIVE     ●           │
│ Agent: CODING     ▓▓▓░░       │
│ Checks: 4/6 PASS  ▓▓▓▓░       │
│                              │
│ mini preview / pixel thumbnail│
└──────────────────────────────┘
```

### 卡片状态颜色建议

- Backlog：灰蓝
- Ready：青色
- In Progress：黄色 / 琥珀
- Blocked：红色
- Review：紫色
- Done：绿色

保持像素风高对比，但不要用过多霓虹导致阅读疲劳。

## 5.3 Task Detail / Vibe Ticket 详情页

### 页面目标

这是产品最核心页面。用户在这里查看任务意图、prompt 上下文、workspace 预览、AI 执行、验收标准和 Review 状态。

### 推荐布局

```text
┌─────────────────────────────────────────────────────────────┐
│ Task Header                                                  │
├──────────────────────────────┬──────────────────────────────┤
│ Left Panel                    │ Right Panel                  │
│ Task Brief                    │ Live Workspace                 │
│ Acceptance Criteria           │                              │
│ Agent Controls                │                              │
├──────────────────────────────┴──────────────────────────────┤
│ Bottom Timeline / Logs                                       │
└─────────────────────────────────────────────────────────────┘
```

### Task Header

- Task ID
- Title
- Status badge
- Priority
- Assignee / Agent Cell
- Branch / workspace
- Action buttons：Assign to AI / Start Workspace / Run Checks / Move to Review

### Left Panel：任务控制区

#### Task Brief
- 描述
- 目标
- 关联文件/组件范围
- 风险提示

#### Acceptance Criteria
- 每条验收标准显示状态：pending / passing / failing / skipped
- 可展开查看检查类型和失败日志
- 总分条：`ACCEPTANCE 67%`

#### Agent Controls
- Assign to AI
- Confirm Plan
- Pause Agent
- Add Instruction
- Cancel Run

### Right Panel：Live Workspace

- iframe preview / 运行证据面板
- 顶部像素浏览器栏：URL、viewport、refresh、screenshot
- 错误覆盖层：build error、console error、test failing
- 状态角标：running / failed / stale

### Bottom Timeline

像素终端日志 + 时间线结合：

事件类型：
- plan
- file_read
- file_write
- command
- test
- preview
- comment
- decision
- error

## 5.4 Workspace Sandbox / 工作区沙箱全屏页

### 页面目标

给 PM / Reviewer 一个沉浸式运行环境，专注体验本次任务结果。

### 页面结构

```text
Workspace Sandbox
  ├─ Sandbox Toolbar
  ├─ Viewport Switcher
  ├─ Live Workspace iframe
  ├─ Console / Error Drawer
  └─ Acceptance Overlay
```

### 关键能力

- 切换桌面 / 平板 / 手机 viewport
- 重新运行验收检查
- 截图
- 查看 console errors
- 在 UI 上添加批注（后续版本）

## 5.5 Agent Runs / Agent 运行中心

### 页面目标

集中展示所有 AI Agent 的任务、状态、失败和历史。

### 页面结构

```text
Agent Runs
  ├─ Agent Status Summary
  ├─ Active Runs Table
  ├─ Failed Runs
  ├─ Agent Detail Drawer
  └─ Run Timeline
```

### Agent Status Summary

以 RPG 队伍面板呈现：
- Planner：idle / planning / blocked
- Coder：coding / waiting / failed
- Tester：running / passing / failing
- Reviewer：summarizing / idle

### Active Runs Table

字段：
- Run ID
- Task
- Agent Type
- Status
- Started At
- Last Event
- Risk
- Actions

## 5.6 Acceptance Lab / 验收实验室

### 页面目标

集中管理任务验收标准和自动检查。

### 页面结构

```text
Acceptance Lab
  ├─ Criteria List
  ├─ Generated Checks
  ├─ Check Result Panel
  └─ Raw Logs
```

### 设计重点

- 左侧自然语言验收标准
- 中间可执行检查项
- 右侧运行结果和失败日志
- 支持一键 Run All

## 5.7 DiffReel Review / 可视化 Review 页面

### 页面目标

让 Reviewer 不拉代码也能理解和批准 UI 变化。

### 页面结构

```text
DiffReel Review
  ├─ Review Header
  ├─ Before / After Viewer
  ├─ Change Summary
  ├─ Acceptance Snapshot
  ├─ Changed Files
  ├─ Agent Summary
  └─ Decision Bar
```

### Before / After Viewer

推荐两种展示：
- Split view：左右对比
- Slider view：拖动对比

### Decision Bar

固定在底部：
- Approve
- Request changes
- Re-run checks
- Open Sandbox

## 5.8 Context Pack Library / 上下文包库

### 页面目标

展示项目沉淀的可复用 AI 上下文。

### 页面结构

```text
Context Pack Library
  ├─ Search / Filters
  ├─ Context Pack Cards
  ├─ Pack Detail
  └─ Related Tasks
```

### Context Pack Card

- 标题
- 适用领域：routing / styling / forms / state / tests
- 来源任务
- 相关文件
- 使用次数
- 成功率

## 5.9 Settings / 设置

### 页面结构

```text
Settings
  ├─ Project Settings
  ├─ Runtime Settings
  ├─ Agent Provider Settings
  ├─ Test Settings
  └─ Danger Zone
```

### MVP 必须包含

- 项目路径 / repo URL
- install command
- preview command
- test command
- agent provider key / endpoint
- preview runtime mode

## 6. 关键组件库建议

## 6.1 Pixel Window

用于包裹 preview、terminal、review、modal。

结构：
- 像素边框
- 标题栏
- 状态灯
- 内容区

## 6.2 Living Task Card

核心卡片组件。

状态层：
- 任务身份：ID、标题、优先级
- 执行状态：status、assignee
- 运行证据：previewStatus
- 验收状态：acceptanceScore
- AI 状态：agentRunStatus
- 缩略预览：mini preview / screenshot

## 6.3 Agent Avatar Card

表达 AI 队友。

字段：
- 名称
- 类型
- 像素头像
- 当前状态
- 当前任务
- health / risk / token meter

## 6.4 Status Chip

统一状态标签。

示例：
- `RUNNING`
- `FAILED`
- `AI CODING`
- `4/6 PASS`
- `REVIEW READY`

## 6.5 Pixel Progress Bar

用于验收分数、agent 进度、runtime 启动进度。

## 6.6 Terminal Timeline

像素终端风的 timeline。

每条事件像一行日志，但带 icon 和展开详情。

## 6.7 Diff Slider

Before / After 视觉对比组件。

## 7. 视觉语言建议

## 7.1 风格关键词

- 复古但不幼稚
- 像素但保持可读
- 游戏化但不玩具化
- 高对比但不刺眼
- 专业开发工具 + 独立游戏 UI

## 7.2 色彩建议

### Base

- Background：#0E1116 / #111827
- Panel：#171C26
- Border：#2D3444
- Text Primary：#F8FAFC
- Text Muted：#94A3B8

### Accent

- Cyan：#38E8FF，用于 runtime online / links
- Green：#7CFF6B，用于 passing / done
- Amber：#FFD166，用于 in progress / warning
- Red：#FF5C7A，用于 failed / blocked
- Purple：#B48CFF，用于 review / agent magic

## 7.3 字体建议

标题 / 标签可用像素字体，正文必须优先可读。

建议：
- Display：Press Start 2P / Pixel Operator / 方正像素类字体
- Body：Inter / IBM Plex Sans / 思源黑体
- Mono：JetBrains Mono / IBM Plex Mono

规则：
- 像素字体只用于标题、按钮、状态标签。
- 正文、日志、说明不要全部像素字体，避免疲劳。

## 7.4 图标风格

- 16x16 或 24x24 像素图标
- 使用硬边、不抗锯齿的图标语言
- Agent 头像可做职业化：Planner / Coder / Tester / Reviewer

## 8. 页面优先级

### P0：设计原型必须做

1. Project Dashboard
2. Kanban Board
3. Task Detail / Vibe Ticket
4. DiffReel Review

### P1：第二轮设计

1. Workspace Sandbox
2. Agent Runs
3. Acceptance Lab

### P2：后续扩展

1. Context Pack Library
2. Settings
3. Agent Detail Deep Dive

## 9. 推荐原型流程

设计软件里建议按以下顺序制作 clickable prototype：

1. Project Dashboard：看到项目全局状态。
2. 点击 Active Living Ticket 进入 Task Detail。
3. 在 Task Detail 启动 workspace preview、查看 Agent Timeline。
4. 点击 Run Checks，验收分数变化。
5. 点击 Move to Review，进入 DiffReel Review。
6. 在 DiffReel 点击 Approve，任务进入 Done。

## 10. 空状态与异常状态

### Empty Board

文案：`No quests loaded. Create your first living ticket.`

操作：Create Task

### Preview Failed

展示：
- 错误摘要
- stderr 日志
- Retry Workspace
- Open Runtime Settings

### Agent Failed

展示：
- 失败步骤
- 最后一次成功事件
- Retry from checkpoint
- Add instruction

### Acceptance Failed

展示：
- 失败标准
- 失败截图 / 日志
- Re-run check
- Ask AI to fix

## 11. 设计注意事项

- 像素风是外观语言，不要牺牲信息密度和可读性。
- 任务卡不要过度装饰；状态必须一眼可扫。
- 运行证据是核心资产，页面布局要给 preview、日志和验收结果足够空间。
- Agent Timeline 要可信，避免做成“聊天机器人消息流”那么轻飘。
- Review 页面要服务决策：通过 / 驳回 / 重跑检查必须明显。

## 12. 推荐首批设计画板

1. `01-App-Shell`
2. `02-Project-Dashboard`
3. `03-Kanban-Board`
4. `04-Vibe-Ticket-Detail`
5. `05-Agent-Timeline-States`
6. `06-Acceptance-Lab`
7. `07-DiffReel-Review`
8. `08-Pixel-Components`
9. `09-Empty-And-Error-States`
