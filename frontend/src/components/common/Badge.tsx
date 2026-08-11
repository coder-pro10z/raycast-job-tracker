import React from 'react';
import type { ApplicationStatus, Priority } from '../../types/job';

interface BadgeProps {
  type: 'status' | 'priority' | 'tech' | 'custom';
  value: ApplicationStatus | Priority | string;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({ type, value, size = 'sm' }) => {
  const getStyle = (): { bg: string; color: string; border?: string } => {
    if (type === 'priority') {
      const v = value.toLowerCase();
      if (v === 'high' || v === 'urgent') {
        return { bg: 'var(--priority-high-bg)', color: 'var(--priority-high-text)' };
      }
      if (v === 'medium') {
        return { bg: 'var(--priority-medium-bg)', color: 'var(--priority-medium-text)' };
      }
      return { bg: 'var(--priority-low-bg)', color: 'var(--priority-low-text)' };
    }

    if (type === 'status') {
      const v = value.toLowerCase();
      if (v.includes('not started') || v.includes('ready')) {
        return { bg: 'var(--status-ready-bg)', color: 'var(--status-ready-text)' };
      }
      if (v.includes('applied') || v.includes('sent')) {
        return { bg: 'var(--status-applied-bg)', color: 'var(--status-applied-text)' };
      }
      if (v.includes('interview') || v.includes('review')) {
        return { bg: 'var(--status-interview-bg)', color: 'var(--status-interview-text)' };
      }
      if (v.includes('offer')) {
        return { bg: 'var(--status-offer-bg)', color: 'var(--status-offer-text)' };
      }
      if (v.includes('reject') || v.includes('archive')) {
        return { bg: 'var(--status-rejected-bg)', color: 'var(--status-rejected-text)' };
      }
      return { bg: 'var(--bg-elevated)', color: 'var(--text-secondary)' };
    }

    if (type === 'tech') {
      return {
        bg: 'var(--bg-tertiary)',
        color: 'var(--text-accent)',
        border: '1px solid var(--border-color)'
      };
    }

    return { bg: 'var(--bg-elevated)', color: 'var(--text-primary)' };
  };

  const style = getStyle();
  const padding = size === 'sm' ? 'var(--space-1) var(--space-2)' : 'var(--space-1) var(--space-3)';
  const fontSize = size === 'sm' ? 'var(--text-xs)' : 'var(--text-sm)';

  return (
    <span
      className={type === 'tech' ? 'font-mono' : 'font-sans'}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding,
        fontSize,
        fontWeight: 'var(--weight-semibold)',
        lineHeight: '1.25',
        borderRadius: 'var(--radius-full)',
        backgroundColor: style.bg,
        color: style.color,
        border: style.border || 'none',
        whiteSpace: 'nowrap',
        transition: 'all 150ms ease'
      }}
    >
      {value}
    </span>
  );
};
