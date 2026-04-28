import type { VibeTicket, ContextPack, AcceptanceCriteria, PlanStep, EvidenceNode, TerminalLog } from '../types/vibeTicket';

const authContextPack: ContextPack = {
  id: 'ctx-auth-001',
  name: 'Authentication Patterns',
  description: 'JWT, OAuth2.0, session management patterns',
  selected: true,
  items: [
    'src/middleware/auth.ts',
    'src/utils/jwt.ts',
    'docs/auth-flow.md'
  ]
};

const uiContextPack: ContextPack = {
  id: 'ctx-ui-001',
  name: 'UI Component Library',
  description: 'Brutalist design system components',
  selected: true,
  items: [
    'src/components/layout/',
    'src/index.css',
    'docs/design-system.md'
  ]
};

const apiContextPack: ContextPack = {
  id: 'ctx-api-001',
  name: 'API Integration Patterns',
  description: 'REST client, error handling, retry logic',
  selected: false,
  items: [
    'src/api/client.ts',
    'src/api/interceptors.ts'
  ]
};

const authAcceptanceCriteria: AcceptanceCriteria[] = [
  {
    id: 'ac-1',
    text: '生成基础登录表单 UI 组件 (账号/密码)',
    checked: true
  },
  {
    id: 'ac-2',
    text: '集成 Axios 请求库并配置拦截器',
    checked: true
  },
  {
    id: 'ac-3',
    text: '实现 Vue/React 路由守卫拦截未授权访问',
    checked: false,
    active: true
  },
  {
    id: 'ac-4',
    text: '处理 401 Unauthorized 错误响应并清空本地态',
    checked: false
  }
];

const authPlanSteps: PlanStep[] = [
  {
    id: 'step-1',
    goal: 'Create AuthForm component with brutalist styling',
    expectedOutput: 'src/components/AuthForm.tsx with form fields and submit button',
    completionSignal: 'Component renders without errors, matches design system',
    risk: 'low',
    requiresCheckpoint: false
  },
  {
    id: 'step-2',
    goal: 'Integrate Axios and configure JWT interceptors',
    expectedOutput: 'src/api/auth.ts with login endpoint and token management',
    completionSignal: 'Successful login returns token, interceptor adds Authorization header',
    risk: 'medium',
    requiresCheckpoint: true
  },
  {
    id: 'step-3',
    goal: 'Implement route guards for protected routes',
    expectedOutput: 'Route protection logic in App.tsx or router config',
    completionSignal: 'Unauthenticated users redirected to login, authenticated users access protected routes',
    risk: 'high',
    requiresCheckpoint: true
  },
  {
    id: 'step-4',
    goal: 'Handle 401 errors and token expiration',
    expectedOutput: 'Error interceptor clears token and redirects to login',
    completionSignal: 'Expired token triggers logout, user sees login screen',
    risk: 'medium',
    requiresCheckpoint: false
  }
];

const authEvidenceNodes: EvidenceNode[] = [
  {
    id: 'ev-1',
    planStepId: 'step-1',
    type: 'file_change',
    status: 'success',
    timestamp: '14:22:03',
    summary: 'Created AuthForm.tsx component',
    details: 'Scaffolded component with form fields, submit button, and brutalist styling',
    artifactPath: 'src/components/AuthForm.tsx'
  },
  {
    id: 'ev-2',
    planStepId: 'step-1',
    type: 'ui_preview',
    status: 'success',
    timestamp: '14:22:05',
    summary: 'UI preview updated',
    details: 'Login form renders correctly with brutalist borders and shadows',
    artifactPath: 'http://localhost:5173/login'
  },
  {
    id: 'ev-3',
    planStepId: 'step-2',
    type: 'file_change',
    status: 'success',
    timestamp: '14:22:10',
    summary: 'Created auth API client',
    details: 'Implemented login endpoint with JWT token handling',
    artifactPath: 'src/api/auth.ts'
  },
  {
    id: 'ev-4',
    planStepId: 'step-3',
    type: 'agent_decision',
    status: 'running',
    timestamp: '14:22:15',
    summary: 'Implementing React Router navigation guards',
    details: 'Adding ProtectedRoute wrapper component for authenticated routes'
  }
];

