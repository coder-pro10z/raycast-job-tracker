import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Search, ExternalLink, Users, ChevronDown, Check } from 'lucide-react';
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
  const [activelyHiringNet, setActivelyHiringNet] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });
  const btnRef = useRef<HTMLButtonElement>(null);
  
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  
  const handleToggle = (open: boolean) => {
    if (open && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      // Position the dropdown below the button, aligning its right edge with the button's right edge
      setCoords({ 
        top: rect.bottom + 8, 
        left: rect.right,
        width: 260
      });
    }
    
    if (onToggle) onToggle(open);
    else setInternalIsOpen(open);
  };

  const personas = Object.keys(DEFAULT_LEAD_SEARCH_CONFIG.personas);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // We don't check btnRef here because the portal is rendered outside
      // Instead, we check if the click target is inside the dropdown or the button
      const target = event.target as Element;
      if (
        !target.closest('.leads-menu-dropdown') && 
        !target.closest('.leads-menu-btn') &&
        !(btnRef.current && btnRef.current.contains(target))
      ) {
        handleToggle(false);
      }
    }
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Optional: close on scroll to avoid detached dropdowns
      const handleScroll = () => handleToggle(false);
      window.addEventListener('scroll', handleScroll, { capture: true, passive: true });
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        window.removeEventListener('scroll', handleScroll, { capture: true });
      };
    }
  }, [isOpen, onToggle]);

  const handleSelect = (persona: string) => {
    let hiringIds: string[] = [];
    if (activelyHiringNet) {
      if (job.domain === 'cloud') {
        hiringIds = [DEFAULT_LEAD_SEARCH_CONFIG.hiringJobTitleIds['Cloud Engineer'], DEFAULT_LEAD_SEARCH_CONFIG.hiringJobTitleIds['DevOps Engineer']];
      } else if (job.domain === 'dual') {
        hiringIds = [DEFAULT_LEAD_SEARCH_CONFIG.hiringJobTitleIds['.NET Developer'], DEFAULT_LEAD_SEARCH_CONFIG.hiringJobTitleIds['Cloud Engineer'], DEFAULT_LEAD_SEARCH_CONFIG.hiringJobTitleIds['DevOps Engineer']];
      } else {
        hiringIds = [DEFAULT_LEAD_SEARCH_CONFIG.hiringJobTitleIds['.NET Developer']];
      }
    }

    const url = buildLinkedInSearchUrl({
      personaTitles: DEFAULT_LEAD_SEARCH_CONFIG.personas[persona],
      companyName: job.companyName,
      // Defaulting to the canonical cities to maximize reach
      cityGeoUrns: Object.values(DEFAULT_LEAD_SEARCH_CONFIG.cityGeoUrns),
      hiringJobTitleIds: hiringIds
    });
    
    window.open(url, '_blank', 'noopener,noreferrer');
    handleToggle(false);
  };

  const getHiringToggleLabel = () => {
    if (job.domain === 'cloud') return 'Actively hiring Cloud/DevOps';
    if (job.domain === 'dual') return 'Actively hiring .NET/Cloud';
    return 'Actively hiring .NET';
  };

  return (
    <div style={{ position: 'relative' }} className={className}>
      <button
        ref={btnRef}
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

      {isOpen && createPortal(
        <div 
          className="leads-menu-dropdown"
          style={{
            position: 'fixed',
            top: coords.top,
            left: coords.left - coords.width, // Align right edge
            width: `${coords.width}px`,
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-xl)',
            overflow: 'hidden',
            zIndex: 9999,
            border: '1px solid rgba(99, 102, 241, 0.3)',
            backgroundColor: 'rgba(15, 23, 42, 0.85)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
          }}
          onClick={(e) => e.stopPropagation()} // Prevent bubbling up to the row if the portal somehow isn't isolated enough
        >
          <div style={{
            padding: 'var(--space-3)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            background: 'linear-gradient(to right, rgba(99, 102, 241, 0.15), rgba(168, 85, 247, 0.08))',
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

          <div style={{
            padding: 'var(--space-2) var(--space-3)',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            background: 'rgba(0, 0, 0, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <div 
                style={{ 
                  width: '16px', 
                  height: '16px', 
                  borderRadius: '4px', 
                  border: `1px solid ${activelyHiringNet ? 'var(--border-focus)' : 'var(--text-muted)'}`,
                  background: activelyHiringNet ? 'var(--border-focus)' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all var(--transition-fast)',
                  flexShrink: 0
                }}
              >
                {activelyHiringNet && <Check size={12} color="white" />}
              </div>
              <input 
                type="checkbox" 
                checked={activelyHiringNet}
                onChange={(e) => {
                  e.stopPropagation();
                  setActivelyHiringNet(e.target.checked);
                }}
                style={{ display: 'none' }}
              />
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ color: activelyHiringNet ? 'var(--text-primary)' : 'inherit', transition: 'color var(--transition-fast)' }}>{getHiringToggleLabel()}</span>
                <span style={{ fontSize: '0.7rem', opacity: 0.6 }}>(Tighter filter)</span>
              </span>
            </label>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
