import { useState, useRef, useEffect } from 'react';
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
    <div className={`relative ${className}`} ref={menuRef}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleToggle(!isOpen);
        }}
        className={`flex items-center gap-2 ${
          compact 
            ? 'p-1.5 hover:bg-slate-700/50 rounded text-slate-400 hover:text-white transition-colors' 
            : 'px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-sm font-medium transition-colors'
        } ${buttonClassName}`}
        title="Find Leads on LinkedIn"
      >
        <span>🔍</span>
        {!compact && <span>Find Leads</span>}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-slate-800/90 backdrop-blur-md border border-slate-700/50 rounded-xl shadow-xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-100">
          <div className="p-2 border-b border-slate-700/50">
            <p className="text-xs font-semibold text-slate-400 px-2 uppercase tracking-wider">Search LinkedIn For</p>
          </div>
          <div className="p-1">
            {personas.map((persona) => (
              <button
                key={persona}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelect(persona);
                }}
                className="w-full text-left px-3 py-2.5 text-sm text-slate-200 hover:bg-indigo-500/20 hover:text-indigo-300 rounded-lg transition-colors flex items-center justify-between group"
              >
                <span>{persona}</span>
                <span className="opacity-0 group-hover:opacity-100 text-xs">↗</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
