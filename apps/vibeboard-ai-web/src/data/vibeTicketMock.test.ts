import { describe, it, expect } from 'vitest';
import { mockAuthTicket, mockApiTicket, mockTestTicket, mockTickets, getTicketById, getTicketsByStage, getTicketsByStatus } from './vibeTicketMock';

describe('VibeTicket Mock Data', () => {
  describe('mockAuthTicket', () => {
    it('has correct structure', () => {
      expect(mockAuthTicket.id).toBe('TICKET-492');
      expect(mockAuthTicket.title).toBe('实现身份验证流程');
      expect(mockAuthTicket.vibeStage).toBe('evidence');
      expect(mockAuthTicket.agileStatus).toBe('in_progress');
    });

    it('has brief with context packs', () => {
      expect(mockAuthTicket.brief.contextPacks).toHaveLength(3);
      expect(mockAuthTicket.brief.contextPacks[0].name).toBe('Authentication Patterns');
    });

    it('has plan with steps', () => {
      expect(mockAuthTicket.plan).toBeDefined();
      expect(mockAuthTicket.plan?.steps).toHaveLength(4);
      expect(mockAuthTicket.plan?.steps[0].goal).toContain('AuthForm');
    });

    it('has evidence nodes', () => {
      expect(mockAuthTicket.evidence).toBeDefined();
      expect(mockAuthTicket.evidence?.nodes).toHaveLength(4);
      expect(mockAuthTicket.evidence?.nodes[0].type).toBe('file_change');
    });
  });

  describe('mockApiTicket', () => {
    it('is in brief stage', () => {
      expect(mockApiTicket.vibeStage).toBe('brief');
      expect(mockApiTicket.agileStatus).toBe('backlog');
    });

    it('has no plan or evidence yet', () => {
      expect(mockApiTicket.plan).toBeUndefined();
      expect(mockApiTicket.evidence).toBeUndefined();
    });
  });

  describe('mockTestTicket', () => {
    it('has test-related evidence', () => {
      expect(mockTestTicket.evidence?.nodes.some(n => n.type === 'test_log')).toBe(true);
    });
  });

  describe('Helper functions', () => {
    it('getTicketById returns correct ticket', () => {
      const ticket = getTicketById('TICKET-492');
      expect(ticket?.title).toBe('实现身份验证流程');
    });

    it('getTicketById returns undefined for non-existent id', () => {
      const ticket = getTicketById('TICKET-999');
      expect(ticket).toBeUndefined();
    });

    it('getTicketsByStage filters correctly', () => {
      const evidenceTickets = getTicketsByStage('evidence');
      expect(evidenceTickets).toHaveLength(2);
      expect(evidenceTickets.every(t => t.vibeStage === 'evidence')).toBe(true);
    });

    it('getTicketsByStatus filters correctly', () => {
      const inProgressTickets = getTicketsByStatus('in_progress');
      expect(inProgressTickets).toHaveLength(2);
      expect(inProgressTickets.every(t => t.agileStatus === 'in_progress')).toBe(true);
    });
  });

  describe('Data consistency', () => {
    it('all tickets have required fields', () => {
      mockTickets.forEach(ticket => {
        expect(ticket.id).toBeDefined();
        expect(ticket.title).toBeDefined();
        expect(ticket.vibeStage).toBeDefined();
        expect(ticket.agileStatus).toBeDefined();
        expect(ticket.brief).toBeDefined();
      });
    });

    it('evidence nodes reference valid plan steps', () => {
      const ticket = mockAuthTicket;
      if (ticket.evidence && ticket.plan) {
        const planStepIds = ticket.plan.steps.map(s => s.id);
        ticket.evidence.nodes.forEach(node => {
          expect(planStepIds).toContain(node.planStepId);
        });
      }
    });

    it('acceptance criteria have unique ids', () => {
      mockTickets.forEach(ticket => {
        const ids = ticket.brief.acceptanceCriteria.map(ac => ac.id);
        const uniqueIds = new Set(ids);
        expect(ids.length).toBe(uniqueIds.size);
      });
    });
  });
});