const authTerminalLogs: TerminalLog[] = [
  {
    time: '[14:22:01]',
    tag: '[SYSTEM]',
    text: 'Task TKT-492 initialized. Parsing requirements...',
    tagColor: 'text-secondary-fixed'
  },
  {
    time: '[14:22:03]',
    tag: '[AGENT]',
    text: 'Scaffolded AuthForm.tsx component. Added basic layout.',
    tagColor: 'text-primary-fixed'
  },
  {
    time: '[14:22:05]',
    tag: '[PREVIEW]',
    text: 'Workspace evidence updated: /src/components/AuthForm.tsx',
    tagColor: 'text-surface-dim',
    textColor: 'text-tertiary-fixed'
  },
  {
    time: '[14:22:15]',
    tag: '[AGENT]',
    text: 'Implementing React Router navigation guards...',
    tagColor: 'text-primary-fixed',
    active: true
  }
];

export const mockAuthTicket: VibeTicket = {
  id: 'TICKET-492',
  title: '实现身份验证流程',
  vibeStage: 'evidence',
  agileStatus: 'in_progress',
  priority: 'high',
  assignee: 'Agent-007',
  sprint: 'Iteration 14 (Alpha)',
  brief: {
    originalIdea: '需要在客户端和服务器之间建立安全的身份验证机制。目前前端路由处于完全开放状态，必须实现基于 JWT 的登录拦截。',
    target: '实现完整的用户身份验证流程',
    expectedChange: 'Agent 需要生成对应的登录界面，对接 `/api/v1/auth/login` 端点，并在成功后将 Token 注入到本地存储及全局请求头中。',
    acceptanceCriteria: authAcceptanceCriteria,
    constraints: [
      '必须使用 JWT token 格式',
      '密码字段必须加密传输',
      'Token 过期时间设置为 24 小时'
    ],
    nonGoals: [
      '不实现注册功能',
      '不实现密码重置',
      '不实现多因素认证'
    ],
    targetWorkspace: 'apps/vibeboard-ai-web',
    allowedScope: [
      'src/components/',
      'src/api/',
      'src/utils/',
      'src/App.tsx'
    ],
    evidenceType: ['ui_preview', 'test_log', 'file_change'],
    contextPacks: [authContextPack, uiContextPack, apiContextPack]
  },
  plan: {
    agentUnderstanding: '用户需要一个完整的身份验证流程，包括登录界面、API 集成、路由保护和错误处理。重点是确保未授权用户无法访问受保护的路由，同时提供良好的用户体验。',
    steps: authPlanSteps,
    expectedModifiedAreas: [
      'src/components/AuthForm.tsx (new)',
      'src/api/auth.ts (new)',
      'src/App.tsx (modified)',
      'src/utils/jwt.ts (new)'
    ],
    scopeRisk: false,
    riskLevel: 'medium',
    checkpoints: [
      'Before implementing route guards (step-3)',
      'After completing API integration (step-2)'
    ],
    autonomyPolicy: 'checkpoint',
    testStrategy: 'Unit tests for auth utilities, integration tests for login flow, manual testing for UI'
  },
  evidence: {
    nodes: authEvidenceNodes,
    rawLogs: authTerminalLogs
  },
  review: {
    overallStatus: 'conditional',
    summary: '登录表单与 API 客户端已完成，证据链显示核心 UI 和请求封装可用；路由守卫与 401 过期处理仍在执行中，需要在交付前补齐。',
    briefSummary: '身份验证需求、范围边界与上下文包已经整理完成。',
    planSummary: '登录 UI 与 API 集成已完成，路由守卫与 401 清理仍在推进。',
    evidenceSummary: '证据链显示表单、API client 已完成，路由守卫还在运行中。',
    acceptanceCriteria: [
      {
        criterion: '生成基础登录表单 UI 组件 (账号/密码)',
        met: true,
        evidence: 'AuthForm.tsx 已生成，并通过 UI preview 证据确认可渲染。'
      },
      {
        criterion: '集成 Axios 请求库并配置拦截器',
        met: true,
        evidence: 'auth API client 已创建，JWT token 注入逻辑已记录在执行证据中。'
      },
      {
        criterion: '实现 React 路由守卫拦截未授权访问',
        met: false,
        evidence: '当前证据仍停留在 ProtectedRoute 实现中。',
        gap: '需要提交路由守卫实现并补未授权跳转验证。'
      },
      {
        criterion: '处理 401 Unauthorized 错误响应并清空本地态',
        met: false,
        evidence: '尚未看到 401 分支测试或运行日志。',
        gap: '需要补错误拦截器和 token 清理验证。'
      }
    ],
    qualityMetrics: {
      testCoverage: 72,
      codeQuality: 88,
      documentationCompleteness: 84,
      performanceBenchmark: 96
    },
    risks: [
      {
        severity: 'high',
        description: '路由守卫未完成时，受保护页面仍可能被未授权用户访问。',
        mitigation: '完成 ProtectedRoute 并添加未登录访问重定向测试。'
      },
      {
        severity: 'medium',
        description: '401 token 过期分支缺少自动化验证。',
        mitigation: '补 API error interceptor 测试，确认过期后清空本地态。'
      }
    ],
    changedFiles: [
      'src/components/AuthForm.tsx',
      'src/api/auth.ts',
      'src/App.tsx'
    ],
    contextPackDraft: {
      prompt: '实现完整的用户身份验证流程',
      finalPlan: '先完成登录表单与 API 集成，再实现路由守卫和 401 错误处理。',
      keyEvidence: ['Created AuthForm.tsx component', 'Created auth API client'],
      successfulChecks: ['登录表单可渲染', 'JWT token 注入逻辑已记录'],
      conventions: ['保持 brutalist 视觉风格', 'JWT token 由请求拦截器统一注入']
    },
    recommendation: 'approve_with_conditions',
    nextSteps: [
      '完成 React route guard 并补未授权访问测试。',
      '实现 401 Unauthorized 清理流程并补过期 token 验证。',
      '复跑 lint、单元测试和一次手动登录流程检查。'
    ]
  },
  createdAt: '2026-04-26T10:00:00Z',
  updatedAt: '2026-04-26T14:22:15Z'
};

