import React from 'react';

export type AutomatorStatusType = 'Draft Created' | 'Sent' | 'Skipped' | string;

interface AutomatorStatusBadgeProps {
  status: AutomatorStatusType;
  size?: 'sm' | 'md';
}

interface StatusStyleConfig {
  label: string;
  color: string;
  bg: string;
  borderColor: string;
}

const STATUS_CONFIG: Record<string, StatusStyleConfig> = {
  'Draft Created': {
    label: 'Draft Created',
    color: '#3b82f6',
    bg: 'rgba(59, 130, 246, 0.12)',
    borderColor: 'rgba(59, 130, 246, 0.3)',
  },
  'Sent': {
    label: 'Sent',
    color: '#22c55e',
    bg: 'rgba(34, 197, 94, 0.12)',
    borderColor: 'rgba(34, 197, 94, 0.3)',
  },
  'Skipped': {
    label: 'Skipped',
    color: '#f59e0b',
    bg: 'rgba(245, 158, 11, 0.12)',
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
};

export const AutomatorStatusBadge: React.FC<AutomatorStatusBadgeProps> = ({
  status,
  size = 'sm',
}) => {
  const config: StatusStyleConfig = STATUS_CONFIG[status] ?? {
    label: status || 'Unknown',
    color: '#94a3b8',
    bg: 'rgba(148, 163, 184, 0.12)',
    borderColor: 'rgba(148, 163, 184, 0.25)',
  };

  const isSmall = size === 'sm';

  return (
    <span
      data-testid="automator-badge"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
        padding: isSmall ? '2px 8px' : '4px 10px',
        fontSize: isSmall ? '0.75rem' : '0.8125rem',
        fontWeight: 600,
        borderRadius: '9999px',
        color: config.color,
        backgroundColor: config.bg,
        border: `1px solid ${config.borderColor}`,
        whiteSpace: 'nowrap',
        lineHeight: 1.2,
      }}
    >
      <span
        style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          backgroundColor: config.color,
          flexShrink: 0,
        }}
      />
      {config.label}
    </span>
  );
};
