import React, { useRef, useState } from 'react';
import { useJobStore } from '../../state/useJobStore';
import { Search, RefreshCw, Sun, Moon, Upload, FileSpreadsheet } from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    reloadJobs, 
    uploadExcelFile, 
    theme, 
    toggleTheme, 
    setCommandPaletteOpen, 
    loading,
    jobs 
  } = useJobStore();
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [reloading, setReloading] = useState<boolean>(false);

  const handleReload = async () => {
    setReloading(true);
    await reloadJobs();
    setTimeout(() => setReloading(false), 500);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadExcelFile(file);
    }
  };

  return (
    <header style={{
      height: '64px',
      borderBottom: '1px solid var(--border-color)',
      backgroundColor: 'var(--bg-secondary)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 var(--space-6)',
      position: 'relative',
      zIndex: 10
    }}>
      {/* Brand Logo & Name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: 'var(--radius-sm)',
          background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
          boxShadow: 'var(--shadow-md)'
        }}>
          <FileSpreadsheet size={20} />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 className="font-sans" style={{ fontSize: '1.125rem', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
              Job Tracker
            </h1>
            <span style={{
              fontSize: '0.6875rem',
              fontWeight: 600,
              padding: '2px 6px',
              borderRadius: '4px',
              backgroundColor: 'rgba(99, 102, 241, 0.15)',
              color: 'var(--text-accent)',
              textTransform: 'uppercase'
            }}>
              Prototype
            </span>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Excel-Powered Workspace ({jobs.length} loaded)
          </p>
        </div>
      </div>

      {/* Center / Search Quick Command trigger */}
      <div style={{ flex: '1', maxWidth: '440px', margin: '0 var(--space-6)' }}>
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
            <Search size={16} style={{ color: 'var(--text-muted)' }} />
            <span>Search opportunities or commands...</span>
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
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
        {/* Hidden Excel File Input */}
        <input 
          type="file" 
          ref={fileInputRef} 
          style={{ display: 'none' }} 
          accept=".xlsx,.xls,.csv" 
          onChange={handleFileUpload} 
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          title="Upload & Parse Custom Excel Sheet"
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
            cursor: 'pointer'
          }}
          className="glow-hover focus-ring"
        >
          <Upload size={15} />
          <span>Upload Excel</span>
        </button>

        <button
          onClick={handleReload}
          disabled={loading || reloading}
          title="Reload Jobs-sheet.xlsx data"
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
            cursor: loading ? 'wait' : 'pointer'
          }}
          className="glow-hover focus-ring"
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
            cursor: 'pointer'
          }}
          className="glow-hover focus-ring"
        >
          {theme === 'dark' ? <Sun size={18} style={{ color: '#fbbf24' }} /> : <Moon size={18} style={{ color: '#6366f1' }} />}
        </button>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </header>
  );
};
