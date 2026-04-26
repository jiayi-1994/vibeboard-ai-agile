import { describe, it, expect } from 'vitest';
import { renderWithProviders, screen } from '../test/render';
import { PlanStage } from './PlanStage';
import { mockAuthTicket } from '../data/vibeTicketMock';

describe('PlanStage', () => {
  const plan = mockAuthTicket.plan!;

  it('renders agent understanding section', () => {
    renderWithProviders(<PlanStage plan={plan} />);
    
    expect(screen.getByText('Agent 理解')).toBeInTheDocument();
    expect(screen.getByText(plan.agentUnderstanding)).toBeInTheDocument();
  });

  it('displays plan steps with correct count', () => {
    renderWithProviders(<PlanStage plan={plan} />);
    
    expect(screen.getByText('执行步骤')).toBeInTheDocument();
    expect(screen.getByText(`${plan.steps.length} 步骤`)).toBeInTheDocument();
  });

  it('shows step details with risk levels', () => {
    renderWithProviders(<PlanStage plan={plan} />);
    
    plan.steps.forEach(step => {
      expect(screen.getByText(step.goal)).toBeInTheDocument();
    });
  });

  it('marks steps requiring checkpoints', () => {
    renderWithProviders(<PlanStage plan={plan} />);
    
    const checkpointSteps = plan.steps.filter(s => s.requiresCheckpoint);
    const checkpointLabels = screen.getAllByText('需要检查点');
    expect(checkpointLabels).toHaveLength(checkpointSteps.length);
  });

  it('displays risk assessment section', () => {
    renderWithProviders(<PlanStage plan={plan} />);
    
    expect(screen.getByText('风险评估')).toBeInTheDocument();
    expect(screen.getByText(new RegExp(`整体风险: ${plan.riskLevel}`, 'i'))).toBeInTheDocument();
  });

  it('shows scope risk warning when present', () => {
    const planWithScopeRisk = { ...plan, scopeRisk: true, scopeRiskReason: 'Test risk reason' };
    renderWithProviders(<PlanStage plan={planWithScopeRisk} />);
    
    expect(screen.getByText('⚠️ 作用域风险警告')).toBeInTheDocument();
    expect(screen.getByText('Test risk reason')).toBeInTheDocument();
  });

  it('displays expected modified areas', () => {
    renderWithProviders(<PlanStage plan={plan} />);
    
    expect(screen.getByText(`预期修改区域 (${plan.expectedModifiedAreas.length})`)).toBeInTheDocument();
  });

  it('shows checkpoints section', () => {
    renderWithProviders(<PlanStage plan={plan} />);
    
    expect(screen.getByText('检查点与自主策略')).toBeInTheDocument();
  });

  it('displays autonomy policy', () => {
    renderWithProviders(<PlanStage plan={plan} />);
    
    const policyLabels = {
      full: '完全自主',
      checkpoint: '检查点确认',
      approval_required: '需要审批'
    };
    
    expect(screen.getByText(policyLabels[plan.autonomyPolicy])).toBeInTheDocument();
  });

  it('displays test strategy', () => {
    renderWithProviders(<PlanStage plan={plan} />);
    
    expect(screen.getByText('测试策略')).toBeInTheDocument();
    expect(screen.getByText(plan.testStrategy)).toBeInTheDocument();
  });

  it('shows approval actions', () => {
    renderWithProviders(<PlanStage plan={plan} />);
    
    expect(screen.getByText('准备好批准此计划了吗？')).toBeInTheDocument();
    expect(screen.getByText('请求修改')).toBeInTheDocument();
    expect(screen.getByText('批准并开始')).toBeInTheDocument();
  });
});
