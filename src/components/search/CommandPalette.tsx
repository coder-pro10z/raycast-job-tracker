import React, { useState, useEffect, useRef } from 'react';
import { useJobStore } from '../../state/useJobStore';
import { Search, Briefcase, Zap, Send, Award, Moon, RefreshCw, X, ChevronRight } from 'lucide-react';

export const CommandPalette: React.FC = () => {
  const { 
    isCommandPaletteOpen, 
    setCommandPaletteOpen, 
    jobs, 
    setSelectedJobId, 
    setViewMode, 
    toggleTheme, 
    reloadJobs,
    resetFilters 
  } = useJobStore();
  
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Global Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(!isCommandPaletteOpen);
      } else if (e.key === 'Escape' && isCommandPaletteOpen) {
        setCommandPaletteOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCommandPaletteOpen, setCommandPaletteOpen]);

  useEffect(() => {
    if (isCommandPaletteOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  // Static System Commands
  const systemCommands = [
    { id: 'cmd-all', label: 'View: All Job Opportunities', icon: Briefcase, action: () => setViewMode('all') },
    { id: 'cmd-ready', label: 'View: Ready to Apply', icon: Zap, action: () => setViewMode('ready') },
    { id: 'cmd-applied', label: 'View: Active Applied Roles', icon: Send, action: () => setViewMode('applied') },
    { id: 'cmd-offers', label: 'View: Received Offers', icon: Award, action: () => setViewMode('offers') },
    { id: 'cmd-theme', label: 'Action: Toggle Dark / Light Theme', icon: Moon, action: () => toggleTheme() },
    { id: 'cmd-reload', label: 'Action: Reload Excel Workbook Data', icon: RefreshCw, action: () => reloadJobs() },
    { id: 'cmd-reset', label: 'Action: Reset All Active Filters', icon: X, action: () => resetFilters() },
  ];

  // Filter commands and jobs based on query
  const filteredCommands = query.trim() 
    ? systemCommands.filter((c) => c.label.toLowerCase().includes(query.toLowerCase()))
    : systemCommands.slice(0, 4);

  const filteredJobs = query.trim()
    ? jobs.filter((j) => j.companyName.toLowerCase().includes(query.toLowerCase()) || j.targetRole.toLowerCase().includes(query.toLowerCase())).slice(0, 8)
    : jobs.slice(0, 5);

  const combinedResults = [
    ...filteredCommands.map((c) => ({ type: 'command' as const, data: c })),
    ...filteredJobs.map((j) => ({ type: 'job' as const, data: j }))
  ];

  const handleSelect = (index: number) => {
    const item = combinedResults[index];
    if (!item) return;
    if (item.type === 'command') {
      item.data.action();
    } else {
      setSelectedJobId(item.data.id);
    }
    setCommandPaletteOpen(false);
  };

  const handleKeyDownInModal = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (combinedResults.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + (combinedResults.length || 1)) % (combinedResults.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      handleSelect(selectedIndex);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      backdropFilter: 'blur(4px)',
      zIndex: 100,
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'center',
      paddingTop: '12vh'
    }} onClick={() => setCommandPaletteOpen(false)}>
      <div 
        style={{
          width: '100%',
          maxWidth: '600px',
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-xl)',
          overflow: 'hidden',
          animation: 'scaleUp 150ms cubic-bezier(0.16, 1, 0.3, 1)'
        }}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDownInModal}
      >
        {/* Search Bar Input */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          padding: '12px 18px',
          borderBottom: '1px solid var(--border-color)',
          backgroundColor: 'var(--bg-primary)'
        }}>
          <Search size={20} style={{ color: 'var(--text-muted)', marginRight: '12px', flexShrink: 0 }} />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search Companies..."
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
            style={{
              width: '100%',
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--text-primary)',
              fontSize: '1rem',
              fontWeight: 500
            }}
          />
          <kbd style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', padding: '2px 6px', backgroundColor: 'var(--bg-elevated)', borderRadius: '4px', color: 'var(--text-muted)' }}>
            Esc
          </kbd>
        </div>

        {/* Results Body */}
        <div style={{ maxHeight: '420px', overflowY: 'auto', padding: '8px 0' }}>
          {combinedResults.length === 0 && (
            <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              No commands or job roles match "{query}".
            </div>
          )}

          {/* Render Commands */}
          {filteredCommands.length > 0 && (
            <div style={{ padding: '4px 12px', fontSize: '0.6875rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              System Commands
            </div>
          )}
          {filteredCommands.map((c, idx) => {
            const isSelected = selectedIndex === idx;
            const Icon = c.icon;
            return (
              <div
                key={c.id}
                onClick={() => handleSelect(idx)}
                onMouseEnter={() => setSelectedIndex(idx)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 18px',
                  backgroundColor: isSelected ? 'var(--bg-active)' : 'transparent',
                  color: isSelected ? 'var(--text-accent)' : 'var(--text-primary)',
                  cursor: 'pointer',
                  borderLeft: isSelected ? '3px solid var(--text-accent)' : '3px solid transparent',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Icon size={16} style={{ color: 'var(--text-muted)' }} />
                  <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{c.label}</span>
                </div>
                <ChevronRight size={14} style={{ color: 'var(--text-muted)' }} />
              </div>
            );
          })}

          {/* Render Job Matches */}
          {filteredJobs.length > 0 && (
            <div style={{ padding: '12px 12px 4px', fontSize: '0.6875rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Opportunities ({jobs.length} loaded)
            </div>
          )}
          {filteredJobs.map((j, idx) => {
            const actualIdx = filteredCommands.length + idx;
            const isSelected = selectedIndex === actualIdx;
            return (
              <div
                key={j.id}
                onClick={() => handleSelect(actualIdx)}
                onMouseEnter={() => setSelectedIndex(actualIdx)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 18px',
                  backgroundColor: isSelected ? 'var(--bg-active)' : 'transparent',
                  cursor: 'pointer',
                  borderLeft: isSelected ? '3px solid var(--text-accent)' : '3px solid transparent',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {j.companyName}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {j.targetRole} • {j.location} ({j.workMode})
                  </div>
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-accent)', fontWeight: 600 }}>
                  Jump to Drawer
                </span>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div style={{
          padding: '8px 18px',
          backgroundColor: 'var(--bg-tertiary)',
          borderTop: '1px solid var(--border-color)',
          fontSize: '0.75rem',
          color: 'var(--text-muted)',
          display: 'flex',
          justifyContent: 'space-between'
        }}>
          <span>Use <strong>↑↓</strong> to navigate, <strong>Enter</strong> to select</span>
          <span>⚡ Raycast Mode</span>
        </div>
      </div>
    </div>
  );
};
