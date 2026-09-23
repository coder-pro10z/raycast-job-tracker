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
  CheckCircle2
} from 'lucide-react';

interface WebAutomatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WebAutomatorModal: React.FC<WebAutomatorModalProps> = ({ isOpen, onClose }) => {
  const { userProfile, showToast } = useJobStore();
  const createJobMutation = useCreateJob();

  const [activeTab, setActiveTab] = useState<'generator' | 'cloud' | 'local'>('generator');

  // Generator State
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [recruiterEmail, setRecruiterEmail] = useState('');
  const [jdText, setJdText] = useState('');
  const [domain, setDomain] = useState<'sde' | 'cloud' | 'dual'>('sde');
  
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

    // Simulate / execute AI tailored outreach synthesis grounded in active profile
    setTimeout(() => {
      const candidateName = userProfile.fullName || 'Candidate';
      const roleName = role.trim();
      const companyName = company.trim();
      
      const subject = `${roleName} Application – ${candidateName}`;
      
      const strengths = domain === 'cloud' 
        ? 'architecting resilient multi-region cloud infrastructure, container orchestration (Docker/K8s), and automated CI/CD pipelines'
        : 'building scalable distributed backends with .NET Core/C#, responsive React frontends, and cloud microservices';

      const body = `Hi,\n\n` +
        `I am writing to express my strong interest in the ${roleName} opportunity at ${companyName}.\n\n` +
        `With over ${userProfile.yoe || '3+ years'} of hands-on software engineering experience specializing in ${strengths}, I have consistently delivered robust systems and solved high-throughput technical challenges.\n\n` +
        `Having reviewed your opening, my background aligns closely with your team's tech stack and engineering standards. I have attached my resume for your review.\n\n` +
        `I would welcome the opportunity to discuss how my skillset can contribute to ${companyName}'s product goals.\n\n` +
        `Best regards,\n` +
        `${candidateName}\n` +
        `${userProfile.phone ? `${userProfile.phone}\n` : ''}` +
        `${userProfile.linkedinUrl || ''}`;

      setGeneratedSubject(subject);
      setGeneratedBody(body);
      setGenerating(false);
      showToast('Outreach email synthesized!');
    }, 600);
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
        outreachBodyPreview: generatedBody.slice(0, 150) + '...',
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
    const to = encodeURIComponent(recruiterEmail.trim());
    const su = encodeURIComponent(generatedSubject);
    const body = encodeURIComponent(generatedBody);
    return `https://mail.google.com/mail/?view=cm&fs=1&to=${to}&su=${su}&body=${body}`;
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
              borderBottom: activeTab === 'generator' ? '2px solid var(--text-accent)' : '2px solid transparent'
            }}
          >
            ⚡ In-Browser / Mobile Generator
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
              borderBottom: activeTab === 'cloud' ? '2px solid var(--text-accent)' : '2px solid transparent'
            }}
          >
            ☁️ 24/7 Cloud Runner (GitHub Actions)
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
              borderBottom: activeTab === 'local' ? '2px solid var(--text-accent)' : '2px solid transparent'
            }}
          >
            💻 1-Click Machine Setup
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
                📱 <strong>Mobile & Zero-Install Ready:</strong> Paste the JD or role details below. We synthesize a grounded cold email and give you a 1-tap button to open Gmail with everything pre-filled directly on your phone or desktop.
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
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-accent)' }}>
                      ✉️ Generated Outreach (Ready for 1-Tap Send)
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
                  <div style={{ padding: '8px 12px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '4px', fontSize: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>⚙️ <code>setup-automator.bat</code> — 1-click automated dependency installation</span>
                  </div>
                  <div style={{ padding: '8px 12px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '4px', fontSize: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>▶️ <code>run-automator.bat</code> — 1-click headless pipeline execution</span>
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
