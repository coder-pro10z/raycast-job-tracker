import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import type { ReactNode } from 'react';
import type { JobItem, FilterState, ViewMode, Priority, WorkMode, ApplicationStatus, DashboardMetrics } from '../types/job';
import { excelAdapter } from '../services/excelAdapter';

interface JobStoreContextType {
  jobs: JobItem[];
  filteredJobs: JobItem[];
  loading: boolean;
  error: string | null;
  selectedJob: JobItem | null;
  selectedJobId: string | null;
  filterState: FilterState;
  metrics: DashboardMetrics;
  theme: 'dark' | 'light';
  isCommandPaletteOpen: boolean;
  
  // Actions
  setSelectedJobId: (id: string | null) => void;
  setSearchQuery: (query: string) => void;
  setViewMode: (view: ViewMode) => void;
  togglePriorityFilter: (prio: Priority) => void;
  toggleWorkModeFilter: (mode: WorkMode) => void;
  toggleStatusFilter: (status: ApplicationStatus) => void;
  setSort: (column: keyof JobItem) => void;
  resetFilters: () => void;
  reloadJobs: () => Promise<void>;
  uploadExcelFile: (file: File) => Promise<void>;
  toggleTheme: () => void;
  setCommandPaletteOpen: (open: boolean) => void;
  updateJobJD: (id: string, content: string) => void;
}

const defaultFilterState: FilterState = {
  searchQuery: '',
  priority: [],
  workMode: [],
  status: [],
  viewMode: 'all',
  sortBy: '',
  sortDirection: 'asc'
};

const JobStoreContext = createContext<JobStoreContextType | undefined>(undefined);

