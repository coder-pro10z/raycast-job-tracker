import type { JobItem, JobDomain, Priority, WorkMode, ApplicationStatus } from '../types/job';
import type { UserProfileDto, PublicUserSummary, AuthResponse } from '../types/auth';
import { excelAdapter } from './excelAdapter';
import { getEnrichedJobData } from '../data/enrichedPilotJobs';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5089';

function getAuthHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    'X-Api-Key': (typeof localStorage !== 'undefined' ? localStorage.getItem('apiKey') : null) || 'dev-local-key'
  };
  const token = typeof localStorage !== 'undefined' ? localStorage.getItem('job_tracker_token') : null;
  const userId = typeof localStorage !== 'undefined' ? localStorage.getItem('job_tracker_active_user_id') : null;
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  if (userId) {
    headers['X-User-Id'] = userId;
  }
  return headers;
}

function getActiveUserId(): string {
  if (typeof localStorage === 'undefined') return '';
  return localStorage.getItem('job_tracker_active_user_id') || '';
}

function isMixedContentBlocked(): boolean {
  if (typeof window === 'undefined') return false;
  return window.location.protocol === 'https:' && API_BASE.startsWith('http://');
}

const DEMO_USERS: Record<string, { token: string; user: UserProfileDto }> = {
  '2pkashyap2001@gmail.com': {
    token: 'mock-jwt-praveen',
    user: {
      id: 'user_praveen',
      fullName: 'Praveen Kashyap',
      email: '2pkashyap2001@gmail.com',
      targetDomain: 'sde',
      currentRole: 'Full Stack Engineer / SDE',
      yoe: '3+ years',
      keyStrengths: 'Angular, React, TypeScript, C#, .NET Core, Microservices, Cloud Architecture',
      phone: '+91 7394990738',
      linkedinUrl: 'https://www.linkedin.com/in/coder-pro10z/',
      githubUrl: 'https://github.com/coder-pro10z',
      portfolioUrl: 'https://github.com/coder-pro10z',
      flagshipAchievement: 'Architected distributed event-driven microservices in .NET Core and modern Angular/React micro-frontends with sub-50ms latency',
      resumeSummary: 'Full Stack Software Development Engineer specializing in Angular, React, TypeScript, C#, .NET Core, and cloud distributed architectures.',
      createdAt: '2026-09-22T08:00:00Z'
    }
  },
  'anamansari.0406@gmail.com': {
    token: 'mock-jwt-anam',
    user: {
      id: 'user_anam',
      fullName: 'Anam Ansari',
      email: 'anamansari.0406@gmail.com',
      targetDomain: 'dual',
      currentRole: 'Cloud & Platform Software Engineer',
      yoe: '3+ years',
      keyStrengths: 'Full Stack Development, React, Python, Cloud Infrastructure, Docker, Kubernetes',
      phone: '+91 98765 43211',
      linkedinUrl: 'https://www.linkedin.com/in/anam-ansari',
      githubUrl: 'https://github.com/anam-ansari',
      portfolioUrl: 'https://anamansari.dev',
      flagshipAchievement: 'Automated multi-region Kubernetes cluster deployments with zero downtime and automated Prometheus/Grafana observability',
      resumeSummary: 'Cloud & SDE Specialist with deep expertise in DevOps, Kubernetes orchestration, Docker, and multi-cloud solutions.',
      createdAt: '2026-09-22T08:00:00Z'
    }
  }
};

