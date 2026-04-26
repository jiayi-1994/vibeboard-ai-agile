import { describe, it, expect } from 'vitest';
import { renderWithProviders, screen } from '../test/render';
import TicketDetail from './TicketDetail';

describe('TicketDetail', () => {
  it('renders ticket detail view', () => {
    renderWithProviders(<TicketDetail />);
    
    expect(screen.getByText(/TICKET-/i)).toBeInTheDocument();
  });

  it('displays brief section', () => {
    renderWithProviders(<TicketDetail />);
    
    expect(screen.getByText(/简报/i)).toBeInTheDocument();
  });

  it('displays acceptance criteria', () => {
    renderWithProviders(<TicketDetail />);
    
    expect(screen.getByText(/验收标准/i)).toBeInTheDocument();
  });
});