export const mockApiTicket: VibeTicket = {
  id: 'TICKET-089',
  title: '优化数据库索引策略以降低查询延迟',
  vibeStage: 'brief',
  agileStatus: 'backlog',
  priority: 'medium',
  assignee: 'Agent-003',
  sprint: 'Iteration 15 (Beta)',
  brief: {
    originalIdea: '当前数据库查询性能较差，特别是在用户列表和订单查询接口。需要分析慢查询日志并添加合适的索引。',
    target: '将平均查询时间从 800ms 降低到 100ms 以下',
    expectedChange: 'Agent 分析数据库查询模式，识别缺失的索引，生成 migration 文件添加索引。',
    acceptanceCriteria: [
      {
        id: 'ac-db-1',
        text: '分析慢查询日志，识别性能瓶颈',
        checked: false
      },
      {
        id: 'ac-db-2',
        text: '为 users 表的 email 和 created_at 字段添加索引',
        checked: false
      },
      {
        id: 'ac-db-3',
        text: '为 orders 表的 user_id 和 status 组合添加复合索引',
        checked: false
      },
      {
        id: 'ac-db-4',
        text: '验证查询性能提升，平均响应时间 < 100ms',
        checked: false
      }
    ],
    constraints: [
      '不能影响现有数据',
      '必须使用数据库 migration 工具',
      '索引命名遵循 idx_tablename_columnname 规范'
    ],
    nonGoals: [
      '不重构现有查询语句',
      '不修改表结构',
      '不实现查询缓存'
    ],
    targetWorkspace: 'apps/vibeboard-api',
    allowedScope: [
      'db/migrations/',
      'docs/database/'
    ],
    evidenceType: ['test_log', 'api_response'],
    contextPacks: [
      {
        id: 'ctx-db-001',
        name: 'Database Schema',
        description: 'Current database schema and migration patterns',
        selected: true,
        items: ['db/schema.sql', 'db/migrations/']
      }
    ]
  },
  createdAt: '2026-04-25T09:00:00Z',
  updatedAt: '2026-04-25T09:00:00Z'
};

