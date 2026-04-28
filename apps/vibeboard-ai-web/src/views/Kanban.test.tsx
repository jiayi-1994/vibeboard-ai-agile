import { afterEach, beforeEach, describe, it, expect, vi } from 'vitest';
import { renderWithProviders, screen } from '../test/render';
import { Kanban } from './Kanban';

describe('Kanban', () => {
  const mockOnTicketSelect = vi.fn();
  const fetchMock = vi.fn();

  beforeEach(() => {
    vi.stubGlobal('fetch', fetchMock);
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => [
        {
          id: 'ticket-backlog',
          projectId: 'project-1',
          title: '优化数据库索引策略以降低查询延迟',
          description: '真实 backlog 工单',
          status: 'backlog',
          priority: 'medium',
          assigneeType: 'agent',
          assigneeId: 'alpha',
          branchName: 'feat/indexes',
          previewUrl: null,
          previewStatus: 'idle',
          acceptanceScore: 0,
          vibeStage: 'brief',
          createdAt: '2026-04-28T10:00:00Z',
          updatedAt: '2026-04-28T10:00:00Z'
        },
        {
          id: 'ticket-review',
          projectId: 'project-1',
          title: '实现身份验证流程',
          description: '真实 review 工单',
          status: 'review',
          priority: 'high',
          assigneeType: 'agent',
          assigneeId: 'beta',
          branchName: 'feat/auth',
          previewUrl: 'http://127.0.0.1:4173',
          previewStatus: 'running',
          acceptanceScore: 0.88,
          vibeStage: 'review',
          createdAt: '2026-04-28T10:00:00Z',
          updatedAt: '2026-04-28T10:00:00Z'
        },
        {
          id: 'ticket-blocked',
          projectId: 'project-1',
          title: '自动生成单元测试用例 (覆盖率 > 80%)',
          description: '真实 blocked 工单',
          status: 'blocked',
          priority: 'medium',
          assigneeType: 'agent',
          assigneeId: 'gamma',
          branchName: 'feat/tests',
          previewUrl: null,
          previewStatus: 'failed',
          acceptanceScore: 0.4,
          vibeStage: 'evidence',
          createdAt: '2026-04-28T10:00:00Z',
          updatedAt: '2026-04-28T10:00:00Z'
        }
      ]
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('renders kanban board with columns', async () => {
    renderWithProviders(<Kanban onTicketSelect={mockOnTicketSelect} />);
    
    expect(await screen.findByText('待处理')).toBeInTheDocument();
    expect(screen.getByText('准备就绪')).toBeInTheDocument();
    expect(screen.getByText('执行中')).toBeInTheDocument();
    expect(screen.getByText('待审查')).toBeInTheDocument();
    expect(screen.getByText('已阻塞')).toBeInTheDocument();
    expect(screen.getByText('已完成')).toBeInTheDocument();
  });

  it('displays vibe stage badges on tickets', async () => {
    renderWithProviders(<Kanban onTicketSelect={mockOnTicketSelect} />);
    
    expect(await screen.findByText('简报')).toBeInTheDocument();
    expect(screen.getAllByText('审查').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('证据')).toBeInTheDocument();
  });

  it('shows ticket progress bars', async () => {
    renderWithProviders(<Kanban onTicketSelect={mockOnTicketSelect} />);
    
    expect((await screen.findAllByText('Agent 进度')).length).toBeGreaterThan(0);
    expect(screen.getByText('Agent 已阻塞')).toBeInTheDocument();
  });

  it('calls onTicketSelect when ticket is clicked', async () => {
    renderWithProviders(<Kanban onTicketSelect={mockOnTicketSelect} />);
    
    const firstTicket = await screen.findByText('优化数据库索引策略以降低查询延迟');
    firstTicket.click();
    
    expect(mockOnTicketSelect).toHaveBeenCalledWith('ticket-backlog');
  });

  it('displays agent load indicator', async () => {
    renderWithProviders(<Kanban onTicketSelect={mockOnTicketSelect} />);
    
    expect(await screen.findByText(/Agent 负载: 0%/)).toBeInTheDocument();
  });

  it('shows active border for blocked tickets', async () => {
    renderWithProviders(<Kanban onTicketSelect={mockOnTicketSelect} />);
    
    expect(await screen.findByText('Agent 已阻塞')).toBeInTheDocument();
  });
});
