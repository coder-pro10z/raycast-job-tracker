import React from 'react';
import { useJobStore } from '../../state/useJobStore';
import type { Priority, WorkMode } from '../../types/job';
import { Search, X, Filter, RotateCcw, Code, Cloud } from 'lucide-react';

export const FilterBar: React.FC = () => {
  const { filterState, setSearchQuery, togglePriorityFilter, toggleWorkModeFilter, toggleTechFilter, resetFilters } = useJobStore();

  const priorities: Priority[] = ['High', 'Medium', 'Low'];
  const workModes: WorkMode[] = ['Hybrid', 'Remote', 'Onsite'];

  // Domain-specific Tech stack filter pills
  const techPills = filterState.activeDomain === 'cloud' 
    ? ['Azure', 'Docker', 'Kubernetes', 'CI/CD', 'Terraform', '.NET', 'SQL']
    : ['.NET Core', 'C#', 'React', 'Angular', 'SQL', 'Azure', 'Docker'];

  const hasActiveFilters = 
    filterState.priority.length > 0 || 
    filterState.workMode.length > 0 || 
    filterState.status.length > 0 ||
    filterState.techFilters.length > 0 ||
    filterState.searchQuery.trim() !== '';

  return (
    <div className="mobile-px" style={{
      padding: '0 var(--space-6) var(--space-4)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 'var(--space-4)',
      flexWrap: 'wrap',
      maxWidth: '100%',
      boxSizing: 'border-box'
    }}>
      {/* Left Search Input Box */}
      <div style={{
        position: 'relative',
        flex: '1',
        minWidth: '240px',
        maxWidth: '380px'
      }}>
        <Search 
          size={16} 
          style={{ 
            position: 'absolute', 
            left: '12px', 
            top: '50%', 
            transform: 'translateY(-50%)', 
            color: 'var(--text-muted)' 
          }} 
        />
        <input
          type="text"
          placeholder={filterState.activeDomain === 'cloud' ? "Search Azure, K8s, Docker, DevOps roles..." : "Search C#, .NET, React roles, companies..."}
          value={filterState.searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '100%',
            height: '36px',
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-full)',
            padding: '0 36px',
            fontSize: '0.8125rem',
            color: 'var(--text-primary)',
            outline: 'none',
            transition: 'border-color 150ms ease'
          }}
          onFocus={(e) => e.currentTarget.style.borderColor = 'var(--border-focus)'}
          onBlur={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}
        />
        {filterState.searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            style={{
              position: 'absolute',
              right: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Right Filter Pills Section */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', maxWidth: '100%' }}>
        
        {/* Tech Stack Filter Pills (New Domain-Driven Feature) */}
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '4px', background: 'var(--bg-secondary)', padding: '4px 8px', borderRadius: '14px', border: '1px solid var(--border-color)', maxWidth: '100%', boxSizing: 'border-box' }}>
          <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--text-muted)', paddingLeft: '4px', paddingRight: '4px', display: 'flex', alignItems: 'center', gap: '3px' }}>
            {filterState.activeDomain === 'cloud' ? <Cloud size={12} style={{ color: '#38bdf8' }} /> : <Code size={12} style={{ color: '#818cf8' }} />}
            <span>Stack:</span>
          </span>
          {techPills.map((tech) => {
            const isActive = filterState.techFilters.includes(tech);
            return (
              <button
                key={tech}
                onClick={() => toggleTechFilter(tech)}
                style={{
                  padding: '3px 9px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.75rem',
                  fontWeight: isActive ? 700 : 500,
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 150ms ease',
                  backgroundColor: isActive ? (filterState.activeDomain === 'cloud' ? '#0089d6' : 'var(--border-focus)') : 'transparent',
                  color: isActive ? '#ffffff' : 'var(--text-secondary)'
                }}
              >
                {tech}
              </button>
            );
          })}
        </div>

        {/* Priority Pills */}
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '4px', background: 'var(--bg-secondary)', padding: '4px 8px', borderRadius: '14px', border: '1px solid var(--border-color)', maxWidth: '100%', boxSizing: 'border-box' }}>
          <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--text-muted)', paddingLeft: '4px', paddingRight: '4px', display: 'flex', alignItems: 'center', gap: '3px' }}>
            <Filter size={10} />
            <span>Priority:</span>
          </span>
          {priorities.map((prio) => {
            const isActive = filterState.priority.includes(prio);
            return (
              <button
                key={prio}
                onClick={() => togglePriorityFilter(prio)}
                style={{
                  padding: '3px 9px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.75rem',
                  fontWeight: isActive ? 700 : 500,
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 150ms ease',
                  backgroundColor: isActive ? 'rgba(249, 115, 22, 0.2)' : 'transparent',
                  color: isActive ? '#fb923c' : 'var(--text-secondary)'
                }}
              >
                {prio}
              </button>
            );
          })}
        </div>

        {/* Work Mode Pills */}
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '4px', background: 'var(--bg-secondary)', padding: '4px 8px', borderRadius: '14px', border: '1px solid var(--border-color)', maxWidth: '100%', boxSizing: 'border-box' }}>
          <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--text-muted)', paddingLeft: '4px', paddingRight: '4px' }}>
            Mode:
          </span>
          {workModes.map((mode) => {
            const isActive = filterState.workMode.includes(mode);
            return (
              <button
                key={mode}
                onClick={() => toggleWorkModeFilter(mode)}
                style={{
                  padding: '3px 9px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.75rem',
                  fontWeight: isActive ? 700 : 500,
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 150ms ease',
                  backgroundColor: isActive ? 'var(--status-ready-bg)' : 'transparent',
                  color: isActive ? 'var(--status-ready-text)' : 'var(--text-secondary)'
                }}
              >
                {mode}
              </button>
            );
          })}
        </div>

        {/* Reset All Filters Button */}
        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            title="Reset all active filters and search"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '6px 12px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--bg-tertiary)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-muted)',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 150ms ease'
            }}
            className="glow-hover"
          >
            <RotateCcw size={12} />
            <span>Reset</span>
          </button>
        )}
      </div>
    </div>
  );
};
