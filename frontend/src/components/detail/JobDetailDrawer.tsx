import React, { useEffect, useState, useRef } from 'react';
import { useJobStore } from '../../state/useJobStore';
import { useUpdateJob, useAddNote, useCheckDuplicateJob } from '../../hooks/useJobs';
import { Badge } from '../common/Badge';
import { StatusBadgeDropdown } from '../common/StatusBadgeDropdown';
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
  Save,
  Cloud,
  Edit3,
  Phone
} from 'lucide-react';
import { OutreachStudio } from './OutreachStudio';
import { FindLeadsMenu } from './FindLeadsMenu';

export const JobDetailDrawer: React.FC = () => {
  const { selectedJob, setSelectedJobId } = useJobStore();
  const { mutate: updateJob } = useUpdateJob();
  const { mutate: addNote } = useAddNote();
  const [isEditingHR, setIsEditingHR] = useState(false);
  const [hrForm, setHrForm] = useState({ name: '', email: '', linkedin: '', phone: '' });

  const [isEditingReferral, setIsEditingReferral] = useState(false);
  const [referralForm, setReferralForm] = useState({ name: '', role: '', email: '', linkedin: '' });

  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [jdInput, setJdInput] = useState<string>('');
  const [linkInput, setLinkInput] = useState<string>('');
  const [jdEdited, setJdEdited] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'details' | 'outreach'>('details');

  const roleInputRef = useRef<HTMLInputElement>(null);
  const [roleInput, setRoleInput] = useState<string>('');
  
  // Custom simple debounce for duplicate check
  const [debouncedRole, setDebouncedRole] = useState('');
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedRole(roleInput), 400);
    return () => clearTimeout(handler);
  }, [roleInput]);

  const duplicateCheck = useCheckDuplicateJob(selectedJob?.companyName || '', debouncedRole);

  const handleSaveRole = () => {
    if (selectedJob && roleInput !== selectedJob.targetRole) {
      updateJob({ id: selectedJob.id, patch: { targetRole: roleInput } });
    }
  };

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
      setJdInput(selectedJob.jdContent || '');
      setLinkInput(selectedJob.jobApplicationLink || '');
      setRoleInput(selectedJob.targetRole || '');
      setJdEdited(false);
      setActiveTab('details');
      setIsEditingHR(false);
      setHrForm({
        name: selectedJob.hrRecruiterName || '',
        email: selectedJob.hrRecruiterEmail || '',
        linkedin: selectedJob.hrRecruiterLinkedIn || '',
        phone: selectedJob.hrRecruiterPhone || ''
      });
      setIsEditingReferral(false);
      setReferralForm({
        name: selectedJob.referralContactName || '',
        role: selectedJob.referralContactRole || '',
        email: selectedJob.referralContactEmail || '',
        linkedin: selectedJob.referralContactLinkedIn || ''
      });
      
      // Auto-focus targetRole if empty (e.g. newly cloned)
      if (!selectedJob.targetRole) {
        setTimeout(() => {
          roleInputRef.current?.focus();
        }, 50);
      }
    }
  }, [selectedJob]);

  if (!selectedJob) return null;

  const handleSaveJd = () => {
    if (jdInput !== selectedJob.jdContent) {
      addNote({ jobId: selectedJob.id, content: jdInput, type: 'JD' });
    }
    updateJob({ 
      id: selectedJob.id, 
      patch: { 
        jdContent: jdInput, 
        jobApplicationLink: linkInput 
      } 
    });
    setJdEdited(false);
  };

  const copyToClipboard = (text: string, field: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const renderSectionHeader = (title: string, icon: React.ReactNode) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', marginTop: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '6px' }}>
      <span style={{ color: 'var(--text-accent)' }}>{icon}</span>
      <h3 style={{ fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)' }}>
        {title}
      </h3>
    </div>
  );

  // Compute Domain Track tag strictly from domain attribute
  const isCloud = selectedJob.domain === 'cloud';
  const isDual = selectedJob.domain === 'dual';

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
      <aside 
        className="mobile-full-drawer"
        style={{
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
        }}
      >
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
              {isDual ? (
                <span title="Dual Domain (SDE + Cloud)" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', fontFamily: 'monospace', fontWeight: 800, backgroundColor: 'rgba(251, 146, 60, 0.15)', color: '#fb923c', padding: '2px 8px', borderRadius: '4px' }}>
                  &lt;/&gt; <Cloud size={12} />
                </span>
              ) : isCloud ? (
                <span title="Cloud / DevOps Track" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '24px', height: '22px', backgroundColor: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', borderRadius: '4px' }}>
                  <Cloud size={14} />
                </span>
              ) : (
                <span title="SDE / FullStack Track" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontFamily: 'monospace', fontWeight: 800, backgroundColor: 'rgba(129, 140, 248, 0.15)', color: '#818cf8', padding: '2px 8px', borderRadius: '4px', letterSpacing: '-0.05em' }}>
                  &lt;/&gt;
                </span>
              )}
            </div>
            {/* Editable Target Role */}
            <div style={{ position: 'relative', marginTop: '4px' }}>
              <input
                ref={roleInputRef}
                type="text"
                value={roleInput}
                onChange={(e) => setRoleInput(e.target.value)}
                onBlur={handleSaveRole}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.currentTarget.blur();
                  }
                }}
                placeholder="Enter Target Role..."
                style={{ 
                  fontSize: '1.25rem', 
                  fontWeight: 800, 
                  color: 'var(--text-primary)', 
                  lineHeight: 1.3,
                  background: 'transparent',
                  border: '1px solid transparent',
                  borderBottom: roleInput !== selectedJob.targetRole ? '1px dashed var(--text-accent)' : '1px solid transparent',
                  padding: '2px 4px',
                  marginLeft: '-4px',
                  width: '100%',
                  outline: 'none',
                  transition: 'border-color 0.2s ease',
                  fontFamily: 'inherit'
                }}
                onFocus={(e) => e.target.style.border = '1px solid var(--border-color)'}
              />
              {duplicateCheck.data?.isDuplicate && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: '0',
                  marginTop: '4px',
                  backgroundColor: 'rgba(251, 146, 60, 0.1)',
                  border: '1px solid rgba(251, 146, 60, 0.3)',
                  color: '#ea580c',
                  padding: '6px 10px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  zIndex: 10,
                  whiteSpace: 'nowrap',
                  boxShadow: 'var(--shadow-sm)',
                  animation: 'fadeIn 0.2s ease'
                }}>
                  ⚠️ You already have "{roleInput}" at {selectedJob.companyName}.
                </div>
              )}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px', alignItems: 'center' }}>
              <StatusBadgeDropdown jobId={selectedJob.id} currentStatus={selectedJob.applicationStatus} size="md" />
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

        {/* Tab Navigation Switcher */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid var(--border-color)',
          backgroundColor: 'var(--bg-secondary)',
          padding: '0 var(--space-6)'
        }}>
          <button
            onClick={() => setActiveTab('details')}
            style={{
              flex: '1',
              padding: '12px 0',
              border: 'none',
              borderBottom: activeTab === 'details' ? '2px solid var(--text-accent)' : '2px solid transparent',
              background: 'transparent',
              color: activeTab === 'details' ? 'var(--text-primary)' : 'var(--text-muted)',
              fontSize: '0.8125rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'all 150ms ease'
            }}
          >
            <FileText size={15} />
            <span>Job & Application Info</span>
          </button>

          <button
            onClick={() => setActiveTab('outreach')}
            style={{
              flex: '1',
              padding: '12px 0',
              border: 'none',
              borderBottom: activeTab === 'outreach' ? '2px solid #10b981' : '2px solid transparent',
              background: 'transparent',
              color: activeTab === 'outreach' ? '#10b981' : 'var(--text-muted)',
              fontSize: '0.8125rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'all 150ms ease'
            }}
          >
            <Mail size={15} />
            <span>Outreach Pitch Studio</span>
            <span style={{ fontSize: '0.625rem', padding: '1px 6px', backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10b981', borderRadius: '10px' }}>NEW</span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', marginLeft: 'auto', padding: '8px 0' }}>
            <FindLeadsMenu job={selectedJob} />
          </div>
        </div>

        {activeTab === 'outreach' ? (
          <OutreachStudio job={selectedJob} />
        ) : (
          /* Scrollable Body Content */
          <div style={{ flex: '1', overflowY: 'auto', padding: '0 var(--space-6) var(--space-8)' }}>
            
            {/* Section 1: Application Link & Job Description Editor */}
          {renderSectionHeader('Application Link & Job Description', <FileText size={15} />)}
          <div style={{ backgroundColor: 'var(--bg-primary)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {/* Application URL Field */}
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                Application URL:
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="url"
                  value={linkInput}
                  onChange={(e) => {
                    setLinkInput(e.target.value);
                    setJdEdited(true);
                  }}
                  placeholder="https://company.com/careers/..."
                  style={{
                    flex: 1,
                    backgroundColor: 'var(--bg-tertiary)',
                    border: '1px solid',
                    borderColor: jdEdited && linkInput !== (selectedJob.jobApplicationLink || '') ? 'var(--border-focus)' : 'var(--border-color)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '8px 12px',
                    color: 'var(--text-primary)',
                    fontSize: '0.8125rem',
                    outline: 'none',
                  }}
                />
                {selectedJob.jobApplicationLink && (
                  <a 
                    href={selectedJob.jobApplicationLink.startsWith('http') ? selectedJob.jobApplicationLink : `https://${selectedJob.jobApplicationLink}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Open application link"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '36px',
                      height: '36px',
                      backgroundColor: 'rgba(96, 165, 250, 0.1)',
                      color: '#60a5fa',
                      borderRadius: 'var(--radius-sm)',
                      textDecoration: 'none',
                      flexShrink: 0
                    }}
                  >
                    <ExternalLink size={16} />
                  </a>
                )}
              </div>
            </div>

            {/* Job Description Field */}
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                Job Description Details:
              </label>
              <textarea
                value={jdInput}
                onChange={(e) => {
                  setJdInput(e.target.value);
                  setJdEdited(true);
                }}
                placeholder="Paste full requirements & job description text here..."
                rows={4}
                style={{
                  width: '100%',
                  backgroundColor: 'var(--bg-tertiary)',
                  border: '1px solid',
                  borderColor: jdEdited && jdInput !== (selectedJob.jdContent || '') ? 'var(--border-focus)' : 'var(--border-color)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '10px 12px',
                  color: 'var(--text-primary)',
                  fontSize: '0.8125rem',
                  fontFamily: 'var(--font-sans)',
                  lineHeight: 1.5,
                  resize: 'vertical',
                  outline: 'none',
                  minHeight: '80px'
                }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              {jdEdited && (
                <button
                  onClick={() => {
                    setJdInput(selectedJob.jdContent || '');
                    setLinkInput(selectedJob.jobApplicationLink || '');
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
          {renderSectionHeader(isCloud ? 'Cloud Infrastructure & DevOps Stack' : 'Software Engineering Tech Stack', <CheckCircle size={15} />)}
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>
              Extracted Technical Competencies:
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {selectedJob.techStack.length > 0 ? (
                selectedJob.techStack.map((skill, idx) => {
                  const isCloudSkill = skill.toLowerCase().includes('azure') || skill.toLowerCase().includes('docker') || skill.toLowerCase().includes('k8s') || skill.toLowerCase().includes('cloud') || skill.toLowerCase().includes('devops');
                  return (
                    <span 
                      key={idx} 
                      style={{
                        padding: '4px 10px',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.75rem',
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 600,
                        backgroundColor: isCloudSkill ? 'rgba(56, 189, 248, 0.15)' : 'var(--bg-elevated)',
                        color: isCloudSkill ? '#38bdf8' : 'var(--text-primary)',
                        border: isCloudSkill ? '1px solid rgba(56, 189, 248, 0.3)' : '1px solid transparent'
                      }}
                    >
                      {isCloudSkill && '☁️ '}{skill}
                    </span>
                  );
                })
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
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', marginTop: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '6px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: 'var(--text-accent)' }}><User size={15} /></span>
              <h3 style={{ fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)' }}>Recruiter / HR Contacts</h3>
            </div>
            {!isEditingHR && (
              <button onClick={() => setIsEditingHR(true)} style={{ background: 'none', border: 'none', color: 'var(--text-accent)', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                <Edit3 size={12} /> Edit
              </button>
            )}
          </div>
          <div style={{ backgroundColor: 'var(--bg-primary)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            {isEditingHR ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Name</label>
                  <input type="text" value={hrForm.name} onChange={e => setHrForm({...hrForm, name: e.target.value})} placeholder="E.g. Sarah Smith" style={{ padding: '8px 10px', fontSize: '0.8125rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-tertiary)', color: 'var(--text-primary)', outline: 'none' }} onFocus={e => e.target.style.borderColor = 'var(--border-focus)'} onBlur={e => e.target.style.borderColor = 'var(--border-color)'} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Email</label>
                  <input type="email" value={hrForm.email} onChange={e => setHrForm({...hrForm, email: e.target.value})} placeholder="sarah@company.com" style={{ padding: '8px 10px', fontSize: '0.8125rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-tertiary)', color: 'var(--text-primary)', outline: 'none' }} onFocus={e => e.target.style.borderColor = 'var(--border-focus)'} onBlur={e => e.target.style.borderColor = 'var(--border-color)'} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>LinkedIn</label>
                  <input type="url" value={hrForm.linkedin} onChange={e => setHrForm({...hrForm, linkedin: e.target.value})} placeholder="https://linkedin.com/in/..." style={{ padding: '8px 10px', fontSize: '0.8125rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-tertiary)', color: 'var(--text-primary)', outline: 'none' }} onFocus={e => e.target.style.borderColor = 'var(--border-focus)'} onBlur={e => e.target.style.borderColor = 'var(--border-color)'} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Phone</label>
                  <input type="tel" value={hrForm.phone} onChange={e => setHrForm({...hrForm, phone: e.target.value})} placeholder="+1 (555) 000-0000" style={{ padding: '8px 10px', fontSize: '0.8125rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-tertiary)', color: 'var(--text-primary)', outline: 'none' }} onFocus={e => e.target.style.borderColor = 'var(--border-focus)'} onBlur={e => e.target.style.borderColor = 'var(--border-color)'} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '4px' }}>
                  <button onClick={() => setIsEditingHR(false)} style={{ padding: '6px 12px', fontSize: '0.75rem', background: 'transparent', color: 'var(--text-muted)', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
                  <button onClick={() => { updateJob({ id: selectedJob.id, patch: { hrRecruiterName: hrForm.name, hrRecruiterEmail: hrForm.email, hrRecruiterLinkedIn: hrForm.linkedin, hrRecruiterPhone: hrForm.phone }}); setIsEditingHR(false); }} style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 12px', fontSize: '0.75rem', background: 'var(--border-focus)', color: 'white', border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontWeight: 600 }}><Save size={13} /> Save</button>
                </div>
              </div>
            ) : selectedJob.hrRecruiterName || selectedJob.hrRecruiterEmail || selectedJob.hrRecruiterLinkedIn || selectedJob.hrRecruiterPhone ? (
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
                    <a href={selectedJob.hrRecruiterLinkedIn.startsWith('http') ? selectedJob.hrRecruiterLinkedIn : `https://${selectedJob.hrRecruiterLinkedIn}`} target="_blank" rel="noreferrer" style={{ color: '#60a5fa', fontSize: '0.8125rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Globe size={13} /> View Profile
                    </a>
                  </div>
                )}
                {selectedJob.hrRecruiterPhone && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Phone Number</span>
                    <a href={`tel:${selectedJob.hrRecruiterPhone}`} style={{ color: '#34d399', fontSize: '0.8125rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Phone size={13} /> {selectedJob.hrRecruiterPhone}
                    </a>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ color: 'var(--text-muted)', fontSize: '0.8125rem', fontStyle: 'italic', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '8px' }}>
                No direct recruiter or HR contact recorded for this role.
                <button onClick={() => setIsEditingHR(true)} style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)', padding: '4px 10px', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}><Edit3 size={12} /> Add Contact Details</button>
              </div>
            )}
          </div>

          {/* Section 5: Referral Information */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', marginTop: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '6px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: 'var(--text-accent)' }}><Users size={15} /></span>
              <h3 style={{ fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)' }}>Referral Pipeline</h3>
            </div>
            {!isEditingReferral && (
              <button onClick={() => setIsEditingReferral(true)} style={{ background: 'none', border: 'none', color: 'var(--text-accent)', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                <Edit3 size={12} /> Edit
              </button>
            )}
          </div>
          <div style={{ backgroundColor: 'var(--bg-primary)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.8125rem', fontWeight: 500 }}>Referral Needed?</span>
              <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: selectedJob.referralNeeded ? '#fb923c' : 'var(--text-muted)' }}>
                {selectedJob.referralNeeded ? '⚡ Yes (Required/Preferred)' : 'No / Self Apply'}
              </span>
            </div>
            
            <div style={{ borderTop: '1px dashed var(--border-color)', paddingTop: '12px' }}>
              {isEditingReferral ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Contact Name</label>
                    <input type="text" value={referralForm.name} onChange={e => setReferralForm({...referralForm, name: e.target.value})} placeholder="E.g. John Doe" style={{ padding: '8px 10px', fontSize: '0.8125rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-tertiary)', color: 'var(--text-primary)', outline: 'none' }} onFocus={e => e.target.style.borderColor = 'var(--border-focus)'} onBlur={e => e.target.style.borderColor = 'var(--border-color)'} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Role / Relationship</label>
                    <input type="text" value={referralForm.role} onChange={e => setReferralForm({...referralForm, role: e.target.value})} placeholder="E.g. Senior SWE" style={{ padding: '8px 10px', fontSize: '0.8125rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-tertiary)', color: 'var(--text-primary)', outline: 'none' }} onFocus={e => e.target.style.borderColor = 'var(--border-focus)'} onBlur={e => e.target.style.borderColor = 'var(--border-color)'} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Email Address</label>
                    <input type="email" value={referralForm.email} onChange={e => setReferralForm({...referralForm, email: e.target.value})} placeholder="john@company.com" style={{ padding: '8px 10px', fontSize: '0.8125rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-tertiary)', color: 'var(--text-primary)', outline: 'none' }} onFocus={e => e.target.style.borderColor = 'var(--border-focus)'} onBlur={e => e.target.style.borderColor = 'var(--border-color)'} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>LinkedIn Profile</label>
                    <input type="url" value={referralForm.linkedin} onChange={e => setReferralForm({...referralForm, linkedin: e.target.value})} placeholder="https://linkedin.com/in/..." style={{ padding: '8px 10px', fontSize: '0.8125rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-tertiary)', color: 'var(--text-primary)', outline: 'none' }} onFocus={e => e.target.style.borderColor = 'var(--border-focus)'} onBlur={e => e.target.style.borderColor = 'var(--border-color)'} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '4px' }}>
                    <button onClick={() => setIsEditingReferral(false)} style={{ padding: '6px 12px', fontSize: '0.75rem', background: 'transparent', color: 'var(--text-muted)', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
                    <button onClick={() => { updateJob({ id: selectedJob.id, patch: { referralContactName: referralForm.name, referralContactRole: referralForm.role, referralContactEmail: referralForm.email, referralContactLinkedIn: referralForm.linkedin }}); setIsEditingReferral(false); }} style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 12px', fontSize: '0.75rem', background: 'var(--border-focus)', color: 'white', border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontWeight: 600 }}><Save size={13} /> Save</button>
                  </div>
                </div>
              ) : selectedJob.referralContactName || selectedJob.referralContactEmail || selectedJob.referralContactLinkedIn ? (
                <div style={{ display: 'grid', gap: '10px' }}>
                  {selectedJob.referralContactName && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Contact Name</span>
                      <span style={{ fontSize: '0.8125rem', fontWeight: 600 }}>{selectedJob.referralContactName} <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>({selectedJob.referralContactRole || 'Connection'})</span></span>
                    </div>
                  )}
                  {selectedJob.referralContactEmail && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Email Address</span>
                      <a href={`mailto:${selectedJob.referralContactEmail}`} style={{ color: 'var(--text-accent)', fontSize: '0.8125rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Mail size={13} /> {selectedJob.referralContactEmail}
                      </a>
                    </div>
                  )}
                  {selectedJob.referralContactLinkedIn && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>LinkedIn Profile</span>
                      <a href={selectedJob.referralContactLinkedIn.startsWith('http') ? selectedJob.referralContactLinkedIn : `https://${selectedJob.referralContactLinkedIn}`} target="_blank" rel="noreferrer" style={{ color: '#60a5fa', fontSize: '0.8125rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Globe size={13} /> View Profile
                      </a>
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ color: 'var(--text-muted)', fontSize: '0.8125rem', fontStyle: 'italic', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '8px' }}>
                  No referral pipeline established.
                  <button onClick={() => setIsEditingReferral(true)} style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)', padding: '4px 10px', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}><Edit3 size={12} /> Add Referral Details</button>
                </div>
              )}
            </div>
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
        )}
      </aside>
    </>
  );
};
