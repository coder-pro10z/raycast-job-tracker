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
  color?: string;
  bgColor?: string;
  subText?: string;
  onClick?: () => void;
  active?: boolean;
  solidIcon?: boolean;
}

const MetricCard: React.FC<MetricCardProps> = ({ label, value, icon: Icon, color, bgColor, subText, onClick, active, solidIcon = true }) => (
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
      <div style={{ width: '28px', height: '28px', borderRadius: 'var(--radius-sm)', backgroundColor: bgColor || 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: color || 'var(--text-secondary)', border: '1px solid var(--border-color)' }}>
        <Icon size={14} strokeWidth={1.5} fill={solidIcon ? "currentColor" : "none"} />
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
        gap: 'var(--space-3)', 
        padding: 'var(--space-4) var(--space-6) var(--space-4)', 
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
          solidIcon={false}
        />
        <MetricCard 
          label="CI/CD & Pipelines" 
          value={metrics.cicdCount} 
          icon={GitBranch} 
          color="#34d399" 
          bgColor="rgba(52, 211, 153, 0.15)"
          subText="Automation"
          solidIcon={false}
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
      gap: 'var(--space-3)', 
      padding: 'var(--space-4) var(--space-6) var(--space-4)', 
      width: '100%' 
    }}>
      <MetricCard 
        label="Total Opportunities" 
        value={metrics.totalJobs} 
        icon={Briefcase} 
        color="var(--primary-500)" 
        bgColor="var(--primary-bg)"
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
        solidIcon={false}
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
