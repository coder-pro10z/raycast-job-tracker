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
  color: string;
  bgColor: string;
  subText?: string;
  onClick?: () => void;
  active?: boolean;
}

const MetricCard: React.FC<MetricCardProps> = ({ label, value, icon: Icon, color, bgColor, subText, onClick, active }) => (
  <div 
    onClick={() => {
      if (onClick) onClick();
      document.getElementById('filter-bar-container')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }}
    style={{
      flex: '1',
      minWidth: '170px',
      padding: '14px 16px',
      backgroundColor: 'var(--bg-secondary)',
      border: active ? `2px solid ${color}` : '1px solid var(--border-color)',
      borderRadius: 'var(--radius-md)',
      boxShadow: 'var(--shadow-sm)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      cursor: 'pointer',
      transition: 'all 200ms ease'
    }}
    className="glow-hover metric-card-hover"
  >
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
      <span style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-muted)' }}>
        {label}
      </span>
      <div style={{ width: '32px', height: '32px', borderRadius: 'var(--radius-sm)', backgroundColor: bgColor, display: 'flex', alignItems: 'center', justifyContent: 'center', color: color }}>
        <Icon size={16} />
      </div>
    </div>
    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
      <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', lineHeight: 1 }}>
        {value}
      </div>
      {subText && (
        <span style={{ fontSize: '0.6875rem', fontWeight: 600, color: color }}>
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
        gap: '12px', 
        padding: 'var(--space-6) var(--space-6) var(--space-4)', 
        width: '100%' 
      }}>
        <MetricCard 
          label="SDE & FullStack Roles" 
          value={metrics.totalJobs} 
          icon={Code} 
          color="#818cf8" 
          bgColor="rgba(129, 140, 248, 0.15)"
          subText="Active Track"
          onClick={() => setViewMode('all')}
        />
        <MetricCard 
          label=".NET & C# Stack" 
          value={metrics.dotnetCount} 
          icon={Terminal} 
          color="#a855f7" 
          bgColor="rgba(168, 85, 247, 0.15)"
          subText="Core Backend"
        />
        <MetricCard 
          label="React / Angular Web" 
          value={metrics.reactAngularCount} 
          icon={Cpu} 
          color="#38bdf8" 
          bgColor="rgba(56, 189, 248, 0.15)"
          subText="Modern Frontend"
        />
        <MetricCard 
          label="Ready to Apply" 
          value={metrics.readyToApply} 
          icon={Zap} 
          color="#facc15" 
          bgColor="rgba(250, 204, 21, 0.15)"
          subText="Action Required"
          onClick={() => setViewMode('ready')}
        />
        <MetricCard 
          label="High Priority Leads" 
          value={metrics.highPriority} 
          icon={Star} 
          color="#fb923c" 
          bgColor="rgba(251, 146, 60, 0.15)"
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
        gap: '12px', 
        padding: 'var(--space-6) var(--space-6) var(--space-4)', 
        width: '100%' 
      }}>
        <MetricCard 
          label="Cloud & DevOps Roles" 
          value={metrics.totalJobs} 
          icon={Cloud} 
          color="#38bdf8" 
          bgColor="rgba(56, 189, 248, 0.15)"
          subText="Infrastructure"
          onClick={() => setViewMode('all')}
        />
        <MetricCard 
          label="Microsoft Azure / AWS" 
          value={metrics.azureCount} 
          icon={Cloud} 
          color="#0089d6" 
          bgColor="rgba(0, 137, 214, 0.15)"
          subText="Cloud Ecosystem"
        />
        <MetricCard 
          label="Docker / Kubernetes" 
          value={metrics.dockerK8sCount} 
          icon={Layers} 
          color="#2496ed" 
          bgColor="rgba(36, 150, 237, 0.15)"
          subText="Container Orchestration"
        />
        <MetricCard 
          label="CI/CD & Pipelines" 
          value={metrics.cicdCount} 
          icon={GitBranch} 
          color="#34d399" 
          bgColor="rgba(52, 211, 153, 0.15)"
          subText="Automation"
        />
        <MetricCard 
          label="High Priority Leads" 
          value={metrics.highPriority} 
          icon={Star} 
          color="#fb923c" 
          bgColor="rgba(251, 146, 60, 0.15)"
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
      gap: '12px', 
      padding: '0 var(--space-6) var(--space-4)', 
      width: '100%' 
    }}>
      <MetricCard 
        label="Total Opportunities" 
        value={metrics.totalJobs} 
        icon={Briefcase} 
        color="var(--text-accent)" 
        bgColor="rgba(99, 102, 241, 0.15)"
        subText="All Tracks"
        onClick={() => setViewMode('all')}
      />
      <MetricCard 
        label="Ready to Apply" 
        value={metrics.readyToApply} 
        icon={Zap} 
        color="#facc15" 
        bgColor="rgba(250, 204, 21, 0.15)"
        subText="In Queue"
        onClick={() => setViewMode('ready')}
      />
      <MetricCard 
        label="Active Applied" 
        value={metrics.applied} 
        icon={Send} 
        color="#60a5fa" 
        bgColor="rgba(59, 130, 246, 0.15)"
        subText="In Flight"
        onClick={() => setViewMode('applied')}
      />
      <MetricCard 
        label="Dual Domain Leads" 
        value={metrics.dualCount} 
        icon={Layers} 
        color="#fb923c" 
        bgColor="rgba(251, 146, 60, 0.15)"
        subText="SDE + Azure/Docker"
      />
      <MetricCard 
        label="High Priority" 
        value={metrics.highPriority} 
        icon={Star} 
        color="#fb923c" 
        bgColor="rgba(251, 146, 60, 0.15)"
        subText="Click to Filter"
        onClick={() => togglePriorityFilter('High')}
        active={isHighPriorityFilterActive}
      />
    </div>
  );
};
