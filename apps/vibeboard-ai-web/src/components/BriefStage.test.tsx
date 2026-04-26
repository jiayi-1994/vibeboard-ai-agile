import { describe, it, expect } from 'vitest';
import { renderWithProviders, screen } from '../test/render';
import { BriefStage } from './BriefStage';
import { mockAuthTicket } from '../data/vibeTicketMock';

describe('BriefStage', () => {
  const brief = mockAuthTicket.brief;

  it('renders original idea section', () => {
    renderWithProviders(<BriefStage brief={brief} />);
    
    expect(screen.getByText('原始想法')).toBeInTheDocument();
    expect(screen.getByText(brief.originalIdea)).toBeInTheDocument();
  });

  it('displays context packs', () => {
    renderWithProviders(<BriefStage brief={brief} />);
    
    expect(screen.getByText('上下文包')).toBeInTheDocument();
    expect(screen.getByText('Authentication Patterns')).toBeInTheDocument();
    expect(screen.getByText('UI Component Library')).toBeInTheDocument();
  });

  it('shows selected context pack count', () => {
    renderWithProviders(<BriefStage brief={brief} />);
    
    const selectedCount = brief.contextPacks.filter(cp => cp.selected).length;
    expect(screen.getByText(`${selectedCount} / ${brief.contextPacks.length} 已选择`)).toBeInTheDocument();
  });

  it('displays acceptance criteria with progress', () => {
    renderWithProviders(<BriefStage brief={brief} />);
    
    expect(screen.getByText('验收标准')).toBeInTheDocument();
    
    const completed = brief.acceptanceCriteria.filter(c => c.checked).length;
    const total = brief.acceptanceCriteria.length;
    expect(screen.getByText(`${completed} / ${total} 完成`)).toBeInTheDocument();
  });

  it('marks active acceptance criteria', () => {
    renderWithProviders(<BriefStage brief={brief} />);
    
    const activeItem = brief.acceptanceCriteria.find(c => c.active);
    if (activeItem) {
      expect(screen.getByText(activeItem.text)).toBeInTheDocument();
      expect(screen.getByText('进行中')).toBeInTheDocument();
    }
  });

  it('displays constraints section', () => {
    renderWithProviders(<BriefStage brief={brief} />);
    
    expect(screen.getByText('约束条件')).toBeInTheDocument();
    expect(screen.getByText(brief.constraints[0])).toBeInTheDocument();
  });

  it('displays non-goals section', () => {
    renderWithProviders(<BriefStage brief={brief} />);
    
    expect(screen.getByText('非目标')).toBeInTheDocument();
    expect(screen.getByText(brief.nonGoals[0])).toBeInTheDocument();
  });

  it('displays scope configuration', () => {
    renderWithProviders(<BriefStage brief={brief} />);
    
    expect(screen.getByText('作用域配置')).toBeInTheDocument();
    expect(screen.getByText(brief.targetWorkspace)).toBeInTheDocument();
  });

  it('shows allowed scope paths', () => {
    renderWithProviders(<BriefStage brief={brief} />);
    
    expect(screen.getByText(`允许修改范围 (${brief.allowedScope.length})`)).toBeInTheDocument();
    expect(screen.getByText(brief.allowedScope[0])).toBeInTheDocument();
  });

  it('displays evidence types', () => {
    renderWithProviders(<BriefStage brief={brief} />);
    
    expect(screen.getByText(`证据类型 (${brief.evidenceType.length})`)).toBeInTheDocument();
  });
});
