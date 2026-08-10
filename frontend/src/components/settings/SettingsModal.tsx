import React, { useState, useEffect } from 'react';
import { useJobStore } from '../../state/useJobStore';
import { X, User, Save, Code, Briefcase, Mail, Phone, Globe, Link } from 'lucide-react';
import type { UserProfile } from '../../types/job';

export const SettingsModal: React.FC = () => {
  const { isSettingsModalOpen, setSettingsModalOpen, userProfile, updateUserProfile } = useJobStore();
  
  // Local form state for editing before saving
  const [form, setForm] = useState<UserProfile>(userProfile);

  // Sync form when modal opens
  useEffect(() => {
    if (isSettingsModalOpen) {
      setForm(userProfile);
    }
  }, [isSettingsModalOpen, userProfile]);

  if (!isSettingsModalOpen) return null;

  const handleSave = () => {
    updateUserProfile(form);
    setSettingsModalOpen(false);
  };

  const handleClose = () => {
    setSettingsModalOpen(false);
  };

  return (
    <div 
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(4px)',
        zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px'
      }}
      onClick={handleClose}
    >
      <div 
        style={{
          width: '100%', maxWidth: '600px', backgroundColor: 'var(--bg-secondary)',
          borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-xl)', display: 'flex', flexDirection: 'column',
          maxHeight: '90vh'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '20px 24px', borderBottom: '1px solid var(--border-color)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: 'var(--radius-sm)',
              background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
            }}>
              <User size={18} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                Application Settings & Profile
              </h2>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
                Your global identity for auto-generating personalized Cold Emails and LinkedIn pitches.
              </p>
            </div>
          </div>
          <button 
            onClick={handleClose}
            style={{
              background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)',
              color: 'var(--text-muted)', width: '32px', height: '32px', borderRadius: 'var(--radius-sm)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
            }}
            className="glow-hover"
          >
            <X size={16} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div style={{ padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Section: Identity */}
          <div>
            <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Briefcase size={14} style={{ color: 'var(--text-accent)' }} /> 
              Professional Identity
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>Full Name</label>
                <input 
                  type="text" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  placeholder="e.g. John Doe"
                  style={{ padding: '10px 12px', fontSize: '0.875rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', outline: 'none' }}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>Current / Target Role</label>
                <input 
                  type="text" value={form.currentRole} onChange={(e) => setForm({ ...form, currentRole: e.target.value })}
                  placeholder="e.g. Senior Software Engineer"
                  style={{ padding: '10px 12px', fontSize: '0.875rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', outline: 'none' }}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>Years of Experience</label>
                <input 
                  type="text" value={form.yoe} onChange={(e) => setForm({ ...form, yoe: e.target.value })}
                  placeholder="e.g. 5+ years"
                  style={{ padding: '10px 12px', fontSize: '0.875rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', outline: 'none' }}
                />
              </div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '16px' }}>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>Key Technical Strengths</label>
              <textarea 
                value={form.keyStrengths} onChange={(e) => setForm({ ...form, keyStrengths: e.target.value })}
                placeholder="e.g. building scalable microservices and resilient cloud architectures"
                rows={2}
                style={{ padding: '10px 12px', fontSize: '0.875rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', outline: 'none', resize: 'vertical' }}
              />
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: 0 }} />

          {/* Section: Contact & Socials */}
          <div>
            <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Code size={14} style={{ color: 'var(--text-accent)' }} /> 
              Contact & Signature Details
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '4px' }}><Mail size={12}/> Email Address</label>
                <input 
                  type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="john@example.com"
                  style={{ padding: '10px 12px', fontSize: '0.875rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', outline: 'none' }}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '4px' }}><Phone size={12}/> Phone Number</label>
                <input 
                  type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+1 (555) 000-0000"
                  style={{ padding: '10px 12px', fontSize: '0.875rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', outline: 'none' }}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '4px' }}><Globe size={12}/> LinkedIn Profile</label>
                <input 
                  type="url" value={form.linkedinUrl} onChange={(e) => setForm({ ...form, linkedinUrl: e.target.value })}
                  placeholder="linkedin.com/in/..."
                  style={{ padding: '10px 12px', fontSize: '0.875rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', outline: 'none' }}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '4px' }}><Link size={12}/> GitHub / Portfolio</label>
                <input 
                  type="url" value={form.githubUrl} onChange={(e) => setForm({ ...form, githubUrl: e.target.value })}
                  placeholder="github.com/..."
                  style={{ padding: '10px 12px', fontSize: '0.875rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', outline: 'none' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '16px 24px', borderTop: '1px solid var(--border-color)',
          display: 'flex', justifyContent: 'flex-end', gap: '12px',
          backgroundColor: 'var(--bg-tertiary)', borderBottomLeftRadius: 'var(--radius-lg)', borderBottomRightRadius: 'var(--radius-lg)'
        }}>
          <button 
            onClick={handleClose}
            style={{
              padding: '10px 16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)',
              background: 'transparent', color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer'
            }}
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            style={{
              padding: '10px 20px', borderRadius: 'var(--radius-sm)', border: 'none',
              background: 'var(--text-accent)', color: 'white', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '6px'
            }}
          >
            <Save size={16} /> Save Profile
          </button>
        </div>
      </div>
    </div>
  );
};
