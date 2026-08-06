import React from 'react';
import { useJobStore } from '../../state/useJobStore';

export const Toast: React.FC = () => {
  const { toastMessage } = useJobStore();

  if (!toastMessage) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      left: '50%',
      transform: 'translateX(-50%)',
      backgroundColor: 'var(--bg-elevated)',
      color: 'var(--text-primary)',
      padding: '12px 24px',
      borderRadius: '30px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '0.875rem',
      fontWeight: 500,
      zIndex: 9999,
      border: '1px solid var(--border-color)',
      animation: 'toast-slide-up 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
    }}>
      {toastMessage}
    </div>
  );
};
