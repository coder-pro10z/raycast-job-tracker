import React, { useState } from 'react';

export const PassphraseGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [unlocked, setUnlocked] = useState(!!localStorage.getItem('apiKey'));

  if (unlocked) return <>{children}</>;

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100vw', height: '100dvh', backgroundColor: 'var(--bg-primary)' }}>
      <form 
        onSubmit={(e) => {
          e.preventDefault();
          const key = (e.target as any).passphrase.value;
          if (key) {
             localStorage.setItem('apiKey', key);
             setUnlocked(true);
          }
        }}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          padding: '32px',
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-md)',
          width: '320px'
        }}
      >
        <h2 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1.2rem', textAlign: 'center' }}>NextApply Access</h2>
        <input 
          name="passphrase" 
          type="password" 
          placeholder="Enter API key" 
          autoFocus
          style={{
            padding: '10px 12px',
            backgroundColor: 'var(--bg-tertiary)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-primary)',
            borderRadius: 'var(--radius-sm)',
            outline: 'none',
            fontSize: '14px'
          }}
        />
        <button 
          type="submit"
          style={{
            padding: '10px 12px',
            backgroundColor: 'var(--accent-primary)',
            color: 'white',
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '14px'
          }}
        >
          Unlock Workspace
        </button>
      </form>
    </div>
  );
};
