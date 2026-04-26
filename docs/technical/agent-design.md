# Agent 设计

## Agent 类型

### Planning Agent

输入：任务标题、描述、验收标准、项目上下文。  
输出：任务拆解、风险、预计修改范围、执行顺序。

### Coding Agent

输入：确认后的计划、文件上下文、可用命令。  
输出：patch、命令执行结果、阻塞点、下一步建议。

### Acceptance Agent

输入：自然语言验收标准、当前页面结构、项目测试约定。  
输出：可执行检查项草案。

### Review Agent

输入：diff、截图、验收结果、timeline。  
输出：DiffReel 摘要、风险说明、review checklist。

### Context Builder Agent

输入：成功完成的任务、最终 diff、review 反馈。  
输出：可复用上下文包和项目约定。

## Agent 安全边界

- 默认不能访问项目外目录。
- 默认不能运行任意 shell 命令，只允许 allowlist。
- 每次文件写入必须形成 patch，并可回滚。
- 关键操作需要 timeline event。
- 高风险修改进入人工确认：依赖安装、配置改动、删除文件、大规模重构。

## Timeline 事件标准

每个 Agent 动作都应记录：

- 动作类型
- 原因
- 输入摘要
- 输出摘要
- 影响文件
- 是否成功
- 下一步

## Agent 成功标准

- 修改范围符合任务意图。
- Preview 可运行。
- 验收标准通过。
- 生成 Review 摘要。
- 未触碰无关文件。
