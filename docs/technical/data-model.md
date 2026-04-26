# 数据模型草案

## Project

- id
- name
- repositoryUrl
- localPath
- defaultBranch
- previewCommand
- installCommand
- testCommand
- createdAt
- updatedAt

## Task

- id
- projectId
- title
- description
- status: backlog | ready | in_progress | review | done | blocked
- priority
- assigneeType: human | agent | cell
- assigneeId
- branchName
- previewUrl
- previewStatus
- acceptanceScore
- createdAt
- updatedAt

## AcceptanceCriterion

- id
- taskId
- text
- checkType: manual | playwright | dom | screenshot | console
- generatedCheck
- status: pending | passing | failing | skipped
- lastRunAt
- lastError

## AgentRun

- id
- taskId
- agentType: planner | coder | reviewer | tester
- status: queued | running | paused | completed | failed | cancelled
- model
- startedAt
- completedAt
- summary
- error

## TimelineEvent

- id
- taskId
- agentRunId
- type: plan | file_read | file_write | command | test | preview | comment | decision | error
- title
- payload
- createdAt

## PreviewSession

- id
- taskId
- workspacePath
- port
- url
- status
- startedAt
- stoppedAt
- lastError

## DiffReel

- id
- taskId
- beforeScreenshotUrl
- afterScreenshotUrl
- summary
- changedFiles
- acceptanceSnapshot
- createdAt

## ContextPack

- id
- projectId
- taskId
- title
- domain
- relevantFiles
- prompts
- conventions
- successfulChecks
- createdAt
