# 开发路线图

## Phase 0：项目初始化

- 初始化 monorepo
- 搭建 Vite React 前端
- 搭建 API 服务
- 配置数据库 schema
- 建立基础设计系统

## Phase 1：普通敏捷看板

- 项目创建
- 任务 CRUD
- Kanban 列拖拽
- 卡片详情页
- 评论 / timeline 基础 UI

## Phase 2：Living Ticket Preview

- 接入示例 workspace
- API 启动 / 停止 workspace preview
- 卡片详情页 iframe 预览
- 捕获 build / console error
- preview 状态实时更新

## Phase 3：Agent Timeline

- Agent provider 抽象
- Planning Agent 输出计划
- Coding Agent 生成 patch
- Timeline 记录 agent 过程
- 支持用户追加指令

## Phase 4：Executable Acceptance

- 自然语言验收标准结构化
- Playwright 检查执行
- DOM / console 检查执行
- 验收通过率驱动任务状态

## Phase 5：DiffReel Review

- Before / After 截图
- 文件改动摘要
- Review 页面
- Approve / Request changes
- Context Pack 初版

## Phase 6：产品化增强

- 多项目支持
- GitHub 集成
- PR 创建和同步
- 权限管理
- Agent 质量指标
- 更强 preview runtime 隔离
