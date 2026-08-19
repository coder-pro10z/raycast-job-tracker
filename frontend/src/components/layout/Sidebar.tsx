import React, { useEffect } from 'react';
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
  MessageSquare,
  Cloud,
  Layers,
  Globe,
  X,
  ChevronLeft,
  ChevronRight,
  BadgeHelp
} from 'lucide-react';

interface NavItem {
  id: ViewMode;
  label: string;
  icon: React.ElementType;
  countKey?: 'totalJobs' | 'readyToApply' | 'applied' | 'withReferrals' | 'interviewing' | 'offers';
}

export const Sidebar: React.FC = () => {
  const { filterState, setViewMode, setActiveDomain, metrics, jobs, isSidebarOpen, setSidebarOpen, isSidebarCollapsed, setSidebarCollapsed } = useJobStore();

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

  const handleDomainSelect = (id: ActiveDomain) => {
    setActiveDomain(id);
    setSidebarOpen(false);
  };

  const handleNavSelect = (id: ViewMode) => {
    setViewMode(id);
    setSidebarOpen(false);
  };

  // Auto-hide sidebar in mobile view after 5 seconds of inactivity
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    if (isSidebarOpen && window.innerWidth <= 768) {
      timeout = setTimeout(() => {
        setSidebarOpen(false);
      }, 5000); // 5 seconds
    }
    return () => clearTimeout(timeout);
  }, [isSidebarOpen, setSidebarOpen]);

  return (
    <>
      {/* Mobile Dark Backdrop */}
      {isSidebarOpen && (
        <div 
          className="mobile-sidebar-backdrop mobile-only" 
          onClick={() => setSidebarOpen(false)} 
        />
      )}

      <aside
        className={`sidebar-container ${isSidebarOpen ? 'sidebar-open' : ''}`}
        style={{
          width: isSidebarCollapsed ? '72px' : '260px',
          backgroundColor: 'var(--bg-secondary)',
          borderRight: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          padding: 'var(--space-4) 0',
          userSelect: 'none',
          flexShrink: 0,
          transition: 'width 250ms cubic-bezier(0.4, 0, 0.2, 1)',
          overflowY: 'auto',
          overflowX: 'hidden'
        }}
      >
        {/* Mobile Header with Close Button */}
        <div className="mobile-only" style={{
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 16px 12px',
          marginBottom: '8px',
          borderBottom: '1px solid var(--border-color)',
          color: 'var(--text-primary)',
          fontWeight: 700,
          fontSize: '0.9375rem'
        }}>
          <span>🧭 Job Tracker</span>
          <button
            onClick={() => setSidebarOpen(false)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex'
            }}
          >
            <X size={20} />
          </button>
        </div>



        {/* Domain Track Switcher Section */}
        <div style={{ padding: '0 var(--space-4) var(--space-4)', borderBottom: '1px solid var(--border-color)', marginBottom: 'var(--space-3)' }}>
          <div style={{ fontSize: '0.6875rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', marginBottom: '12px', paddingLeft: isSidebarCollapsed ? '0' : '4px', display: 'flex', alignItems: 'center', gap: '6px', justifyContent: isSidebarCollapsed ? 'center' : 'space-between' }} title="Domain Workspace">
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: isSidebarCollapsed ? 'center' : 'flex-start' }}>
              <Layers size={15} style={{ color: 'var(--text-accent)' }} />
              {!isSidebarCollapsed && <span>Domain Workspace</span>}
            </div>
            
            {/* Compact Collapse Toggle */}
            <button 
              onClick={() => setSidebarCollapsed(!isSidebarCollapsed)}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: 'var(--radius-sm)', border: 'none', background: 'var(--bg-tertiary)', color: 'var(--text-secondary)', cursor: 'pointer', transition: 'all 150ms ease', opacity: isSidebarCollapsed ? 0.7 : 1 }}
              title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
              className="glow-hover desktop-only"
            >
              {isSidebarCollapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {domains.map((domain) => {
              const isActive = filterState.activeDomain === domain.id;
              const Icon = domain.icon;
              return (
                <button
                  key={domain.id}
                  onClick={() => handleDomainSelect(domain.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    padding: isSidebarCollapsed ? '10px 0' : '8px 10px',
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden', justifyContent: isSidebarCollapsed ? 'center' : 'flex-start', width: isSidebarCollapsed ? '100%' : 'auto' }} title={isSidebarCollapsed ? domain.label : undefined}>
                    <Icon size={18} style={{ color: isActive ? domain.badgeColor : 'var(--text-muted)', flexShrink: 0 }} />
                    {!isSidebarCollapsed && (
                      <span style={{ fontSize: '0.8125rem', fontWeight: isActive ? 700 : 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {domain.label}
                      </span>
                    )}
                  </div>
                  {!isSidebarCollapsed && (
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
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Pipeline View Status Navigation */}
        <div style={{ padding: '0 var(--space-4) var(--space-2)', marginTop: '8px' }}>
          <div style={{ fontSize: '0.6875rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', marginBottom: '8px', paddingLeft: isSidebarCollapsed ? '0' : '4px', textAlign: isSidebarCollapsed ? 'center' : 'left' }}>
            {isSidebarCollapsed ? '...' : 'Pipeline Status'}
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
                onClick={() => handleNavSelect(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: isSidebarCollapsed ? '10px' : 'var(--space-2) var(--space-3)',
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: isSidebarCollapsed ? 'center' : 'flex-start', width: isSidebarCollapsed ? '100%' : 'auto' }} title={isSidebarCollapsed ? item.label : undefined}>
                  <Icon size={18} style={{ color: isActive ? 'var(--text-accent)' : 'var(--text-muted)' }} />
                  {!isSidebarCollapsed && <span style={{ fontSize: '0.875rem', whiteSpace: 'nowrap' }}>{item.label}</span>}
                </div>

                {!isSidebarCollapsed && count !== undefined && (
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

        
        {/* Outreach Hub Section */}
        <div style={{ padding: 'var(--space-2) var(--space-4)' }}>
          <div style={{ fontSize: '0.6875rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', marginBottom: '8px', paddingLeft: isSidebarCollapsed ? '0' : '4px', textAlign: isSidebarCollapsed ? 'center' : 'left' }}>
            {isSidebarCollapsed ? '...' : 'Outreach Hub'}
          </div>
          <div 
            onClick={() => handleNavSelect('outreach-templates')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: isSidebarCollapsed ? 'center' : 'flex-start',
              padding: isSidebarCollapsed ? '10px' : 'var(--space-2) var(--space-3)',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: filterState.viewMode === 'outreach-templates' ? 'var(--bg-active)' : 'transparent',
              color: filterState.viewMode === 'outreach-templates' ? 'var(--text-primary)' : 'var(--text-secondary)',
              cursor: 'pointer',
              transition: 'all 150ms ease',
              fontWeight: filterState.viewMode === 'outreach-templates' ? 600 : 500,
            }}
            onMouseEnter={(e) => {
              if (filterState.viewMode !== 'outreach-templates') e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
            }}
            onMouseLeave={(e) => {
              if (filterState.viewMode !== 'outreach-templates') e.currentTarget.style.backgroundColor = 'transparent';
            }}
            title={isSidebarCollapsed ? "Cold Templates" : undefined}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: isSidebarCollapsed ? '100%' : 'auto', justifyContent: isSidebarCollapsed ? 'center' : 'flex-start' }}>
              <MessageSquare size={18} style={{ color: filterState.viewMode === 'outreach-templates' ? '#38bdf8' : 'var(--text-muted)' }} />
              {!isSidebarCollapsed && <span style={{ fontSize: '0.875rem', whiteSpace: 'nowrap' }}>Cold Templates</span>}
            </div>
          </div>
        </div>

        {/* Support Section */}
        <div style={{ padding: 'var(--space-2) var(--space-4)', marginTop: 'auto', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
          <div 
            onClick={() => handleNavSelect('support')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: isSidebarCollapsed ? 'center' : 'flex-start',
              padding: isSidebarCollapsed ? '10px' : 'var(--space-2) var(--space-3)',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: filterState.viewMode === 'support' ? 'var(--bg-active)' : 'transparent',
              color: filterState.viewMode === 'support' ? 'var(--text-primary)' : 'var(--text-secondary)',
              cursor: 'pointer',
              transition: 'all 150ms ease',
              fontWeight: filterState.viewMode === 'support' ? 600 : 500,
            }}
            onMouseEnter={(e) => {
              if (filterState.viewMode !== 'support') e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
            }}
            onMouseLeave={(e) => {
              if (filterState.viewMode !== 'support') e.currentTarget.style.backgroundColor = 'transparent';
            }}
            title={isSidebarCollapsed ? "Support & Feedback" : undefined}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: isSidebarCollapsed ? '100%' : 'auto', justifyContent: isSidebarCollapsed ? 'center' : 'flex-start' }}>
              <BadgeHelp size={18} style={{ color: filterState.viewMode === 'support' ? '#38bdf8' : 'var(--text-muted)' }} />
              {!isSidebarCollapsed && <span style={{ fontSize: '0.875rem', whiteSpace: 'nowrap' }}>Support & Feedback</span>}
            </div>
          </div>
        </div>

      </aside>
    </>
  );
};
