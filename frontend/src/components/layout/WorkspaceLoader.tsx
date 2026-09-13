import React, { useState } from 'react';
import { Database, ServerCrash, RefreshCw, Loader2, Server, Globe } from 'lucide-react';

interface WorkspaceLoaderProps {
  isLoading: boolean;
  error: Error | null;
  children: React.ReactNode;
}

export const WorkspaceLoader: React.FC<WorkspaceLoaderProps> = ({ isLoading, error, children }) => {
  const [diagnosticsLoading, setDiagnosticsLoading] = useState(false);
  const [diagnosticsResult, setDiagnosticsResult] = useState<any>(null);

  const runDiagnostics = async () => {
    setDiagnosticsLoading(true);
    try {
      const apiKey = localStorage.getItem('apiKey') || '';
      // The API base URL is usually dynamic in production, let's use the one from env or fallback
      const baseUrl = import.meta.env.VITE_API_URL || 'https://job-tracker-99v3.onrender.com';
      
      const res = await fetch(`${baseUrl}/api/health`, {
        headers: {
          'x-api-key': apiKey,
          'Content-Type': 'application/json'
        }
      });
      
      if (res.ok) {
        const data = await res.json();
        setDiagnosticsResult(data);
      } else {
        setDiagnosticsResult({ status: 'offline', database: 'unknown', message: 'Backend server is completely unreachable.' });
      }
    } catch (e: any) {
      setDiagnosticsResult({ status: 'offline', database: 'unknown', message: 'Network error or backend server is sleeping.' });
    } finally {
      setDiagnosticsLoading(false);
    }
  };

  if (error) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%', padding: 'var(--space-6)', backgroundColor: 'var(--bg-primary)' }}>
        <div className="glass-panel" style={{ padding: 'var(--space-8)', maxWidth: '500px', width: '100%', textAlign: 'center', borderRadius: 'var(--radius-md)' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 'var(--space-4)' }}>
            <ServerCrash size={48} style={{ color: 'var(--status-rejected-text)' }} />
          </div>
          <h2 style={{ fontSize: 'var(--text-xl)', marginBottom: 'var(--space-2)', color: 'var(--text-primary)' }}>Connection Lost</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-6)' }}>
            Failed to load your workspace. The server might be sleeping, or the database connection was dropped.
          </p>
          
          {!diagnosticsResult ? (
            <button
              onClick={runDiagnostics}
              disabled={diagnosticsLoading}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 16px',
                backgroundColor: 'var(--bg-tertiary)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-sm)',
                cursor: diagnosticsLoading ? 'not-allowed' : 'pointer',
                fontWeight: 500,
                transition: 'all var(--transition-fast)'
              }}
              className="glow-hover"
            >
              {diagnosticsLoading ? <Loader2 size={18} className="animate-spin" /> : <RefreshCw size={18} />}
              {diagnosticsLoading ? 'Running Diagnostics...' : 'Run Diagnostics'}
            </button>
          ) : (
            <div style={{ textAlign: 'left', backgroundColor: 'var(--bg-secondary)', padding: 'var(--space-4)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
              <h3 style={{ fontSize: 'var(--text-base)', marginBottom: 'var(--space-3)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Globe size={16} /> Diagnostic Results
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Server size={14} /> Backend Server:
                  </span>
                  <span style={{ color: diagnosticsResult.status === 'online' || diagnosticsResult.status === 'degraded' ? 'var(--status-offer-text)' : 'var(--status-rejected-text)', fontWeight: 600 }}>
                    {diagnosticsResult.status === 'offline' ? 'Offline' : 'Online'}
                  </span>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Database size={14} /> Database:
                  </span>
                  <span style={{ color: diagnosticsResult.database === 'connected' ? 'var(--status-offer-text)' : 'var(--status-rejected-text)', fontWeight: 600 }}>
                    {diagnosticsResult.database === 'connected' ? 'Connected' : 'Disconnected'}
                  </span>
                </div>
              </div>

              {diagnosticsResult.database === 'disconnected' && (
                <div style={{ marginTop: 'var(--space-4)', padding: 'var(--space-3)', backgroundColor: 'var(--priority-high-bg)', color: 'var(--priority-high-text)', borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-sm)' }}>
                  <strong>Action Required:</strong> Your Supabase database is currently paused due to inactivity. Please log into your Supabase dashboard and click "Restore" or "Unpause" to continue using the workspace.
                </div>
              )}
              
              <div style={{ marginTop: 'var(--space-6)', textAlign: 'center' }}>
                <button
                  onClick={() => window.location.reload()}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: 'var(--accent-primary)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    fontWeight: 500
                  }}
                >
                  Reload Workspace
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%', color: 'var(--text-secondary)' }}>
        <Loader2 size={32} className="animate-spin" style={{ color: 'var(--text-accent)', marginBottom: 'var(--space-4)' }} />
        <h2 style={{ fontSize: 'var(--text-lg)', color: 'var(--text-primary)', marginBottom: 'var(--space-2)' }}>Loading Workspace</h2>
        <p style={{ fontSize: 'var(--text-sm)', opacity: 0.8 }}>Waking up database... this may take a few seconds.</p>
      </div>
    );
  }

  return <>{children}</>;
};
