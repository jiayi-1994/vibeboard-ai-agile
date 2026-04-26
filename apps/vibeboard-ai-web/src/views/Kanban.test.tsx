import { describe, it, expect, vi } from 'vitest';
import { renderWithProviders, screen } from '../test/render';
import { Kanban } from './Kanban';

describe('Kanban', () => {
  const mockOnTicketSelect = vi.fn();

  it('renders kanban board with columns', () => {
    renderWithProviders(<Kanban onTicketSelect={mockOnTicketSelect} />);
    
    expect(screen.getByText('待处理')).toBeInTheDocument();
    expect(screen.getByText('准备就绪')).toBeInTheDocument();
    expect(screen.getByText('执行中')).toBeInTheDocument();
    expect(screen.getByText('已完成')).toBeInTheDocument();
  });

  it('displays vibe stage badges on tickets', () => {
    renderWithProviders(<Kanban onTicketSelect={mockOnTicketSelect} />);
    
    expect(screen.getByText('简报')).toBeInTheDocument();
    expect(screen.getByText('计划')).toBeInTheDocument();
    expect(screen.getAllByText('证据')).toHaveLength(2);
    expect(screen.getAllByText('审查')).toHaveLength(2);
  });

  it('shows ticket progress bars', () => {
    renderWithProviders(<Kanban onTicketSelect={mockOnTicketSelect} />);
    
    expect(screen.getAllByText(/Agent 进度|Agent 正在执行/)).toHaveLength(6);
  });

  it('calls onTicketSelect when ticket is clicked', () => {
    renderWithProviders(<Kanban onTicketSelect={mockOnTicketSelect} />);
    
    const firstTicket = screen.getByText('优化数据库索引策略以降低查询延迟');
    firstTicket.click();
    
    expect(mockOnTicketSelect).toHaveBeenCalledWith('#VB-089');
  });

  it('displays agent load indicator', () => {
    renderWithProviders(<Kanban onTicketSelect={mockOnTicketSelect} />);
    
    expect(screen.getByText(/Agent 负载: 78%/)).toBeInTheDocument();
  });

  it('shows active border for running tickets', () => {
    renderWithProviders(<Kanban onTicketSelect={mockOnTicketSelect} />);
    
    expect(screen.getByText('Agent 正在执行...')).toBeInTheDocument();
  });
});
