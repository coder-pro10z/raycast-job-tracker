import React, { useState, useEffect, useRef } from 'react';
import type { JobItem, UserProfile } from '../../types/job';
import { useUpdateJob } from '../../hooks/useJobs';
import { useJobStore } from '../../state/useJobStore';
import { assembleFullOutreachEmail } from '../../services/emailAssembler';
import {
  composeOutreachEmail,
  inferCompanyScale,
  type WorkModeType,
  type CompanyScaleType,
  type OutreachAngleType
} from '../../services/composableOutreachEngine';
import {
  X,
  Minus,
  Maximize2,
  Minimize2,
  ExternalLink,
  Copy,
  Check,
  CheckCircle2,
  Sparkles,
  Bold,
  Italic,
  List,
  Link2,
  Trash2,
  Mail,
  Building2,
  Globe,
  Users,
  ChevronDown,
  ChevronUp,
  RotateCcw
} from 'lucide-react';

export type EditorWindowState = 'docked' | 'maximized' | 'minimized';

interface GmailDraftEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: JobItem | null;
  userProfile: UserProfile;
}

export const GmailDraftEditorModal: React.FC<GmailDraftEditorModalProps> = ({
  isOpen,
  onClose,
  job,
  userProfile
}) => {
  const { showToast } = useJobStore();
  const updateJobMutation = useUpdateJob();

  // Window State: 'docked' (bottom-right 580x540), 'maximized' (center 840x680), 'minimized' (pill 320x42)
  const [windowState, setWindowState] = useState<EditorWindowState>('docked');

  // Form Fields
  const [to, setTo] = useState('');
  const [showCcBcc, setShowCcBcc] = useState(false);
  const [cc, setCc] = useState('');
  const [bcc, setBcc] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [copied, setCopied] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'idle'>('idle');

  // Matrix Intelligence Controls
  const [showIntelligenceBar, setShowIntelligenceBar] = useState(true);
  const [workMode, setWorkMode] = useState<WorkModeType>('Remote');
  const [companyScale, setCompanyScale] = useState<CompanyScaleType | 'auto'>('auto');
  const [outreachAngle, setOutreachAngle] = useState<OutreachAngleType>('recruiter-direct');

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Initialize form fields when job changes
  useEffect(() => {
    if (job) {
      setTo(job.hrRecruiterName || '');
      setSubject(job.outreachSubject || `${job.targetRole} Application – ${userProfile.fullName || 'Praveen Kashyap'}`);

      // Synthesize full publication-ready draft if missing or preview is brief
      const initialBody = assembleFullOutreachEmail(job, userProfile);
      setBody(initialBody);

      // Work Mode alignment
      let mode: WorkModeType = 'Remote';
      if (job.workMode) {
        const wmLower = job.workMode.toLowerCase();
        if (wmLower.includes('hybrid')) mode = 'Hybrid';
        else if (wmLower.includes('onsite') || wmLower.includes('office')) mode = 'Onsite';
      }
      setWorkMode(mode);

      // Inferred Scale
      setCompanyScale(inferCompanyScale(job.companyName));
      setOutreachAngle('recruiter-direct');
      setIsDirty(false);
      setSaveStatus('saved');
    }
  }, [job, userProfile]);

  // Debounced Auto-Save back to Job Record
  useEffect(() => {
    if (!job || !isDirty) return;

    setSaveStatus('saving');
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);

    debounceTimerRef.current = setTimeout(async () => {
      try {
        await updateJobMutation.mutateAsync({
          id: job.id,
          patch: {
            hrRecruiterName: to.trim(),
            outreachSubject: subject.trim(),
            outreachBodyPreview: body.trim()
          }
        });
        setSaveStatus('saved');
      } catch (err) {
        setSaveStatus('idle');
      }
    }, 600);

    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [to, subject, body, isDirty, job, updateJobMutation]);

  if (!isOpen || !job) return null;

  const userEmail = userProfile.email || '2pkashyap2001@gmail.com';
  const authParam = userEmail ? `authuser=${encodeURIComponent(userEmail)}&` : '';

  // Calculate Gmail compose web URL
  const getGmailComposeUrl = () => {
    const encTo = encodeURIComponent(to.trim());
    const encSu = encodeURIComponent(subject.trim());
    const encBody = encodeURIComponent(body.trim());
    const ccParam = cc.trim() ? `&cc=${encodeURIComponent(cc.trim())}` : '';
    const bccParam = bcc.trim() ? `&bcc=${encodeURIComponent(bcc.trim())}` : '';
    return `https://mail.google.com/mail/u/?${authParam}view=cm&fs=1&to=${encTo}&su=${encSu}&body=${encBody}${ccParam}${bccParam}`;
  };

  // Re-synthesize using the Composable Matrix Engine
  const handleResynthesize = () => {
    const result = composeOutreachEmail({
      companyName: job.companyName,
      targetRole: job.targetRole,
      workMode,
      companyScale: companyScale !== 'auto' ? companyScale : undefined,
      outreachAngle,
      recruiterName: to.trim(),
      profile: userProfile
    });

    setSubject(result.subject);
    setBody(result.body);
    setIsDirty(true);
    showToast(`Draft re-synthesized for ${workMode} • ${companyScale.toUpperCase()}!`);
  };

  // Reset to default publication-ready draft
  const handleResetToDefault = () => {
    const freshBody = assembleFullOutreachEmail(job, userProfile);
    setBody(freshBody);
    setIsDirty(true);
    showToast('Reset draft to foundational template.');
  };

  // Copy email to clipboard
  const handleCopy = () => {
    const textToCopy = `Subject: ${subject}\n\n${body}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    showToast('Copied subject and body to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  // Mark job as applied and save
  const handleMarkApplied = async () => {
    try {
      await updateJobMutation.mutateAsync({
        id: job.id,
        patch: {
          applicationStatus: 'Applied',
          appliedDate: new Date().toISOString().slice(0, 10),
          automatorStatus: 'Sent',
          outreachSubject: subject.trim(),
          outreachBodyPreview: body.trim(),
          notes: job.notes ? `${job.notes}\n[Applied via Native Dark Gmail Editor]` : 'Applied via Native Dark Gmail Editor'
        }
      });
      showToast(`Marked ${job.companyName} as Applied!`);
      onClose();
    } catch (err) {
      showToast('Failed to update status');
    }
  };

  // Text formatting helpers (injects markdown into textarea selection)
  const formatSelection = (prefix: string, suffix: string = prefix) => {
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const text = el.value;
    const selected = text.substring(start, end);
    const replacement = `${prefix}${selected || 'text'}${suffix}`;
    const nextBody = text.substring(0, start) + replacement + text.substring(end);
    setBody(nextBody);
    setIsDirty(true);

    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + prefix.length, start + prefix.length + (selected ? selected.length : 4));
    }, 20);
  };

  // Word & character stats
  const wordCount = body.trim() ? body.trim().split(/\s+/).length : 0;
  const charCount = body.length;

  // Minimized Window Pill (Docked bottom-right tab)
  if (windowState === 'minimized') {
    return (
      <div
        onClick={() => setWindowState('docked')}
        style={{
          position: 'fixed',
          bottom: 0,
          right: '24px',
          width: '320px',
          height: '42px',
          backgroundColor: 'var(--bg-tertiary)',
          border: '1px solid var(--border-color)',
          borderBottom: 'none',
          borderRadius: '8px 8px 0 0',
          boxShadow: 'var(--shadow-lg)',
          zIndex: 1200,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 12px',
          cursor: 'pointer',
          transition: 'all 150ms ease'
        }}
        title="Click to expand draft"
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#3b82f6', flexShrink: 0 }} />
          <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            Draft: {job.companyName} – {job.targetRole}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <button
            onClick={(e) => { e.stopPropagation(); setWindowState('docked'); }}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
          >
            <Maximize2 size={13} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onClose(); }}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
          >
            <X size={13} />
          </button>
        </div>
      </div>
    );
  }

  // Maximized Overlay Container or Docked Window Box
  const isMax = windowState === 'maximized';

  const modalStyle: React.CSSProperties = isMax ? {
    width: '840px',
    height: '700px',
    maxHeight: '92vh',
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    borderRadius: 'var(--radius-lg)',
    boxShadow: '0 20px 45px rgba(0,0,0,0.65)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  } : {
    position: 'fixed',
    bottom: 0,
    right: '24px',
    width: '580px',
    height: '560px',
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    borderBottom: 'none',
    borderRadius: '12px 12px 0 0',
    boxShadow: '0 -8px 32px rgba(0,0,0,0.5)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    zIndex: 1200
  };

  const content = (
    <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
      {/* 1. The Header Bar */}
      <div style={{
        padding: '10px 14px',
        backgroundColor: 'var(--bg-tertiary)',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        cursor: 'default'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
          <div style={{
            width: '24px',
            height: '24px',
            borderRadius: '6px',
            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            flexShrink: 0
          }}>
            <Mail size={13} />
          </div>
          <span style={{
            fontSize: '0.8125rem',
            fontWeight: 600,
            color: 'var(--text-primary)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            {job.companyName} — {job.targetRole}
          </span>
          <span style={{
            padding: '2px 6px',
            fontSize: '0.625rem',
            fontWeight: 600,
            borderRadius: '10px',
            backgroundColor: 'rgba(59, 130, 246, 0.15)',
            color: '#60a5fa',
            flexShrink: 0
          }}>
            {job.automatorStatus || 'Draft'}
          </span>
        </div>

        {/* Window Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            onClick={() => setWindowState('minimized')}
            title="Minimize to pill"
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '4px',
              borderRadius: '4px'
            }}
            className="hover-bg"
          >
            <Minus size={14} />
          </button>
          <button
            onClick={() => setWindowState(isMax ? 'docked' : 'maximized')}
            title={isMax ? 'Restore to bottom-right' : 'Maximize window'}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '4px',
              borderRadius: '4px'
            }}
            className="hover-bg"
          >
            {isMax ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
          </button>
          <button
            onClick={onClose}
            title="Close editor"
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '4px',
              borderRadius: '4px'
            }}
            className="hover-bg"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* 2. Recipient Stack */}
      <div style={{
        padding: '8px 14px',
        borderBottom: '1px solid var(--border-color)',
        backgroundColor: 'var(--bg-secondary)',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px'
      }}>
        {/* From Row */}
        <div style={{ display: 'flex', alignItems: 'center', fontSize: '0.75rem' }}>
          <span style={{ width: '56px', color: 'var(--text-muted)', fontWeight: 500 }}>From</span>
          <span style={{
            color: 'var(--text-secondary)',
            backgroundColor: 'var(--bg-tertiary)',
            padding: '2px 8px',
            borderRadius: '4px',
            border: '1px solid var(--border-color)',
            fontSize: '0.71875rem'
          }}>
            {userEmail} (Default Sender)
          </span>
        </div>

        {/* To Row */}
        <div style={{ display: 'flex', alignItems: 'center', fontSize: '0.75rem' }}>
          <span style={{ width: '56px', color: 'var(--text-muted)', fontWeight: 500 }}>To</span>
          <input
            type="email"
            value={to}
            onChange={(e) => { setTo(e.target.value); setIsDirty(true); }}
            placeholder="Recruiter email (e.g. talent@company.com)"
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              fontSize: '0.8125rem',
              color: 'var(--text-primary)'
            }}
          />
          <button
            type="button"
            onClick={() => setShowCcBcc(!showCcBcc)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--accent-primary)',
              fontSize: '0.6875rem',
              cursor: 'pointer',
              padding: '2px 4px'
            }}
          >
            {showCcBcc ? 'Hide Cc/Bcc' : 'Cc Bcc'}
          </button>
        </div>

        {/* Optional Cc / Bcc */}
        {showCcBcc && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', paddingTop: '4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', fontSize: '0.75rem' }}>
              <span style={{ width: '56px', color: 'var(--text-muted)', fontWeight: 500 }}>Cc</span>
              <input
                type="email"
                value={cc}
                onChange={(e) => setCc(e.target.value)}
                placeholder="optional cc"
                style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: '0.75rem', color: 'var(--text-primary)' }}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', fontSize: '0.75rem' }}>
              <span style={{ width: '56px', color: 'var(--text-muted)', fontWeight: 500 }}>Bcc</span>
              <input
                type="email"
                value={bcc}
                onChange={(e) => setBcc(e.target.value)}
                placeholder="optional bcc"
                style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: '0.75rem', color: 'var(--text-primary)' }}
              />
            </div>
          </div>
        )}

        {/* Subject Row */}
        <div style={{ display: 'flex', alignItems: 'center', fontSize: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '4px' }}>
          <span style={{ width: '56px', color: 'var(--text-muted)', fontWeight: 500 }}>Subject</span>
          <input
            type="text"
            value={subject}
            onChange={(e) => { setSubject(e.target.value); setIsDirty(true); }}
            placeholder="Subject Line"
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              fontSize: '0.8125rem',
              fontWeight: 600,
              color: 'var(--text-primary)'
            }}
          />
        </div>
      </div>

      {/* 3. Outreach Intelligence Bar (Matrix Toggles) */}
      <div style={{
        padding: '6px 14px',
        backgroundColor: 'var(--bg-primary)',
        borderBottom: '1px solid var(--border-color)',
        fontSize: '0.6875rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button
            onClick={() => setShowIntelligenceBar(!showIntelligenceBar)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-secondary)',
              fontSize: '0.6875rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              cursor: 'pointer',
              padding: 0
            }}
          >
            <Sparkles size={11} color="var(--accent-primary)" />
            <span>Outreach Intelligence Matrix</span>
            {showIntelligenceBar ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
          </button>

          <span style={{ color: 'var(--text-muted)', fontSize: '0.6875rem' }}>
            {wordCount} words • {charCount} chars
          </span>
        </div>

        {showIntelligenceBar && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '6px',
            marginTop: '6px',
            paddingTop: '6px',
            borderTop: '1px dashed var(--border-color)'
          }}>
            {/* Work Mode Toggle */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
              <Globe size={11} color="var(--text-muted)" />
              <div style={{ display: 'flex', gap: '2px', flex: 1 }}>
                {(['Remote', 'Hybrid', 'Onsite'] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setWorkMode(m)}
                    style={{
                      flex: 1,
                      padding: '2px 4px',
                      fontSize: '0.625rem',
                      borderRadius: '3px',
                      border: '1px solid',
                      borderColor: workMode === m ? 'var(--accent-primary)' : 'var(--border-color)',
                      backgroundColor: workMode === m ? 'var(--accent-primary)' : 'transparent',
                      color: workMode === m ? '#fff' : 'var(--text-secondary)',
                      cursor: 'pointer'
                    }}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Company Scale Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
              <Building2 size={11} color="var(--text-muted)" />
              <select
                value={companyScale}
                onChange={(e) => setCompanyScale(e.target.value as any)}
                style={{
                  flex: 1,
                  padding: '2px 4px',
                  fontSize: '0.625rem',
                  backgroundColor: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '3px',
                  color: 'var(--text-primary)',
                  outline: 'none'
                }}
              >
                <option value="auto">Auto-Detect Scale</option>
                <option value="startup">Startup (0-1)</option>
                <option value="mid-size">Mid-Size (Scale-up)</option>
                <option value="mnc">MNC / Big Tech</option>
                <option value="service">Service / IT Solutions</option>
                <option value="high-comp-product">High-Comp Quant/FinTech</option>
              </select>
            </div>

            {/* Angle Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
              <Users size={11} color="var(--text-muted)" />
              <select
                value={outreachAngle}
                onChange={(e) => setOutreachAngle(e.target.value as any)}
                style={{
                  flex: 1,
                  padding: '2px 4px',
                  fontSize: '0.625rem',
                  backgroundColor: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '3px',
                  color: 'var(--text-primary)',
                  outline: 'none'
                }}
              >
                <option value="recruiter-direct">Recruiter (&lt;120w)</option>
                <option value="hiring-manager-technical">Hiring Manager</option>
                <option value="peer-referral">Peer Referral</option>
              </select>
            </div>

            {/* Re-Synthesize Trigger */}
            <button
              type="button"
              onClick={handleResynthesize}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
                padding: '3px 8px',
                fontSize: '0.625rem',
                fontWeight: 600,
                backgroundColor: 'rgba(59, 130, 246, 0.15)',
                color: '#60a5fa',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                borderRadius: '3px',
                cursor: 'pointer'
              }}
            >
              <Sparkles size={10} />
              <span>Apply Matrix</span>
            </button>
          </div>
        )}
      </div>

      {/* 4. Formatting Tools Sub-bar */}
      <div style={{
        padding: '4px 14px',
        backgroundColor: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
          <button
            type="button"
            onClick={() => formatSelection('**', '**')}
            title="Bold (**text**)"
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '3px 5px', borderRadius: '3px' }}
            className="hover-bg"
          >
            <Bold size={12} />
          </button>
          <button
            type="button"
            onClick={() => formatSelection('*', '*')}
            title="Italic (*text*)"
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '3px 5px', borderRadius: '3px' }}
            className="hover-bg"
          >
            <Italic size={12} />
          </button>
          <button
            type="button"
            onClick={() => formatSelection('• ', '')}
            title="Bullet point (• item)"
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '3px 5px', borderRadius: '3px' }}
            className="hover-bg"
          >
            <List size={12} />
          </button>
          <button
            type="button"
            onClick={() => formatSelection('[', '](url)')}
            title="Link ([Title](url))"
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '3px 5px', borderRadius: '3px' }}
            className="hover-bg"
          >
            <Link2 size={12} />
          </button>
        </div>

        <div style={{ width: '1px', height: '14px', backgroundColor: 'var(--border-color)' }} />

        <button
          type="button"
          onClick={handleResetToDefault}
          title="Reset to default pitch"
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            fontSize: '0.6875rem',
            display: 'flex',
            alignItems: 'center',
            gap: '3px',
            cursor: 'pointer',
            padding: '2px 4px'
          }}
        >
          <RotateCcw size={10} />
          <span>Reset</span>
        </button>

        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '6px' }}>
          {saveStatus === 'saving' && (
            <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>Saving...</span>
          )}
          {saveStatus === 'saved' && (
            <span style={{ fontSize: '0.6875rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '3px' }}>
              <Check size={11} /> Saved
            </span>
          )}
        </div>
      </div>

      {/* 5. Main Editor Area */}
      <div style={{ flex: 1, padding: '12px 14px', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
        <textarea
          ref={textareaRef}
          value={body}
          onChange={(e) => { setBody(e.target.value); setIsDirty(true); }}
          placeholder="Draft your outreach email pitch here..."
          style={{
            flex: 1,
            width: '100%',
            height: '100%',
            minHeight: '220px',
            backgroundColor: 'transparent',
            border: 'none',
            outline: 'none',
            resize: 'none',
            fontSize: '0.8125rem',
            lineHeight: 1.6,
            color: 'var(--text-primary)',
            fontFamily: 'inherit'
          }}
        />
      </div>

      {/* 6. Footer Multi-Action Toolbar */}
      <div style={{
        padding: '10px 14px',
        backgroundColor: 'var(--bg-tertiary)',
        borderTop: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '10px'
      }}>
        {/* Action Group */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {/* Primary: Open in Gmail Web */}
          <a
            href={getGmailComposeUrl()}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              fontSize: '0.75rem',
              fontWeight: 600,
              backgroundColor: 'var(--accent-primary)',
              color: '#fff',
              borderRadius: 'var(--radius-sm)',
              textDecoration: 'none',
              boxShadow: '0 2px 8px rgba(59, 130, 246, 0.35)',
              cursor: 'pointer'
            }}
          >
            <span>Open in Gmail Web</span>
            <ExternalLink size={12} />
          </a>

          {/* Secondary: Copy to Clipboard */}
          <button
            type="button"
            onClick={handleCopy}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              padding: '6px 12px',
              fontSize: '0.75rem',
              fontWeight: 500,
              backgroundColor: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer'
            }}
          >
            {copied ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
            <span>{copied ? 'Copied' : 'Copy Formatted'}</span>
          </button>

          {/* Tertiary: Mark Applied & Save */}
          {job.applicationStatus !== 'Applied' && (
            <button
              type="button"
              onClick={handleMarkApplied}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '6px 12px',
                fontSize: '0.75rem',
                fontWeight: 500,
                backgroundColor: 'rgba(16, 185, 129, 0.12)',
                color: '#10b981',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer'
              }}
            >
              <CheckCircle2 size={12} />
              <span>Mark as Applied</span>
            </button>
          )}
        </div>

        {/* Trash / Discard Action */}
        <button
          type="button"
          onClick={onClose}
          title="Close editor"
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '6px',
            borderRadius: '4px'
          }}
          className="hover-bg"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );

  // If Maximized, wrap in backdrop overlay; if docked, render directly anchored at bottom-right
  if (isMax) {
    return (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.65)',
          backdropFilter: 'blur(5px)',
          zIndex: 1200,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px'
        }}
        onClick={onClose}
      >
        {content}
      </div>
    );
  }

  return content;
};
