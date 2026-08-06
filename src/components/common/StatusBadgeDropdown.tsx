import React, { useState, useRef, useEffect } from 'react';
import { Badge } from './Badge';
import { ChevronDown, Check } from 'lucide-react';
import { useJobStore } from '../../state/useJobStore';

interface StatusBadgeDropdownProps {
  jobId: string;
  currentStatus: string;
  size?: 'sm' | 'md';
  onToggle?: (isOpen: boolean) => void;
}

const DEFAULT_STATUSES = [
  'Not Started',
  'Applied(Referral)',
  'Applied(portal)',
  'Applied(HR/TR)',
  'Shortlisted',
  'Hold',
  'Rejected',
  'R1',
  'R2',
  'R3',
  'HR Round'
];

export const StatusBadgeDropdown: React.FC<StatusBadgeDropdownProps> = ({ jobId, currentStatus, size = 'sm', onToggle }) => {
  const { updateJobFields } = useJobStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isCustom, setIsCustom] = useState(false);
  const [customInput, setCustomInput] = useState('');
  
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setIsCustom(false);
        if (onToggle) onToggle(false);
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onToggle]);

  const handleSelect = (status: string) => {
    updateJobFields(jobId, { applicationStatus: status });
    setIsOpen(false);
    setIsCustom(false);
    if (onToggle) onToggle(false);
  };

  const handleCustomSubmit = () => {
    if (customInput.trim()) {
      handleSelect(customInput.trim());
    }
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }} ref={containerRef}>
      <button 
        onClick={(e) => {
          e.stopPropagation();
          const newState = !isOpen;
          setIsOpen(newState);
          if (onToggle) onToggle(newState);
        }}
        style={{ 
          display: 'flex', alignItems: 'center', gap: '4px', background: 'none', border: 'none', padding: 0, cursor: 'pointer' 
        }}
      >
        <Badge type="status" value={currentStatus || 'Not Started'} size={size} />
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
            width: '180px', 
            backgroundColor: 'rgba(39, 39, 42, 0.75)', 
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.1)', 
            borderRadius: 'var(--radius-md)',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.3)', 
            zIndex: 9999, padding: '6px',
            display: 'flex', flexDirection: 'column', gap: '4px',
            maxHeight: '260px', overflowY: 'auto'
          }}
        >
          {DEFAULT_STATUSES.map(st => (
            <button 
              key={st} 
              onClick={() => handleSelect(st)} 
              style={{ 
                textAlign: 'left', padding: '6px 10px', fontSize: '0.8125rem', borderRadius: 'var(--radius-sm)', 
                border: 'none', background: 'transparent', color: 'var(--text-primary)', cursor: 'pointer', fontWeight: 500 
              }} 
              onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)'} 
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              {st}
            </button>
          ))}
          
          <div style={{ height: '1px', backgroundColor: 'var(--border-color)', margin: '2px 0', flexShrink: 0 }} />
          
          {!isCustom ? (
            <button 
              onClick={() => { setIsCustom(true); setCustomInput(''); }} 
              style={{ 
                textAlign: 'left', padding: '6px 10px', fontSize: '0.8125rem', borderRadius: 'var(--radius-sm)', 
                border: 'none', background: 'transparent', color: 'var(--text-accent)', cursor: 'pointer', fontWeight: 600,
                flexShrink: 0
              }} 
              onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)'} 
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              Custom Status...
            </button>
          ) : (
            <div style={{ display: 'flex', gap: '6px', padding: '4px', flexShrink: 0 }}>
              <input 
                type="text" 
                autoFocus 
                value={customInput} 
                onChange={e => setCustomInput(e.target.value)} 
                placeholder="Type status" 
                onKeyDown={e => { 
                  if (e.key === 'Enter') handleCustomSubmit();
                  if (e.key === 'Escape') setIsCustom(false);
                }} 
                style={{ 
                  flex: 1, padding: '6px 8px', fontSize: '0.75rem', borderRadius: 'var(--radius-sm)', 
                  border: '1px solid var(--border-focus)', outline: 'none', background: 'var(--bg-primary)', 
                  color: 'var(--text-primary)', minWidth: 0 
                }} 
              />
              <button 
                onClick={handleCustomSubmit} 
                style={{ 
                  padding: '6px', background: 'var(--text-accent)', color: 'white', border: 'none', 
                  borderRadius: 'var(--radius-sm)', cursor: 'pointer', display: 'flex', alignItems: 'center',
                  flexShrink: 0
                }}
              >
                <Check size={12} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
