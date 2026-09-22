import type { JobItem, JobDomain, Priority, WorkMode, ApplicationStatus } from '../types/job';
import type { UserProfileDto, PublicUserSummary, AuthResponse } from '../types/auth';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5089';

function getAuthHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    'X-Api-Key': localStorage.getItem('apiKey') || 'dev-local-key'
  };
  const token = localStorage.getItem('job_tracker_token');
  const userId = localStorage.getItem('job_tracker_active_user_id');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  if (userId) {
    headers['X-User-Id'] = userId;
  }
  return headers;
}

export const apiClient = {
  async getJobs(): Promise<JobItem[]> {
    const res = await fetch(`${API_BASE}/api/jobs`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) {
        if (res.status === 401) throw new Error('Unauthorized');
        throw new Error('Failed to load jobs');
    }
    const data = await res.json();
    return data.map(mapJobToFrontend);
  },

  async updateJob(id: string, patch: Partial<JobItem>): Promise<JobItem> {
    const backendPatch = mapPatchToBackend(patch);
    const res = await fetch(`${API_BASE}/api/jobs/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify(backendPatch)
    });
    if (!res.ok) throw new Error('Failed to update job');
    const data = await res.json();
    return mapJobToFrontend(data);
  },
  
  async createJob(job: Partial<JobItem>): Promise<JobItem> {
    const backendJob = mapPatchToBackend(job);
    const res = await fetch(`${API_BASE}/api/jobs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify(backendJob)
    });
    if (!res.ok) throw new Error('Failed to create job');
    const data = await res.json();
    return mapJobToFrontend(data);
  },

  async addNote(jobId: string, content: string, type: 'General' | 'JD' | 'Link' = 'General'): Promise<any> {
    const res = await fetch(`${API_BASE}/api/jobs/${jobId}/notes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify({ content, noteType: type })
    });
    if (!res.ok) throw new Error('Failed to add note');
    return res.json();
  },

  async cloneJob(id: string): Promise<JobItem> {
    const res = await fetch(`${API_BASE}/api/jobs/${id}/clone`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to clone job');
    const data = await res.json();
    return mapJobToFrontend(data);
  },

  async checkDuplicateJob(companyName: string, targetRole: string, excludeJobId?: string): Promise<{ isDuplicate: boolean }> {
    const url = new URL(`${API_BASE}/api/jobs/check-duplicate`);
    url.searchParams.append('companyName', companyName);
    url.searchParams.append('targetRole', targetRole);
    if (excludeJobId) {
      url.searchParams.append('excludeJobId', excludeJobId);
    }
    const res = await fetch(url.toString(), {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to check duplicate job');
    return res.json();
  },

  // Auth & Profile methods
  async login(email: string, password: string): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': 'dev-local-key'
      },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: 'Login failed' }));
      throw new Error(err.message || 'Invalid email or password');
    }
    return res.json();
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
    const res = await fetch(`${API_BASE}/api/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': 'dev-local-key'
      },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: 'Sign up failed' }));
      throw new Error(err.message || 'Sign up failed');
    }
    return res.json();
  },

  async getCurrentUser(): Promise<UserProfileDto> {
    const res = await fetch(`${API_BASE}/api/auth/me`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch user profile');
    return res.json();
  },

  async updateProfile(updates: Partial<UserProfileDto>): Promise<UserProfileDto> {
    const res = await fetch(`${API_BASE}/api/auth/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify(updates)
    });
    if (!res.ok) throw new Error('Failed to update profile');
    return res.json();
  },

  async getUsers(): Promise<PublicUserSummary[]> {
    const res = await fetch(`${API_BASE}/api/auth/users`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch users');
    return res.json();
  },

  async seedInitialUsers(): Promise<{ message: string }> {
    const res = await fetch(`${API_BASE}/api/auth/seed-initial-users`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to seed users');
    return res.json();
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
    return undefined; // general doesn't map perfectly, but fine
}

function mapJobToFrontend(job: any): JobItem {
  return {
    id: String(job.id),
    companyName: job.companyName || '',
    targetRole: job.targetRole || '',
    domain: mapDomainToFrontend(job.domain),
    location: job.location || '',
    workMode: (job.workMode as WorkMode) || 'Unknown',
    jobApplicationLink: job.applicationLink || '', // Map to frontend prop
    priority: (job.priority as Priority) || 'Normal',
    applicationStatus: (job.applicationStatus as ApplicationStatus) || 'Not Started',
    nextAction: job.nextAction || '',
    techStack: job.techStack ? job.techStack.split(',').map((t: string) => t.trim()) : [],
    careerPageLink: job.careerPageLink || '',
    appliedDate: job.appliedDate || '',
    referralNeeded: job.referralNeeded || false,
    referralContactName: job.referralContactName || '',
    hrRecruiterName: job.hrRecruiterName || '',
    // Map Notes logic if notes relation exists, else just string
    notes: job.notes && job.notes.length > 0 ? [...job.notes].sort((a:any, b:any) => (b.id || 0) - (a.id || 0)).find((n:any)=>n.noteType==='General')?.content || '' : '',
    jdContent: job.notes && job.notes.length > 0 ? [...job.notes].sort((a:any, b:any) => (b.id || 0) - (a.id || 0)).find((n:any)=>n.noteType==='JD')?.content || '' : '',
    
    // Unused but required by TS currently
    referralContactRole: job.referralContactRole || '',
    referralContactEmail: job.referralContactEmail || '',
    referralContactLinkedIn: job.referralContactLinkedIn || '',
    hrRecruiterEmail: job.hrRecruiterEmail || '',
    hrRecruiterLinkedIn: job.hrRecruiterLinkedIn || '',
    hrRecruiterPhone: job.hrRecruiterPhone || '',
    followUpDate: job.followUpDate || '',
    responseStatus: '',
    interviewStage: '',

    // Gmail JD Automator integration fields
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
