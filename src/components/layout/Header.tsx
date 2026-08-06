import React, { useState } from 'react';
import { useJobStore } from '../../state/useJobStore';
import { Search, RefreshCw, Sun, Moon, Upload, FileSpreadsheet, Menu, Settings, Download } from 'lucide-react';
import { UploadModal } from '../upload/UploadModal';
import { SettingsModal } from '../settings/SettingsModal';

export const Header: React.FC = () => {
  const { 
    reloadJobs, 
    theme, 
    toggleTheme, 
    setCommandPaletteOpen, 
    isSidebarOpen,
    setSidebarOpen,
    setSettingsModalOpen,
    loading,
    jobs 
  } = useJobStore();
  
  const [reloading, setReloading] = useState<boolean>(false);
  const [isUploadModalOpen, setUploadModalOpen] = useState<boolean>(false);

  const handleReload = async () => {
    setReloading(true);
    await reloadJobs();
    setTimeout(() => setReloading(false), 500);
  };

  return (
    <>
      <header
        className="mobile-header-padding"
        style={{
          height: '64px',
          borderBottom: '1px solid var(--border-color)',
          backgroundColor: 'var(--bg-secondary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 var(--space-6)',
          position: 'relative',
          zIndex: 30
        }}
      >
        {/* Brand Logo & Name with Mobile Toggle */}
        <div className="mobile-brand-group" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <button
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="mobile-only mobile-icon-btn glow-hover focus-ring"
            title="Toggle Navigation Sidebar"
            style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-color)',
              backgroundColor: 'var(--bg-tertiary)',
              color: 'var(--text-primary)',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0
            }}
          >
            <Menu size={18} />
          </button>

          <div className="mobile-brand-logo" style={{
            width: '36px',
            height: '36px',
            borderRadius: 'var(--radius-sm)',
            background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            boxShadow: 'var(--shadow-md)',
            flexShrink: 0
          }}>
            <FileSpreadsheet size={18} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 className="font-sans mobile-brand-text" style={{ fontSize: '1.125rem', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>
                Job Tracker
              </h1>
              <span 
                className="hide-on-mobile"
                style={{
                  fontSize: '0.6875rem',
                  fontWeight: 600,
                  padding: '2px 6px',
                  borderRadius: '4px',
                  backgroundColor: 'rgba(99, 102, 241, 0.15)',
                  color: 'var(--text-accent)',
                  textTransform: 'uppercase'
                }}
              >
                Prototype
              </span>
            </div>
            <p className="hide-on-mobile" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Excel-Powered Workspace ({jobs.length} loaded)
            </p>
          </div>
        </div>

        {/* Center / Search Quick Command trigger */}
        <div className="mobile-search-bar" style={{ flex: '1', maxWidth: '440px', margin: '0 var(--space-6)' }}>
          <button
            onClick={() => setCommandPaletteOpen(true)}
            style={{
              width: '100%',
              height: '38px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-color)',
              backgroundColor: 'var(--bg-tertiary)',
              color: 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 var(--space-3)',
              fontSize: '0.875rem',
              cursor: 'pointer',
              transition: 'all 150ms ease',
            }}
            className="glow-hover focus-ring"
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <Search size={16} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
              <span>Search Companies...</span>
            </span>
            <kbd style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              backgroundColor: 'var(--bg-elevated)',
              color: 'var(--text-primary)',
              padding: '2px 6px',
              borderRadius: '4px',
              border: '1px solid var(--border-color)'
            }}>
              Ctrl+K
            </kbd>
          </button>
        </div>

        {/* Action Toolbar */}
        <div className="mobile-actions" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <button
            onClick={() => exportJobsToExcel()}
            title="Export Jobs to Excel"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              height: '36px',
              padding: '0 var(--space-3)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-color)',
              backgroundColor: 'var(--bg-tertiary)',
              color: 'var(--text-primary)',
              fontWeight: 600,
              fontSize: '0.8125rem',
              cursor: 'pointer'
            }}
            className="glow-hover"
          >
            <Download size={15} />
            <span className="desktop-only">Export</span>
          </button>
          
          <button
            onClick={() => setUploadModalOpen(true)}
            title="Import & Append Custom Excel Sheet"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              height: '36px',
              padding: '0 var(--space-3)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-color)',
              backgroundColor: 'var(--bg-tertiary)',
              color: 'var(--text-primary)',
              fontSize: '0.8125rem',
              fontWeight: 500,
              cursor: 'pointer',
              flexShrink: 0
            }}
            className="mobile-header-btn glow-hover focus-ring"
          >
            <Upload size={16} />
            <span>Upload Excel</span>
          </button>

          <button
            onClick={() => setSettingsModalOpen(true)}
            title="Application Settings & Profile"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-color)',
              backgroundColor: 'var(--bg-tertiary)',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              flexShrink: 0
            }}
            className="mobile-icon-btn glow-hover focus-ring"
          >
            <Settings size={17} />
          </button>

          <button
            onClick={handleReload}
            disabled={loading || reloading}
            title="Reload Master_Job_Tracker_Verified.xlsx data"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              height: '36px',
              padding: '0 var(--space-3)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-color)',
              backgroundColor: 'var(--bg-tertiary)',
              color: 'var(--text-primary)',
              fontSize: '0.8125rem',
              fontWeight: 500,
              cursor: loading ? 'wait' : 'pointer',
              flexShrink: 0
            }}
            className="mobile-header-btn glow-hover focus-ring"
          >
            <RefreshCw size={15} style={{ animation: (loading || reloading) ? 'spin 1s linear infinite' : 'none' }} />
            <span>Reload</span>
          </button>

          <button
            onClick={toggleTheme}
            title="Toggle Dark / Light Mode"
            style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-color)',
              backgroundColor: 'var(--bg-tertiary)',
              color: 'var(--text-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0
            }}
            className="mobile-icon-btn glow-hover focus-ring"
          >
            {theme === 'dark' ? <Sun size={17} style={{ color: '#fbbf24' }} /> : <Moon size={17} style={{ color: '#6366f1' }} />}
          </button>
        </div>

        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </header>

      <UploadModal isOpen={isUploadModalOpen} onClose={() => setUploadModalOpen(false)} />
      <SettingsModal />
    </>
  );
};
