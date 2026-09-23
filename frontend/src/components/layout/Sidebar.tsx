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
  BadgeHelp,
  Share2,
  Bot
} from 'lucide-react';

interface NavItem {
  id: ViewMode;
  label: string;
  icon: React.ElementType;
  countKey?: 'totalJobs' | 'readyToApply' | 'applied' | 'withReferrals' | 'interviewing' | 'offers';
}

interface SidebarRowProps {
  label: string;
  icon: React.ElementType;
  isActive: boolean;
  onClick: () => void;
  count?: number;
  badgeColor?: string;
  isCollapsed: boolean;
  title?: string;
}

const SidebarRow: React.FC<SidebarRowProps> = ({
  label,
  icon: Icon,
  isActive,
  onClick,
  count,
  badgeColor,
  isCollapsed,
  title
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`sidebar-nav-btn ${isActive ? 'sidebar-nav-btn-active' : 'sidebar-nav-btn-inactive'}`}
      style={{
        padding: isCollapsed ? '8px 0' : '6px 10px',
        justifyContent: isCollapsed ? 'center' : 'space-between',
        marginBottom: '2px'
      }}
      title={isCollapsed ? (title || label) : undefined}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '9px',
        overflow: 'hidden',
        width: isCollapsed ? '100%' : 'auto',
        justifyContent: isCollapsed ? 'center' : 'flex-start'
      }}>
        <Icon 
          size={16} 
          style={{ 
            color: isActive ? (badgeColor || 'var(--text-accent)') : 'var(--text-muted)', 
            flexShrink: 0 
          }} 
        />
        {!isCollapsed && (
          <span style={{ 
            whiteSpace: 'nowrap', 
            overflow: 'hidden', 
            textOverflow: 'ellipsis' 
          }}>
            {label}
          </span>
        )}
      </div>

      {!isCollapsed && count !== undefined && (
        <span 
          className="sidebar-count-badge"
          style={{
            backgroundColor: isActive ? 'rgba(255, 255, 255, 0.12)' : 'var(--bg-tertiary)',
            color: isActive ? (badgeColor || 'var(--text-primary)') : 'var(--text-muted)'
          }}
        >
          {count}
        </span>
      )}
    </button>
  );
};

export const Sidebar: React.FC = () => {
  const { 
    filterState, 
    setViewMode, 
    setActiveDomain, 
    metrics, 
    jobs, 
    isSidebarOpen, 
    setSidebarOpen, 
    isSidebarCollapsed, 
    setSidebarCollapsed 
  } = useJobStore();

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
    { id: 'all', label: 'All Tracks', icon: Globe, count: jobs.length, badgeColor: 'var(--text-accent)' },
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
      }, 5000);
    }
    return () => clearTimeout(timeout);
  }, [isSidebarOpen, setSidebarOpen]);

  const automatorDraftCount = jobs.filter(j => Boolean(j.gmailDraftId)).length;

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
          padding: '12px 0',
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Briefcase size={18} style={{ color: 'var(--text-accent)' }} />
            <span>Job Tracker</span>
          </div>
          <button
            type="button"
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

        {/* 1. Domain Workspace Section */}
        <div style={{
          padding: '0 12px 10px',
          borderBottom: '1px solid var(--border-color)',
          marginBottom: '10px'
        }}>
          <div 
            className="sidebar-section-header"
            style={{
              marginBottom: '6px',
              padding: '0 4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: isSidebarCollapsed ? 'center' : 'space-between'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Layers size={14} style={{ color: 'var(--text-accent)' }} />
              {!isSidebarCollapsed && <span>Domain Workspace</span>}
            </div>
            
            {/* Collapse / Expand Toggle */}
            <button 
              type="button"
              onClick={() => setSidebarCollapsed(!isSidebarCollapsed)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '20px',
                height: '20px',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                background: 'var(--bg-tertiary)',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                transition: 'all 150ms ease',
                opacity: isSidebarCollapsed ? 0.7 : 1
              }}
              title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
              className="glow-hover desktop-only"
            >
              {isSidebarCollapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {domains.map((domain) => (
              <SidebarRow
                key={domain.id}
                label={domain.label}
                icon={domain.icon}
                isActive={filterState.activeDomain === domain.id}
                onClick={() => handleDomainSelect(domain.id)}
                count={domain.count}
                badgeColor={domain.badgeColor}
                isCollapsed={isSidebarCollapsed}
              />
            ))}
          </div>
        </div>

        {/* 2. Pipeline Status Section */}
        <div style={{
          padding: '0 12px 10px',
          borderBottom: '1px solid var(--border-color)',
          marginBottom: '10px'
        }}>
          <div 
            className="sidebar-section-header"
            style={{
              marginBottom: '6px',
              padding: '0 4px',
              textAlign: isSidebarCollapsed ? 'center' : 'left'
            }}
          >
            {isSidebarCollapsed ? '...' : 'Pipeline Status'}
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column' }}>
            {navItems.map((item) => {
              const isActive = filterState.viewMode === item.id;
              const count = item.countKey ? metrics[item.countKey] : undefined;

              return (
                <SidebarRow
                  key={item.id}
                  label={item.label}
                  icon={item.icon}
                  isActive={isActive}
                  onClick={() => handleNavSelect(item.id)}
                  count={count}
                  isCollapsed={isSidebarCollapsed}
                />
              );
            })}
          </nav>
        </div>

        {/* 3. Outreach & Applications Section */}
        <div style={{ padding: '0 12px', marginBottom: 'auto' }}>
          <div 
            className="sidebar-section-header"
            style={{
              marginBottom: '6px',
              padding: '0 4px',
              textAlign: isSidebarCollapsed ? 'center' : 'left'
            }}
          >
            {isSidebarCollapsed ? '...' : 'Outreach & Apps'}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <SidebarRow
              label="Gmail JD Automator"
              icon={Bot}
              isActive={filterState.viewMode === 'job-applications'}
              onClick={() => handleNavSelect('job-applications')}
              count={automatorDraftCount > 0 ? automatorDraftCount : undefined}
              badgeColor="#38bdf8"
              isCollapsed={isSidebarCollapsed}
            />

            <SidebarRow
              label="Cold Templates"
              icon={MessageSquare}
              isActive={filterState.viewMode === 'outreach-templates'}
              onClick={() => handleNavSelect('outreach-templates')}
              badgeColor="#38bdf8"
              isCollapsed={isSidebarCollapsed}
            />

            <SidebarRow
              label="System Graph"
              icon={Share2}
              isActive={filterState.viewMode === 'graph'}
              onClick={() => handleNavSelect('graph')}
              badgeColor="#818cf8"
              isCollapsed={isSidebarCollapsed}
            />
          </div>
        </div>

        {/* 4. Support & Feedback Footer Section */}
        <div style={{
          padding: '10px 12px 0',
          borderTop: '1px solid var(--border-color)',
          marginTop: '12px'
        }}>
          <SidebarRow
            label="Support & Feedback"
            icon={BadgeHelp}
            isActive={filterState.viewMode === 'support'}
            onClick={() => handleNavSelect('support')}
            badgeColor="#38bdf8"
            isCollapsed={isSidebarCollapsed}
          />
        </div>

      </aside>
    </>
  );
};