export const mockTestTicket: VibeTicket = {
  id: 'TICKET-077',
  title: '自动生成单元测试用例 (覆盖率 > 80%)',
  vibeStage: 'evidence',
  agileStatus: 'in_progress',
  priority: 'medium',
  assignee: 'Agent-005',
  sprint: 'Iteration 14 (Alpha)',
  brief: {
    originalIdea: 'src/utils/ 目录下的工具函数缺少测试覆盖，需要 Agent 自动生成单元测试。',
    target: '为所有工具函数生成单元测试，覆盖率达到 80% 以上',
    expectedChange: 'Agent 分析函数签名和实现，生成对应的测试用例，包括正常情况、边界情况和错误情况。',
    acceptanceCriteria: [
      {
        id: 'ac-test-1',
        text: '为 src/utils/date.ts 生成测试',
        checked: true
      },
      {
        id: 'ac-test-2',
        text: '为 src/utils/string.ts 生成测试',
        checked: true
      },
      {
        id: 'ac-test-3',
        text: '为 src/utils/validation.ts 生成测试',
        checked: false,
        active: true
      },
      {
        id: 'ac-test-4',
        text: '运行测试套件，确保覆盖率 > 80%',
        checked: false
      }
    ],
    constraints: [
      '使用 Vitest 测试框架',
      '测试文件命名为 *.test.ts',
      '每个函数至少 3 个测试用例'
    ],
    nonGoals: [
      '不生成集成测试',
      '不修改原有函数实现',
      '不添加测试覆盖率工具配置'
    ],
    targetWorkspace: 'apps/vibeboard-ai-web',
    allowedScope: [
      'src/utils/*.test.ts'
    ],
    evidenceType: ['test_log', 'file_change'],
    contextPacks: [
      {
        id: 'ctx-test-001',
        name: 'Testing Patterns',
        description: 'Vitest setup and testing best practices',
        selected: true,
        items: ['src/test/setup.ts', 'src/test/render.tsx']
      }
    ]
  },
  plan: {
    agentUnderstanding: '用户需要为工具函数生成全面的单元测试，确保代码质量和可维护性。测试应该覆盖正常流程、边界情况和错误处理。',
    steps: [
      {
        id: 'test-step-1',
        goal: 'Analyze utility functions and identify test scenarios',
        expectedOutput: 'List of functions with test case descriptions',
        completionSignal: 'All functions documented with test scenarios',
        risk: 'low',
        requiresCheckpoint: false
      },
      {
        id: 'test-step-2',
        goal: 'Generate test files for date utilities',
        expectedOutput: 'src/utils/date.test.ts with comprehensive tests',
        completionSignal: 'Tests pass, coverage > 80% for date.ts',
        risk: 'low',
        requiresCheckpoint: false
      },
      {
        id: 'test-step-3',
        goal: 'Generate test files for string utilities',
        expectedOutput: 'src/utils/string.test.ts with comprehensive tests',
        completionSignal: 'Tests pass, coverage > 80% for string.ts',
        risk: 'low',
        requiresCheckpoint: false
      },
      {
        id: 'test-step-4',
        goal: 'Generate test files for validation utilities',
        expectedOutput: 'src/utils/validation.test.ts with comprehensive tests',
        completionSignal: 'Tests pass, coverage > 80% for validation.ts',
        risk: 'medium',
        requiresCheckpoint: false
      }
    ],
    expectedModifiedAreas: [
      'src/utils/date.test.ts (new)',
      'src/utils/string.test.ts (new)',
      'src/utils/validation.test.ts (new)'
    ],
    scopeRisk: false,
    riskLevel: 'low',
    checkpoints: [],
    autonomyPolicy: 'full',
    testStrategy: 'Generate unit tests with happy path, edge cases, and error scenarios'
  },
  evidence: {
    nodes: [
      {
        id: 'test-ev-1',
        planStepId: 'test-step-2',
        type: 'file_change',
        status: 'success',
        timestamp: '11:30:05',
        summary: 'Created date.test.ts',
        details: 'Generated 12 test cases covering date formatting, parsing, and validation',
        artifactPath: 'src/utils/date.test.ts'
      },
      {
        id: 'test-ev-2',
        planStepId: 'test-step-2',
        type: 'test_log',
        status: 'success',
        timestamp: '11:30:08',
        summary: 'date.test.ts: 12 passed',
        details: 'All tests passed, coverage: 92%'
      },
      {
        id: 'test-ev-3',
        planStepId: 'test-step-3',
        type: 'file_change',
        status: 'success',
        timestamp: '11:32:15',
        summary: 'Created string.test.ts',
        details: 'Generated 15 test cases for string manipulation functions',
        artifactPath: 'src/utils/string.test.ts'
      },
      {
        id: 'test-ev-4',
        planStepId: 'test-step-3',
        type: 'test_log',
        status: 'success',
        timestamp: '11:32:18',
        summary: 'string.test.ts: 15 passed',
        details: 'All tests passed, coverage: 88%'
      },
      {
        id: 'test-ev-5',
        planStepId: 'test-step-4',
        type: 'agent_decision',
        status: 'running',
        timestamp: '11:35:20',
        summary: 'Generating validation.test.ts',
        details: 'Analyzing validation functions and edge cases'
      }
    ],
    rawLogs: [
      {
        time: '[11:30:00]',
        tag: '[SYSTEM]',
        text: 'Task TICKET-077 initialized',
        tagColor: 'text-secondary-fixed'
      },
      {
        time: '[11:30:05]',
        tag: '[AGENT]',
        text: 'Generated date.test.ts with 12 test cases',
        tagColor: 'text-primary-fixed'
      },
      {
        time: '[11:30:08]',
        tag: '[TEST]',
        text: '✓ date.test.ts (12 passed) - Coverage: 92%',
        tagColor: 'text-primary-fixed'
      },
      {
        time: '[11:32:15]',
        tag: '[AGENT]',
        text: 'Generated string.test.ts with 15 test cases',
        tagColor: 'text-primary-fixed'
      },
      {
        time: '[11:32:18]',
        tag: '[TEST]',
        text: '✓ string.test.ts (15 passed) - Coverage: 88%',
        tagColor: 'text-primary-fixed'
      },
      {
        time: '[11:35:20]',
        tag: '[AGENT]',
        text: 'Analyzing validation functions...',
        tagColor: 'text-primary-fixed',
        active: true
      }
    ]
  },
  createdAt: '2026-04-26T11:00:00Z',
  updatedAt: '2026-04-26T11:35:20Z'
};

export const mockTickets: VibeTicket[] = [
  mockAuthTicket,
  mockApiTicket,
  mockTestTicket
];

export const getTicketById = (id?: string): VibeTicket | undefined => {
  if (!id) return undefined;
  return mockTickets.find(t => t.id === id);
};

export const getTicketsByStage = (stage: VibeTicket['vibeStage']): VibeTicket[] => {
  return mockTickets.filter(ticket => ticket.vibeStage === stage);
};

export const getTicketsByStatus = (status: VibeTicket['agileStatus']): VibeTicket[] => {
  return mockTickets.filter(ticket => ticket.agileStatus === status);
};
