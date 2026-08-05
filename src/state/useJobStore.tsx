import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import type { ReactNode } from 'react';
import type { JobItem, FilterState, ViewMode, Priority, WorkMode, ApplicationStatus, DomainMetrics, ActiveDomain } from '../types/job';
import { excelAdapter } from '../services/excelAdapter';

interface JobStoreContextType {
  jobs: JobItem[];
  filteredJobs: JobItem[];
  loading: boolean;
  error: string | null;
  selectedJob: JobItem | null;
  selectedJobId: string | null;
  filterState: FilterState;
  metrics: DomainMetrics;
  theme: 'dark' | 'light';
  isCommandPaletteOpen: boolean;
  isSidebarOpen: boolean;
  
  // Actions
  setSelectedJobId: (id: string | null) => void;
  setSearchQuery: (query: string) => void;
  setActiveDomain: (domain: ActiveDomain) => void;
  setViewMode: (view: ViewMode) => void;
  togglePriorityFilter: (prio: Priority) => void;
  toggleWorkModeFilter: (mode: WorkMode) => void;
  toggleStatusFilter: (status: ApplicationStatus) => void;
  toggleTechFilter: (tech: string) => void;
  setSort: (column: keyof JobItem) => void;
  resetFilters: () => void;
  reloadJobs: () => Promise<void>;
  uploadExcelFile: (file: File) => Promise<{ added: number; duplicates: number }>;
  toggleTheme: () => void;
  setCommandPaletteOpen: (open: boolean) => void;
  setSidebarOpen: (open: boolean) => void;
  updateJobJD: (id: string, content: string) => void;
}

const getSavedDomain = (): ActiveDomain => {
  const saved = localStorage.getItem('job_tracker_active_domain');
  return (saved === 'sde' || saved === 'cloud' || saved === 'all') ? saved : 'all';
};

const getSavedViewMode = (): ViewMode => {
  const saved = localStorage.getItem('job_tracker_view_mode') as ViewMode;
  const valid: ViewMode[] = ['dashboard', 'all', 'ready', 'applied', 'interview', 'offers', 'rejected', 'archived'];
  return (saved && valid.includes(saved)) ? saved : 'all';
};

const getSavedSortBy = (): keyof JobItem | '' => {
  return (localStorage.getItem('job_tracker_sort_by') as keyof JobItem) || 'priority';
};

const getSavedSortDir = (): 'asc' | 'desc' => {
  const dir = localStorage.getItem('job_tracker_sort_dir');
  return dir === 'asc' ? 'asc' : 'desc';
};

