import React, { useState, useEffect, useRef } from 'react';
import { X, Building2, MapPin, Briefcase } from 'lucide-react';
import { useCreateJob } from '../hooks/useJobs';
import { useJobStore } from '../state/useJobStore';
import type { WorkMode } from '../types/job';

interface NewJobModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewJobModal: React.FC<NewJobModalProps> = ({ isOpen, onClose }) => {
  const { setSelectedJobId } = useJobStore();
  const { mutateAsync: createJob, isPending } = useCreateJob();
  
  const [companyName, setCompanyName] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [location, setLocation] = useState('');
  
  const companyInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setCompanyName('');
      setTargetRole('');
      setLocation('');
      setTimeout(() => companyInputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName || !targetRole) return;
    
    try {
      const newJob = await createJob({
        companyName,
        targetRole,
        location,
        applicationStatus: 'Not Started',
        priority: 'Medium',
        nextAction: 'Apply and send outreach',
        workMode: 'Unknown' as WorkMode,
      });
      onClose();
      // Open the new job in the drawer for further editing
      setSelectedJobId(newJob.id);
    } catch (err) {
      console.error('Failed to create job', err);
    }
  };

  return (
    <>
      <div 
        style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(2px)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: 'fadeIn 150ms ease'
        }}
        onClick={onClose}
      >
        <div 
          onClick={e => e.stopPropagation()}
          style={{
            backgroundColor: 'var(--bg-primary)',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-xl)',
            width: '90%',
            maxWidth: '400px',
            overflow: 'hidden',
            border: '1px solid var(--border-color)',
            animation: 'slideUp 200ms cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          <div style={{
            padding: '16px 20px',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
              Add New Job
            </h2>
            <button 
              onClick={onClose}
              className="icon-btn"
            >
              <X size={16} />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} style={{ padding: '20px' }}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Company Name *
              </label>
              <div style={{ position: 'relative' }}>
                <Building2 size={14} style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--text-muted)' }} />
                <input
                  ref={companyInputRef}
                  type="text"
                  required
                  value={companyName}
                  onChange={e => setCompanyName(e.target.value)}
                  style={{
                    width: '100%', padding: '8px 10px 8px 30px',
                    backgroundColor: 'var(--bg-secondary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--text-primary)',
                    fontSize: '0.875rem'
                  }}
                  placeholder="e.g. Microsoft"
                />
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Target Role *
              </label>
              <div style={{ position: 'relative' }}>
                <Briefcase size={14} style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  required
                  value={targetRole}
                  onChange={e => setTargetRole(e.target.value)}
                  style={{
                    width: '100%', padding: '8px 10px 8px 30px',
                    backgroundColor: 'var(--bg-secondary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--text-primary)',
                    fontSize: '0.875rem'
                  }}
                  placeholder="e.g. Senior Software Engineer"
                />
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Location
              </label>
              <div style={{ position: 'relative' }}>
                <MapPin size={14} style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  style={{
                    width: '100%', padding: '8px 10px 8px 30px',
                    backgroundColor: 'var(--bg-secondary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--text-primary)',
                    fontSize: '0.875rem'
                  }}
                  placeholder="e.g. Seattle, WA"
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button
                type="button"
                onClick={onClose}
                style={{
                  padding: '8px 16px',
                  backgroundColor: 'transparent',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--text-primary)',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending || !companyName || !targetRole}
                style={{
                  padding: '8px 16px',
                  backgroundColor: 'var(--text-accent)',
                  border: '1px solid var(--text-accent)',
                  borderRadius: 'var(--radius-sm)',
                  color: '#fff',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  cursor: (isPending || !companyName || !targetRole) ? 'not-allowed' : 'pointer',
                  opacity: (isPending || !companyName || !targetRole) ? 0.7 : 1
                }}
              >
                {isPending ? 'Saving...' : 'Create Job'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
