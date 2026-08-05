import React from 'react';
import { useJobStore } from '../../state/useJobStore';
import { Sparkles, Zap, Target, Award, ArrowUpRight } from 'lucide-react';

export const DashboardMetrics: React.FC = () => {
  const { metrics, setViewMode } = useJobStore();

  const cards = [
    {
      title: 'Total Opportunities',
      value: metrics.totalJobs,
      icon: Sparkles,
      color: '#818cf8',
      gradient: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(99, 102, 241, 0.03) 100%)',
      subtext: 'Tracked in workbook',
      onClick: () => setViewMode('all')
    },
    {
      title: 'Ready to Apply',
      value: metrics.readyToApply,
      icon: Zap,
      color: '#facc15',
      gradient: 'linear-gradient(135deg, rgba(234, 179, 8, 0.15) 0%, rgba(234, 179, 8, 0.03) 100%)',
      subtext: 'Actionable applications',
      onClick: () => setViewMode('ready')
    },
    {
      title: 'High Priority Roles',
      value: metrics.highPriority,
      icon: Target,
      color: '#fb923c',
      gradient: 'linear-gradient(135deg, rgba(249, 115, 22, 0.15) 0%, rgba(249, 115, 22, 0.03) 100%)',
      subtext: 'Top tier matches'
    },
    {
      title: 'Active Applied',
      value: metrics.applied,
      icon: Award,
      color: '#34d399',
      gradient: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(16, 185, 129, 0.03) 100%)',
      subtext: 'Awaiting HR response',
      onClick: () => setViewMode('applied')
    }
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: 'var(--space-4)',
      marginBottom: 'var(--space-6)',
      padding: '0 var(--space-6)'
    }}>
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            onClick={card.onClick}
            style={{
              background: card.gradient,
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              padding: 'var(--space-4)',
              cursor: card.onClick ? 'pointer' : 'default',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 200ms ease'
            }}
            className="glow-hover"
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
              <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                {card.title}
              </span>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--bg-elevated)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: card.color
              }}>
                <Icon size={16} />
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
              <span className="font-mono" style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {card.value}
              </span>
              {card.onClick && (
                <ArrowUpRight size={16} style={{ color: 'var(--text-muted)' }} />
              )}
            </div>

            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              {card.subtext}
            </span>
          </div>
        );
      })}
    </div>
  );
};
