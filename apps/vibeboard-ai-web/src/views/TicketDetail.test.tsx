import { afterEach, beforeEach, describe, it, expect, vi } from 'vitest';
import { renderWithProviders, screen } from '../test/render';
import { TicketDetail } from './TicketDetail';
import userEvent from '@testing-library/user-event';
import { act } from 'react';

describe('TicketDetail', () => {
  const mockOnBack = vi.fn();
  const fetchMock = vi.fn();
  const sockets: MockWebSocket[] = [];

  class MockWebSocket {
    static CONNECTING = 0;
    static OPEN = 1;
    static CLOSING = 2;
    static CLOSED = 3;

    readyState = MockWebSocket.OPEN;
    private listeners = new Map<string, Array<(event: { data?: string }) => void>>();

    constructor(public readonly url: string) {
      sockets.push(this);
      queueMicrotask(() => {
        this.emit('message', JSON.stringify({ type: 'timeline.connected', ticketId: 'ticket-123' }));
      });
    }

    addEventListener(type: string, listener: (event: { data?: string }) => void) {
      const current = this.listeners.get(type) || [];
      current.push(listener);
      this.listeners.set(type, current);
    }

    close() {
      this.readyState = MockWebSocket.CLOSED;
      this.emit('close');
    }

    emit(type: string, data?: string) {
      for (const listener of this.listeners.get(type) || []) {
        listener({ data });
      }
    }
  }

  beforeEach(() => {
    vi.stubGlobal('fetch', fetchMock);
    vi.stubGlobal('WebSocket', MockWebSocket as unknown as typeof WebSocket);
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({
        id: 'ticket-123',
        projectId: 'project-1',
        title: '实现身份验证流程',
        description: '真实 detail 工单',
        status: 'review',
        priority: 'high',
        assigneeType: 'agent',
        assigneeId: 'agent-007',
        branchName: 'feat/auth-flow',
        previewUrl: 'http://127.0.0.1:4173',
        previewStatus: 'running',
        acceptanceScore: 0.88,
        vibeStage: 'review',
        createdAt: '2026-04-28T10:00:00Z',
        updatedAt: '2026-04-28T10:00:00Z',
        acceptanceCriteria: [
          {
            id: 'ac-1',
            ticketId: 'ticket-123',
            text: '生成基础登录表单 UI 组件',
            checkType: 'manual',
            generatedCheck: null,
            status: 'passing',
            lastRunAt: null,
            lastError: null
          }
        ],
        timelineEvents: [
          {
            id: 'event-1',
            ticketId: 'ticket-123',
            agentRunId: null,
            sequence: 1,
            event: {
              kind: 'command',
              title: 'Run auth tests',
              payload: { command: 'pnpm test -- auth', status: 'success' }
            },
            createdAt: '2026-04-28T10:01:00Z'
          }
        ]
      })
    });
  });

  afterEach(() => {
    sockets.splice(0, sockets.length);
    vi.unstubAllGlobals();
  });

  it('renders ticket header with id and title', async () => {
    renderWithProviders(<TicketDetail id="ticket-123" onBack={mockOnBack} />);
    
    expect(await screen.findByText('ticket-123')).toBeInTheDocument();
    expect(screen.getByText('实现身份验证流程')).toBeInTheDocument();
  });

  it('displays stage navigation tabs', async () => {
    renderWithProviders(<TicketDetail id="ticket-123" onBack={mockOnBack} />);
    
    expect(await screen.findByText('简报')).toBeInTheDocument();
    expect(screen.getByText('计划')).toBeInTheDocument();
    expect(screen.getByText('证据')).toBeInTheDocument();
    expect(screen.getByText('审查')).toBeInTheDocument();
  });

  it('displays terminal drawer', async () => {
    renderWithProviders(<TicketDetail id="ticket-123" onBack={mockOnBack} />);
    
    expect(await screen.findByText('Agent Execution Terminal')).toBeInTheDocument();
    expect(screen.getByText('CONNECTING')).toBeInTheDocument();
  });

  it('calls onBack when back button is clicked', async () => {
    renderWithProviders(<TicketDetail id="ticket-123" onBack={mockOnBack} />);
    const user = userEvent.setup();
    await screen.findByText('实现身份验证流程');
    
    const backIcon = await screen.findByText('arrow_back');
    const backButton = backIcon.closest('button');
    expect(backButton).not.toBeNull();
    await user.click(backButton!);
    
    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });

  it('displays ticket status and priority', async () => {
    renderWithProviders(<TicketDetail id="ticket-123" onBack={mockOnBack} />);
    
    expect(await screen.findByText((content, element) => element?.textContent === 'REVIEW')).toBeInTheDocument();
    expect(screen.getByText((content, element) => element?.textContent === 'PRIORITY: HIGH')).toBeInTheDocument();
  });

  it('appends realtime timeline events from websocket', async () => {
    renderWithProviders(<TicketDetail id="ticket-123" onBack={mockOnBack} />);

    await screen.findByText('Run auth tests // pnpm test -- auth');

    await act(async () => {
      sockets[0]?.emit(
        'message',
        JSON.stringify({
          type: 'timeline.event.created',
          data: {
            id: 'event-2',
            ticketId: 'ticket-123',
            agentRunId: null,
            sequence: 2,
            event: {
              kind: 'preview',
              title: 'Preview refreshed',
              payload: { url: 'http://127.0.0.1:4173', status: 'success' }
            },
            createdAt: '2026-04-28T10:02:00Z'
          }
        })
      );
    });

    expect(await screen.findByText(/Preview refreshed/)).toBeInTheDocument();
  });
});
