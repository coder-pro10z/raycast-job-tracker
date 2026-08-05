import React from 'react';
import { useJobStore } from '../../state/useJobStore';
import type { ViewMode } from '../../types/job';
import { 
  Briefcase, 
  Zap, 
  Send, 
  Users, 
  Award, 
  XCircle, 
  Archive
} from 'lucide-react';

interface NavItem {
  id: ViewMode;
  label: string;
  icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>;
  count?: number;
  badgeColor?: string;
}

export const Sidebar: React.FC = () => {
  const { filterState, setViewMode, jobs, metrics } = useJobStore();
  const currentView = filterState.viewMode;

  const navItems: NavItem[] = [
    { id: 'all', label: 'All Jobs', icon: Briefcase, count: metrics.totalJobs },
    { id: 'ready', label: 'Ready to Apply', icon: Zap, count: metrics.readyToApply, badgeColor: 'var(--status-ready-text)' },
    { id: 'applied', label: 'Applied', icon: Send, count: metrics.applied, badgeColor: 'var(--status-applied-text)' },
    { id: 'interview', label: 'Interview Pipeline', icon: Users, count: metrics.interviewing, badgeColor: 'var(--status-interview-text)' },
    { id: 'offers', label: 'Offers', icon: Award, count: metrics.offers, badgeColor: 'var(--status-offer-text)' },
    { id: 'rejected', label: 'Rejected', icon: XCircle, count: jobs.filter((j) => j.applicationStatus === 'Rejected').length },
    { id: 'archived', label: 'Archived', icon: Archive, count: jobs.filter((j) => j.applicationStatus === 'Archived').length },
  ];

  return (
    <aside style={{
      width: '240px',
      borderRight: '1px solid var(--border-color)',
      backgroundColor: 'var(--bg-primary)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: 'var(--space-4) 0',
      height: 'calc(100vh - 64px)',
      flexShrink: 0
    }}>
      <div>
        <div style={{ padding: '0 var(--space-4)', marginBottom: 'var(--space-2)' }}>
          <span style={{
            fontSize: '0.6875rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: 'var(--text-muted)'
          }}>
            Views & Pipelines
          </span>
        </div>

        <nav style={{ padding: '0 var(--space-2)' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setViewMode(item.id)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: 'var(--space-2) var(--space-3)',
                  marginBottom: '2px',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  backgroundColor: isActive ? 'var(--bg-active)' : 'transparent',
                  color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                  fontWeight: isActive ? 600 : 500,
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 150ms ease',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                  <Icon size={18} style={{ color: isActive ? 'var(--text-accent)' : 'var(--text-muted)' }} />
                  <span>{item.label}</span>
                </div>
                {item.count !== undefined && (
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    padding: '1px 8px',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: isActive ? 'var(--border-focus)' : 'var(--bg-tertiary)',
                    color: isActive ? '#ffffff' : (item.badgeColor || 'var(--text-muted)'),
                  }}>
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer info in sidebar */}
      <div style={{ padding: '0 var(--space-4)', borderTop: '1px solid var(--border-color)', paddingTop: 'var(--space-3)' }}>
        <div style={{
          padding: 'var(--space-3)',
          borderRadius: 'var(--radius-sm)',
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          fontSize: '0.75rem'
        }}>
          <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
            ⚡ Single Source of Truth
          </div>
          <p style={{ color: 'var(--text-muted)', lineHeight: '1.4', marginBottom: '8px' }}>
            Data read directly from your local Excel file with zero backend persistence.
          </p>
        </div>
      </div>
    </aside>
  );
};
