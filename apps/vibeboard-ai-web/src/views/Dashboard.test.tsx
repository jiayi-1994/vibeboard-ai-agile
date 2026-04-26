import { describe, it, expect } from 'vitest';
import { renderWithProviders, screen } from '../test/render';
import { Dashboard } from './Dashboard';

describe('Dashboard', () => {
  it('renders dashboard header', () => {
    renderWithProviders(<Dashboard />);
    
    expect(screen.getByText('PROJECT DASHBOARD')).toBeInTheDocument();
    expect(screen.getByText(/SESSION_ID/)).toBeInTheDocument();
  });

  it('displays KPI boxes', () => {
    renderWithProviders(<Dashboard />);
    
    expect(screen.getByText('首个证据生成时间')).toBeInTheDocument();
    expect(screen.getByText('活跃代理小队')).toBeInTheDocument();
    expect(screen.getByText('验收通过率')).toBeInTheDocument();
    expect(screen.getByText('Vibe 工作流阶段')).toBeInTheDocument();
  });

  it('shows vibe workflow stage KPI', () => {
    renderWithProviders(<Dashboard />);
    
    expect(screen.getByText('证据')).toBeInTheDocument();
  });

  it('displays agent squad HUD', () => {
    renderWithProviders(<Dashboard />);
    
    expect(screen.getByText('AGENT SQUAD HUD')).toBeInTheDocument();
    expect(screen.getByText('PLANNER_01')).toBeInTheDocument();
    expect(screen.getByText('CODER_02')).toBeInTheDocument();
    expect(screen.getByText('TESTER_03')).toBeInTheDocument();
    expect(screen.getByText('REVIEWER_04')).toBeInTheDocument();
  });

  it('shows project health status', () => {
    renderWithProviders(<Dashboard />);
    
    expect(screen.getByText('项目健康度')).toBeInTheDocument();
    expect(screen.getByText('STABLE')).toBeInTheDocument();
  });

  it('displays terminal with task logs', () => {
    renderWithProviders(<Dashboard />);
    
    expect(screen.getByText(/TERMINAL \/\/ 实时任务日志/)).toBeInTheDocument();
  });

  it('shows health report button', () => {
    renderWithProviders(<Dashboard />);
    
    expect(screen.getByText('生成健康报告')).toBeInTheDocument();
  });
});
