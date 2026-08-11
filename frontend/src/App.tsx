import React, { useEffect } from 'react';
import { JobProvider, useJobStore } from './state/useJobStore';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { DashboardMetrics } from './components/dashboard/DashboardMetrics';
import { FilterBar } from './components/search/FilterBar';
import { JobTable } from './components/table/JobTable';
import { JobDetailDrawer } from './components/detail/JobDetailDrawer';
import { CommandPalette } from './components/search/CommandPalette';
import { Toast } from './components/ui/Toast';
import { ColdOutreachWorkspace } from './components/outreach/ColdOutreachWorkspace';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useJobs } from './hooks/useJobs';
import { PassphraseGate } from './components/auth/PassphraseGate';

const queryClient = new QueryClient();

const MainWorkspace: React.FC = () => {
  const { filteredJobs, selectedJobId, setSelectedJobId, setCommandPaletteOpen, filterState, setJobs } = useJobStore();
  const { data: jobs, isLoading, error } = useJobs();

  // Sync React Query data to Zustand store
  useEffect(() => {
    if (jobs) {
      setJobs(jobs);
    }
  }, [jobs, setJobs]);

  // Global j/k keyboard shortcut for rapid job row navigation without clicking
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if focus is inside an input or textarea
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA' ||
        e.metaKey || 
        e.ctrlKey
      ) {
        return;
      }

      if (e.key === 'j' || e.key === 'k') {
        e.preventDefault();
        if (filteredJobs.length === 0) return;

        const currentIdx = selectedJobId ? filteredJobs.findIndex((j) => j.id === selectedJobId) : -1;
        let nextIdx = currentIdx;

        if (e.key === 'j') {
          nextIdx = currentIdx < filteredJobs.length - 1 ? currentIdx + 1 : 0;
        } else if (e.key === 'k') {
          nextIdx = currentIdx > 0 ? currentIdx - 1 : filteredJobs.length - 1;
        }

        const nextJob = filteredJobs[nextIdx];
        if (nextJob) {
          setSelectedJobId(nextJob.id);
        }
      } else if (e.key === '/') {
        e.preventDefault();
        setCommandPaletteOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [filteredJobs, selectedJobId, setSelectedJobId, setCommandPaletteOpen]);

  if (isLoading && filteredJobs.length === 0) {
     return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%', color: 'var(--text-secondary)' }}>Loading Workspace...</div>;
  }
  if (error) {
     return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%', color: 'var(--red)' }}>Error loading jobs: {(error as Error).message}</div>;
  }

  return (
    <div style={{ display: 'flex', width: '100vw', height: 'calc(100vh - 64px)', overflow: 'hidden', backgroundColor: 'var(--bg-primary)' }}>
      {/* Left Navigation Sidebar */}
      <Sidebar />

      {/* Main Content Workspace Area */}
      <main style={{ flex: '1', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
        {filterState.viewMode === 'outreach-templates' ? (
          <ColdOutreachWorkspace />
        ) : (
          <>
            <DashboardMetrics />
            <FilterBar />
            <JobTable />
          </>
        )}
      </main>

      {/* Overlays & Drawers */}
      <JobDetailDrawer />
      <CommandPalette />
      <Toast />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <JobProvider>
        <PassphraseGate>
          <div style={{ display: 'flex', flexDirection: 'column', width: '100vw', height: '100vh', overflow: 'hidden' }}>
            <Header />
            <MainWorkspace />
          </div>
        </PassphraseGate>
      </JobProvider>
    </QueryClientProvider>
  );
};

export default App;
