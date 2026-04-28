import { describe, it, expect } from 'vitest';
import { renderWithProviders, screen } from '../test/render';
import { ReviewStage } from './ReviewStage';
import { mockAuthTicket } from '../data/vibeTicketMock';

describe('ReviewStage', () => {
  const review = mockAuthTicket.review!;

  it('renders review summary', () => {
    renderWithProviders(<ReviewStage review={review} />);
    
    expect(screen.getByText('审查总结')).toBeInTheDocument();
    expect(screen.getByText(review.summary)).toBeInTheDocument();
  });

  it('displays overall status', () => {
    renderWithProviders(<ReviewStage review={review} />);
    
    const statusLabels = {
      pass: '通过',
      conditional: '有条件通过',
      fail: '未通过'
    };
    
    expect(screen.getByText(statusLabels[review.overallStatus])).toBeInTheDocument();
  });

  it('shows acceptance criteria review', () => {
    renderWithProviders(<ReviewStage review={review} />);
    
    expect(screen.getByText('验收标准审查')).toBeInTheDocument();
    
    const passedCount = review.acceptanceCriteria.filter(c => c.met).length;
    const totalCount = review.acceptanceCriteria.length;
    expect(screen.getByText(`${passedCount} / ${totalCount} 通过`)).toBeInTheDocument();
  });

  it('displays each acceptance criterion', () => {
    renderWithProviders(<ReviewStage review={review} />);
    
    review.acceptanceCriteria.forEach(criterion => {
      expect(screen.getByText(criterion.criterion)).toBeInTheDocument();
      expect(screen.getByText(criterion.evidence)).toBeInTheDocument();
    });
  });

  it('shows gaps for unmet criteria', () => {
    const reviewWithGap = {
      ...review,
      acceptanceCriteria: [
        ...review.acceptanceCriteria,
        {
          criterion: 'Test criterion',
          met: false,
          evidence: 'No evidence',
          gap: 'Missing implementation'
        }
      ]
    };

    renderWithProviders(<ReviewStage review={reviewWithGap} />);
    
    expect(screen.getAllByText('差距：').length).toBeGreaterThan(0);
    expect(screen.getByText('Missing implementation')).toBeInTheDocument();
  });

  it('displays quality metrics', () => {
    renderWithProviders(<ReviewStage review={review} />);
    
    expect(screen.getByText('质量指标')).toBeInTheDocument();
    expect(screen.getByText('测试覆盖率')).toBeInTheDocument();
    expect(screen.getByText('代码质量评分')).toBeInTheDocument();
    expect(screen.getByText('文档完整性')).toBeInTheDocument();
    expect(screen.getByText('性能基准')).toBeInTheDocument();
  });

  it('shows metric values', () => {
    renderWithProviders(<ReviewStage review={review} />);
    
    expect(screen.getByText(review.qualityMetrics.testCoverage.toString())).toBeInTheDocument();
    expect(screen.getByText(review.qualityMetrics.codeQuality.toString())).toBeInTheDocument();
  });

  it('displays risk assessment', () => {
    renderWithProviders(<ReviewStage review={review} />);
    
    expect(screen.getByText('风险评估')).toBeInTheDocument();
    expect(screen.getByText(`${review.risks.length} 个风险`)).toBeInTheDocument();
  });

  it('shows risk details', () => {
    renderWithProviders(<ReviewStage review={review} />);
    
    review.risks.forEach(risk => {
      expect(screen.getByText(risk.description)).toBeInTheDocument();
      expect(screen.getByText(new RegExp(risk.mitigation))).toBeInTheDocument();
    });
  });

  it('displays handoff decision', () => {
    renderWithProviders(<ReviewStage review={review} />);
    
    expect(screen.getByText('交付决策')).toBeInTheDocument();
    expect(screen.getByText('推荐决策')).toBeInTheDocument();
  });

  it('shows recommendation action', () => {
    renderWithProviders(<ReviewStage review={review} />);
    
    const actionLabels = {
      approve: '批准交付',
      approve_with_conditions: '有条件批准',
      reject: '拒绝交付'
    };
    
    const recommendationLabel = actionLabels[review.recommendation];
    expect(screen.getAllByText(recommendationLabel)).toHaveLength(2); // Label and button
  });

  it('displays next steps', () => {
    renderWithProviders(<ReviewStage review={review} />);
    
    expect(screen.getByText(`后续步骤 (${review.nextSteps.length})`)).toBeInTheDocument();
    
    review.nextSteps.forEach(step => {
      expect(screen.getByText(step)).toBeInTheDocument();
    });
  });

  it('shows action buttons', () => {
    renderWithProviders(<ReviewStage review={review} />);
    
    expect(screen.getByText('请求修改')).toBeInTheDocument();
  });
});
