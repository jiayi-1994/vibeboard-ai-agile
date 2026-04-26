# 技术架构

## 总体架构

```text
Browser UI
  ├─ Board / Cards
  ├─ Preview iframe
  ├─ Agent timeline
  └─ DiffReel review

API Server
  ├─ Project / Task API
  ├─ Agent orchestration API
  ├─ Preview runtime manager
  ├─ Acceptance check runner
  └─ Realtime event gateway

Runtime Layer
  ├─ Workspace preview process / container
  ├─ File workspace
  ├─ Test runner
  └─ Git branch / patch manager

AI Layer
  ├─ Planning agent
  ├─ Coding agent
  ├─ Acceptance generator
  ├─ Review summarizer
  └─ Context pack builder
```

## 关键模块

### Board UI

- 展示任务列和卡片状态
- 卡片内显示 preview 状态、验收通过率、AI 执行状态
- 详情页承载 preview iframe 和 timeline

### Preview Runtime Manager

- 为任务启动独立 workspace preview 运行环境
- 管理端口、进程、日志、错误状态
- 将 preview URL 写回任务卡片
- 后续可升级为容器池或 WebContainer

### Agent Orchestrator

- 接收任务上下文
- 生成执行计划
- 控制读写文件、运行命令、测试和提交 patch
- 将每一步输出为 timeline event
- 必须支持暂停、继续、取消和追加指令

### Acceptance Runner

- 将自然语言验收标准转成检查项
- 支持 Playwright、DOM query、截图对比、console error 检查
- 结果写回任务进度

### DiffReel Generator

- 捕获修改前后截图
- 汇总文件改动
- 汇总测试和验收结果
- 生成适合 PM / Reviewer 阅读的 review 页面

## MVP 技术选择

- Monorepo: pnpm workspace 或 Turborepo
- App: Vite + React + TypeScript
- API: Node.js + Fastify / Hono
- DB: PostgreSQL + Prisma / Drizzle
- Realtime: WebSocket
- Agent: provider abstraction，先封装 OpenAI-compatible chat/completions
- Preview: 本地 child_process 启动 preview command；MVP 示例可用 Vite，后续迁移容器
- Tests: Playwright

## 主要风险

1. Preview runtime 资源隔离不足。
2. AI 直接写文件可能破坏项目。
3. 自然语言验收转测试准确率不稳定。
4. 多任务并发时端口、文件和 Git 状态管理复杂。
5. 预览截图和视觉 diff 在不同环境可能不稳定。

## 风险控制

- 每个任务使用独立 workspace copy 或 git worktree。
- Agent 写入必须通过 patch manager，不允许随意覆盖。
- 所有命令有 allowlist、timeout 和日志。
- 默认只允许修改 blast radius 内文件。
- Review 前必须通过 build / lint / acceptance checks。

