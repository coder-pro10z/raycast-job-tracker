import React, { useState, useRef, useEffect } from 'react';
import { Cloud, ChevronDown } from 'lucide-react';
import { useUpdateJob } from '../../hooks/useJobs';
import type { JobDomain } from '../../types/job';

interface DomainBadgeDropdownProps {
  jobId: string;
  currentDomain: string;
}

const DOMAINS: { value: JobDomain, label: string }[] = [
  { value: 'sde', label: 'SDE / FullStack Track' },
  { value: 'cloud', label: 'Cloud / DevOps Track' },
  { value: 'dual', label: 'Dual Domain' },
  { value: 'general', label: 'General' }
];

export const DomainBadgeDropdown: React.FC<DomainBadgeDropdownProps> = ({ jobId, currentDomain }) => {
  const { mutate: updateJob } = useUpdateJob();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleSelect = (domain: JobDomain) => {
    updateJob({ id: jobId, patch: { domain } });
    setIsOpen(false);
  };

  const isCloud = currentDomain === 'cloud';
  const isDual = currentDomain === 'dual';
  const isGeneral = currentDomain === 'general';

  return (
    <div style={{ position: 'relative', display: 'inline-block' }} ref={containerRef}>
      <button 
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        title="Change Domain Track"
        style={{ 
          display: 'flex', alignItems: 'center', gap: '4px', background: 'none', border: 'none', padding: 0, cursor: 'pointer' 
        }}
      >
        {isDual ? (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', fontFamily: 'monospace', fontWeight: 800, backgroundColor: 'rgba(251, 146, 60, 0.15)', color: '#fb923c', padding: '2px 8px', borderRadius: '4px' }}>
            &lt;/&gt; <Cloud size={12} />
          </span>
        ) : isCloud ? (
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '24px', height: '22px', backgroundColor: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', borderRadius: '4px' }}>
            <Cloud size={14} />
          </span>
        ) : isGeneral ? (
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800, backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-secondary)', padding: '2px 8px', borderRadius: '4px' }}>
            GEN
          </span>
        ) : (
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontFamily: 'monospace', fontWeight: 800, backgroundColor: 'rgba(129, 140, 248, 0.15)', color: '#818cf8', padding: '2px 8px', borderRadius: '4px', letterSpacing: '-0.05em' }}>
            &lt;/&gt;
          </span>
        )}
        <span style={{ 
          display: 'flex', alignItems: 'center', justifyContent: 'center', 
          width: '18px', 
          height: '18px', 
          borderRadius: '50%', backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-color)',
          transition: 'transform 150ms ease',
          transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)'
        }}>
          <ChevronDown size={12} style={{ color: 'var(--text-muted)' }} />
        </span>
      </button>

      {isOpen && (
        <div 
          onClick={(e) => e.stopPropagation()}
          style={{
            position: 'absolute', top: '100%', left: 0, marginTop: '8px',
            width: '180px', 
            backgroundColor: 'var(--bg-elevated)', 
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid var(--border-color)', 
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-xl)', 
            zIndex: 9999, padding: '6px',
            display: 'flex', flexDirection: 'column', gap: '4px'
          }}
        >
          {DOMAINS.map(d => (
            <button 
              key={d.value} 
              onClick={() => handleSelect(d.value)} 
              style={{ 
                textAlign: 'left', padding: '6px 10px', fontSize: '0.8125rem', borderRadius: 'var(--radius-sm)', 
                border: 'none', background: 'transparent', color: 'var(--text-primary)', cursor: 'pointer', fontWeight: 500 
              }} 
              onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)'} 
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              {d.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
