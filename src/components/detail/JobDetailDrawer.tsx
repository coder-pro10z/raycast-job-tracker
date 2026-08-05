import React, { useEffect, useState } from 'react';
import { useJobStore } from '../../state/useJobStore';
import { Badge } from '../common/Badge';
import { 
  X, 
  ExternalLink, 
  Building2, 
  MapPin, 
  Calendar, 
  User, 
  Mail, 
  Globe, 
  Users,
  FileText, 
  CheckCircle,
  Copy,
  Check,
  Link as LinkIcon,
  Save
} from 'lucide-react';

export const JobDetailDrawer: React.FC = () => {
  const { selectedJob, setSelectedJobId, updateJobJD } = useJobStore();
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [jdInput, setJdInput] = useState<string>('');
  const [jdEdited, setJdEdited] = useState<boolean>(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedJob && document.activeElement?.tagName !== 'TEXTAREA') {
        setSelectedJobId(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedJob, setSelectedJobId]);

  useEffect(() => {
    if (selectedJob) {
      setJdInput(selectedJob.jdContent || selectedJob.jobApplicationLink || '');
      setJdEdited(false);
    }
  }, [selectedJob]);

  if (!selectedJob) return null;

  const handleSaveJd = () => {
    updateJobJD(selectedJob.id, jdInput);
    setJdEdited(false);
  };

  const copyToClipboard = (text: string, field: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const isUrl = (text: string) => {
    if (!text) return false;
    const clean = text.trim().toLowerCase();
    return clean.startsWith('http') || clean.includes('.com') || clean.includes('.in') || clean.includes('.io') || clean.includes('careers');
  };

  const renderSectionHeader = (title: string, icon: React.ReactNode) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', marginTop: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '6px' }}>
      <span style={{ color: 'var(--text-accent)' }}>{icon}</span>
      <h3 style={{ fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)' }}>
        {title}
      </h3>
    </div>
  );

  const currentJdIsLink = isUrl(selectedJob.jdContent);

  return (
    <>
      {/* Backdrop overlay for focus */}
      <div 
        onClick={() => setSelectedJobId(null)}
        style={{
          position: 'fixed',
          top: '64px',
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(2px)',
          zIndex: 40,
          animation: 'fadeIn 150ms ease'
        }}
      />

      {/* Drawer Container */}
      <aside style={{
        position: 'fixed',
        top: '64px',
        right: 0,
        bottom: 0,
        width: '100%',
        maxWidth: '540px',
        backgroundColor: 'var(--bg-secondary)',
        borderLeft: '1px solid var(--border-color)',
        boxShadow: 'var(--shadow-xl)',
        zIndex: 50,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        animation: 'slideIn 200ms cubic-bezier(0.16, 1, 0.3, 1)'
      }}>
        {/* Drawer Top Bar */}
        <div style={{
          padding: 'var(--space-4) var(--space-6)',
          borderBottom: '1px solid var(--border-color)',
          backgroundColor: 'var(--bg-primary)',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 'var(--space-4)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <Building2 size={16} style={{ color: 'var(--text-accent)' }} />
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                {selectedJob.companyName}
              </span>
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.3 }}>
              {selectedJob.targetRole}
            </h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px' }}>
              <Badge type="status" value={selectedJob.applicationStatus} size="md" />
              <Badge type="priority" value={`Priority: ${selectedJob.priority}`} size="md" />
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--text-secondary)', backgroundColor: 'var(--bg-tertiary)', padding: '2px 10px', borderRadius: 'var(--radius-full)' }}>
                <MapPin size={12} />
                {selectedJob.location} ({selectedJob.workMode})
              </span>
            </div>
          </div>

          <button
            onClick={() => setSelectedJobId(null)}
            title="Close details (Esc)"
            style={{
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-sm)',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              flexShrink: 0
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Body Content */}
        <div style={{ flex: '1', overflowY: 'auto', padding: '0 var(--space-6) var(--space-8)' }}>
          
          {/* Section 1: JD & Application URL Editor */}
          {renderSectionHeader('Job Description & Application Link', <FileText size={15} />)}
          <div style={{ backgroundColor: 'var(--bg-primary)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                Paste direct Application URL or full JD text below:
              </span>
              {currentJdIsLink && selectedJob.jdContent && (
                <a 
                  href={selectedJob.jdContent.startsWith('http') ? selectedJob.jdContent : `https://${selectedJob.jdContent}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: '0.75rem', fontWeight: 600, color: '#60a5fa', display: 'inline-flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}
                >
                  <LinkIcon size={12} /> Open URL in Tab
                </a>
              )}
            </div>

            <textarea
              value={jdInput}
              onChange={(e) => {
                setJdInput(e.target.value);
                setJdEdited(e.target.value !== (selectedJob.jdContent || ''));
              }}
              placeholder="Paste job posting URL (https://...) or copy-paste full requirements & job description text here..."
              rows={4}
              style={{
                width: '100%',
                backgroundColor: 'var(--bg-tertiary)',
                border: '1px solid',
                borderColor: jdEdited ? 'var(--border-focus)' : 'var(--border-color)',
                borderRadius: 'var(--radius-sm)',
                padding: '10px 12px',
                color: 'var(--text-primary)',
                fontSize: '0.8125rem',
                fontFamily: 'var(--font-sans)',
                lineHeight: 1.5,
                resize: 'vertical',
                outline: 'none',
                marginBottom: '10px',
                minHeight: '80px'
              }}
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              {jdEdited && (
                <button
                  onClick={() => {
                    setJdInput(selectedJob.jdContent || '');
                    setJdEdited(false);
                  }}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'transparent',
                    color: 'var(--text-muted)',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
              )}
              <button
                onClick={handleSaveJd}
                disabled={!jdEdited}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  backgroundColor: jdEdited ? 'var(--border-focus)' : 'var(--bg-elevated)',
                  color: jdEdited ? '#ffffff' : 'var(--text-muted)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: jdEdited ? 'pointer' : 'default',
                  transition: 'all 150ms ease'
                }}
              >
                <Save size={13} />
                <span>{jdEdited ? 'Save Changes' : 'Saved'}</span>
              </button>
            </div>
          </div>

          {/* Section 2: Overview & Tech Stack */}
          {renderSectionHeader('Overview & Tech Stack', <CheckCircle size={15} />)}
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>
              Extracted Keywords & Skills:
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {selectedJob.techStack.length > 0 ? (
                selectedJob.techStack.map((skill, idx) => (
                  <Badge key={idx} type="tech" value={skill} />
                ))
              ) : (
                <span style={{ color: 'var(--text-muted)', fontSize: '0.8125rem', fontStyle: 'italic' }}>No technical stack keywords recorded in sheet.</span>
              )}
            </div>
          </div>

          {/* Section 3: Application Links & Action */}
          {renderSectionHeader('Direct Links & Action', <ExternalLink size={15} />)}
          <div style={{ display: 'grid', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Next Required Action</div>
                <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-accent)' }}>{selectedJob.nextAction}</div>
              </div>
            </div>

            {selectedJob.careerPageLink && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', backgroundColor: 'var(--bg-primary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingRight: '12px' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Career Portal</div>
                  <a href={selectedJob.careerPageLink} target="_blank" rel="noreferrer" style={{ fontSize: '0.8125rem', color: 'var(--text-accent)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {selectedJob.careerPageLink} <ExternalLink size={12} />
                  </a>
                </div>
                <button 
                  onClick={() => copyToClipboard(selectedJob.careerPageLink, 'career')}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                  title="Copy URL"
                >
                  {copiedField === 'career' ? <Check size={16} style={{ color: '#34d399' }} /> : <Copy size={16} />}
                </button>
              </div>
            )}
          </div>

          {/* Section 4: Recruiter Contacts */}
          {renderSectionHeader('Recruiter / HR Contacts', <User size={15} />)}
          <div style={{ backgroundColor: 'var(--bg-primary)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            {selectedJob.hrRecruiterName || selectedJob.hrRecruiterEmail || selectedJob.hrRecruiterLinkedIn ? (
              <div style={{ display: 'grid', gap: '10px' }}>
                {selectedJob.hrRecruiterName && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Contact Name</span>
                    <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{selectedJob.hrRecruiterName}</span>
                  </div>
                )}
                {selectedJob.hrRecruiterEmail && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Email Address</span>
                    <a href={`mailto:${selectedJob.hrRecruiterEmail}`} style={{ color: 'var(--text-accent)', fontSize: '0.8125rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Mail size={13} /> {selectedJob.hrRecruiterEmail}
                    </a>
                  </div>
                )}
                {selectedJob.hrRecruiterLinkedIn && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>LinkedIn Profile</span>
                    <a href={selectedJob.hrRecruiterLinkedIn} target="_blank" rel="noreferrer" style={{ color: '#60a5fa', fontSize: '0.8125rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Globe size={13} /> View Profile
                    </a>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ color: 'var(--text-muted)', fontSize: '0.8125rem', fontStyle: 'italic' }}>
                No direct recruiter or HR contact recorded for this role yet.
              </div>
            )}
          </div>

          {/* Section 5: Referral Information */}
          {renderSectionHeader('Referral Pipeline', <Users size={15} />)}
          <div style={{ backgroundColor: 'var(--bg-primary)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: selectedJob.referralContactName ? '10px' : '0' }}>
              <span style={{ fontSize: '0.8125rem', fontWeight: 500 }}>Referral Needed?</span>
              <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: selectedJob.referralNeeded ? '#fb923c' : 'var(--text-muted)' }}>
                {selectedJob.referralNeeded ? '⚡ Yes (Required/Preferred)' : 'No / Self Apply'}
              </span>
            </div>
            {selectedJob.referralContactName && (
              <div style={{ display: 'grid', gap: '8px', borderTop: '1px dashed var(--border-color)', paddingTop: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Referral Contact</span>
                  <span style={{ fontSize: '0.8125rem', fontWeight: 600 }}>{selectedJob.referralContactName} ({selectedJob.referralContactRole || 'Connection'})</span>
                </div>
                {selectedJob.referralContactEmail && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Email</span>
                    <span style={{ fontSize: '0.8125rem', color: 'var(--text-accent)' }}>{selectedJob.referralContactEmail}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Section 6: Timeline & Follow-up */}
          {renderSectionHeader('Timeline & Follow-ups', <Calendar size={15} />)}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={{ padding: '10px', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Date Applied</div>
              <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{selectedJob.appliedDate || 'Not Yet Applied'}</div>
            </div>
            <div style={{ padding: '10px', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Follow-Up Date</div>
              <div style={{ fontSize: '0.875rem', fontWeight: 600, color: selectedJob.followUpDate ? '#fb923c' : 'inherit' }}>
                {selectedJob.followUpDate || 'No Follow-up Set'}
              </div>
            </div>
          </div>

          {/* Section 7: Notes & Intelligence */}
          {renderSectionHeader('Notes & Market Intelligence', <FileText size={15} />)}
          <div style={{ 
            backgroundColor: 'var(--bg-primary)', 
            padding: 'var(--space-4)', 
            borderRadius: 'var(--radius-md)', 
            border: '1px solid var(--border-color)',
            fontSize: '0.8125rem',
            lineHeight: 1.6,
            color: 'var(--text-secondary)',
            whiteSpace: 'pre-wrap'
          }}>
            {selectedJob.notes || 'No notes available for this position.'}
          </div>

        </div>
      </aside>
    </>
  );
};
