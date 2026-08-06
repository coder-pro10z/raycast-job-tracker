import React, { useState, useEffect, useMemo } from 'react';
import type { JobItem } from '../../types/job';
import { Copy, Check, Mail, MessageSquare, Send, Sparkles, RefreshCw, User, FileText } from 'lucide-react';
import { useJobStore } from '../../state/useJobStore';

interface OutreachStudioProps {
  job: JobItem;
}

type ChannelType = 'linkedin-note' | 'inmail' | 'cold-email' | 'referral';

export const OutreachStudio: React.FC<OutreachStudioProps> = ({ job }) => {
  const { userProfile, setSettingsModalOpen } = useJobStore();
  const [activeChannel, setActiveChannel] = useState<ChannelType>('linkedin-note');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  
  const yoe = userProfile.yoe || '3+ years';
  const strengths = userProfile.keyStrengths || 'building scalable architectures';
  const portfolioUrl = userProfile.githubUrl || '';
  const myName = userProfile.fullName || 'Applicant';

  // Derive relevant tech stack string
  const formattedTech = useMemo(() => {
    if (job.techStack && job.techStack.length > 0) {
      const topTech = job.techStack.slice(0, 3);
      if (topTech.length === 1) return topTech[0];
      if (topTech.length === 2) return `${topTech[0]} & ${topTech[1]}`;
      return `${topTech.slice(0, -1).join(', ')} & ${topTech[topTech.length - 1]}`;
    }
    return job.domain === 'cloud' ? 'Azure, DevOps & Docker' : '.NET Core, C# & React';
  }, [job]);

  // Determine ideal recipient names
  const recruiterName = useMemo(() => {
    const name = job.hrRecruiterName?.trim();
    if (!name) return 'Hiring Team';
    if (name.toLowerCase().includes('hiring') || name.toLowerCase().includes('team') || name.toLowerCase().includes('recruiter')) {
      return name;
    }
    return name.split(' ')[0]; // Use first name otherwise
  }, [job]);

  const referralName = useMemo(() => {
    const name = job.referralContactName?.trim();
    if (!name) return 'Engineering Team';
    if (name.toLowerCase().includes('team')) return name;
    return name.split(' ')[0];
  }, [job]);

  // Generate templates based on active parameters
  const generateTemplate = (channel: ChannelType) => {
    const portfolioText = portfolioUrl.trim() ? ` You can view my technical portfolio and recent projects here: ${portfolioUrl.trim()}` : '';
    
    // Dynamic signature builder
    let signature = `\n\nBest regards,\n${myName}`;
    if (userProfile.currentRole) signature += `\n${userProfile.currentRole}`;
    if (userProfile.email) signature += `\nE: ${userProfile.email}`;
    if (userProfile.phone) signature += `\nPh: ${userProfile.phone}`;
    if (userProfile.linkedinUrl) signature += `\nLinkedIn: ${userProfile.linkedinUrl}`;

    switch (channel) {
      case 'linkedin-note': {
        const name = job.hrRecruiterName ? recruiterName : 'there';
        return `Hi ${name}, I noticed the ${job.targetRole} opening at ${job.companyName}! With ${yoe} experience specializing in ${formattedTech}, I'd love to connect and share how my background in ${strengths} can support your engineering goals at ${job.companyName}.`;
      }
      case 'inmail': {
        const name = job.hrRecruiterName ? recruiterName : `${job.companyName} Hiring Team`;
        return `Hi ${name},\n\nI hope you're having a great week! I came across the ${job.targetRole} position at ${job.companyName} and was immediately drawn to your engineering culture and product focus.\n\nWith ${yoe} of hands-on experience in ${formattedTech}, I have specialized in ${strengths}. I am confident that my practical problem-solving mindset and technical depth make me an exceptionally strong match for this role.${portfolioText}\n\nI have already submitted my application via the portal and would welcome the opportunity to discuss how I can deliver immediate impact for your team.${signature}`;
      }
      case 'cold-email': {
        const name = job.hrRecruiterName ? recruiterName : 'Hiring Team';
        const body = `Hi ${name},\n\nI am writing to express my strong interest in the ${job.targetRole} position at ${job.companyName} (${job.location}).\n\nThroughout my career over the past ${yoe}, I have focused heavily on ${formattedTech}. Here is a brief snapshot of how my background aligns with what you are building:\n\n• Core Competence: Deep hands-on expertise in ${formattedTech}.\n• Key Strengths: Demonstrated track record in ${strengths}.\n• Work Style: Highly autonomous, adaptable, and aligned with ${job.workMode || 'modern'} collaboration models.\n\n${portfolioUrl.trim() ? `My complete technical profile and past projects can be explored at: ${portfolioUrl.trim()}\n\n` : ''}I have attached my resume for your review and would love to schedule a brief 15-minute introductory call to explore how I can add immediate engineering value to ${job.companyName}.${signature}`;
        return body;
      }
      case 'referral': {
        return `Hi ${referralName},\n\nI came across your profile while exploring the engineering work happening at ${job.companyName}! I really admire the innovative scale your team is operating at.\n\nI am currently preparing my application for the ${job.targetRole} role. Coming from a background of ${yoe} working deeply in ${formattedTech} and ${strengths}, I feel excited about contributing to ${job.companyName}'s roadmap.\n\nIf you have a brief moment, I would be deeply grateful to learn a bit about your personal experience working on the team, and whether you might be open to supporting my application with an employee referral link.${portfolioText}\n\nThanks so much for your time and guidance!${signature}`;
      }
    }
  };

  const emailSubject = `Application & Intro: ${job.targetRole} (${yoe} in ${formattedTech}) — ${myName}`;

  const [messageText, setMessageText] = useState<string>(() => generateTemplate(activeChannel));
  const [subjectText, setSubjectText] = useState<string>(emailSubject);

  // Regulate when channel or job changes
  useEffect(() => {
    setMessageText(generateTemplate(activeChannel));
    setSubjectText(`Application & Intro: ${job.targetRole} (${yoe} in ${formattedTech}) — ${myName}`);
  }, [activeChannel, job, yoe, strengths, portfolioUrl, formattedTech, myName]);

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleMailto = () => {
    const targetEmail = job.hrRecruiterEmail || job.referralContactEmail || '';
    const subject = encodeURIComponent(subjectText);
    const body = encodeURIComponent(messageText);
    const mailtoUrl = `mailto:${targetEmail}?subject=${subject}&body=${body}`;
    window.location.href = mailtoUrl;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      
      {/* Scrollable Pitch Studio Body */}
      <div style={{ flex: '1', overflowY: 'auto', padding: 'var(--space-4) var(--space-6)' }}>
        
        {/* Global Settings Trigger Card */}
        <div style={{
          backgroundColor: 'var(--bg-primary)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-color)',
          marginBottom: '20px',
          padding: '12px 16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <User size={15} style={{ color: 'var(--text-accent)' }} />
              <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)' }}>Outreach Profile Active</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Using global settings for <strong style={{ color: 'var(--text-secondary)' }}>{myName}</strong> ({yoe})
            </div>
          </div>
          <button
            onClick={() => setSettingsModalOpen(true)}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '6px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)',
              background: 'var(--bg-tertiary)', color: 'var(--text-primary)', fontSize: '0.75rem', fontWeight: 600,
              cursor: 'pointer'
            }}
            className="glow-hover focus-ring"
          >
            Edit Profile
          </button>
        </div>

        {/* Channel Navigation Pills */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '16px' }}>
          <button
            onClick={() => setActiveChannel('linkedin-note')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--border-color)',
              backgroundColor: activeChannel === 'linkedin-note' ? '#2563eb' : 'var(--bg-tertiary)',
              color: activeChannel === 'linkedin-note' ? '#ffffff' : 'var(--text-secondary)',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 150ms ease'
            }}
          >
            <MessageSquare size={13} />
            <span>LinkedIn Note (&lt;300 chars)</span>
          </button>

          <button
            onClick={() => setActiveChannel('inmail')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--border-color)',
              backgroundColor: activeChannel === 'inmail' ? '#6366f1' : 'var(--bg-tertiary)',
              color: activeChannel === 'inmail' ? '#ffffff' : 'var(--text-secondary)',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 150ms ease'
            }}
          >
            <Send size={13} />
            <span>LinkedIn InMail</span>
          </button>

          <button
            onClick={() => setActiveChannel('cold-email')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--border-color)',
              backgroundColor: activeChannel === 'cold-email' ? '#059669' : 'var(--bg-tertiary)',
              color: activeChannel === 'cold-email' ? '#ffffff' : 'var(--text-secondary)',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 150ms ease'
            }}
          >
            <Mail size={13} />
            <span>Cold Email</span>
          </button>

          <button
            onClick={() => setActiveChannel('referral')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--border-color)',
              backgroundColor: activeChannel === 'referral' ? '#d97706' : 'var(--bg-tertiary)',
              color: activeChannel === 'referral' ? '#ffffff' : 'var(--text-secondary)',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 150ms ease'
            }}
          >
            <Sparkles size={13} />
            <span>Peer Referral</span>
          </button>
        </div>

        {/* Dynamic Recipient Metadata Badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 12px',
          backgroundColor: 'var(--bg-tertiary)',
          borderLeft: '4px solid #a855f7',
          borderRadius: '4px',
          marginBottom: '12px',
          fontSize: '0.75rem',
          flexWrap: 'wrap',
          gap: '8px'
        }}>
          <div>
            <span style={{ color: 'var(--text-muted)', marginRight: '6px' }}>Target Company:</span>
            <strong style={{ color: 'var(--text-primary)' }}>{job.companyName} ({job.targetRole})</strong>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)', marginRight: '6px' }}>Key Stack:</span>
            <span style={{ color: '#818cf8', fontWeight: 600 }}>{formattedTech}</span>
          </div>
        </div>

        {/* Email Subject Field (Only when Email or InMail channel active) */}
        {activeChannel === 'cold-email' && (
          <div style={{ marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <FileText size={13} />
                <span>Subject Line:</span>
              </label>
              <button
                onClick={() => handleCopy(subjectText, 'subject')}
                style={{ background: 'none', border: 'none', color: 'var(--text-accent)', cursor: 'pointer', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                {copiedField === 'subject' ? <Check size={12} style={{ color: '#10b981' }} /> : <Copy size={12} />}
                <span>{copiedField === 'subject' ? 'Copied Subject!' : 'Copy'}</span>
              </button>
            </div>
            <input
              type="text"
              value={subjectText}
              onChange={(e) => setSubjectText(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-primary)',
                color: 'var(--text-primary)',
                fontSize: '0.8125rem',
                fontWeight: 600,
                outline: 'none'
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = 'var(--border-focus)'}
              onBlur={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}
            />
          </div>
        )}

        {/* Message Editor Area */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>Generated Pitch (Editable Preview):</span>
              {activeChannel === 'linkedin-note' && (
                <span style={{ 
                  fontWeight: 800,
                  fontSize: '0.6875rem',
                  padding: '1px 6px',
                  borderRadius: '4px',
                  backgroundColor: messageText.length <= 300 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                  color: messageText.length <= 300 ? '#10b981' : '#ef4444'
                }}>
                  {messageText.length} / 300 chars
                </span>
              )}
            </label>
            
            <button
              onClick={() => setMessageText(generateTemplate(activeChannel))}
              title="Reset message to default variables"
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <RefreshCw size={11} />
              <span>Reset</span>
            </button>
          </div>

          <textarea
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            style={{
              width: '100%',
              minHeight: activeChannel === 'linkedin-note' ? '120px' : '260px',
              padding: '12px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              backgroundColor: 'var(--bg-primary)',
              color: 'var(--text-primary)',
              fontSize: '0.875rem',
              lineHeight: 1.5,
              outline: 'none',
              resize: 'vertical',
              fontFamily: 'inherit'
            }}
            onFocus={(e) => e.currentTarget.style.borderColor = 'var(--border-focus)'}
            onBlur={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}
          />
        </div>
      </div>

      {/* Action Footer Bar */}
      <div style={{
        padding: '12px var(--space-6)',
        borderTop: '1px solid var(--border-color)',
        backgroundColor: 'var(--bg-tertiary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        flexWrap: 'wrap'
      }}>
        <button
          onClick={() => handleCopy(messageText, 'message')}
          style={{
            flex: '1',
            minWidth: '160px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            borderRadius: 'var(--radius-sm)',
            border: 'none',
            backgroundColor: 'var(--border-focus)',
            color: '#ffffff',
            fontWeight: 700,
            fontSize: '0.875rem',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-md)',
            transition: 'all 150ms ease'
          }}
          className="glow-hover"
        >
          {copiedField === 'message' ? <Check size={17} /> : <Copy size={17} />}
          <span>{copiedField === 'message' ? 'Message Copied!' : 'Copy to Clipboard'}</span>
        </button>

        <button
          onClick={handleMailto}
          style={{
            height: '40px',
            padding: '0 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-color)',
            backgroundColor: 'var(--bg-secondary)',
            color: 'var(--text-primary)',
            fontWeight: 600,
            fontSize: '0.8125rem',
            cursor: 'pointer',
            transition: 'all 150ms ease'
          }}
          className="glow-hover"
        >
          <Mail size={16} style={{ color: '#10b981' }} />
          <span>Launch Email App</span>
        </button>
      </div>
    </div>
  );
};
