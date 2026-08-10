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
    <div className={`relative ${className}`} ref={menuRef}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleToggle(!isOpen);
        }}
        className={`flex items-center gap-2 transition-all duration-300 group ${
          compact 
            ? 'p-1.5 hover:bg-indigo-500/10 rounded-md text-slate-400 hover:text-indigo-400 ring-1 ring-transparent hover:ring-indigo-500/30' 
            : 'px-4 py-2 bg-slate-800/80 hover:bg-slate-700/90 border border-slate-700/50 hover:border-indigo-500/40 rounded-xl text-sm font-medium shadow-lg hover:shadow-indigo-500/10 backdrop-blur-sm text-slate-200 hover:text-white'
        } ${buttonClassName} ${isOpen && !compact ? 'border-indigo-500/50 bg-slate-700/90 shadow-indigo-500/10' : ''}`}
        title="Find Leads on LinkedIn"
      >
        <Search className={`w-4 h-4 ${compact ? 'text-current group-hover:text-indigo-400' : 'text-indigo-400 group-hover:text-indigo-300 transition-colors'}`} />
        {!compact && (
          <>
            <span>Find Leads</span>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-indigo-400' : 'group-hover:text-slate-300'}`} />
          </>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-slate-900/95 backdrop-blur-xl border border-indigo-500/20 rounded-2xl shadow-2xl shadow-indigo-500/10 overflow-hidden z-50 animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-200 ring-1 ring-white/5">
          <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 p-3.5 border-b border-indigo-500/10 flex items-center gap-2 relative overflow-hidden">
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
             <Users className="w-4 h-4 text-indigo-400 relative z-10" />
             <p className="text-xs font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400 uppercase tracking-widest relative z-10">Target Personas</p>
          </div>
          <div className="p-1.5 flex flex-col gap-0.5">
            {personas.map((persona, idx) => (
              <button
                key={persona}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelect(persona);
                }}
                className="w-full text-left px-3 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-indigo-500/10 rounded-xl transition-all duration-200 flex items-center justify-between group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-500/0 to-indigo-500/0 group-hover:via-indigo-500/5 transition-all duration-500" />
                <span className="relative z-10 font-medium">{persona}</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-indigo-400 relative z-10" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
