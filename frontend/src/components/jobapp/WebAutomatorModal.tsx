import React, { useState } from 'react';
import { useJobStore } from '../../state/useJobStore';
import { useCreateJob } from '../../hooks/useJobs';
import { 
  X, 
  Sparkles, 
  Mail, 
  Smartphone, 
  Cloud, 
  Check, 
  Copy, 
  ExternalLink, 
  Laptop,
  CheckCircle2,
  Terminal,
  Play,
  FileText
} from 'lucide-react';
import { FOUNDATIONAL_DRAFTS, interpolateDraft } from '../../data/foundationalDrafts';

interface WebAutomatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WebAutomatorModal: React.FC<WebAutomatorModalProps> = ({ isOpen, onClose }) => {
  const { userProfile, currentUser, showToast } = useJobStore();
  const createJobMutation = useCreateJob();

  const [activeTab, setActiveTab] = useState<'generator' | 'cloud' | 'local'>('generator');

  // Generator State
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [recruiterEmail, setRecruiterEmail] = useState('');
  const [jdText, setJdText] = useState('');
  const [domain, setDomain] = useState<'sde' | 'cloud' | 'dual'>('sde');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('auto');
  
  // Output State
  const [generating, setGenerating] = useState(false);
  const [generatedSubject, setGeneratedSubject] = useState('');
  const [generatedBody, setGeneratedBody] = useState('');
  const [savedJobId, setSavedJobId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleGenerate = () => {
    if (!company.trim() || !role.trim()) {
      showToast('Please enter at least the Company Name and Role.');
      return;
    }

    setGenerating(true);

    setTimeout(() => {
      let template = selectedTemplateId !== 'auto' ? FOUNDATIONAL_DRAFTS.find(t => t.id === selectedTemplateId) : undefined;
      if (!template) {
        const lowerCompany = company.toLowerCase();
        const lowerRole = role.toLowerCase();

        // Check company-specific blueprints first
        if (lowerCompany.includes('uber')) {
          template = FOUNDATIONAL_DRAFTS.find(t => t.id === 'top-uber');
        } else if (lowerCompany.includes('netflix')) {
          template = FOUNDATIONAL_DRAFTS.find(t => t.id === 'top-netflix');
        } else if (lowerCompany.includes('google') || lowerCompany.includes('alphabet')) {
          template = FOUNDATIONAL_DRAFTS.find(t => t.id === 'top-google');
        } else if (lowerCompany.includes('meta') || lowerCompany.includes('facebook') || lowerCompany.includes('instagram')) {
          template = FOUNDATIONAL_DRAFTS.find(t => t.id === 'top-meta');
        } else if (lowerCompany.includes('apple')) {
          template = FOUNDATIONAL_DRAFTS.find(t => t.id === 'top-apple');
        } else if (lowerCompany.includes('airbnb')) {
          template = FOUNDATIONAL_DRAFTS.find(t => t.id === 'top-airbnb');
        } else if (lowerCompany.includes('amazon') || lowerCompany.includes('aws')) {
          template = FOUNDATIONAL_DRAFTS.find(t => t.id === 'top-amazon');
        } else if (lowerCompany.includes('microsoft') || lowerCompany.includes('azure')) {
          template = FOUNDATIONAL_DRAFTS.find(t => t.id === 'top-microsoft');
        } else if (lowerCompany.includes('nvidia')) {
          template = FOUNDATIONAL_DRAFTS.find(t => t.id === 'top-nvidia');
        } else if (lowerCompany.includes('stripe')) {
          template = FOUNDATIONAL_DRAFTS.find(t => t.id === 'top-stripe');
        } else if (lowerCompany.includes('atlassian') || lowerCompany.includes('jira') || lowerCompany.includes('confluence')) {
          template = FOUNDATIONAL_DRAFTS.find(t => t.id === 'top-atlassian');
        } else if (lowerCompany.includes('razorpay') || lowerCompany.includes('phonepe') || lowerCompany.includes('paytm') || lowerCompany.includes('cred')) {
          template = FOUNDATIONAL_DRAFTS.find(t => t.id === 'top-fintech-india');
        } else if (lowerCompany.includes('flipkart') || lowerCompany.includes('zomato') || lowerCompany.includes('swiggy') || lowerCompany.includes('meesho') || lowerCompany.includes('blinkit') || lowerCompany.includes('zepto')) {
          template = FOUNDATIONAL_DRAFTS.find(t => t.id === 'top-ecommerce-dispatch');
        } else if (lowerCompany.includes('salesforce') || lowerCompany.includes('adobe') || lowerCompany.includes('servicenow') || lowerCompany.includes('paypal') || lowerCompany.includes('oracle') || lowerCompany.includes('sap') || lowerCompany.includes('cisco') || lowerCompany.includes('qualcomm')) {
          template = FOUNDATIONAL_DRAFTS.find(t => t.id === 'top-enterprise-saas');
        } else if (domain === 'cloud' || lowerRole.includes('cloud') || lowerRole.includes('devops') || lowerRole.includes('sre') || lowerRole.includes('infra')) {
          template = FOUNDATIONAL_DRAFTS.find(t => t.id === 'cloud-platform-devops') || FOUNDATIONAL_DRAFTS[0];
        } else if (lowerRole.includes('backend') || lowerRole.includes('system') || lowerRole.includes('distributed')) {
          template = FOUNDATIONAL_DRAFTS.find(t => t.id === 'sde-distributed-backend') || FOUNDATIONAL_DRAFTS[0];
        } else {
          template = FOUNDATIONAL_DRAFTS.find(t => t.id === 'sde-fullstack-product') || FOUNDATIONAL_DRAFTS[0];
        }
      }

      const activeTemplate = template || FOUNDATIONAL_DRAFTS[0];

      const { subject, body } = interpolateDraft(activeTemplate, userProfile, {
        companyName: company.trim(),
        targetRole: role.trim(),
        hrRecruiterName: recruiterEmail.trim()
      });

      setGeneratedSubject(subject);
      setGeneratedBody(body);
      setGenerating(false);
      showToast(`Outreach email synthesized using template: ${activeTemplate.title}!`);
    }, 400);
  };

  const handleSaveToNextApply = async () => {
    try {
      const newJob = await createJobMutation.mutateAsync({
        companyName: company.trim(),
        targetRole: role.trim(),
        domain: domain,
        location: 'Remote',
        workMode: 'Remote',
        priority: 'High',
        applicationStatus: 'Applied',
        hrRecruiterName: recruiterEmail.trim() || 'Recruiting Team',
        gmailDraftId: `web-${Date.now()}`,
        automatorStatus: 'Draft Created',
        outreachSubject: generatedSubject,
        outreachBodyPreview: generatedBody,
        appliedDate: new Date().toISOString().slice(0, 10),
        notes: `Generated via Online Web/Mobile Automator for ${company}.`
      });

      setSavedJobId(newJob.id);
      showToast(`Tracked ${company} in NextApply!`);
    } catch (err) {
      showToast('Failed to save to NextApply');
    }
  };

  const getGmailComposeUrl = () => {
    const userEmail = currentUser?.email || userProfile.email || '2pkashyap2001@gmail.com';
    const authParam = userEmail ? `authuser=${encodeURIComponent(userEmail)}&` : '';
    const to = encodeURIComponent(recruiterEmail.trim());
    const su = encodeURIComponent(generatedSubject);
    const body = encodeURIComponent(generatedBody);
    return `https://mail.google.com/mail/u/?${authParam}view=cm&fs=1&to=${to}&su=${su}&body=${body}`;
  };

  const copyOutreach = () => {
    const full = `Subject: ${generatedSubject}\n\n${generatedBody}`;
    navigator.clipboard.writeText(full);
    setCopied(true);
    showToast('Copied email to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(6px)',
        zIndex: 1100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '720px',
          maxHeight: '92vh',
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-xl)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--border-color)',
          backgroundColor: 'var(--bg-tertiary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff'
            }}>
              <Smartphone size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                Mobile & Online Automator Studio
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
                Run outreach synthesis from ANY device without needing Python or Windows installed.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '6px'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid var(--border-color)',
          backgroundColor: 'var(--bg-secondary)',
          padding: '0 16px'
        }}>
          <button
            onClick={() => setActiveTab('generator')}
            style={{
              padding: '10px 14px',
              fontSize: '0.8125rem',
              fontWeight: 600,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: activeTab === 'generator' ? 'var(--text-accent)' : 'var(--text-muted)',
              borderBottom: activeTab === 'generator' ? '2px solid var(--text-accent)' : '2px solid transparent',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Smartphone size={14} />
            <span>Web & Mobile Generator</span>
          </button>
          <button
            onClick={() => setActiveTab('cloud')}
            style={{
              padding: '10px 14px',
              fontSize: '0.8125rem',
              fontWeight: 600,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: activeTab === 'cloud' ? 'var(--text-accent)' : 'var(--text-muted)',
              borderBottom: activeTab === 'cloud' ? '2px solid var(--text-accent)' : '2px solid transparent',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Cloud size={14} />
            <span>Cloud Runner (GitHub Actions)</span>
          </button>
          <button
            onClick={() => setActiveTab('local')}
            style={{
              padding: '10px 14px',
              fontSize: '0.8125rem',
              fontWeight: 600,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: activeTab === 'local' ? 'var(--text-accent)' : 'var(--text-muted)',
              borderBottom: activeTab === 'local' ? '2px solid var(--text-accent)' : '2px solid transparent',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Laptop size={14} />
            <span>1-Click Machine Setup</span>
          </button>
        </div>

        {/* Content Body */}
        <div style={{ padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* TAB 1: In-Browser / Mobile Generator */}
          {activeTab === 'generator' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{
                padding: '10px 14px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'rgba(59, 130, 246, 0.08)',
                border: '1px solid rgba(59, 130, 246, 0.2)',
                fontSize: '0.75rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.4
              }}>
                <strong>Mobile & Zero-Install Ready:</strong> Paste the JD or role details below. We synthesize a grounded cold email and give you a 1-tap button to open Gmail with everything pre-filled directly on your phone or desktop.
              </div>

              {/* Form Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                    Company Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. OpenAI, Stripe, Amazon"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      fontSize: '0.8125rem',
                      backgroundColor: 'var(--bg-tertiary)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-sm)',
                      color: 'var(--text-primary)'
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                    Target Role *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Senior Software Engineer"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      fontSize: '0.8125rem',
                      backgroundColor: 'var(--bg-tertiary)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-sm)',
                      color: 'var(--text-primary)'
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                    Recruiter / Contact Email
                  </label>
                  <input
                    type="email"
                    placeholder="e.g. recruiter@company.com"
                    value={recruiterEmail}
                    onChange={(e) => setRecruiterEmail(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      fontSize: '0.8125rem',
                      backgroundColor: 'var(--bg-tertiary)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-sm)',
                      color: 'var(--text-primary)'
                    }}
                  />
                </div>

                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
                    <FileText size={12} /> Outreach Blueprint / Foundational Draft
                  </label>
                  <select
                    value={selectedTemplateId}
                    onChange={(e) => setSelectedTemplateId(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      fontSize: '0.8125rem',
                      backgroundColor: 'var(--bg-tertiary)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-sm)',
                      color: 'var(--text-primary)',
                      outline: 'none'
                    }}
                  >
                    <option value="auto">Auto-Select Best Blueprint (Recommended)</option>
                    <optgroup label="Top Product / High-Comp (MAANG & Global ~₹68–95 LPA)">
                      {FOUNDATIONAL_DRAFTS.filter(d => d.category === 'Top Product / High-Comp (MAANG & Global)').map(d => (
                        <option key={d.id} value={d.id}>{d.title} ({d.ctcBand})</option>
                      ))}
                    </optgroup>
                    <optgroup label="Tier-1 FinTech & Unicorns (India ~₹40–48 LPA)">
                      {FOUNDATIONAL_DRAFTS.filter(d => d.category === 'Tier-1 FinTech & Unicorns (India)').map(d => (
                        <option key={d.id} value={d.id}>{d.title} ({d.ctcBand})</option>
                      ))}
                    </optgroup>
                    <optgroup label="SDE & Full Stack Archetypes">
                      {FOUNDATIONAL_DRAFTS.filter(d => d.category === 'SDE / Full Stack').map(d => (
                        <option key={d.id} value={d.id}>{d.title}</option>
                      ))}
                    </optgroup>
                    <optgroup label="Cloud, Platform & DevOps Archetypes">
                      {FOUNDATIONAL_DRAFTS.filter(d => d.category === 'Cloud & DevOps').map(d => (
                        <option key={d.id} value={d.id}>{d.title}</option>
                      ))}
                    </optgroup>
                    <optgroup label="Specialized, Networking & Referrals">
                      {FOUNDATIONAL_DRAFTS.filter(d => d.category === 'Specialized & Networking').map(d => (
                        <option key={d.id} value={d.id}>{d.title}</option>
                      ))}
                    </optgroup>
                  </select>
                </div>
              </div>

              {/* Domain & JD Text Area */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                    Job Description / Notes (Paste text from screenshot or job post)
                  </label>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {(['sde', 'cloud', 'dual'] as const).map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setDomain(d)}
                        style={{
                          padding: '2px 8px',
                          fontSize: '0.6875rem',
                          borderRadius: '4px',
                          border: '1px solid',
                          borderColor: domain === d ? 'var(--border-focus)' : 'var(--border-color)',
                          backgroundColor: domain === d ? 'var(--bg-active)' : 'transparent',
                          color: domain === d ? 'var(--text-primary)' : 'var(--text-muted)',
                          cursor: 'pointer'
                        }}
                      >
                        {d === 'sde' ? 'SDE Track' : d === 'cloud' ? 'Cloud Track' : 'Dual Track'}
                      </button>
                    ))}
                  </div>
                </div>

                <textarea
                  rows={4}
                  placeholder="Paste snippet or JD requirements here (e.g. Looking for 3+ years experience with C#, microservices, React, and cloud architecture...)"
                  value={jdText}
                  onChange={(e) => setJdText(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    fontSize: '0.8125rem',
                    backgroundColor: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--text-primary)',
                    resize: 'vertical'
                  }}
                />
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={handleGenerate}
                disabled={generating}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '10px',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                  color: '#fff',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  cursor: 'pointer'
                }}
                className="glow-hover"
              >
                <Sparkles size={16} />
                <span>{generating ? 'Synthesizing Tailored Outreach...' : 'Generate Tailored Outreach'}</span>
              </button>

              {/* Output Preview */}
              {generatedSubject && (
                <div style={{
                  marginTop: '8px',
                  padding: '14px',
                  backgroundColor: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-accent)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                      <Mail size={14} />
                      <span>Generated Outreach (Ready for 1-Tap Send)</span>
                    </span>
                    <button
                      type="button"
                      onClick={copyOutreach}
                      style={{
                        background: 'transparent',
                        border: '1px solid var(--border-color)',
                        borderRadius: '4px',
                        padding: '2px 8px',
                        color: 'var(--text-secondary)',
                        fontSize: '0.6875rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      {copied ? <Check size={12} style={{ color: '#10b981' }} /> : <Copy size={12} />}
                      <span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Subject:</div>
                    <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {generatedSubject}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Message:</div>
                    <pre style={{
                      fontSize: '0.75rem',
                      color: 'var(--text-secondary)',
                      whiteSpace: 'pre-wrap',
                      fontFamily: 'inherit',
                      margin: '4px 0 0 0',
                      lineHeight: 1.45
                    }}>
                      {generatedBody}
                    </pre>
                  </div>

                  {/* 1-Tap Action Bar */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '6px', flexWrap: 'wrap' }}>
                    <a
                      href={getGmailComposeUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        flex: 1,
                        minWidth: '180px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        padding: '8px 14px',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: '#ea4335',
                        color: '#fff',
                        fontWeight: 600,
                        fontSize: '0.8125rem',
                        textDecoration: 'none'
                      }}
                      className="glow-hover"
                    >
                      <Mail size={15} />
                      <span>Open Pre-filled in Gmail</span>
                      <ExternalLink size={13} />
                    </a>

                    <button
                      type="button"
                      onClick={handleSaveToNextApply}
                      style={{
                        flex: 1,
                        minWidth: '180px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        padding: '8px 14px',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: savedJobId ? 'rgba(34, 197, 94, 0.15)' : 'var(--bg-secondary)',
                        border: '1px solid',
                        borderColor: savedJobId ? '#22c55e' : 'var(--border-color)',
                        color: savedJobId ? '#22c55e' : 'var(--text-primary)',
                        fontWeight: 600,
                        fontSize: '0.8125rem',
                        cursor: 'pointer'
                      }}
                      className="glow-hover"
                    >
                      <CheckCircle2 size={15} />
                      <span>{savedJobId ? 'Saved & Tracked!' : 'Save & Track in NextApply'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: 24/7 Cloud Runner */}
          {activeTab === 'cloud' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{
                padding: '12px 14px',
                backgroundColor: 'rgba(139, 92, 246, 0.08)',
                border: '1px solid rgba(139, 92, 246, 0.2)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.8125rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.5
              }}>
                <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Cloud size={16} style={{ color: '#8b5cf6' }} />
                  Zero-OS Cloud Runner (GitHub Actions)
                </div>
                Run the Python sidecar 24/7 in the cloud on GitHub's free infrastructure without needing your computer turned on. Trigger it on a recurring schedule or with <strong>1 tap from your smartphone</strong> via the GitHub Mobile app!
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <h4 style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                  How to Trigger from Mobile Phone in 3 Steps:
                </h4>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div>1. Install <strong>GitHub Mobile</strong> on your phone (iOS / Android) or visit your GitHub repo in mobile Safari/Chrome.</div>
                  <div>2. Navigate to <strong>Actions → Gmail JD Automator - Cloud Runner</strong>.</div>
                  <div>3. Tap <strong>Run workflow</strong> → Select <code>draft</code> → Tap <strong>Run</strong>!</div>
                </div>
              </div>

              <div style={{
                padding: '10px 14px',
                backgroundColor: 'var(--bg-tertiary)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-color)',
                fontSize: '0.75rem',
                color: 'var(--text-muted)'
              }}>
                <strong>Required GitHub Secrets:</strong>
                <ul style={{ paddingLeft: '18px', marginTop: '6px', lineHeight: 1.5 }}>
                  <li><code>ANTHROPIC_API_KEY</code> — Your Claude API Key</li>
                  <li><code>GMAIL_CREDENTIALS_JSON</code> — Content of credentials.json</li>
                  <li><code>GMAIL_TOKEN_JSON</code> — Content of token.json</li>
                  <li><code>RESUME_BASE64</code> — Base64-encoded PDF resume</li>
                </ul>
              </div>
            </div>
          )}

          {/* TAB 3: 1-Click Local Machine Setup */}
          {activeTab === 'local' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{
                padding: '12px 14px',
                backgroundColor: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.2)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.8125rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.5
              }}>
                <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Laptop size={16} style={{ color: '#10b981' }} />
                  Automated Windows Setup Script
                </div>
                Double-click <code>setup-automator.bat</code> in the project root. It uses Windows Package Manager (<code>winget</code>) to install Python and Tesseract automatically, prepares your virtual environment, and installs requirements with 0 manual steps!
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                  Included 1-Click Launchers in Repository Root:
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ padding: '8px 12px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '4px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Terminal size={14} style={{ color: 'var(--text-accent)' }} />
                    <span><code>setup-automator.bat</code> — 1-click automated dependency installation</span>
                  </div>
                  <div style={{ padding: '8px 12px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '4px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Play size={14} style={{ color: 'var(--text-accent)' }} />
                    <span><code>run-automator.bat</code> — 1-click headless pipeline execution</span>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
