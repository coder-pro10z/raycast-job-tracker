import React, { useState, useRef, useEffect } from 'react';
import { useJobStore } from '../../state/useJobStore';
import { LogOut, Settings, UserPlus, Check, ChevronDown } from 'lucide-react';

export const ProfileMenu: React.FC = () => {
  const { 
    currentUser, 
    usersList, 
    activeUserId, 
    switchUser, 
    logout, 
    setAuthModalOpen, 
    setSettingsModalOpen 
  } = useJobStore();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  const domainLabel = (domain?: string) => {
    if (domain === 'sde') return 'SDE';
    if (domain === 'cloud') return 'Cloud';
    return 'Dual';
  };

  return (
    <div ref={dropdownRef} style={{ position: 'relative' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        title="Active User Profile & Switcher"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          height: '36px',
          padding: '0 8px',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--border-color)',
          backgroundColor: 'var(--bg-tertiary)',
          color: 'var(--text-primary)',
          cursor: 'pointer',
          transition: 'all 150ms ease'
        }}
        className="glow-hover focus-ring"
      >
        <div style={{
          width: '26px',
          height: '26px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
          color: '#fff',
          fontSize: '0.6875rem',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {getInitials(currentUser?.fullName)}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', lineHeight: 1.1 }} className="desktop-only">
          <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)', maxWidth: '110px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {currentUser?.fullName || 'Sign In'}
          </span>
          <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
            {domainLabel(currentUser?.targetDomain)}
          </span>
        </div>

        <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} />
      </button>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            right: 0,
            width: '260px',
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-xl)',
            padding: '8px',
            zIndex: 100,
            display: 'flex',
            flexDirection: 'column',
            gap: '4px'
          }}
        >
          {/* Active User Header */}
          <div style={{ padding: '8px 10px', borderBottom: '1px solid var(--border-color)', marginBottom: '4px' }}>
            <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-primary)' }}>
              {currentUser?.fullName || 'Not Signed In'}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {currentUser?.email || 'Select or create a profile'}
            </div>
            {currentUser?.currentRole && (
              <div style={{ fontSize: '0.6875rem', color: 'var(--text-accent)', marginTop: '2px', fontWeight: 500 }}>
                {currentUser.currentRole}
              </div>
            )}
          </div>

          {/* Quick Switch Profiles */}
          <div style={{ padding: '4px 10px', fontSize: '0.6875rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Switch Account
          </div>

          {usersList.map((user) => {
            const isSelected = user.id === activeUserId;
            return (
              <button
                key={user.id}
                onClick={() => {
                  switchUser(user.id);
                  setIsOpen(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 10px',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  backgroundColor: isSelected ? 'var(--bg-tertiary)' : 'transparent',
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontSize: '0.8125rem'
                }}
                className="glow-hover"
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    backgroundColor: isSelected ? 'var(--text-accent)' : 'var(--bg-tertiary)',
                    color: isSelected ? '#fff' : 'var(--text-secondary)',
                    fontSize: '0.625rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {getInitials(user.fullName)}
                  </div>
                  <div>
                    <div style={{ fontWeight: isSelected ? 600 : 400 }}>{user.fullName}</div>
                    <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                      {domainLabel(user.targetDomain)}
                    </div>
                  </div>
                </div>
                {isSelected && <Check size={14} style={{ color: 'var(--text-accent)' }} />}
              </button>
            );
          })}

          <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '4px 0' }} />

          {/* Action: Profile Settings */}
          <button
            onClick={() => {
              setIsOpen(false);
              setSettingsModalOpen(true);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 10px',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              backgroundColor: 'transparent',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              fontSize: '0.8125rem'
            }}
            className="glow-hover"
          >
            <Settings size={15} style={{ color: 'var(--text-muted)' }} />
            <span>Profile & Preferences</span>
          </button>

          {/* Action: New Profile */}
          <button
            onClick={() => {
              setIsOpen(false);
              setAuthModalOpen(true);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 10px',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              backgroundColor: 'transparent',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              fontSize: '0.8125rem'
            }}
            className="glow-hover"
          >
            <UserPlus size={15} style={{ color: 'var(--text-muted)' }} />
            <span>New Profile / Sign In</span>
          </button>

          {/* Action: Logout */}
          <button
            onClick={() => {
              setIsOpen(false);
              logout();
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 10px',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              backgroundColor: 'transparent',
              color: '#ef4444',
              cursor: 'pointer',
              fontSize: '0.8125rem'
            }}
            className="glow-hover"
          >
            <LogOut size={15} />
            <span>Sign Out</span>
          </button>
        </div>
      )}
    </div>
  );
};
