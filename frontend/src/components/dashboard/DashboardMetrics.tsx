import React from 'react';
import { useJobStore } from '../../state/useJobStore';
import { 
  Briefcase, 
  Zap, 
  Send, 
  Star, 
  Code, 
  Cloud, 
  Layers, 
  Cpu,
  GitBranch,
  Terminal
} from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: number | string;
  icon: React.ElementType;
  subText?: string;
  onClick?: () => void;
  active?: boolean;
}

const MetricCard: React.FC<MetricCardProps> = ({ label, value, icon: Icon, subText, onClick, active }) => (
  <div 
    onClick={() => {
      if (onClick) onClick();
      document.getElementById('filter-bar-container')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }}
    style={{
      flex: '1',
      minWidth: '170px',
      padding: 'var(--space-4)',
      backgroundColor: 'var(--bg-secondary)',
      border: active ? '2px solid var(--primary-500)' : '1px solid var(--border-color)',
      borderRadius: 'var(--radius-md)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      cursor: 'pointer'
    }}
    className="metric-card-hover"
  >
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-2)' }}>
      <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-medium)', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-secondary)', opacity: 0.65 }}>
        {label}
      </span>
      <div style={{ width: '28px', height: '28px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', border: '1px solid var(--border-color)' }}>
        <Icon size={14} strokeWidth={1.5} />
      </div>
    </div>
    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
      <div style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--weight-bold)', color: 'var(--text-primary)', letterSpacing: '-0.02em', lineHeight: 1 }}>
        {value}
      </div>
      {subText && (
        <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-regular)', color: 'var(--text-muted)' }}>
          {subText}
        </span>
      )}
    </div>
  </div>
);

export const DashboardMetrics: React.FC = () => {
  const { metrics, filterState, setViewMode, togglePriorityFilter } = useJobStore();

  const isHighPriorityFilterActive = filterState.priority.includes('High');

  if (filterState.activeDomain === 'sde') {
    return (
      <div className="mobile-px" style={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: 'var(--space-3)', 
        padding: 'var(--space-4) var(--space-6) var(--space-4)', 
        width: '100%' 
      }}>
        <MetricCard 
          label="SDE & FullStack Roles" 
          value={metrics.totalJobs} 
          icon={Code} 
          subText="Active Track"
          onClick={() => setViewMode('all')}
        />
        <MetricCard 
          label=".NET & C# Stack" 
          value={metrics.dotnetCount} 
          icon={Terminal} 
          subText="Core Backend"
        />
        <MetricCard 
          label="React / Angular Web" 
          value={metrics.reactAngularCount} 
          icon={Cpu} 
          subText="Modern Frontend"
        />
        <MetricCard 
          label="Ready to Apply" 
          value={metrics.readyToApply} 
          icon={Zap} 
          subText="Action Required"
          onClick={() => setViewMode('ready')}
        />
        <MetricCard 
          label="High Priority Leads" 
          value={metrics.highPriority} 
          icon={Star} 
          subText="Click to Filter"
          onClick={() => togglePriorityFilter('High')}
          active={isHighPriorityFilterActive}
        />
      </div>
    );
  }

  if (filterState.activeDomain === 'cloud') {
    return (
      <div className="mobile-px" style={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: 'var(--space-3)', 
        padding: 'var(--space-4) var(--space-6) var(--space-4)', 
        width: '100%' 
      }}>
        <MetricCard 
          label="Cloud & DevOps Roles" 
          value={metrics.totalJobs} 
          icon={Cloud} 
          subText="Infrastructure"
          onClick={() => setViewMode('all')}
        />
        <MetricCard 
          label="Microsoft Azure / AWS" 
          value={metrics.azureCount} 
          icon={Cloud} 
          subText="Cloud Ecosystem"
        />
        <MetricCard 
          label="Docker / Kubernetes" 
          value={metrics.dockerK8sCount} 
          icon={Layers} 
          subText="Container Orchestration"
        />
        <MetricCard 
          label="CI/CD & Pipelines" 
          value={metrics.cicdCount} 
          icon={GitBranch} 
          subText="Automation"
        />
        <MetricCard 
          label="High Priority Leads" 
          value={metrics.highPriority} 
          icon={Star} 
          subText="Click to Filter"
          onClick={() => togglePriorityFilter('High')}
          active={isHighPriorityFilterActive}
        />
      </div>
    );
  }

  return (
    <div className="mobile-px" style={{ 
      display: 'flex', 
      flexWrap: 'wrap', 
      gap: 'var(--space-3)', 
      padding: 'var(--space-4) var(--space-6) var(--space-4)', 
      width: '100%' 
    }}>
      <MetricCard 
        label="Total Opportunities" 
        value={metrics.totalJobs} 
        icon={Briefcase} 
        subText="All Tracks"
        onClick={() => setViewMode('all')}
      />
      <MetricCard 
        label="Ready to Apply" 
        value={metrics.readyToApply} 
        icon={Zap} 
        subText="In Queue"
        onClick={() => setViewMode('ready')}
      />
      <MetricCard 
        label="Active Applied" 
        value={metrics.applied} 
        icon={Send} 
        subText="In Flight"
        onClick={() => setViewMode('applied')}
      />
      <MetricCard 
        label="Dual Domain Leads" 
        value={metrics.dualCount} 
        icon={Layers} 
        subText="SDE + Azure/Docker"
      />
      <MetricCard 
        label="High Priority" 
        value={metrics.highPriority} 
        icon={Star} 
        subText="Click to Filter"
        onClick={() => togglePriorityFilter('High')}
        active={isHighPriorityFilterActive}
      />
    </div>
  );
};
