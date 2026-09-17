import React, { useState, useMemo } from 'react';
import { useJobApplicationImport } from '../../hooks/useJobApplicationImport';
import { useJobStore } from '../../state/useJobStore';
import { AutomatorStatusBadge } from './AutomatorStatusBadge';
import { StatusBadgeDropdown } from '../common/StatusBadgeDropdown';
import type { JobItem } from '../../types/job';
import { 
  Mail, 
  ExternalLink, 
  CheckCircle2, 
  Search, 
  RefreshCw, 
  Bot
} from 'lucide-react';

interface JobApplicationPanelProps {
  jobs?: JobItem[];
  isLoading?: boolean;
}

export const JobApplicationPanel: React.FC<JobApplicationPanelProps> = ({
  jobs: controlledJobs,
  isLoading: controlledIsLoading,
}) => {
  const { setSelectedJobId } = useJobStore();
  const liveImport = useJobApplicationImport();

  const jobs = controlledJobs ?? liveImport.automatorJobs;
  const isLoading = controlledIsLoading ?? liveImport.isLoading;

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Draft Created' | 'Sent' | 'Skipped'>('All');

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchSearch =
        !search.trim() ||
        job.companyName.toLowerCase().includes(search.toLowerCase()) ||
        (job.outreachSubject && job.outreachSubject.toLowerCase().includes(search.toLowerCase())) ||
        (job.hrRecruiterName && job.hrRecruiterName.toLowerCase().includes(search.toLowerCase()));

      const matchStatus =
        statusFilter === 'All' || job.automatorStatus === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [jobs, search, statusFilter]);

  if (isLoading) {
    return (
      <div
        data-testid="loading-skeleton"
        style={{
          padding: '32px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '300px',
          color: 'var(--text-muted)',
        }}
      >
        <RefreshCw size={28} className="animate-spin" style={{ color: 'var(--text-accent)' }} />
        <span>Loading auto-imported job applications...</span>
      </div>
    );
  }

  if (!jobs || jobs.length === 0) {
    return (
      <div
        data-testid="empty-state"
        style={{
          padding: '48px 24px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px',
          maxWidth: '560px',
          margin: '40px auto',
          backgroundColor: 'var(--bg-secondary)',
          borderRadius: 'var(--radius-lg)',
          border: '1px dashed var(--border-color)',
        }}
      >
        <div
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-accent)',
          }}
        >
          <Bot size={28} />
        </div>
        <div>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
            No Auto-Imported Applications Yet
          </h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
            Run the <strong>Gmail JD Automator</strong> Python sidecar to scan your Gmail drafts, OCR JD screenshots, generate tailored emails with Claude, and import them directly into NextApply.
          </p>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 14px',
            backgroundColor: 'var(--bg-tertiary)',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.75rem',
            fontFamily: 'monospace',
            color: 'var(--text-secondary)',
          }}
        >
          <span>python automation/gmail-jd-automator/main.py</span>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto' }}>
      {/* Top Banner & Stats */}
      <div
        style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--border-color)',
          backgroundColor: 'var(--bg-secondary)',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                backgroundColor: 'rgba(59, 130, 246, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#3b82f6',
              }}
            >
              <Mail size={20} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Job Applications (Automator)
                </h2>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '9999px',
                    backgroundColor: 'rgba(59, 130, 246, 0.15)',
                    color: '#3b82f6',
                  }}
                >
                  {jobs.length} Total
                </span>
              </div>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                Applications processed from Gmail JD drafts by Claude and OCR.
              </p>
            </div>
          </div>

          {/* Quick Metrics Pills */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <div style={{ padding: '6px 12px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-tertiary)', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              🔵 Drafts: <strong>{jobs.filter((j) => j.automatorStatus === 'Draft Created').length}</strong>
            </div>
            <div style={{ padding: '6px 12px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-tertiary)', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              🟢 Sent: <strong>{jobs.filter((j) => j.automatorStatus === 'Sent').length}</strong>
            </div>
            <div style={{ padding: '6px 12px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-tertiary)', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              🟡 Skipped: <strong>{jobs.filter((j) => j.automatorStatus === 'Skipped').length}</strong>
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', width: '280px' }}>
            <Search
              size={14}
              style={{
                position: 'absolute',
                left: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)',
              }}
            />
            <input
              type="text"
              placeholder="Filter company or subject..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '6px 12px 6px 30px',
                fontSize: '0.8125rem',
                backgroundColor: 'var(--bg-tertiary)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-primary)',
                outline: 'none',
              }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {(['All', 'Draft Created', 'Sent', 'Skipped'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                style={{
                  padding: '4px 10px',
                  fontSize: '0.75rem',
                  fontWeight: statusFilter === st ? 700 : 500,
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid',
                  borderColor: statusFilter === st ? 'var(--border-focus)' : 'var(--border-color)',
                  backgroundColor: statusFilter === st ? 'var(--bg-active)' : 'transparent',
                  color: statusFilter === st ? 'var(--text-primary)' : 'var(--text-muted)',
                  cursor: 'pointer',
                  transition: 'all 120ms ease',
                }}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div style={{ flex: 1, overflowX: 'auto', padding: '0 24px 32px' }}>
        <table
          data-testid="job-app-panel"
          style={{
            width: '100%',
            borderCollapse: 'separate',
            borderSpacing: '0 6px',
            fontSize: '0.8125rem',
          }}
        >
          <thead>
            <tr style={{ color: 'var(--text-muted)', textAlign: 'left' }}>
              <th style={{ padding: '12px 14px', fontWeight: 600 }}>Company</th>
              <th style={{ padding: '12px 14px', fontWeight: 600 }}>Outreach Subject</th>
              <th style={{ padding: '12px 14px', fontWeight: 600 }}>Automator Status</th>
              <th style={{ padding: '12px 14px', fontWeight: 600 }}>Tracker Status</th>
              <th style={{ padding: '12px 14px', fontWeight: 600, textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredJobs.map((job) => {
              const draftLink = job.gmailDraftId
                ? `https://mail.google.com/mail/#drafts/${job.gmailDraftId}`
                : null;

              return (
                <tr
                  key={job.id}
                  data-testid={`job-row-${job.id}`}
                  onClick={() => setSelectedJobId(job.id)}
                  style={{
                    backgroundColor: 'var(--bg-secondary)',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    transition: 'all 120ms ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
                  }}
                >
                  {/* Company & Recruiter */}
                  <td style={{ padding: '12px 14px', borderTopLeftRadius: 'var(--radius-sm)', borderBottomLeftRadius: 'var(--radius-sm)' }}>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.875rem' }}>
                      {job.companyName}
                    </div>
                    {job.hrRecruiterName && (
                      <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        To: {job.hrRecruiterName}
                      </div>
                    )}
                  </td>

                  {/* Subject Preview */}
                  <td style={{ padding: '12px 14px', maxWidth: '380px' }}>
                    <div
                      style={{
                        color: 'var(--text-primary)',
                        fontWeight: 500,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                      title={job.outreachSubject}
                    >
                      {job.outreachSubject || '—'}
                    </div>
                    {job.outreachBodyPreview && (
                      <div
                        style={{
                          fontSize: '0.6875rem',
                          color: 'var(--text-muted)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          marginTop: '2px',
                        }}
                      >
                        {job.outreachBodyPreview}
                      </div>
                    )}
                  </td>

                  {/* Automator Run Status */}
                  <td style={{ padding: '12px 14px' }}>
                    <div data-testid={`status-${job.id}`}>
                      <AutomatorStatusBadge status={job.automatorStatus || 'Draft Created'} />
                    </div>
                  </td>

                  {/* Current Application Status */}
                  <td
                    style={{ padding: '12px 14px' }}
                    onClick={(e) => e.stopPropagation()} // don't open drawer when clicking dropdown
                  >
                    <StatusBadgeDropdown jobId={job.id} currentStatus={job.applicationStatus} size="sm" />
                  </td>

                  {/* Actions */}
                  <td
                    style={{
                      padding: '12px 14px',
                      textAlign: 'right',
                      borderTopRightRadius: 'var(--radius-sm)',
                      borderBottomRightRadius: 'var(--radius-sm)',
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                      {draftLink && (
                        <a
                          href={draftLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          data-testid={`open-draft-${job.id}`}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '4px 10px',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            borderRadius: 'var(--radius-sm)',
                            backgroundColor: 'rgba(59, 130, 246, 0.12)',
                            color: '#3b82f6',
                            textDecoration: 'none',
                            transition: 'all 120ms ease',
                          }}
                          className="glow-hover"
                        >
                          <span>Open Draft</span>
                          <ExternalLink size={12} />
                        </a>
                      )}

                      {job.applicationStatus !== 'Applied' && (
                        <button
                          onClick={() => liveImport.markAsApplied(job.id)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '4px 10px',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            borderRadius: 'var(--radius-sm)',
                            backgroundColor: 'rgba(34, 197, 94, 0.12)',
                            color: '#22c55e',
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'all 120ms ease',
                          }}
                          className="glow-hover"
                          title="Mark this application as Applied in tracker"
                        >
                          <CheckCircle2 size={12} />
                          <span>Mark Applied</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