export const apiClient = {
  async getJobs(): Promise<JobItem[]> {
    if (!isMixedContentBlocked()) {
      try {
        const res = await fetch(`${API_BASE}/api/jobs`, {
          headers: getAuthHeaders()
        });
        if (res.ok) {
          const data = await res.json();
          const mapped = data.map(mapJobToFrontend);
          const userId = getActiveUserId() || 'guest';
          try {
            localStorage.setItem(`job_tracker_jobs_${userId}`, JSON.stringify(mapped));
          } catch {}
          return mapped;
        }
        if (res.status === 401) throw new Error('Unauthorized');
      } catch (err: any) {
        if (err.message === 'Unauthorized') throw err;
        console.warn('Backend API unavailable for getJobs, falling back to local dataset:', err.message);
      }
    }

    // Client/Offline fallback
    const userId = getActiveUserId();
    const storageKey = `job_tracker_jobs_${userId || 'guest'}`;

    if (typeof localStorage !== 'undefined') {
      const cached = localStorage.getItem(storageKey);
      if (cached) {
        try {
          const list = JSON.parse(cached);
          if (Array.isArray(list) && list.length > 0) {
            // Auto-upgrade with enriched pilot data and legacy automator fixes
            const upgraded = list.map(j => {
              let updated = { ...j };
              const enriched = getEnrichedJobData(j.companyName);
              if (enriched) {
                const missingLink = !updated.jobApplicationLink || updated.jobApplicationLink === '#' || updated.jobApplicationLink.trim() === '';
                const missingJd = !updated.jdContent || updated.jdContent.length < 50;
                const staleAction = !updated.nextAction || updated.nextAction === 'Find application link' || updated.nextAction === 'Check current opening and apply' || updated.nextAction === 'Verify current 3 YoE opening';
                
                if (missingLink || missingJd || staleAction) {
                  updated = {
                    ...updated,
                    careerPageLink: enriched.careerPageLink,
                    jobApplicationLink: missingLink ? enriched.jobApplicationLink : updated.jobApplicationLink,
                    jdContent: missingJd ? enriched.jdContent : updated.jdContent,
                    nextAction: staleAction ? enriched.nextAction : updated.nextAction,
                    priority: 'High' as Priority,
                    techStack: enriched.techStack && enriched.techStack.length > 0 ? enriched.techStack : updated.techStack,
                    outreachSubject: updated.outreachSubject || enriched.outreachSubject,
                    outreachBodyPreview: updated.outreachBodyPreview || enriched.outreachBodyPreview
                  };
                }
              }

              if (userId === 'user_praveen' && updated.companyName === 'HashiCorp' && (updated.targetRole?.includes('DevOps') || updated.outreachSubject?.includes('Candidate Introduction'))) {
                updated = {
                  ...updated,
                  targetRole: 'Senior Full Stack Software Engineer (FSD / React / Go)',
                  domain: 'sde' as JobDomain,
                  priority: 'High' as Priority,
                  hrRecruiterName: 'engineering-hiring@hashicorp.com',
                  outreachSubject: 'Senior Full Stack Engineer Application – Praveen Kashyap',
                  outreachBodyPreview: 'Hi HashiCorp Team, With 3+ years specializing in Full Stack development, modern React micro-frontends, high-performance Go/C# distributed backends, and cloud-native workflows, I would love to contribute to HashiCorp products...',
                  notes: 'Auto-generated by Claude for Praveen Kashyap (SDE & Full Stack).'
                };
              }
              return updated;
            });

            // Write back upgraded records to localStorage
            try {
              localStorage.setItem(storageKey, JSON.stringify(upgraded));
            } catch {}

            return upgraded;
          }
        } catch {}
      }
    }

    // Load from Master_Job_Tracker.xlsx
    let jobs: JobItem[] = [];
    try {
      jobs = await excelAdapter.loadJobs();
    } catch (e) {
      console.warn('Could not load Excel file fallback', e);
    }

    if (!userId) {
      // Guest mode: exactly 0 active application statuses (all Not Started)
      jobs = jobs.map(j => ({
        ...j,
        applicationStatus: 'Not Started' as ApplicationStatus,
        priority: j.priority || 'Medium',
        notes: '',
        followUpDate: ''
      }));
    } else if (userId === 'user_praveen') {
      // Seed Praveen with 12 active applications for authentic portfolio showcase
      let activeCount = 0;
      jobs = jobs.map(j => {
        if ((j.domain === 'sde' || j.domain === 'dual') && j.priority === 'High' && activeCount < 12) {
          activeCount++;
          const status: ApplicationStatus = activeCount <= 3 ? 'Interviewing' : activeCount <= 8 ? 'Applied' : 'Under Review';
          return {
            ...j,
            applicationStatus: status,
            appliedDate: new Date(Date.now() - activeCount * 86400000 * 2).toISOString().slice(0, 10),
            notes: activeCount <= 3 ? 'Interview scheduled with hiring team' : 'Applied via company portal'
          };
        }
        return {
          ...j,
          applicationStatus: 'Not Started' as ApplicationStatus
        };
      });

      const createAutomatorSeed = (partial: any): JobItem => ({
        id: partial.id || `seed_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        companyName: partial.companyName || '',
        targetRole: partial.targetRole || '',
        domain: partial.domain || 'sde',
        location: partial.location || 'Remote',
        workMode: partial.workMode || 'Remote',
        jobApplicationLink: '',
        priority: partial.priority || 'High',
        applicationStatus: partial.applicationStatus || 'Draft Created',
        nextAction: 'Review outreach email',
        techStack: ['React', 'TypeScript', 'C#', '.NET', 'Microservices'],
        careerPageLink: '',
        appliedDate: partial.appliedDate || new Date().toISOString().slice(0, 10),
        referralNeeded: false,
        referralContactName: '',
        referralContactRole: '',
        referralContactEmail: '',
        referralContactLinkedIn: '',
        hrRecruiterName: partial.hrRecruiterName || '',
        hrRecruiterEmail: partial.hrRecruiterName || '',
        hrRecruiterLinkedIn: '',
        notes: partial.notes || '',
        followUpDate: '',
        responseStatus: '',
        interviewStage: '',
        gmailDraftId: partial.gmailDraftId || '',
        automatorStatus: partial.automatorStatus || 'Draft Created',
        outreachSubject: partial.outreachSubject || '',
        outreachBodyPreview: partial.outreachBodyPreview || '',
        jdContent: ''
      });

      // Ensure Praveen's initial automator jobs are present and tailored for SDE & FSD
      jobs.unshift(
        createAutomatorSeed({
          id: 'job-stripe-fsd',
          companyName: 'Stripe',
          targetRole: 'Senior Full Stack Engineer (.NET / React)',
          domain: 'sde',
          location: 'Remote',
          workMode: 'Remote',
          priority: 'High',
          applicationStatus: 'Applied',
          hrRecruiterName: 'recruiting@stripe.com',
          gmailDraftId: 'draft-stripe-9821',
          automatorStatus: 'Draft Created',
          outreachSubject: 'Senior Full Stack Engineer Application – Praveen Kashyap',
          outreachBodyPreview: 'Hi Team, I noticed your opening for a Senior Full Stack Engineer. With 3+ years specializing in distributed systems, C# .NET, and React micro-frontends...',
          appliedDate: new Date().toISOString().slice(0, 10),
          notes: 'Auto-generated by Claude for Praveen Kashyap (SDE & Full Stack).'
        }),
        createAutomatorSeed({
          id: 'job-datadog-sde',
          companyName: 'Datadog',
          targetRole: 'Senior Full Stack & Systems Engineer',
          domain: 'sde',
          location: 'San Francisco, CA (Hybrid)',
          workMode: 'Hybrid',
          priority: 'High',
          applicationStatus: 'Interviewing',
          hrRecruiterName: 'talent-infra@datadoghq.com',
          gmailDraftId: 'draft-datadog-4421',
          automatorStatus: 'Sent',
          outreachSubject: 'Senior Full Stack Engineer Application – Praveen Kashyap',
          outreachBodyPreview: 'Hello Datadog Recruiting Team, Having architected high-performance web microservices in React and robust distributed backend APIs with 3+ years experience...',
          appliedDate: new Date(Date.now() - 86400000 * 2).toISOString().slice(0, 10),
          notes: 'Sent via Gmail Automator for Praveen Kashyap.'
        }),
        createAutomatorSeed({
          id: 'job-snowflake-sde',
          companyName: 'Snowflake',
          targetRole: 'Senior Backend Developer / SDE (C# / Go)',
          domain: 'sde',
          location: 'Remote',
          workMode: 'Remote',
          priority: 'High',
          applicationStatus: 'Not Started',
          hrRecruiterName: 'careers@snowflake.com',
          gmailDraftId: 'draft-snowflake-7712',
          automatorStatus: 'Draft Created',
          outreachSubject: 'Senior Backend Developer role – Praveen Kashyap',
          outreachBodyPreview: 'Dear Hiring Team, I am reaching out regarding the Senior Backend Developer position. My background in building high-throughput microservices and data pipelines...',
          appliedDate: new Date().toISOString().slice(0, 10),
          notes: 'Draft created in Gmail. Pending final review before sending.'
        }),
        createAutomatorSeed({
          id: 'job-hashicorp-fsd',
          companyName: 'HashiCorp',
          targetRole: 'Senior Full Stack Software Engineer (FSD / React / Go)',
          domain: 'sde',
          location: 'Remote',
          workMode: 'Remote',
          priority: 'High',
          applicationStatus: 'Not Started',
          hrRecruiterName: 'engineering-hiring@hashicorp.com',
          gmailDraftId: 'draft-hashi-3390',
          automatorStatus: 'Draft Created',
          outreachSubject: 'Senior Full Stack Engineer Application – Praveen Kashyap',
          outreachBodyPreview: 'Hi HashiCorp Team, With 3+ years hands-on experience in Full Stack development, modern React micro-frontends, high-performance Go/C# distributed backends, and cloud-native workflows, I would love to contribute to HashiCorp products...',
          appliedDate: new Date().toISOString().slice(0, 10),
          notes: 'Auto-generated by Claude for Praveen Kashyap (SDE & Full Stack).'
        })
      );
    } else if (userId === 'user_anam') {
      // Seed Anam with 8 active applications
      let activeCount = 0;
      jobs = jobs.map(j => {
        if ((j.domain === 'cloud' || j.domain === 'dual') && activeCount < 8) {
          activeCount++;
          const status: ApplicationStatus = activeCount <= 2 ? 'Interviewing' : 'Applied';
          return {
            ...j,
            applicationStatus: status,
            appliedDate: new Date(Date.now() - activeCount * 86400000 * 3).toISOString().slice(0, 10),
            notes: 'Followed up with recruiter on LinkedIn'
          };
        }
        return {
          ...j,
          applicationStatus: 'Not Started' as ApplicationStatus
        };
      });
    } else {
      // Fresh user profile
      jobs = jobs.map(j => ({
        ...j,
        applicationStatus: 'Not Started' as ApplicationStatus
      }));
    }

    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(storageKey, JSON.stringify(jobs));
      } catch {}
    }

    return jobs;
  },

  async updateJob(id: string, patch: Partial<JobItem>): Promise<JobItem> {
    const userId = getActiveUserId();
    if (!userId) {
      throw new Error('Unauthorized: Please log in or sign up to edit job statuses.');
    }

    if (!isMixedContentBlocked()) {
      try {
        const backendPatch = mapPatchToBackend(patch);
        const res = await fetch(`${API_BASE}/api/jobs/${id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders()
          },
          body: JSON.stringify(backendPatch)
        });
        if (res.ok) {
          const data = await res.json();
          return mapJobToFrontend(data);
        }
        if (res.status === 401) {
          throw new Error('Unauthorized');
        }
      } catch (err: any) {
        if (err.message === 'Unauthorized') throw err;
        console.warn('Backend API unavailable for updateJob, saving locally:', err.message);
      }
    }

    // Local storage persistence
    const storageKey = `job_tracker_jobs_${userId}`;
    const cached = typeof localStorage !== 'undefined' ? localStorage.getItem(storageKey) : null;
    let updatedJob: JobItem | null = null;

    if (cached) {
      try {
        const list: JobItem[] = JSON.parse(cached);
        const idx = list.findIndex(j => j.id === id);
        if (idx !== -1) {
          list[idx] = { ...list[idx], ...patch };
          updatedJob = list[idx];
          localStorage.setItem(storageKey, JSON.stringify(list));
        }
      } catch {}
    }

    return updatedJob || ({ id, ...patch } as JobItem);
  },
  
  async createJob(job: Partial<JobItem>): Promise<JobItem> {
    const userId = getActiveUserId();
    if (!userId) {
      throw new Error('Unauthorized: Please log in to add new job postings.');
    }

    if (!isMixedContentBlocked()) {
      try {
        const backendJob = mapPatchToBackend(job);
        const res = await fetch(`${API_BASE}/api/jobs`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders()
          },
          body: JSON.stringify(backendJob)
        });
        if (res.ok) {
          const data = await res.json();
          return mapJobToFrontend(data);
        }
      } catch (err: any) {
        console.warn('Backend API unavailable for createJob, saving locally:', err.message);
      }
    }

    const newJob: JobItem = {
      id: `local_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      companyName: job.companyName || '',
      targetRole: job.targetRole || '',
      domain: job.domain || 'sde',
      location: job.location || 'Remote',
      workMode: job.workMode || 'Remote',
      jobApplicationLink: job.jobApplicationLink || '',
      priority: job.priority || 'Normal',
      applicationStatus: job.applicationStatus || 'Not Started',
      nextAction: job.nextAction || 'Review opening',
      techStack: job.techStack || [],
      careerPageLink: job.careerPageLink || '',
      appliedDate: job.appliedDate || '',
      referralNeeded: job.referralNeeded || false,
      referralContactName: job.referralContactName || '',
      referralContactRole: job.referralContactRole || '',
      referralContactEmail: job.referralContactEmail || '',
      referralContactLinkedIn: job.referralContactLinkedIn || '',
      hrRecruiterName: job.hrRecruiterName || '',
      hrRecruiterEmail: job.hrRecruiterEmail || '',
      hrRecruiterLinkedIn: job.hrRecruiterLinkedIn || '',
      hrRecruiterPhone: job.hrRecruiterPhone || '',
      followUpDate: job.followUpDate || '',
      notes: job.notes || '',
      jdContent: job.jdContent || '',
      responseStatus: 'No Response',
      interviewStage: 'Not Started',
      createdAt: new Date().toISOString()
    };

    const storageKey = `job_tracker_jobs_${userId}`;
    const cached = typeof localStorage !== 'undefined' ? localStorage.getItem(storageKey) : null;
    if (cached) {
      try {
        const list: JobItem[] = JSON.parse(cached);
        list.unshift(newJob);
        localStorage.setItem(storageKey, JSON.stringify(list));
      } catch {}
    }

    return newJob;
  },

  async addNote(jobId: string, content: string, type: 'General' | 'JD' | 'Link' = 'General'): Promise<any> {
    if (!isMixedContentBlocked()) {
      try {
        const res = await fetch(`${API_BASE}/api/jobs/${jobId}/notes`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders()
          },
          body: JSON.stringify({ content, noteType: type })
        });
        if (res.ok) return await res.json();
      } catch (err: any) {
        console.warn('Backend API unavailable for addNote, saving locally:', err.message);
      }
    }

    const patch: Partial<JobItem> = type === 'JD' ? { jdContent: content } : { notes: content };
    await this.updateJob(jobId, patch);
    return { success: true, jobId, content, noteType: type };
  },

  async cloneJob(id: string): Promise<JobItem> {
    if (!isMixedContentBlocked()) {
      try {
        const res = await fetch(`${API_BASE}/api/jobs/${id}/clone`, {
          method: 'POST',
          headers: getAuthHeaders()
        });
        if (res.ok) {
          const data = await res.json();
          return mapJobToFrontend(data);
        }
      } catch (err: any) {
        console.warn('Backend API unavailable for cloneJob, cloning locally:', err.message);
      }
    }

    const jobs = await this.getJobs();
    const existing = jobs.find(j => j.id === id);
    if (!existing) throw new Error('Job not found to clone');
    return await this.createJob({
      ...existing,
      companyName: `${existing.companyName} (Copy)`
    });
  },

  async checkDuplicateJob(companyName: string, targetRole: string, excludeJobId?: string): Promise<{ isDuplicate: boolean }> {
    if (!isMixedContentBlocked()) {
      try {
        const url = new URL(`${API_BASE}/api/jobs/check-duplicate`);
        url.searchParams.append('companyName', companyName);
        url.searchParams.append('targetRole', targetRole);
        if (excludeJobId) {
          url.searchParams.append('excludeJobId', excludeJobId);
        }
        const res = await fetch(url.toString(), {
          headers: getAuthHeaders()
        });
        if (res.ok) return await res.json();
      } catch (err: any) {
        // Fallback to local check
      }
    }

    const jobs = await this.getJobs();
    const cNorm = companyName.trim().toLowerCase();
    const rNorm = targetRole.trim().toLowerCase();
    const isDuplicate = jobs.some(j => 
      j.id !== excludeJobId && 
      j.companyName.trim().toLowerCase() === cNorm && 
      j.targetRole.trim().toLowerCase() === rNorm
    );
    return { isDuplicate };
  },

  // Auth & Profile methods
  async login(email: string, password: string): Promise<AuthResponse> {
    if (!isMixedContentBlocked()) {
      try {
        const res = await fetch(`${API_BASE}/api/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Api-Key': 'dev-local-key'
          },
          body: JSON.stringify({ email, password })
        });
        if (res.ok) {
          return await res.json();
        }
        if (res.status === 401 || res.status === 400) {
          const err = await res.json().catch(() => ({ message: 'Invalid email or password' }));
          throw new Error(err.message || 'Invalid email or password');
        }
      } catch (err: any) {
        if (err.message === 'Invalid email or password' || err.message?.toLowerCase().includes('password')) {
          throw err;
        }
        console.warn('Backend unavailable, falling back to client-side auth mode:', err.message);
      }
    }

    // Client-side fallback authentication
    const normalizedEmail = email.trim().toLowerCase();
    for (const [key, demo] of Object.entries(DEMO_USERS)) {
      if (key.toLowerCase() === normalizedEmail) {
        return demo;
      }
    }

    // Check custom registered users from localStorage
    const localUsersJson = typeof localStorage !== 'undefined' ? localStorage.getItem('job_tracker_registered_users') : null;
    if (localUsersJson) {
      try {
        const users: UserProfileDto[] = JSON.parse(localUsersJson);
        const match = users.find(u => u.email.toLowerCase() === normalizedEmail);
        if (match) {
          return {
            token: `token_${match.id}`,
            user: match
          };
        }
      } catch {}
    }

    // Fallback: create dynamic session user
    const newUser: UserProfileDto = {
      id: `user_${Date.now()}`,
      fullName: email.split('@')[0],
      email: normalizedEmail,
      targetDomain: 'dual',
      currentRole: 'Software Engineer',
      yoe: '3+ years',
      keyStrengths: 'Full Stack Development, Microservices',
      createdAt: new Date().toISOString()
    };
    return {
      token: `token_${newUser.id}`,
      user: newUser
    };
  },

  async signup(data: {
    email: string;
    password: string;
    fullName: string;
    targetDomain?: string;
    currentRole?: string;
    yoe?: string;
    keyStrengths?: string;
    linkedinUrl?: string;
    phone?: string;
    resumeSummary?: string;
  }): Promise<AuthResponse> {
    if (!isMixedContentBlocked()) {
      try {
        const res = await fetch(`${API_BASE}/api/auth/signup`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Api-Key': 'dev-local-key'
          },
          body: JSON.stringify(data)
        });
        if (res.ok) {
          return await res.json();
        }
        if (res.status === 400 || res.status === 409) {
          const err = await res.json().catch(() => ({ message: 'Sign up failed' }));
          throw new Error(err.message || 'Sign up failed');
        }
      } catch (err: any) {
        if (err.message?.includes('already exists') || err.message?.includes('Sign up failed')) {
          throw err;
        }
        console.warn('Backend unavailable, saving profile locally:', err.message);
      }
    }

    // Client-side fallback registration
    const normalizedEmail = data.email.trim().toLowerCase();
    const newUser: UserProfileDto = {
      id: `user_${Date.now()}`,
      fullName: data.fullName.trim(),
      email: normalizedEmail,
      targetDomain: data.targetDomain || 'dual',
      currentRole: data.currentRole?.trim() || 'Software Engineer',
      yoe: data.yoe?.trim() || '3+ years',
      keyStrengths: data.keyStrengths?.trim() || 'Full Stack Development, Microservices',
      linkedinUrl: data.linkedinUrl?.trim() || '',
      phone: data.phone?.trim() || '',
      resumeSummary: data.resumeSummary?.trim() || '',
      createdAt: new Date().toISOString()
    };

    if (typeof localStorage !== 'undefined') {
      try {
        const localUsersJson = localStorage.getItem('job_tracker_registered_users');
        const users: UserProfileDto[] = localUsersJson ? JSON.parse(localUsersJson) : [];
        if (!users.some(u => u.email.toLowerCase() === normalizedEmail)) {
          users.push(newUser);
          localStorage.setItem('job_tracker_registered_users', JSON.stringify(users));
        }
      } catch {}
    }

    return {
      token: `token_${newUser.id}`,
      user: newUser
    };
  },

  async getCurrentUser(): Promise<UserProfileDto> {
    if (!isMixedContentBlocked()) {
      try {
        const res = await fetch(`${API_BASE}/api/auth/me`, {
          headers: getAuthHeaders()
        });
        if (res.ok) {
          return await res.json();
        }
      } catch (err: any) {
        console.warn('Backend unavailable for getCurrentUser, returning local profile');
      }
    }

    const activeId = getActiveUserId();
    if (activeId === 'user_praveen') {
      return DEMO_USERS['2pkashyap2001@gmail.com'].user;
    }
    if (activeId === 'user_anam') {
      return DEMO_USERS['anamansari.0406@gmail.com'].user;
    }

    if (typeof localStorage !== 'undefined') {
      const localUsersJson = localStorage.getItem('job_tracker_registered_users');
      if (localUsersJson) {
        try {
          const users: UserProfileDto[] = JSON.parse(localUsersJson);
          const match = users.find(u => u.id === activeId);
          if (match) return match;
        } catch {}
      }

      const savedProfile = localStorage.getItem('job_tracker_user_profile');
      if (savedProfile) {
        try {
          const p = JSON.parse(savedProfile);
          return {
            id: activeId || 'user_local',
            fullName: p.fullName || 'User',
            email: p.email || '',
            targetDomain: p.targetDomain || 'dual',
            currentRole: p.currentRole || 'Software Engineer',
            yoe: p.yoe || '3+ years',
            keyStrengths: p.keyStrengths || '',
            phone: p.phone || '',
            linkedinUrl: p.linkedinUrl || '',
            resumeSummary: p.resumeSummary || '',
            createdAt: new Date().toISOString()
          };
        } catch {}
      }
    }

    return DEMO_USERS['2pkashyap2001@gmail.com'].user;
  },

  async updateProfile(updates: Partial<UserProfileDto>): Promise<UserProfileDto> {
    if (!isMixedContentBlocked()) {
      try {
        const res = await fetch(`${API_BASE}/api/auth/profile`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders()
          },
          body: JSON.stringify(updates)
        });
        if (res.ok) {
          return await res.json();
        }
      } catch (err: any) {
        console.warn('Backend unavailable for updateProfile, saving locally');
      }
    }

    const current = await this.getCurrentUser();
    const updated: UserProfileDto = {
      ...current,
      ...updates
    };

    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem('job_tracker_user_profile', JSON.stringify(updated));
        
        const localUsersJson = localStorage.getItem('job_tracker_registered_users');
        if (localUsersJson) {
          const users: UserProfileDto[] = JSON.parse(localUsersJson);
          const idx = users.findIndex(u => u.id === updated.id);
          if (idx !== -1) {
            users[idx] = updated;
            localStorage.setItem('job_tracker_registered_users', JSON.stringify(users));
          }
        }
      } catch {}
    }

    return updated;
  },

  async getUsers(): Promise<PublicUserSummary[]> {
    if (!isMixedContentBlocked()) {
      try {
        const res = await fetch(`${API_BASE}/api/auth/users`, {
          headers: getAuthHeaders()
        });
        if (res.ok) {
          return await res.json();
        }
      } catch (err: any) {
        console.warn('Backend unavailable for getUsers, returning default public accounts');
      }
    }

    const defaultSummaries: PublicUserSummary[] = [
      {
        id: 'user_praveen',
        fullName: 'Praveen Kashyap',
        email: '2pkashyap2001@gmail.com',
        targetDomain: 'sde',
        currentRole: 'Full Stack Engineer / SDE'
      },
      {
        id: 'user_anam',
        fullName: 'Anam Ansari',
        email: 'anamansari.0406@gmail.com',
        targetDomain: 'dual',
        currentRole: 'Software Engineer'
      }
    ];

    if (typeof localStorage !== 'undefined') {
      const localUsersJson = localStorage.getItem('job_tracker_registered_users');
      if (localUsersJson) {
        try {
          const users: UserProfileDto[] = JSON.parse(localUsersJson);
          for (const u of users) {
            if (!defaultSummaries.some(d => d.id === u.id || d.email.toLowerCase() === u.email.toLowerCase())) {
              defaultSummaries.push({
                id: u.id,
                fullName: u.fullName,
                email: u.email,
                targetDomain: u.targetDomain,
                currentRole: u.currentRole
              });
            }
          }
        } catch {}
      }
    }

    return defaultSummaries;
  },

  async seedInitialUsers(): Promise<{ message: string }> {
    if (!isMixedContentBlocked()) {
      try {
        const res = await fetch(`${API_BASE}/api/auth/seed-initial-users`, {
          method: 'POST',
          headers: getAuthHeaders()
        });
        if (res.ok) return await res.json();
      } catch {}
    }
    return { message: 'Initial users ready' };
  }
};