export const JobProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [filterState, setFilterState] = useState<FilterState>(defaultFilterState);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [isCommandPaletteOpen, setCommandPaletteOpen] = useState<boolean>(false);

  // Initial load
  useEffect(() => {
    loadData();
  }, []);

  // Update theme classes on root body
  useEffect(() => {
    const html = document.documentElement;
    if (theme === 'dark') {
      html.classList.add('dark');
      html.classList.remove('light');
    } else {
      html.classList.add('light');
      html.classList.remove('dark');
    }
  }, [theme]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const loadedJobs = await excelAdapter.loadJobs();
      setJobs(loadedJobs);
    } catch (err: any) {
      setError(err.message || 'Failed to load excel dataset');
    } finally {
      setLoading(false);
    }
  };

  const reloadJobs = async () => {
    await loadData();
  };

  const uploadExcelFile = async (file: File) => {
    setLoading(true);
    setError(null);
    try {
      const parsedJobs = await excelAdapter.parseFile(file);
      setJobs(parsedJobs);
      setSelectedJobId(null);
    } catch (err: any) {
      setError(err.message || 'Invalid excel workbook file');
    } finally {
      setLoading(false);
    }
  };

  const updateJobJD = (id: string, content: string) => {
    setJobs((prev) =>
      prev.map((job) => {
        if (job.id === id) {
          const cleanContent = content.trim();
          const isLink = cleanContent.startsWith('http') || cleanContent.includes('.com') || cleanContent.includes('.io');
          return {
            ...job,
            jdContent: cleanContent,
            jobApplicationLink: isLink ? cleanContent : job.jobApplicationLink
          };
        }
        return job;
      })
    );
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Actions for filtering & sorting
  const setSearchQuery = (query: string) => {
    setFilterState((prev) => ({ ...prev, searchQuery: query }));
  };

  const setViewMode = (view: ViewMode) => {
    setFilterState((prev) => ({ ...prev, viewMode: view, status: [] }));
    setSelectedJobId(null);
  };

  const togglePriorityFilter = (prio: Priority) => {
    setFilterState((prev) => {
      const exists = prev.priority.includes(prio);
      return {
        ...prev,
        priority: exists ? prev.priority.filter((p) => p !== prio) : [...prev.priority, prio]
      };
    });
  };

  const toggleWorkModeFilter = (mode: WorkMode) => {
    setFilterState((prev) => {
      const exists = prev.workMode.includes(mode);
      return {
        ...prev,
        workMode: exists ? prev.workMode.filter((m) => m !== mode) : [...prev.workMode, mode]
      };
    });
  };

  const toggleStatusFilter = (status: ApplicationStatus) => {
    setFilterState((prev) => {
      const exists = prev.status.includes(status);
      return {
        ...prev,
        status: exists ? prev.status.filter((s) => s !== status) : [...prev.status, status]
      };
    });
  };

  const setSort = (column: keyof JobItem) => {
    setFilterState((prev) => {
      const isAsc = prev.sortBy === column && prev.sortDirection === 'asc';
      return {
        ...prev,
        sortBy: column,
        sortDirection: isAsc ? 'desc' : 'asc'
      };
    });
  };

  const resetFilters = () => {
    setFilterState((prev) => ({
      ...defaultFilterState,
      viewMode: prev.viewMode
    }));
  };

  // Compute Dashboard Metrics
  const metrics = useMemo<DashboardMetrics>(() => {
    return {
      totalJobs: jobs.length,
      readyToApply: jobs.filter((j) => j.applicationStatus === 'Not Started').length,
      applied: jobs.filter((j) => j.applicationStatus === 'Applied').length,
      highPriority: jobs.filter((j) => j.priority === 'High').length,
      withReferrals: jobs.filter((j) => j.referralNeeded || j.referralContactName).length,
      interviewing: jobs.filter((j) => j.applicationStatus === 'Interviewing' || j.interviewStage !== 'Not Started').length,
      offers: jobs.filter((j) => j.applicationStatus === 'Offered').length
    };
  }, [jobs]);

  // Compute Filtered Jobs
  const filteredJobs = useMemo(() => {
    let result = [...jobs];

    // Apply View Mode filtration
    if (filterState.viewMode === 'ready') {
      result = result.filter((j) => j.applicationStatus === 'Not Started');
    } else if (filterState.viewMode === 'applied') {
      result = result.filter((j) => j.applicationStatus === 'Applied');
    } else if (filterState.viewMode === 'interview') {
      result = result.filter((j) => j.applicationStatus === 'Interviewing' || j.interviewStage !== 'Not Started');
    } else if (filterState.viewMode === 'offers') {
      result = result.filter((j) => j.applicationStatus === 'Offered');
    } else if (filterState.viewMode === 'rejected') {
      result = result.filter((j) => j.applicationStatus === 'Rejected');
    } else if (filterState.viewMode === 'archived') {
      result = result.filter((j) => j.applicationStatus === 'Archived');
    }

    // Apply Priority filter pills
    if (filterState.priority.length > 0) {
      result = result.filter((j) => filterState.priority.includes(j.priority));
    }

    // Apply Work Mode filter pills
    if (filterState.workMode.length > 0) {
      result = result.filter((j) => filterState.workMode.includes(j.workMode));
    }

    // Apply Status filter pills
    if (filterState.status.length > 0) {
      result = result.filter((j) => filterState.status.includes(j.applicationStatus));
    }

    // Apply Search Query across relevant fields
    if (filterState.searchQuery.trim()) {
      const q = filterState.searchQuery.toLowerCase().trim();
      result = result.filter((j) => {
        return (
          j.companyName.toLowerCase().includes(q) ||
          j.targetRole.toLowerCase().includes(q) ||
          j.location.toLowerCase().includes(q) ||
          j.techStack.some((tech) => tech.toLowerCase().includes(q)) ||
          j.nextAction.toLowerCase().includes(q) ||
          j.notes.toLowerCase().includes(q) ||
          j.jdContent.toLowerCase().includes(q) ||
          j.hrRecruiterName.toLowerCase().includes(q)
        );
      });
    }

    // Apply Sorting
    if (filterState.sortBy) {
      const col = filterState.sortBy;
      const dir = filterState.sortDirection === 'asc' ? 1 : -1;

      result.sort((a, b) => {
        const valA = a[col];
        const valB = b[col];

        if (Array.isArray(valA)) {
          return (valA.length - (valB as unknown as any[]).length) * dir;
        }

        if (typeof valA === 'string' && typeof valB === 'string') {
          return valA.localeCompare(valB) * dir;
        }

        if (valA < valB) return -1 * dir;
        if (valA > valB) return 1 * dir;
        return 0;
      });
    }

    return result;
  }, [jobs, filterState]);

  const selectedJob = useMemo(() => {
    if (!selectedJobId) return null;
    return jobs.find((j) => j.id === selectedJobId) || null;
  }, [jobs, selectedJobId]);

  return (
    <JobStoreContext.Provider
      value={{
        jobs,
        filteredJobs,
        loading,
        error,
        selectedJob,
        selectedJobId,
        filterState,
        metrics,
        theme,
        isCommandPaletteOpen,
        setSelectedJobId,
        setSearchQuery,
        setViewMode,
        togglePriorityFilter,
        toggleWorkModeFilter,
        toggleStatusFilter,
        setSort,
        resetFilters,
        reloadJobs,
        uploadExcelFile,
        toggleTheme,
        setCommandPaletteOpen,
        updateJobJD
      }}
    >
      {children}
    </JobStoreContext.Provider>
  );
};

export const useJobStore = (): JobStoreContextType => {
  const context = useContext(JobStoreContext);
  if (!context) {
    throw new Error('useJobStore must be used within a JobProvider');
  }
  return context;
};
