export type WorkMode = 'Hybrid' | 'Remote' | 'Onsite' | 'Unknown';
export type Priority = 'High' | 'Medium' | 'Low' | 'Normal' | 'Unknown';
export type ApplicationStatus = 
  | 'Not Started' 
  | 'Applied' 
  | 'Under Review' 
  | 'Interviewing' 
  | 'Offered' 
  | 'Rejected' 
  | 'Archived'
  | string;

export type ViewMode = 'dashboard' | 'all' | 'ready' | 'applied' | 'interview' | 'offers' | 'rejected' | 'archived';
export type JobDomain = 'sde' | 'cloud' | 'dual' | 'general';
export type ActiveDomain = 'all' | 'sde' | 'cloud';

export interface JobItem {
  id: string;
  companyName: string;
  targetRole: string;
  location: string;
  workMode: WorkMode;
  techStack: string[];
  careerPageLink: string;
  jobApplicationLink: string;
  jdContent: string; // URL to job app or pasted JD text
  applicationStatus: ApplicationStatus;
  appliedDate: string;
  referralNeeded: boolean;
  referralContactName: string;
  referralContactRole: string;
  referralContactEmail: string;
  referralContactLinkedIn: string;
  hrRecruiterName: string;
  hrRecruiterEmail: string;
  hrRecruiterLinkedIn: string;
  followUpDate: string;
  responseStatus: string;
  interviewStage: string;
  priority: Priority;
  nextAction: string;
  notes: string;
  domain: JobDomain; // Auto-classified from keywords or Excel Track override
}

export interface FilterState {
  searchQuery: string;
  activeDomain: ActiveDomain;
  priority: Priority[];
  workMode: WorkMode[];
  status: ApplicationStatus[];
  techFilters: string[]; // Active tech stack filter tags (e.g., Azure, React, .NET Core)
  viewMode: ViewMode;
  sortBy: keyof JobItem | '';
  sortDirection: 'asc' | 'desc';
}

export interface DomainMetrics {
  totalJobs: number;
  readyToApply: number;
  applied: number;
  highPriority: number;
  withReferrals: number;
  interviewing: number;
  offers: number;
  
  // Domain-specific counts
  sdeCount: number;
  cloudDevOpsCount: number;
  dualCount: number;
  
  // Tech stack counts across active dataset
  dotnetCount: number;
  reactAngularCount: number;
  azureCount: number;
  dockerK8sCount: number;
  cicdCount: number;
}