function mapDomainToFrontend(d: string): JobDomain {
  if (d === 'SDE / FullStack') return 'sde';
  if (d === 'Cloud / DevOps') return 'cloud';
  if (d === 'Dual Domain') return 'dual';
  return 'general';
}

function mapDomainToBackend(d: string | undefined): string | undefined {
  if (d === 'sde') return 'SDE / FullStack';
  if (d === 'cloud') return 'Cloud / DevOps';
  if (d === 'dual') return 'Dual Domain';
  return undefined;
}

function mapJobToFrontend(job: any): JobItem {
  return {
    id: String(job.id),
    companyName: job.companyName || '',
    targetRole: job.targetRole || '',
    domain: mapDomainToFrontend(job.domain),
    location: job.location || '',
    workMode: (job.workMode as WorkMode) || 'Unknown',
    jobApplicationLink: job.applicationLink || '',
    priority: (job.priority as Priority) || 'Normal',
    applicationStatus: (job.applicationStatus as ApplicationStatus) || 'Not Started',
    nextAction: job.nextAction || '',
    techStack: job.techStack ? (Array.isArray(job.techStack) ? job.techStack : job.techStack.split(',').map((t: string) => t.trim())) : [],
    careerPageLink: job.careerPageLink || '',
    appliedDate: job.appliedDate || '',
    referralNeeded: job.referralNeeded || false,
    referralContactName: job.referralContactName || '',
    hrRecruiterName: job.hrRecruiterName || '',
    notes: job.notes && Array.isArray(job.notes) && job.notes.length > 0 
      ? [...job.notes].sort((a: any, b: any) => (b.id || 0) - (a.id || 0)).find((n: any) => n.noteType === 'General')?.content || '' 
      : (typeof job.notes === 'string' ? job.notes : ''),
    jdContent: job.notes && Array.isArray(job.notes) && job.notes.length > 0 
      ? [...job.notes].sort((a: any, b: any) => (b.id || 0) - (a.id || 0)).find((n: any) => n.noteType === 'JD')?.content || '' 
      : (typeof job.jdContent === 'string' ? job.jdContent : ''),
    
    referralContactRole: job.referralContactRole || '',
    referralContactEmail: job.referralContactEmail || '',
    referralContactLinkedIn: job.referralContactLinkedIn || '',
    hrRecruiterEmail: job.hrRecruiterEmail || '',
    hrRecruiterLinkedIn: job.hrRecruiterLinkedIn || '',
    hrRecruiterPhone: job.hrRecruiterPhone || '',
    followUpDate: job.followUpDate || '',
    responseStatus: job.responseStatus || '',
    interviewStage: job.interviewStage || '',

    gmailDraftId: job.gmailDraftId || undefined,
    automatorStatus: job.automatorStatus || undefined,
    outreachSubject: job.outreachSubject || undefined,
    outreachBodyPreview: job.outreachBodyPreview || undefined,
    createdAt: job.createdAt || undefined,
  };
}