const defaultFilterState: FilterState = {
  searchQuery: '',
  activeDomain: getSavedDomain(),
  priority: [],
  workMode: [],
  status: [],
  techFilters: [],
  viewMode: getSavedViewMode(),
  sortBy: getSavedSortBy(),
  sortDirection: getSavedSortDir()
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
  const [isSidebarOpen, setSidebarOpen] = useState<boolean>(false);

  useEffect(() => {
    loadData();
  }, []);

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

  const uploadExcelFile = async (file: File): Promise<{ added: number; duplicates: number }> => {
    setLoading(true);
    setError(null);
    try {
      const parsedJobs = await excelAdapter.parseFile(file);
      let added = 0;
      let duplicates = 0;

      setJobs((prevJobs) => {
        const existingKeys = new Set(prevJobs.map(j => `${j.companyName.toLowerCase().trim()}|${j.targetRole.toLowerCase().trim()}`));
        const newUniqueJobs: JobItem[] = [];

        for (const job of parsedJobs) {
          const key = `${job.companyName.toLowerCase().trim()}|${job.targetRole.toLowerCase().trim()}`;
          if (!existingKeys.has(key)) {
            existingKeys.add(key);
            newUniqueJobs.push(job);
            added++;
          } else {
            duplicates++;
          }
        }
        return [...prevJobs, ...newUniqueJobs];
      });

      setSelectedJobId(null);
      return { added, duplicates };
    } catch (err: any) {
      const msg = err.message || 'Invalid excel workbook file';
      setError(msg);
      throw new Error(msg);
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

  const setActiveDomain = (domain: ActiveDomain) => {
    localStorage.setItem('job_tracker_active_domain', domain);
    setFilterState((prev) => ({ ...prev, activeDomain: domain, techFilters: [] }));
    setSelectedJobId(null);
  };

  const setViewMode = (view: ViewMode) => {
    localStorage.setItem('job_tracker_view_mode', view);
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

  const toggleTechFilter = (tech: string) => {
    setFilterState((prev) => {
      const exists = prev.techFilters.includes(tech);
      return {
        ...prev,
        techFilters: exists ? prev.techFilters.filter((t) => t !== tech) : [...prev.techFilters, tech]
      };
    });
  };

  const setSort = (column: keyof JobItem) => {
    setFilterState((prev) => {
      const isAsc = prev.sortBy === column && prev.sortDirection === 'asc';
      const nextDir = isAsc ? 'desc' : 'asc';
      localStorage.setItem('job_tracker_sort_by', column);
      localStorage.setItem('job_tracker_sort_dir', nextDir);
      return {
        ...prev,
        sortBy: column,
        sortDirection: nextDir
      };
    });
  };

  const resetFilters = () => {
    localStorage.setItem('job_tracker_sort_by', 'priority');
    localStorage.setItem('job_tracker_sort_dir', 'desc');
    setFilterState((prev) => ({
      ...defaultFilterState,
      activeDomain: prev.activeDomain,
      viewMode: prev.viewMode,
      sortBy: 'priority',
      sortDirection: 'desc'
    }));
  };

  // Compute Domain & General Metrics
  const metrics = useMemo<DomainMetrics>(() => {
    const activeDomainJobs = jobs.filter((j) => {
      if (filterState.activeDomain === 'sde') return j.domain === 'sde' || j.domain === 'dual';
      if (filterState.activeDomain === 'cloud') return j.domain === 'cloud' || j.domain === 'dual';
      return true;
    });

    return {
      totalJobs: activeDomainJobs.length,
      readyToApply: activeDomainJobs.filter((j) => j.applicationStatus === 'Not Started').length,
      applied: activeDomainJobs.filter((j) => j.applicationStatus === 'Applied').length,
      highPriority: activeDomainJobs.filter((j) => j.priority === 'High').length,
      withReferrals: activeDomainJobs.filter((j) => j.referralNeeded || j.referralContactName).length,
      interviewing: activeDomainJobs.filter((j) => j.applicationStatus === 'Interviewing' || j.interviewStage !== 'Not Started').length,
      offers: activeDomainJobs.filter((j) => j.applicationStatus === 'Offered').length,
      
      // Overall counts by strict domain
      sdeCount: jobs.filter((j) => j.domain === 'sde' || j.domain === 'dual').length,
      cloudDevOpsCount: jobs.filter((j) => j.domain === 'cloud' || j.domain === 'dual').length,
      dualCount: jobs.filter((j) => j.domain === 'dual').length,
      
      // Specific tech breakdown inside active dataset
      dotnetCount: activeDomainJobs.filter((j) => j.techStack.some(t => t.toLowerCase().includes('.net') || t.toLowerCase().includes('c#')) || j.targetRole.toLowerCase().includes('.net')).length,
      reactAngularCount: activeDomainJobs.filter((j) => j.techStack.some(t => t.toLowerCase().includes('react') || t.toLowerCase().includes('angular') || t.toLowerCase().includes('js'))).length,
      azureCount: activeDomainJobs.filter((j) => j.techStack.some(t => t.toLowerCase().includes('azure') || t.toLowerCase().includes('cloud'))).length,
      dockerK8sCount: activeDomainJobs.filter((j) => j.techStack.some(t => t.toLowerCase().includes('docker') || t.toLowerCase().includes('k8s') || t.toLowerCase().includes('kubernetes'))).length,
      cicdCount: activeDomainJobs.filter((j) => j.techStack.some(t => t.toLowerCase().includes('ci/cd') || t.toLowerCase().includes('pipeline') || t.toLowerCase().includes('devops'))).length,
    };
  }, [jobs, filterState.activeDomain]);

  // Compute Filtered Jobs with strict domain separation
  const filteredJobs = useMemo(() => {
    let result = [...jobs];

    // Apply Active Domain filtration strictly by domain attribute
    if (filterState.activeDomain === 'sde') {
      result = result.filter((j) => j.domain === 'sde' || j.domain === 'dual');
    } else if (filterState.activeDomain === 'cloud') {
      result = result.filter((j) => j.domain === 'cloud' || j.domain === 'dual');
    }

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
      result = result.filter((j) => filterState.priority.includes(j.priority as Priority));
    }

    // Apply Work Mode filter pills
    if (filterState.workMode.length > 0) {
      result = result.filter((j) => filterState.workMode.includes(j.workMode as WorkMode));
    }

    // Apply Status filter pills
    if (filterState.status.length > 0) {
      result = result.filter((j) => filterState.status.includes(j.applicationStatus as ApplicationStatus));
    }

    // Apply Tech filter pills
    if (filterState.techFilters.length > 0) {
      result = result.filter((j) => {
        const fullTechString = `${j.targetRole} ${j.techStack.join(' ')} ${j.notes}`.toLowerCase();
        return filterState.techFilters.some((filterTag) => {
          const kw = filterTag.toLowerCase();
          return fullTechString.includes(kw);
        });
      });
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

        if (col === 'priority') {
          const rank = (p: string) => (p === 'High' ? 3 : p === 'Medium' ? 2 : p === 'Low' ? 1 : 0);
          return (rank(valA as string) - rank(valB as string)) * dir;
        }

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
        isSidebarOpen,
        setSelectedJobId,
        setSearchQuery,
        setActiveDomain,
        setViewMode,
        togglePriorityFilter,
        toggleWorkModeFilter,
        toggleStatusFilter,
        toggleTechFilter,
        setSort,
        resetFilters,
        reloadJobs,
        uploadExcelFile,
        toggleTheme,
        setCommandPaletteOpen,
        setSidebarOpen,
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
