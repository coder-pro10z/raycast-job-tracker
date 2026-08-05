import React from 'react';
import { useJobStore } from '../../state/useJobStore';
import type { ViewMode, ActiveDomain } from '../../types/job';
import { 
  Briefcase, 
  Zap, 
  Send, 
  Users, 
  Award, 
  XCircle, 
  Archive,
  Code,
  Cloud,
  Layers,
  Globe
} from 'lucide-react';

interface NavItem {
  id: ViewMode;
  label: string;
  icon: React.ElementType;
  countKey?: 'totalJobs' | 'readyToApply' | 'applied' | 'withReferrals' | 'interviewing' | 'offers';
}

export const Sidebar: React.FC = () => {
  const { filterState, setViewMode, setActiveDomain, metrics, jobs } = useJobStore();

  const navItems: NavItem[] = [
    { id: 'all', label: 'All Opportunities', icon: Briefcase, countKey: 'totalJobs' },
    { id: 'ready', label: 'Ready to Apply', icon: Zap, countKey: 'readyToApply' },
    { id: 'applied', label: 'Applied Roles', icon: Send, countKey: 'applied' },
    { id: 'interview', label: 'Interview Pipeline', icon: Users, countKey: 'interviewing' },
    { id: 'offers', label: 'Received Offers', icon: Award, countKey: 'offers' },
    { id: 'rejected', label: 'Rejected', icon: XCircle },
    { id: 'archived', label: 'Archived / Closed', icon: Archive },
  ];

  const domains: { id: ActiveDomain; label: string; icon: React.ElementType; count: number; badgeColor: string }[] = [
    { id: 'all', label: 'All Tracks', icon: Globe, count: jobs.length, badgeColor: 'var(--text-muted)' },
    { id: 'sde', label: 'SDE & FullStack', icon: Code, count: metrics.sdeCount, badgeColor: '#818cf8' },
    { id: 'cloud', label: 'Cloud & DevOps', icon: Cloud, count: metrics.cloudDevOpsCount, badgeColor: '#38bdf8' },
  ];

  return (
    <aside style={{
      width: '260px',
      backgroundColor: 'var(--bg-secondary)',
      borderRight: '1px solid var(--border-color)',
      display: 'flex',
      flexDirection: 'column',
      padding: 'var(--space-4) 0',
      userSelect: 'none',
      flexShrink: 0
    }}>
      {/* Domain Track Switcher Section */}
      <div style={{ padding: '0 var(--space-4) var(--space-4)', borderBottom: '1px solid var(--border-color)', marginBottom: 'var(--space-3)' }}>
        <div style={{ fontSize: '0.6875rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', marginBottom: '8px', paddingLeft: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Layers size={13} style={{ color: 'var(--text-accent)' }} />
          <span>Domain Workspace</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {domains.map((domain) => {
            const isActive = filterState.activeDomain === domain.id;
            const Icon = domain.icon;
            return (
              <button
                key={domain.id}
                onClick={() => setActiveDomain(domain.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: isActive ? 'var(--bg-active)' : 'transparent',
                  border: isActive ? '1px solid var(--border-focus)' : '1px solid transparent',
                  color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 150ms ease',
                  boxShadow: isActive ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                }}
                className="glow-hover"
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                  <Icon size={16} style={{ color: isActive ? domain.badgeColor : 'var(--text-muted)', flexShrink: 0 }} />
                  <span style={{ fontSize: '0.8125rem', fontWeight: isActive ? 700 : 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {domain.label}
                  </span>
                </div>
                <span style={{
                  fontSize: '0.6875rem',
                  fontWeight: 700,
                  padding: '1px 6px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: isActive ? 'rgba(255, 255, 255, 0.1)' : 'var(--bg-tertiary)',
                  color: isActive ? domain.badgeColor : 'var(--text-muted)',
                  flexShrink: 0
                }}>
                  {domain.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Pipeline View Status Navigation */}
      <div style={{ padding: '0 var(--space-4) var(--space-2)' }}>
        <div style={{ fontSize: '0.6875rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', marginBottom: '8px', paddingLeft: '4px' }}>
          Pipeline Status
        </div>
      </div>

      <nav style={{ flex: '1', padding: '0 var(--space-3)', display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {navItems.map((item) => {
          const isActive = filterState.viewMode === item.id;
          const Icon = item.icon;
          const count = item.countKey ? metrics[item.countKey] : undefined;

          return (
            <div
              key={item.id}
              onClick={() => setViewMode(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 'var(--space-2) var(--space-3)',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: isActive ? 'var(--bg-active)' : 'transparent',
                color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                cursor: 'pointer',
                transition: 'all 150ms ease',
                fontWeight: isActive ? 600 : 500,
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Icon size={17} style={{ color: isActive ? 'var(--text-accent)' : 'var(--text-muted)' }} />
                <span style={{ fontSize: '0.875rem' }}>{item.label}</span>
              </div>

              {count !== undefined && (
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: isActive ? 'var(--status-ready-bg)' : 'var(--bg-tertiary)',
                  color: isActive ? 'var(--status-ready-text)' : 'var(--text-muted)',
                }}>
                  {count}
                </span>
              )}
            </div>
          );
        })}
      </nav>

      {/* Sidebar Footer Info */}
      <div style={{
        padding: 'var(--space-3) var(--space-4)',
        borderTop: '1px solid var(--border-color)',
        fontSize: '0.75rem',
        color: 'var(--text-muted)',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Active Track:</span>
          <span style={{ fontWeight: 700, color: 'var(--text-accent)' }}>
            {filterState.activeDomain === 'sde' ? '💻 SDE Track' : filterState.activeDomain === 'cloud' ? '☁️ Cloud & DevOps' : '🌐 All Tracks'}
          </span>
        </div>
        <div style={{ color: '#34d399', fontSize: '0.6875rem', fontWeight: 600 }}>
          ⚡ SheetJS Data Synchronized
        </div>
      </div>
    </aside>
  );
};
