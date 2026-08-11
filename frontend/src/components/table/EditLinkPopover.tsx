import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import type { JobItem } from '../../types/job';
import { useUpdateJob } from '../../hooks/useJobs';

interface EditLinkPopoverProps {
  job: JobItem;
  coords: { top: number; left: number };
  onClose: () => void;
}

export const EditLinkPopover: React.FC<EditLinkPopoverProps> = ({ job, coords, onClose }) => {
  const { mutate: updateJob } = useUpdateJob();

  const onCloseRef = React.useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    const mountTime = Date.now();
    
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Element;
      if (target?.closest?.('.edit-link-popover')) return;
      if (target?.closest?.('.icon-btn') || target?.closest?.('button[title="Add Application URL or JD text"]')) return;
      onCloseRef.current();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCloseRef.current();
    };
    
    const handleScroll = (e: Event) => {
      // Ignore involuntary scrolls caused by browser/react layout shifts right after opening
      if (Date.now() - mountTime < 150) return;
      
      const target = e.target as Element;
      if (target?.closest?.('.edit-link-popover')) return;
      
      onCloseRef.current();
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('scroll', handleScroll, { capture: true, passive: true });
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('scroll', handleScroll, { capture: true });
    };
  }, []);

  return createPortal(
    <div 
      className="edit-link-popover"
      style={{
        position: 'fixed',
        top: coords.top,
        left: coords.left,
        width: '280px',
        padding: 'var(--space-3)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-xl)',
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: '1px solid rgba(99, 102, 241, 0.3)',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div>
        <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
          Application URL
        </label>
        <input
          type="url"
          defaultValue={job.jobApplicationLink}
          placeholder="https://..."
          onChange={(e) => updateJob({ id: job.id, patch: { jobApplicationLink: e.currentTarget.value } })}
          style={{
            width: '100%', 
            height: '28px', 
            padding: '0 8px', 
            borderRadius: '4px', 
            border: '1px solid var(--border-color)', 
            backgroundColor: 'rgba(0,0,0,0.2)', 
            color: 'var(--text-primary)', 
            fontSize: '0.8125rem', 
            outline: 'none'
          }}
          onFocus={e => e.target.style.borderColor = 'var(--border-focus)'}
          onBlur={e => e.target.style.borderColor = 'var(--border-color)'}
        />
      </div>
      <div>
        <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
          Job Description Snippet
        </label>
        <textarea
          defaultValue={job.jdContent}
          placeholder="Paste requirements..."
          onChange={(e) => updateJob({ id: job.id, patch: { jdContent: e.currentTarget.value } })}
          rows={3}
          style={{
            width: '100%', 
            padding: '8px', 
            borderRadius: '4px', 
            border: '1px solid var(--border-color)', 
            backgroundColor: 'rgba(0,0,0,0.2)', 
            color: 'var(--text-primary)', 
            fontSize: '0.8125rem', 
            outline: 'none',
            resize: 'vertical',
            minHeight: '60px'
          }}
          onFocus={e => e.target.style.borderColor = 'var(--border-focus)'}
          onBlur={e => e.target.style.borderColor = 'var(--border-color)'}
        />
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button 
          onClick={onClose}
          style={{ 
            fontSize: '0.75rem', 
            padding: '4px 12px', 
            background: 'var(--border-focus)', 
            color: 'white', 
            border: 'none', 
            borderRadius: 'var(--radius-sm)', 
            cursor: 'pointer',
            fontWeight: 600
          }}
        >
          Done
        </button>
      </div>
    </div>,
    document.body
  );
};
