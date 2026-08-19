import React, { useState, useRef, useEffect } from 'react';
import { Badge } from './Badge';
import { ChevronDown } from 'lucide-react';
import { useUpdateJob } from '../../hooks/useJobs';
import type { Priority } from '../../types/job';

interface PriorityBadgeDropdownProps {
  jobId: string;
  currentPriority: string;
  size?: 'sm' | 'md';
}

const PRIORITIES: Priority[] = ['High', 'Medium', 'Low'];

export const PriorityBadgeDropdown: React.FC<PriorityBadgeDropdownProps> = ({ jobId, currentPriority, size = 'sm' }) => {
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

  const handleSelect = (prio: Priority) => {
    updateJob({ id: jobId, patch: { priority: prio } });
    setIsOpen(false);
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }} ref={containerRef}>
      <button 
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        style={{ 
          display: 'flex', alignItems: 'center', gap: '4px', background: 'none', border: 'none', padding: 0, cursor: 'pointer' 
        }}
      >
        <Badge type="priority" value={Priority: } size={size} />
        <span style={{ 
          display: 'flex', alignItems: 'center', justifyContent: 'center', 
          width: size === 'md' ? '20px' : '16px', 
          height: size === 'md' ? '20px' : '16px', 
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
            width: '140px', 
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
          {PRIORITIES.map(prio => (
            <button 
              key={prio} 
              onClick={() => handleSelect(prio)} 
              style={{ 
                textAlign: 'left', padding: '6px 10px', fontSize: '0.8125rem', borderRadius: 'var(--radius-sm)', 
                border: 'none', background: 'transparent', color: 'var(--text-primary)', cursor: 'pointer', fontWeight: 500 
              }} 
              onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)'} 
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              {prio} Priority
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
