# 用户流程

## Flow 1：PM 创建 Vibe Ticket

1. PM 在 Board 中创建任务。
2. 输入标题、目标、上下文和验收标准。
3. 选择目标 workspace、代码范围或组件/接口范围。
4. 系统创建 Vibe Ticket，并准备 preview runtime 或等价运行证据入口。
5. 卡片显示初始证据状态和待执行验收标准。

## Flow 2：AI Agent 执行任务

1. 用户点击“Assign to AI”。
2. Agent 读取任务描述、相关项目上下文和 Context Pack。
3. Agent 输出执行计划，等待用户确认或直接进入执行。
4. Agent 修改文件并运行检查。
5. Timeline 实时记录所有关键动作。
6. Workspace Preview 或运行证据更新，卡片显示最新状态。

## Flow 3：人类中途纠偏

1. 用户看到预览、日志或测试结果偏离预期。
2. 在卡片评论中输入纠偏指令。
3. Agent 暂停当前步骤，更新计划。
4. Agent 继续修改并记录新决策。

## Flow 4：Review 与验收

1. Agent 完成任务并进入 Review。
2. 系统生成 DiffReel。
3. Reviewer 查看 Before / After、验收标准、测试结果和文件摘要。
4. Reviewer 选择 Approve 或 Request changes。
5. Approve 后任务进入 Done，并沉淀 Context Pack。
