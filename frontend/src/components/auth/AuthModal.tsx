import React, { useState } from 'react';
import { useJobStore } from '../../state/useJobStore';
import { X, Lock, Mail, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    setAuthModalOpen, 
    login, 
    signup, 
    showToast 
  } = useJobStore();

  const [tab, setTab] = useState<'login' | 'signup'>('login');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Login form state
  const [loginEmail, setLoginEmail] = useState<string>('');
  const [loginPassword, setLoginPassword] = useState<string>('Password123!');

  // Sign up form state
  const [signupForm, setSignupForm] = useState({
    fullName: '',
    email: '',
    password: '',
    targetDomain: 'dual',
    currentRole: '',
    yoe: '3-5 years',
    keyStrengths: '',
    linkedinUrl: '',
    phone: '',
    resumeSummary: ''
  });

  if (!isAuthModalOpen) return null;

  const handleQuickLogin = async (email: string) => {
    setSubmitting(true);
    setError(null);
    try {
      await login(email, 'Password123!');
      showToast(`Welcome back, ${email.split('@')[0]}!`);
      setAuthModalOpen(false);
    } catch (err: any) {
      setError(err.message || 'Quick login failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      setError('Please enter your email and password');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await login(loginEmail, loginPassword);
      showToast('Logged in successfully');
      setAuthModalOpen(false);
    } catch (err: any) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupForm.fullName || !signupForm.email || !signupForm.password) {
      setError('Please fill in Full Name, Email, and Password');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await signup(signupForm);
      showToast(`Profile created! Welcome, ${signupForm.fullName}`);
      setAuthModalOpen(false);
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div 
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.65)', backdropFilter: 'blur(6px)',
        zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px'
      }}
      onClick={() => {
        setAuthModalOpen(false);
      }}
    >
      <div 
        style={{
          width: '100%', maxWidth: tab === 'login' ? '460px' : '620px',
          backgroundColor: 'var(--bg-secondary)',
          borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-xl)', display: 'flex', flexDirection: 'column',
          maxHeight: '92vh', overflow: 'hidden',
          transition: 'max-width 200ms ease'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '18px 24px', borderBottom: '1px solid var(--border-color)',
          backgroundColor: 'var(--bg-tertiary)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: 'var(--radius-sm)',
              background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff'
            }}>
              <ShieldCheck size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                {tab === 'login' ? 'User Sign In' : 'Create User Profile'}
              </h2>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
                Centralized job catalog with private application statuses.
              </p>
            </div>
          </div>
          <button 
            onClick={() => setAuthModalOpen(false)}
            title="Close / Browse as Guest"
            style={{
              background: 'transparent', border: '1px solid var(--border-color)',
              color: 'var(--text-muted)', width: '30px', height: '30px', borderRadius: 'var(--radius-sm)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
            }}
            className="glow-hover"
          >
            <X size={16} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div style={{
          display: 'flex', borderBottom: '1px solid var(--border-color)',
          backgroundColor: 'var(--bg-secondary)'
        }}>
          <button
            onClick={() => { setTab('login'); setError(null); }}
            style={{
              flex: 1, padding: '12px 16px', border: 'none', background: 'none',
              fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer',
              color: tab === 'login' ? 'var(--text-accent)' : 'var(--text-muted)',
              borderBottom: tab === 'login' ? '2px solid var(--text-accent)' : '2px solid transparent'
            }}
          >
            Log In
          </button>
          <button
            onClick={() => { setTab('signup'); setError(null); }}
            style={{
              flex: 1, padding: '12px 16px', border: 'none', background: 'none',
              fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer',
              color: tab === 'signup' ? 'var(--text-accent)' : 'var(--text-muted)',
              borderBottom: tab === 'signup' ? '2px solid var(--text-accent)' : '2px solid transparent'
            }}
          >
            Create New Profile
          </button>
        </div>

        {/* Error notification banner */}
        {error && (
          <div style={{
            padding: '10px 20px', backgroundColor: 'rgba(239, 68, 68, 0.12)',
            borderBottom: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444',
            fontSize: '0.8125rem', fontWeight: 500
          }}>
            {error}
          </div>
        )}

        {/* Modal Body */}
        <div style={{ padding: '20px 24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          
          {tab === 'login' ? (
            <div>
              {/* Quick Switch / Seeded Accounts */}
              <div style={{
                marginBottom: '20px', padding: '14px', borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-color)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                  <Sparkles size={14} style={{ color: '#fbbf24' }} />
                  <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                    Quick Select Active Profile
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => handleQuickLogin('2pkashyap2001@gmail.com')}
                    disabled={submitting}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '10px 14px', borderRadius: '6px', border: '1px solid var(--border-color)',
                      backgroundColor: 'var(--bg-primary)', cursor: 'pointer', textAlign: 'left'
                    }}
                    className="glow-hover"
                  >
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)' }}>
                        👤 Praveen Kashyap
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        2pkashyap2001@gmail.com (SDE / FullStack)
                      </div>
                    </div>
                    <ArrowRight size={16} style={{ color: 'var(--text-accent)' }} />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickLogin('anamansari.0406@gmail.com')}
                    disabled={submitting}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '10px 14px', borderRadius: '6px', border: '1px solid var(--border-color)',
                      backgroundColor: 'var(--bg-primary)', cursor: 'pointer', textAlign: 'left'
                    }}
                    className="glow-hover"
                  >
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)' }}>
                        👤 Anam Ansari
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        anamansari.0406@gmail.com (Dual Domain)
                      </div>
                    </div>
                    <ArrowRight size={16} style={{ color: 'var(--text-accent)' }} />
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '14px 0' }}>
                <hr style={{ flex: 1, border: 'none', borderTop: '1px solid var(--border-color)' }} />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>OR SIGN IN WITH PASSWORD</span>
                <hr style={{ flex: 1, border: 'none', borderTop: '1px solid var(--border-color)' }} />
              </div>

              <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                    Email Address
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
                    <input 
                      type="email"
                      required
                      placeholder="e.g. praveen@example.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      style={{
                        width: '100%', padding: '10px 12px 10px 38px', fontSize: '0.875rem',
                        borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)',
                        backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', outline: 'none'
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                    Password
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
                    <input 
                      type="password"
                      required
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      style={{
                        width: '100%', padding: '10px 12px 10px 38px', fontSize: '0.875rem',
                        borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)',
                        backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', outline: 'none'
                      }}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    marginTop: '8px', padding: '12px', borderRadius: 'var(--radius-sm)',
                    border: 'none', backgroundColor: 'var(--text-accent)', color: '#fff',
                    fontWeight: 600, fontSize: '0.875rem', cursor: submitting ? 'wait' : 'pointer'
                  }}
                  className="glow-hover"
                >
                  {submitting ? 'Authenticating...' : 'Sign In'}
                </button>
              </form>
            </div>
          ) : (
            <form onSubmit={handleSignupSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Full Name *</label>
                  <input 
                    type="text"
                    required
                    placeholder="e.g. Alex Smith"
                    value={signupForm.fullName}
                    onChange={(e) => setSignupForm({ ...signupForm, fullName: e.target.value })}
                    style={{
                      padding: '10px 12px', fontSize: '0.875rem', borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-primary)',
                      color: 'var(--text-primary)', outline: 'none'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Email Address *</label>
                  <input 
                    type="email"
                    required
                    placeholder="alex@example.com"
                    value={signupForm.email}
                    onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                    style={{
                      padding: '10px 12px', fontSize: '0.875rem', borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-primary)',
                      color: 'var(--text-primary)', outline: 'none'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Password *</label>
                  <input 
                    type="password"
                    required
                    placeholder="Minimum 6 characters"
                    value={signupForm.password}
                    onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                    style={{
                      padding: '10px 12px', fontSize: '0.875rem', borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-primary)',
                      color: 'var(--text-primary)', outline: 'none'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Target Domain *</label>
                  <select
                    value={signupForm.targetDomain}
                    onChange={(e) => setSignupForm({ ...signupForm, targetDomain: e.target.value })}
                    style={{
                      padding: '10px 12px', fontSize: '0.875rem', borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-primary)',
                      color: 'var(--text-primary)', outline: 'none'
                    }}
                  >
                    <option value="sde">Software Engineering (SDE)</option>
                    <option value="cloud">Cloud / DevOps / Infra</option>
                    <option value="dual">Dual Domain / Full Stack</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Target Role</label>
                  <input 
                    type="text"
                    placeholder="e.g. Senior Software Engineer"
                    value={signupForm.currentRole}
                    onChange={(e) => setSignupForm({ ...signupForm, currentRole: e.target.value })}
                    style={{
                      padding: '10px 12px', fontSize: '0.875rem', borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-primary)',
                      color: 'var(--text-primary)', outline: 'none'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Years of Experience</label>
                  <input 
                    type="text"
                    placeholder="e.g. 5+ years"
                    value={signupForm.yoe}
                    onChange={(e) => setSignupForm({ ...signupForm, yoe: e.target.value })}
                    style={{
                      padding: '10px 12px', fontSize: '0.875rem', borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-primary)',
                      color: 'var(--text-primary)', outline: 'none'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Key Technical Strengths</label>
                <input 
                  type="text"
                  placeholder="e.g. React, TypeScript, C#, .NET Core, AWS, Kubernetes"
                  value={signupForm.keyStrengths}
                  onChange={(e) => setSignupForm({ ...signupForm, keyStrengths: e.target.value })}
                  style={{
                    padding: '10px 12px', fontSize: '0.875rem', borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-primary)',
                    color: 'var(--text-primary)', outline: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>LinkedIn Profile URL</label>
                  <input 
                    type="url"
                    placeholder="linkedin.com/in/..."
                    value={signupForm.linkedinUrl}
                    onChange={(e) => setSignupForm({ ...signupForm, linkedinUrl: e.target.value })}
                    style={{
                      padding: '10px 12px', fontSize: '0.875rem', borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-primary)',
                      color: 'var(--text-primary)', outline: 'none'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Phone Number (Optional)</label>
                  <input 
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={signupForm.phone}
                    onChange={(e) => setSignupForm({ ...signupForm, phone: e.target.value })}
                    style={{
                      padding: '10px 12px', fontSize: '0.875rem', borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-primary)',
                      color: 'var(--text-primary)', outline: 'none'
                    }}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                style={{
                  marginTop: '8px', padding: '12px', borderRadius: 'var(--radius-sm)',
                  border: 'none', backgroundColor: 'var(--text-accent)', color: '#fff',
                  fontWeight: 600, fontSize: '0.875rem', cursor: submitting ? 'wait' : 'pointer'
                }}
                className="glow-hover"
              >
                {submitting ? 'Creating Profile...' : 'Complete Registration & Start Tracking'}
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};
