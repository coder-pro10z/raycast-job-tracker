import React, { useState } from 'react';
import { OUTREACH_PROFILES } from '../../data/outreachTemplates';
import { useJobStore } from '../../state/useJobStore';
import { Copy, Check, Mail, Globe, Code2 } from 'lucide-react';

export const ColdOutreachWorkspace: React.FC = () => {
  const { userProfile } = useJobStore();
  const [activeProfileId, setActiveProfileId] = useState<string>(OUTREACH_PROFILES[0].id);
  const [activeTab, setActiveTab] = useState<'email' | 'linkedin'>('email');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const activeProfile = OUTREACH_PROFILES.find(p => p.id === activeProfileId) || OUTREACH_PROFILES[0];
  const templates = activeTab === 'email' ? activeProfile.emailTemplates : activeProfile.linkedinTemplates;

  // Helpers for formatting
  const generateSignature = () => {
    const lines = [
      userProfile.fullName || 'Praveen',
      userProfile.linkedinUrl && `${userProfile.linkedinUrl}`,
      userProfile.githubUrl && `${userProfile.githubUrl}`,
      userProfile.email && `${userProfile.email}`,
      userProfile.phone && `${userProfile.phone}`
    ].filter(Boolean);
    
    return '\nBest regards,\n' + lines.join('\n');
  };

  const interpolate = (text: string) => {
    let result = text;
    result = result.replace(/\{recruiterName\}/g, '[Recruiter Name]');
    result = result.replace(/\{company\}/g, '[Company Name]');
    result = result.replace(/\{yoe\}/g, userProfile.yoe || '[Years]');
    result = result.replace(/\{strengths\}/g, userProfile.keyStrengths || '[Key Strengths]');
    result = result.replace(/\{github\}/g, userProfile.githubUrl || '[Github Profile]');
    result = result.replace(/\{signature\}/g, generateSignature());
    return result;
  };

  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(interpolate(text));
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div style={{ display: 'flex', height: '100%', width: '100%', backgroundColor: 'var(--bg-primary)' }}>
      {/* Profiles Sidebar */}
      <div style={{ width: '280px', borderRight: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-secondary)', overflowY: 'auto' }}>
        <div style={{ padding: '24px 20px 16px', borderBottom: '1px solid var(--border-color)', position: 'sticky', top: 0, backgroundColor: 'var(--bg-secondary)', zIndex: 10 }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Code2 size={20} style={{ color: '#38bdf8' }}/> 
            Profiles
          </h2>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', margin: '8px 0 0 0' }}>Select a target role</p>
        </div>
        
        <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {OUTREACH_PROFILES.map(profile => (
            <button
              key={profile.id}
              onClick={() => setActiveProfileId(profile.id)}
              style={{
                textAlign: 'left', padding: '12px 16px', borderRadius: 'var(--radius-md)', border: 'none',
                backgroundColor: activeProfileId === profile.id ? 'var(--bg-active)' : 'transparent',
                color: activeProfileId === profile.id ? 'var(--text-primary)' : 'var(--text-secondary)',
                fontWeight: activeProfileId === profile.id ? 600 : 500, fontSize: '0.875rem',
                cursor: 'pointer', transition: 'all 150ms ease'
              }}
              className="glow-hover"
            >
              {profile.title}
            </button>
          ))}
        </div>
      </div>

      {/* Main Template Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
        {/* Header Tabs */}
        <div style={{ padding: '24px 32px 0', borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-primary)' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 24px 0' }}>
            {activeProfile.title} Templates
          </h1>
          
          <div style={{ display: 'flex', gap: '24px' }}>
            <button
              onClick={() => setActiveTab('email')}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px', padding: '0 0 12px 0', border: 'none', background: 'none', cursor: 'pointer',
                color: activeTab === 'email' ? 'var(--text-primary)' : 'var(--text-muted)',
                fontWeight: activeTab === 'email' ? 700 : 500,
                borderBottom: activeTab === 'email' ? '2px solid #38bdf8' : '2px solid transparent'
              }}
            >
              <Mail size={18} /> Cold Email
            </button>
            <button
              onClick={() => setActiveTab('linkedin')}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px', padding: '0 0 12px 0', border: 'none', background: 'none', cursor: 'pointer',
                color: activeTab === 'linkedin' ? 'var(--text-primary)' : 'var(--text-muted)',
                fontWeight: activeTab === 'linkedin' ? 700 : 500,
                borderBottom: activeTab === 'linkedin' ? '2px solid #0a66c2' : '2px solid transparent'
              }}
            >
              <Globe size={18} /> LinkedIn Connection
            </button>
          </div>
        </div>

        {/* Template List */}
        <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {templates.map((template, index) => (
            <div key={template.id} style={{ backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-tertiary)' }}>
                <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Template {index + 1}
                </span>
                <button
                  onClick={() => copyToClipboard(template.id, template.subject ? `${template.subject}\n\n${template.body}` : template.body)}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-elevated)', color: 'var(--text-primary)', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600, transition: 'all 150ms ease' }}
                  className="glow-hover"
                >
                  {copiedId === template.id ? <><Check size={14} style={{color: '#34d399'}}/> Copied!</> : <><Copy size={14}/> Copy {activeTab === 'email' ? 'All' : 'Text'}</>}
                </button>
              </div>
              
              <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {template.subject && (
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 600, width: '60px' }}>Subject:</span>
                    <span style={{ color: 'var(--text-primary)', fontSize: '0.9375rem', fontWeight: 500 }}>{interpolate(template.subject)}</span>
                  </div>
                )}
                
                {template.subject && <div style={{ height: '1px', backgroundColor: 'var(--border-color)', margin: '8px 0' }} />}
                
                <div style={{ whiteSpace: 'pre-wrap', color: 'var(--text-secondary)', fontSize: '0.9375rem', lineHeight: 1.6, fontFamily: 'var(--font-mono)' }}>
                  {interpolate(template.body)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
