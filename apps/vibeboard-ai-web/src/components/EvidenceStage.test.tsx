import { describe, it, expect } from 'vitest';
import { renderWithProviders, screen } from '../test/render';
import { EvidenceStage } from './EvidenceStage';
import { mockAuthTicket } from '../data/vibeTicketMock';

describe('EvidenceStage', () => {
  const evidence = mockAuthTicket.evidence!;
  const plan = mockAuthTicket.plan!;

  it('renders evidence summary', () => {
    renderWithProviders(<EvidenceStage evidence={evidence} plan={plan} />);
    
    expect(screen.getByText('执行证据概览')).toBeInTheDocument();
    expect(screen.getByText('总证据节点')).toBeInTheDocument();
  });

  it('displays correct node counts', () => {
    renderWithProviders(<EvidenceStage evidence={evidence} plan={plan} />);
    
    const totalNodes = evidence.nodes.length;
    const successNodes = evidence.nodes.filter(n => n.status === 'success').length;
    
    expect(screen.getByText(totalNodes.toString())).toBeInTheDocument();
    expect(screen.getByText(successNodes.toString())).toBeInTheDocument();
  });

  it('groups evidence nodes by plan step', () => {
    renderWithProviders(<EvidenceStage evidence={evidence} plan={plan} />);
    
    plan.steps.forEach(step => {
      expect(screen.getByText(step.goal)).toBeInTheDocument();
    });
  });

  it('displays evidence node cards', () => {
    renderWithProviders(<EvidenceStage evidence={evidence} plan={plan} />);
    
    evidence.nodes.forEach(node => {
      expect(screen.getByText(node.summary)).toBeInTheDocument();
    });
  });

  it('shows evidence node types', () => {
    renderWithProviders(<EvidenceStage evidence={evidence} plan={plan} />);
    
    const types = new Set(evidence.nodes.map(n => n.type.replace('_', ' ')));
    types.forEach(type => {
      expect(screen.getAllByText(type).length).toBeGreaterThanOrEqual(1);
    });
  });

  it('displays artifact paths when present', () => {
    renderWithProviders(<EvidenceStage evidence={evidence} plan={plan} />);
    
    const nodesWithArtifacts = evidence.nodes.filter(n => n.artifactPath);
    nodesWithArtifacts.forEach(node => {
      expect(screen.getByText(node.artifactPath!)).toBeInTheDocument();
    });
  });

  it('shows failure reasons for failed nodes', () => {
    const evidenceWithFailure = {
      ...evidence,
      nodes: [
        ...evidence.nodes,
        {
          id: 'fail-1',
          planStepId: plan.steps[0].id,
          type: 'test_log' as const,
          status: 'failed' as const,
          timestamp: '14:30:00',
          summary: 'Test failed',
          failureReason: 'Assertion error',
          recommendedNextStep: 'Fix the test'
        }
      ]
    };

    renderWithProviders(<EvidenceStage evidence={evidenceWithFailure} plan={plan} />);
    
    expect(screen.getByText('失败原因')).toBeInTheDocument();
    expect(screen.getByText('Assertion error')).toBeInTheDocument();
    expect(screen.getByText(/建议下一步/)).toBeInTheDocument();
  });

  it('marks checkpoint-required nodes', () => {
    const evidenceWithCheckpoint = {
      ...evidence,
      nodes: [
        ...evidence.nodes,
        {
          id: 'cp-1',
          planStepId: plan.steps[0].id,
          type: 'checkpoint' as const,
          status: 'success' as const,
          timestamp: '14:35:00',
          summary: 'Checkpoint reached',
          requiresCheckpoint: true
        }
      ]
    };

    renderWithProviders(<EvidenceStage evidence={evidenceWithCheckpoint} plan={plan} />);
    
    expect(screen.getByText('需要检查点')).toBeInTheDocument();
  });

  it('shows running status with animation', () => {
    renderWithProviders(<EvidenceStage evidence={evidence} plan={plan} />);
    
    const runningNodes = evidence.nodes.filter(n => n.status === 'running');
    const runningStatuses = screen.getAllByText('running');
    expect(runningStatuses.length).toBeGreaterThanOrEqual(runningNodes.length);
  });
});