function mapPatchToBackend(patch: Partial<JobItem>): any {
  const backendPatch: any = {};
  if (patch.companyName !== undefined) backendPatch.companyName = patch.companyName;
  if (patch.targetRole !== undefined) backendPatch.targetRole = patch.targetRole;
  if (patch.applicationStatus !== undefined) backendPatch.applicationStatus = patch.applicationStatus;
  if (patch.priority !== undefined) backendPatch.priority = patch.priority;
  if (patch.nextAction !== undefined) backendPatch.nextAction = patch.nextAction;
  if (patch.location !== undefined) backendPatch.location = patch.location;
  if (patch.workMode !== undefined) backendPatch.workMode = patch.workMode;
  if (patch.jobApplicationLink !== undefined) backendPatch.applicationLink = patch.jobApplicationLink;
  if (patch.careerPageLink !== undefined) backendPatch.careerPageLink = patch.careerPageLink;
  if (patch.techStack !== undefined) backendPatch.techStack = patch.techStack.join(', ');
  if (patch.referralNeeded !== undefined) backendPatch.referralNeeded = patch.referralNeeded;
  if (patch.referralContactName !== undefined) backendPatch.referralContactName = patch.referralContactName;
  if (patch.referralContactRole !== undefined) backendPatch.referralContactRole = patch.referralContactRole;
  if (patch.referralContactEmail !== undefined) backendPatch.referralContactEmail = patch.referralContactEmail;
  if (patch.referralContactLinkedIn !== undefined) backendPatch.referralContactLinkedIn = patch.referralContactLinkedIn;
  if (patch.hrRecruiterName !== undefined) backendPatch.hrRecruiterName = patch.hrRecruiterName;
  if (patch.hrRecruiterEmail !== undefined) backendPatch.hrRecruiterEmail = patch.hrRecruiterEmail;
  if (patch.hrRecruiterLinkedIn !== undefined) backendPatch.hrRecruiterLinkedIn = patch.hrRecruiterLinkedIn;
  if (patch.hrRecruiterPhone !== undefined) backendPatch.hrRecruiterPhone = patch.hrRecruiterPhone;
  if (patch.appliedDate !== undefined) backendPatch.appliedDate = patch.appliedDate || null;
  if (patch.followUpDate !== undefined) backendPatch.followUpDate = patch.followUpDate || null;
  if (patch.domain !== undefined) backendPatch.domain = mapDomainToBackend(patch.domain);
  if (patch.automatorStatus !== undefined) backendPatch.automatorStatus = patch.automatorStatus;
  if (patch.gmailDraftId !== undefined) backendPatch.gmailDraftId = patch.gmailDraftId;
  if (patch.outreachSubject !== undefined) backendPatch.outreachSubject = patch.outreachSubject;
  if (patch.outreachBodyPreview !== undefined) backendPatch.outreachBodyPreview = patch.outreachBodyPreview;
  return backendPatch;
}
