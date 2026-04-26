import { describe, it, expect, vi } from 'vitest';
import { renderWithProviders, screen } from '../test/render';
import { TicketDetail } from './TicketDetail';

describe('TicketDetail', () => {
  const mockOnBack = vi.fn();

  it('renders ticket header with id and title', () => {
    renderWithProviders(<TicketDetail onBack={mockOnBack} />);
    
    expect(screen.getByText('TICKET-492')).toBeInTheDocument();
    expect(screen.getByText('实现身份验证流程')).toBeInTheDocument();
  });

  it('displays stage navigation tabs', () => {
    renderWithProviders(<TicketDetail onBack={mockOnBack} />);
    
    expect(screen.getByText('简报')).toBeInTheDocument();
    expect(screen.getByText('计划')).toBeInTheDocument();
    expect(screen.getByText('证据')).toBeInTheDocument();
    expect(screen.getByText('审查')).toBeInTheDocument();
  });

  it('displays terminal drawer', () => {
    renderWithProviders(<TicketDetail onBack={mockOnBack} />);
    
    expect(screen.getByText('Agent Execution Terminal')).toBeInTheDocument();
  });

  it('calls onBack when back button is clicked', () => {
    renderWithProviders(<TicketDetail onBack={mockOnBack} />);
    
    const backButton = screen.getAllByRole('button')[0];
    backButton.click();
    
    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });

  it('displays ticket status and priority', () => {
    renderWithProviders(<TicketDetail onBack={mockOnBack} />);
    
    expect(screen.getByText(/IN PROGRESS/i)).toBeInTheDocument();
    expect(screen.getByText(/PRIORITY: HIGH/i)).toBeInTheDocument();
  });
});
