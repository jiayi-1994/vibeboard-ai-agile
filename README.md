# VibeBoard AI Agile

VibeBoard AI Agile 是一个面向 vibe coding 场景的敏捷追踪工作台。它不是 Vite 专用看板，也不是 Jira / Linear 的完整替代品；它把 idea、任务卡、AI Agent 执行轨迹、运行预览、自动验收和 Review 决策连接成一个可追踪闭环。

## 一句话定位

把 vibe coding 从“边聊边改代码的黑盒过程”变成可计划、可观察、可验收、可复盘的敏捷交付流。

## 核心假设

- vibe coding 的真实进度应该由计划、代码变更、运行状态、测试结果、视觉/行为差异和 Review 决策共同决定，而不是人工拖动卡片。
- AI Agent 适合处理明确、可验证、范围受控的任务；人类主要负责意图定义、方向纠偏、风险判断和最终验收。
- 运行预览是证据载体，不是产品定位本身；MVP 可以用 Vite dev server 承载前端示例，但核心价值是“敏捷追踪 + Agent 可观测 + 可执行验收”。

## MVP 核心能力

1. **Vibe Ticket**：每张任务卡绑定一个 vibe coding 目标、上下文、执行计划和运行证据。
2. **Agent Activity Timeline**：记录 AI 的计划、文件修改、命令运行、失败、纠偏和结果。
3. **Live Workspace Preview**：对适合预览的任务展示目标应用/组件/接口行为，作为验收证据。
4. **Executable Acceptance Criteria**：自然语言验收标准转为可执行检查。
5. **DiffReel Review**：任务完成后生成 Before / After、测试结果和 AI 修改摘要。
6. **Context Pack**：沉淀成功任务的提示词、项目约定、相关文件和失败模式。

## 当前目录

```text
docs/
  product/      产品愿景、PRD、MVP、用户流程、UI 信息架构
  technical/    技术架构、数据模型、Agent 设计
  planning/     路线图、Backlog、开发任务
  research/     外部参考和竞品观察
apps/
  vibeboard-ai-web/  VibeBoard 前端原型
packages/       未来放共享包、SDK、agent 工具
```

## 推荐技术方向

- Frontend: Vite + React + TypeScript（作为前端构建工具，不作为产品定位）
- UI: Tailwind CSS + shadcn/ui 或自研设计系统
- Board State: PostgreSQL + Prisma / Drizzle
- Realtime: WebSocket / PartyKit / Socket.IO
- Preview Runtime: 第一阶段用本地/服务端 preview command，后续评估 WebContainer 或容器池
- Agent Runtime: 可插拔 Provider，先支持 OpenAI / Anthropic 兼容接口
- Test Runtime: Playwright + DOM assertions + screenshot diff

## 下一步

先阅读：

1. `docs/product/product-vision.md`
2. `docs/product/prd.md`
3. `docs/product/mvp-scope.md`
4. `docs/product/ui-information-architecture.md`

## 本地开发

### 前端

保持现有前端工作流即可：

```bash
cd apps/vibeboard-ai-web
npm install
npm run dev
```

Vite 已代理 `/api` 和 `/ws` 到 `http://127.0.0.1:8000`，因此前端接后端时不需要额外改浏览器 CORS 配置。

### Python 后端

```bash
cd apps/api
uv sync
uv run alembic upgrade head
uv run uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
```

启动后可访问：

- Swagger UI: `http://127.0.0.1:8000/docs`
- OpenAPI JSON: `http://127.0.0.1:8000/openapi.json`

默认 SQLite 文件会创建在 `apps/api/.data/vibeboard.db`。如果需要切换前端允许来源，可通过 `VIBEBOARD_CORS_ORIGINS` 传入逗号分隔的本地地址列表。

### OpenAPI -> TypeScript 类型同步

在仓库根目录执行：

```bash
pnpm run openapi:generate
```

这会：

1. 从 FastAPI 导出 `apps/api/openapi.json`
2. 生成 `apps/vibeboard-ai-web/src/types/api.generated.ts`
