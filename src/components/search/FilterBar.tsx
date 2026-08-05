import React from 'react';
import { useJobStore } from '../../state/useJobStore';
import type { Priority, WorkMode } from '../../types/job';
import { Search, X, Filter, RotateCcw } from 'lucide-react';

export const FilterBar: React.FC = () => {
  const { 
    filterState, 
    setSearchQuery, 
    togglePriorityFilter, 
    toggleWorkModeFilter, 
    resetFilters,
    filteredJobs,
    jobs
  } = useJobStore();

  const priorities: Priority[] = ['High', 'Medium', 'Low'];
  const workModes: WorkMode[] = ['Hybrid', 'Remote', 'Onsite'];

  const hasActiveFilters = 
    filterState.priority.length > 0 || 
    filterState.workMode.length > 0 || 
    filterState.searchQuery !== '';

  return (
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 'var(--space-4)',
      padding: '0 var(--space-6)',
      marginBottom: 'var(--space-4)'
    }}>
      {/* Search Bar */}
      <div style={{ position: 'relative', flex: '1', minWidth: '260px', maxWidth: '400px' }}>
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
          placeholder="Filter table by company, skill, location..."
          value={filterState.searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '100%',
            height: '36px',
            paddingLeft: '36px',
            paddingRight: filterState.searchQuery ? '32px' : '12px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-color)',
            backgroundColor: 'var(--bg-tertiary)',
            color: 'var(--text-primary)',
            fontSize: '0.875rem',
            outline: 'none',
            transition: 'border 150ms ease'
          }}
          className="focus-ring"
        />
        {filterState.searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            style={{
              position: 'absolute',
              right: '8px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer'
            }}
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Filter Pills */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 'var(--space-2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginRight: '4px', color: 'var(--text-muted)' }}>
          <Filter size={14} />
          <span style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>Filter:</span>
        </div>

        {/* Priority Pills */}
        {priorities.map((p) => {
          const active = filterState.priority.includes(p);
          return (
            <button
              key={p}
              onClick={() => togglePriorityFilter(p)}
              style={{
                height: '30px',
                padding: '0 var(--space-3)',
                borderRadius: 'var(--radius-full)',
                border: '1px solid',
                borderColor: active ? 'var(--border-focus)' : 'var(--border-color)',
                backgroundColor: active ? 'var(--status-ready-bg)' : 'var(--bg-tertiary)',
                color: active ? 'var(--text-accent)' : 'var(--text-secondary)',
                fontSize: '0.75rem',
                fontWeight: active ? 600 : 500,
                cursor: 'pointer',
                transition: 'all 150ms ease'
              }}
            >
              Priority: {p}
            </button>
          );
        })}

        {/* Work Mode Pills */}
        {workModes.map((mode) => {
          const active = filterState.workMode.includes(mode);
          return (
            <button
              key={mode}
              onClick={() => toggleWorkModeFilter(mode)}
              style={{
                height: '30px',
                padding: '0 var(--space-3)',
                borderRadius: 'var(--radius-full)',
                border: '1px solid',
                borderColor: active ? 'var(--border-focus)' : 'var(--border-color)',
                backgroundColor: active ? 'var(--status-ready-bg)' : 'var(--bg-tertiary)',
                color: active ? 'var(--text-accent)' : 'var(--text-secondary)',
                fontSize: '0.75rem',
                fontWeight: active ? 600 : 500,
                cursor: 'pointer',
                transition: 'all 150ms ease'
              }}
            >
              {mode}
            </button>
          );
        })}

        {/* Reset Action */}
        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              height: '30px',
              padding: '0 var(--space-3)',
              borderRadius: 'var(--radius-full)',
              border: '1px dashed var(--status-rejected-text)',
              backgroundColor: 'transparent',
              color: 'var(--status-rejected-text)',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer',
              marginLeft: '4px'
            }}
          >
            <RotateCcw size={12} />
            <span>Clear Filters</span>
          </button>
        )}

        {/* Match counter */}
        <div style={{ marginLeft: 'auto', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
          Showing <strong style={{ color: 'var(--text-primary)' }}>{filteredJobs.length}</strong> of {jobs.length} items
        </div>
      </div>
    </div>
  );
};
