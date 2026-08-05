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
}

export interface FilterState {
  searchQuery: string;
  priority: Priority[];
  workMode: WorkMode[];
  status: ApplicationStatus[];
  viewMode: ViewMode;
  sortBy: keyof JobItem | '';
  sortDirection: 'asc' | 'desc';
}

export interface DashboardMetrics {
  totalJobs: number;
  readyToApply: number;
  applied: number;
  highPriority: number;
  withReferrals: number;
  interviewing: number;
  offers: number;
}
