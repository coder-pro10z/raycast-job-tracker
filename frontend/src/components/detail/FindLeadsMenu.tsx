import { useState, useRef, useEffect } from 'react';
import { Search, ExternalLink, Users, ChevronDown } from 'lucide-react';
import type { JobItem } from '../../types/job';
import { buildLinkedInSearchUrl, DEFAULT_LEAD_SEARCH_CONFIG } from '../../utils/linkedinSearch';

interface FindLeadsMenuProps {
  job: JobItem;
  className?: string;
  buttonClassName?: string;
  compact?: boolean;
  isOpen?: boolean;
  onToggle?: (isOpen: boolean) => void;
}

export function FindLeadsMenu({ job, className = '', buttonClassName = '', compact = false, isOpen: externalIsOpen, onToggle }: FindLeadsMenuProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  
  const handleToggle = (open: boolean) => {
    if (onToggle) onToggle(open);
    else setInternalIsOpen(open);
  };

  const personas = Object.keys(DEFAULT_LEAD_SEARCH_CONFIG.personas);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        handleToggle(false);
      }
    }
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onToggle]);

  const handleSelect = (persona: string) => {
    const url = buildLinkedInSearchUrl(job.companyName, persona, job.location);
    window.open(url, '_blank', 'noopener,noreferrer');
    handleToggle(false);
  };

  return (
    <div style={{ position: 'relative' }} className={className} ref={menuRef}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleToggle(!isOpen);
        }}
        className={`leads-menu-btn ${isOpen && !compact ? 'active' : ''} ${buttonClassName}`}
        style={compact ? {
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-2)',
          padding: '4px 6px',
          borderRadius: 'var(--radius-sm)',
        } : {
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-2)',
          padding: 'var(--space-2) var(--space-4)',
          borderRadius: 'var(--radius-md)',
          backgroundColor: isOpen ? 'var(--bg-active)' : 'var(--bg-elevated)',
          border: `1px solid ${isOpen ? 'var(--border-focus)' : 'var(--border-color)'}`,
          fontWeight: 500,
          boxShadow: 'var(--shadow-sm)',
        }}
        title="Find Leads on LinkedIn"
      >
        <Search size={compact ? 14 : 16} style={{ color: isOpen && !compact ? 'var(--text-accent)' : 'inherit', flexShrink: 0 }} />
        {!compact && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <span>Find Leads</span>
            <ChevronDown 
              size={14} 
              style={{ 
                transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform var(--transition-normal)'
              }} 
            />
          </div>
        )}
      </button>

      {isOpen && (
        <div 
          className="glass-panel leads-menu-dropdown"
          style={{
            position: 'absolute',
            right: 0,
            top: 'calc(100% + var(--space-2))',
            width: '260px',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-xl)',
            overflow: 'hidden',
            zIndex: 100,
            border: '1px solid var(--border-focus)',
          }}
        >
          <div style={{
            padding: 'var(--space-3)',
            borderBottom: '1px solid var(--border-color)',
            background: 'linear-gradient(to right, rgba(99, 102, 241, 0.1), rgba(168, 85, 247, 0.05))',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
          }}>
             <Users size={14} style={{ color: 'var(--text-accent)' }} />
             <p style={{
               fontSize: '0.75rem',
               fontWeight: 700,
               textTransform: 'uppercase',
               letterSpacing: '0.1em',
               background: 'linear-gradient(to right, #818cf8, #c084fc)',
               WebkitBackgroundClip: 'text',
               WebkitTextFillColor: 'transparent',
               margin: 0
             }}>Target Personas</p>
          </div>
          
          <div style={{ padding: 'var(--space-1)' }}>
            {personas.map((persona) => (
              <button
                key={persona}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelect(persona);
                }}
                className="leads-menu-item"
              >
                <span style={{ position: 'relative', zIndex: 2, fontWeight: 500 }}>{persona}</span>
                <ExternalLink size={14} className="icon-link" style={{ position: 'relative', zIndex: 2 }} />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
