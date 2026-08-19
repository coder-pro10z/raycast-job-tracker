import React, { useState } from 'react';
import { Send, Bug, Lightbulb, MessageCircle } from 'lucide-react';

export const SupportPage: React.FC = () => {
  const [issueType, setIssueType] = useState<'Bug' | 'Feature' | 'General'>('Bug');
  const [subject, setSubject] = useState('');
  const [details, setDetails] = useState('');

  const handleSendEmail = () => {
    const to = '2pkashyap2001+JobTrackerSupport@gmail.com';
    const emailSubject = encodeURIComponent([] );
    const emailBody = encodeURIComponent(
      Issue Type: \n\n +
      Details:\n\n\n +
      ---\n +
      App Version: 1.0.0\n +
      User Agent: 
    );

    window.location.href = \mailto:\?subject=\&body=\\;
  };

  return (
    <div style={{ padding: 'var(--space-6)', maxWidth: '800px', margin: '0 auto', width: '100%', animation: 'fadeIn 0.3s ease' }}>
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>
          Support & Feedback
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', lineHeight: 1.5 }}>
          Found a bug? Have a feature request? Let us know! Fill out the form below and it will open your default email client to send us a direct message.
        </p>
      </div>

      <div style={{ 
        backgroundColor: 'var(--bg-secondary)', 
        borderRadius: 'var(--radius-lg)', 
        border: '1px solid var(--border-color)', 
        padding: 'var(--space-6)',
        boxShadow: 'var(--shadow-sm)'
      }}>
        {/* Issue Type Selector */}
        <div style={{ marginBottom: 'var(--space-5)' }}>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '12px' }}>
            What kind of feedback do you have?
          </label>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {[
              { type: 'Bug', icon: Bug, label: 'Report a Bug' },
              { type: 'Feature', icon: Lightbulb, label: 'Feature Request' },
              { type: 'General', icon: MessageCircle, label: 'General Feedback' }
            ].map(option => (
              <button
                key={option.type}
                onClick={() => setIssueType(option.type as any)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '10px 16px',
                  borderRadius: 'var(--radius-md)',
                  border: issueType === option.type ? '1px solid var(--border-focus)' : '1px solid var(--border-color)',
                  backgroundColor: issueType === option.type ? 'rgba(56, 189, 248, 0.1)' : 'var(--bg-tertiary)',
                  color: issueType === option.type ? '#38bdf8' : 'var(--text-primary)',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  transition: 'all 0.2s ease'
                }}
              >
                <option.icon size={16} />
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Subject Input */}
        <div style={{ marginBottom: 'var(--space-5)' }}>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
            Brief Summary (Subject)
          </label>
          <input 
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder={issueType === 'Bug' ? "E.g., The sidebar doesn't open on mobile" : "E.g., Add dark mode toggle"}
            style={{
              width: '100%',
              padding: '12px 14px',
              backgroundColor: 'var(--bg-tertiary)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--text-primary)',
              fontSize: '0.9375rem',
              outline: 'none',
              transition: 'border-color 0.2s ease'
            }}
            onFocus={e => e.target.style.borderColor = 'var(--border-focus)'}
            onBlur={e => e.target.style.borderColor = 'var(--border-color)'}
          />
        </div>

        {/* Details Textarea */}
        <div style={{ marginBottom: 'var(--space-6)' }}>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
            Details
          </label>
          <textarea 
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder={issueType === 'Bug' ? "Please describe what happened, what you expected to happen, and any steps to reproduce the issue..." : "Tell us more about your idea..."}
            rows={8}
            style={{
              width: '100%',
              padding: '12px 14px',
              backgroundColor: 'var(--bg-tertiary)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--text-primary)',
              fontSize: '0.9375rem',
              outline: 'none',
              resize: 'vertical',
              fontFamily: 'inherit',
              lineHeight: 1.5,
              transition: 'border-color 0.2s ease'
            }}
            onFocus={e => e.target.style.borderColor = 'var(--border-focus)'}
            onBlur={e => e.target.style.borderColor = 'var(--border-color)'}
          />
        </div>

        {/* Submit Action */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--border-color)', paddingTop: 'var(--space-5)' }}>
          <button
            onClick={handleSendEmail}
            disabled={!subject.trim() || !details.trim()}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '12px 24px',
              backgroundColor: (!subject.trim() || !details.trim()) ? 'var(--bg-tertiary)' : 'var(--text-accent)',
              color: (!subject.trim() || !details.trim()) ? 'var(--text-muted)' : '#fff',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              fontWeight: 700,
              fontSize: '0.9375rem',
              cursor: (!subject.trim() || !details.trim()) ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: (!subject.trim() || !details.trim()) ? 'none' : '0 4px 12px rgba(56, 189, 248, 0.25)'
            }}
            onMouseEnter={e => {
              if (subject.trim() && details.trim()) {
                e.currentTarget.style.filter = 'brightness(1.1)';
              }
            }}
            onMouseLeave={e => {
              e.currentTarget.style.filter = 'none';
            }}
          >
            <Send size={18} />
            Open Mail Client
          </button>
        </div>
      </div>
    </div>
  );
};
