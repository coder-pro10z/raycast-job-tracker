import React, { useRef, useState } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useJobStore } from '../../state/useJobStore';
import { useUpdateJob } from '../../hooks/useJobs';
import type { JobItem } from '../../types/job';
import { Badge } from '../common/Badge';
import { StatusBadgeDropdown } from '../common/StatusBadgeDropdown';
import { FindLeadsMenu } from '../detail/FindLeadsMenu';
import { ArrowUp, ArrowDown, ExternalLink, ChevronRight, Edit2, FileText, Link as LinkIcon, Plus, Cloud } from 'lucide-react';

export const JobTable: React.FC = () => {
  const { filteredJobs, selectedJobId, setSelectedJobId, filterState, setSort, isSidebarCollapsed, setSidebarCollapsed } = useJobStore();
  const { mutate: updateJob } = useUpdateJob();
  const parentRef = useRef<HTMLDivElement>(null);
  const [editingJdId, setEditingJdId] = useState<string | null>(null);
  const [dropdownOpenRowId, setDropdownOpenRowId] = useState<string | null>(null);
  const [activeLeadsRowId, setActiveLeadsRowId] = useState<string | null>(null);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === 'l' || e.key === 'L') {
        if (selectedJobId) {
          e.preventDefault();
          setActiveLeadsRowId(selectedJobId);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedJobId]);

  const rowVirtualizer = useVirtualizer({
    count: filteredJobs.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50,
    overscan: 12,
  });

  const columns: { key: keyof JobItem | 'actions'; label: string; flex: string; minWidth: string; sortable?: boolean }[] = [
    { key: 'companyName', label: 'Company', flex: '1.3 1 0%', minWidth: '150px', sortable: true },
    { key: 'targetRole', label: 'Target Role & Domain', flex: '2 1 0%', minWidth: '240px', sortable: true },
    { key: 'location', label: 'Location (Mode)', flex: '1.3 1 0%', minWidth: '160px', sortable: true },
    { key: 'jdContent', label: 'JD / Application', flex: '1.5 1 0%', minWidth: '180px', sortable: false },
    { key: 'priority', label: 'Priority', flex: '0.8 1 0%', minWidth: '85px', sortable: true },
    { key: 'applicationStatus', label: 'Status', flex: '1 1 0%', minWidth: '110px', sortable: true },
    { key: 'nextAction', label: 'Next Action', flex: '1.5 1 0%', minWidth: '175px', sortable: false },
  ];

  const handleHeaderClick = (col: keyof JobItem | 'actions', sortable?: boolean) => {
    if (sortable && col !== 'actions') {
      setSort(col as keyof JobItem);
    }
  };



  const renderDomainBadge = (job: JobItem) => {
    if (job.domain === 'dual') {
      return (
        <span title="Dual Domain Track" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '4px', padding: '1px 6px', fontSize: '0.75rem', fontFamily: 'monospace', fontWeight: 800, backgroundColor: 'rgba(251, 146, 60, 0.15)', color: '#fb923c', borderRadius: '4px', marginLeft: '6px', flexShrink: 0 }}>
          &lt;/&gt; <Cloud size={12} />
        </span>
      );
    }
    if (job.domain === 'cloud') {
      return (
        <span title="Cloud / DevOps Track" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '20px', backgroundColor: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', borderRadius: '4px', marginLeft: '6px', flexShrink: 0 }}>
          <Cloud size={13} />
        </span>
      );
    }
    if (job.domain === 'sde') {
      return (
        <span title="SDE / FullStack Track" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '1px 6px', fontSize: '0.75rem', fontFamily: 'monospace', fontWeight: 800, backgroundColor: 'rgba(129, 140, 248, 0.15)', color: '#818cf8', borderRadius: '4px', marginLeft: '6px', flexShrink: 0, letterSpacing: '-0.05em' }}>
          &lt;/&gt;
        </span>
      );
    }
    return null;
  };

  return (
    <div style={{ padding: '0 0 var(--space-4) 0', position: 'relative', width: '100%' }}>
      <div 
        ref={parentRef} 
        className="table-scroll-box"
        onScroll={(e) => {
          if (e.currentTarget.scrollTop > 30 && !isSidebarCollapsed) {
            setSidebarCollapsed(true);
          }
        }}
        style={{ 
          width: '100%',
          overflow: 'auto', 
          WebkitOverflowScrolling: 'touch',
          borderTop: '1px solid var(--border-color)',
          borderBottom: '1px solid var(--border-color)', 
          borderLeft: 'none',
          borderRight: 'none',
          borderRadius: '0',
          backgroundColor: 'var(--bg-primary)',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        {/* Sticky Table Header */}
        <div style={{
          display: 'flex',
          width: '100%',
          minWidth: '1100px',
          position: 'sticky',
          top: 0,
          zIndex: 10,
          backgroundColor: 'var(--bg-secondary)',
          borderBottom: '1px solid var(--border-color)',
          height: '42px',
          alignItems: 'center',
          padding: '0 var(--space-4)'
        }}>
          {columns.map((col) => {
            const isSorted = filterState.sortBy === col.key;
            const isAsc = filterState.sortDirection === 'asc';
            return (
              <div
                key={col.key}
                onClick={() => handleHeaderClick(col.key, col.sortable)}
                style={{
                  flex: col.flex,
                  minWidth: col.minWidth,
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: isSorted ? 'var(--text-accent)' : 'var(--text-secondary)',
                  cursor: col.sortable ? 'pointer' : 'default',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  userSelect: 'none',
                  paddingRight: '12px'
                }}
              >
                <span>{col.label}</span>
                {isSorted && (
                  isAsc ? <ArrowUp size={14} style={{ flexShrink: 0 }} /> : <ArrowDown size={14} style={{ flexShrink: 0 }} />
                )}
              </div>
            );
          })}
        </div>

        {/* Virtualized Rows Container */}
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: '100%',
            minWidth: '1100px',
            position: 'relative',
          }}
        >
          {filteredJobs.length === 0 && (
            <div style={{
              textAlign: 'center',
              padding: '60px 20px',
              color: 'var(--text-muted)',
              fontSize: '0.9375rem'
            }}>
              No job applications match your current domain track and filter criteria.
            </div>
          )}

          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const job = filteredJobs[virtualRow.index];
            const isSelected = job.id === selectedJobId;
            const isEditingThisJd = editingJdId === job.id;
            const hasJd = Boolean(job.jdContent && job.jdContent.trim());
            const hasLink = Boolean(job.jobApplicationLink && job.jobApplicationLink.trim());

            return (
              <div
                key={job.id}
                onClick={() => {
                  if (!isEditingThisJd) setSelectedJobId(isSelected ? null : job.id);
                }}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  minWidth: '1100px',
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`,
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 var(--space-4)',
                  borderBottom: '1px solid var(--border-color)',
                  backgroundColor: isSelected ? 'var(--bg-active)' : 'transparent',
                  cursor: isEditingThisJd ? 'default' : 'pointer',
                  transition: 'background-color 150ms ease',
                  zIndex: (dropdownOpenRowId === job.id || activeLeadsRowId === job.id) ? 50 : 1,
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                {/* Company Name & Link shortcut */}
                <div style={{ flex: columns[0].flex, minWidth: columns[0].minWidth, display: 'flex', alignItems: 'center', gap: '8px', paddingRight: '12px', overflow: 'hidden' }}>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '0.875rem' }}>
                    {job.companyName}
                  </span>
                  {job.careerPageLink && (
                    <a 
                      href={job.careerPageLink.startsWith('http') ? job.careerPageLink : `https://${job.careerPageLink}`}
                      target="_blank" 
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()} 
                      title="Open career portal"
                      style={{ color: 'var(--text-muted)', display: 'inline-flex', flexShrink: 0 }}
                    >
                      <ExternalLink size={13} />
                    </a>
                  )}
                </div>

                {/* Target Role & Domain Badge */}
                <div style={{ flex: columns[1].flex, minWidth: columns[1].minWidth, paddingRight: '12px', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
                  <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 500 }}>
                    {job.targetRole}
                  </span>
                  {renderDomainBadge(job)}
                </div>

                {/* Status & Priority */}
                <div style={{ flex: columns[2].flex, minWidth: columns[2].minWidth, paddingRight: '12px', display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-start' }}>
                  <StatusBadgeDropdown jobId={job.id} currentStatus={job.applicationStatus} />
                </div>

                {/* Combined Location (Work Mode) */}
                <div style={{ flex: columns[2].flex, minWidth: columns[2].minWidth, paddingRight: '12px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '0.8125rem' }}>
                  <span style={{ color: 'var(--text-primary)' }}>{job.location}</span>
                  <span style={{ color: 'var(--text-muted)', marginLeft: '6px', fontSize: '0.75rem' }}>({job.workMode})</span>
                </div>

                {/* JD / Application Link Column */}
                <div style={{ flex: columns[3].flex, minWidth: columns[3].minWidth, paddingRight: '12px', display: 'flex', flexDirection: 'column', gap: '4px', overflow: 'hidden' }}>
                  {isEditingThisJd ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '100%' }} onClick={e => e.stopPropagation()}>
                      <input
                        type="url"
                        autoFocus
                        defaultValue={job.jobApplicationLink}
                        placeholder="Application URL..."
                        onChange={(e) => updateJob({ id: job.id, patch: { jobApplicationLink: e.currentTarget.value } })}
                        style={{
                          width: '100%', height: '24px', padding: '0 8px', borderRadius: '4px', border: '1px solid var(--border-focus)', backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)', fontSize: '0.75rem', outline: 'none'
                        }}
                      />
                      <input
                        type="text"
                        defaultValue={job.jdContent}
                        placeholder="JD text snippet..."
                        onChange={(e) => updateJob({ id: job.id, patch: { jdContent: e.currentTarget.value } })}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === 'Escape') setEditingJdId(null);
                        }}
                        style={{
                          width: '100%', height: '24px', padding: '0 8px', borderRadius: '4px', border: '1px solid var(--border-focus)', backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)', fontSize: '0.75rem', outline: 'none'
                        }}
                      />
                      <button 
                        onClick={() => setEditingJdId(null)}
                        style={{ alignSelf: 'flex-end', fontSize: '0.65rem', padding: '2px 8px', background: 'var(--border-focus)', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer', marginTop: '2px' }}
                      >
                        Done
                      </button>
                    </div>
                  ) : (!hasJd && !hasLink) ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingJdId(job.id);
                      }}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '3px 10px',
                        borderRadius: 'var(--radius-full)',
                        border: '1px dashed rgba(255, 255, 255, 0.2)',
                        backgroundColor: 'rgba(255, 255, 255, 0.03)',
                        color: 'var(--text-muted)',
                        fontSize: '0.75rem',
                        fontWeight: 500,
                        cursor: 'pointer',
                        transition: 'all 150ms ease',
                        alignSelf: 'flex-start'
                      }}
                      className="glow-hover"
                      title="Click to paste Job Application URL or JD text"
                    >
                      <Plus size={12} style={{ color: 'var(--text-accent)' }} />
                      <span>Add Details</span>
                    </button>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'flex-start' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {hasLink && (
                          <a
                            href={job.jobApplicationLink.startsWith('http') ? job.jobApplicationLink : `https://${job.jobApplicationLink}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              padding: '2px 8px',
                              borderRadius: 'var(--radius-full)',
                              backgroundColor: 'rgba(59, 130, 246, 0.15)',
                              color: '#60a5fa',
                              fontSize: '0.7rem',
                              fontWeight: 600,
                              textDecoration: 'none',
                            }}
                            title={`Apply: ${job.jobApplicationLink}`}
                          >
                            <LinkIcon size={10} />
                            <span>Apply</span>
                          </a>
                        )}
                        {hasJd && (
                          <span
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedJobId(job.id);
                            }}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              padding: '2px 8px',
                              borderRadius: 'var(--radius-full)',
                              backgroundColor: 'rgba(16, 185, 129, 0.15)',
                              color: '#34d399',
                              fontSize: '0.7rem',
                              fontWeight: 600,
                              cursor: 'pointer',
                            }}
                            title="JD Saved (click row to read full text in details drawer)"
                          >
                            <FileText size={10} />
                            <span>JD</span>
                          </span>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingJdId(job.id);
                          }}
                          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '2px' }}
                          title="Edit Application Link or JD"
                        >
                          <Edit2 size={12} />
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {/* Find Leads Quick Action */}
                  <div className="ml-2 flex-shrink-0">
                    <FindLeadsMenu 
                      job={job} 
                      compact={true} 
                      isOpen={activeLeadsRowId === job.id}
                      onToggle={(isOpen) => setActiveLeadsRowId(isOpen ? job.id : null)}
                    />
                  </div>
                </div>

                {/* Priority */}
                <div style={{ flex: columns[4].flex, minWidth: columns[4].minWidth, paddingRight: '12px' }}>
                  <Badge type="priority" value={job.priority} />
                </div>

                {/* Application Status */}
                <div style={{ flex: columns[5].flex, minWidth: columns[5].minWidth, paddingRight: '12px' }}>
                  <StatusBadgeDropdown 
                    jobId={job.id} 
                    currentStatus={job.applicationStatus} 
                    size="sm" 
                    onToggle={(isOpen) => setDropdownOpenRowId(isOpen ? job.id : null)}
                  />
                </div>

                {/* Next Action */}
                <div style={{ flex: columns[6].flex, minWidth: columns[6].minWidth, display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-accent)', fontSize: '0.8125rem', paddingRight: '4px', overflow: 'hidden' }}>
                  <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', paddingRight: '6px' }}>
                    {job.nextAction}
                  </span>
                  <ChevronRight size={16} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
