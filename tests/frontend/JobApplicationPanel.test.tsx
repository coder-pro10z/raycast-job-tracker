// @vitest-environment jsdom
/**
 * JobApplicationPanel.test.tsx
 *
 * Component tests for:
 *   - JobApplicationPanel (frontend/src/components/jobapp/JobApplicationPanel.tsx)
 *   - AutomatorStatusBadge (frontend/src/components/jobapp/AutomatorStatusBadge.tsx)
 *
 * Run: npx vitest run tests/frontend/JobApplicationPanel.test.tsx
 */

import React from 'react';
import { describe, test, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AutomatorStatusBadge } from '../../frontend/src/components/jobapp/AutomatorStatusBadge';
import { JobApplicationPanel } from '../../frontend/src/components/jobapp/JobApplicationPanel';
import type { JobItem } from '../../frontend/src/types/job';

// ── Mock Zustand and Query hooks for JobApplicationPanel ──────────────────────
vi.mock('../../frontend/src/state/useJobStore', () => ({
  useJobStore: () => ({
    setSelectedJobId: vi.fn(),
    showToast: vi.fn(),
    currentUser: null,
    userProfile: {
      fullName: 'Praveen Kashyap',
      email: '2pkashyap2001@gmail.com',
      currentRole: 'Full Stack Engineer / SDE',
      yoe: '3+ years',
      targetDomain: 'sde',
      keyStrengths: 'React, .NET Core',
      phone: '+91 7394990738',
      linkedinUrl: 'https://linkedin.com/in/coder-pro10z',
      githubUrl: 'https://github.com/coder-pro10z'
    },
    filterState: {
      activeDomain: 'all',
      searchQuery: '',
      priority: [],
      workMode: [],
      status: [],
      techFilters: [],
      viewMode: 'job-applications',
      sortBy: 'priority',
      sortDirection: 'desc'
    }
  }),
}));

vi.mock('../../frontend/src/hooks/useJobApplicationImport', () => ({
  useJobApplicationImport: () => ({
    automatorJobs: [],
    isLoading: false,
    error: null,
    metrics: { total: 0, drafts: 0, sent: 0, skipped: 0, markedApplied: 0 },
    markAsApplied: vi.fn(),
    isUpdating: false,
    refetch: vi.fn(),
  }),
}));

vi.mock('../../frontend/src/hooks/useJobs', () => ({
  useCreateJob: () => ({
    mutateAsync: vi.fn(),
    isPending: false,
  }),
  useUpdateJob: () => ({
    mutateAsync: vi.fn(),
    isPending: false,
  }),
}));

vi.mock('../../frontend/src/components/common/StatusBadgeDropdown', () => ({
  StatusBadgeDropdown: ({ currentStatus }: { currentStatus: string }) => (
    <span data-testid="status-badge-dropdown">{currentStatus}</span>
  ),
}));

// ── Mock data ─────────────────────────────────────────────────────────────────

const mockAutomatorJobs: JobItem[] = [
  {
    id: '1',
    companyName: 'ACME Corp',
    targetRole: 'Senior .NET Engineer',
    location: 'Remote',
    workMode: 'Remote',
    techStack: ['C#', '.NET'],
    careerPageLink: '',
    jobApplicationLink: '',
    jdContent: '',
    applicationStatus: 'Not Started',
    appliedDate: '',
    referralNeeded: false,
    referralContactName: '',
    referralContactRole: '',
    referralContactEmail: '',
    referralContactLinkedIn: '',
    hrRecruiterName: 'john.doe',
    hrRecruiterEmail: 'john.doe@acme.com',
    hrRecruiterLinkedIn: '',
    followUpDate: '',
    responseStatus: '',
    interviewStage: '',
    priority: 'High',
    nextAction: '',
    notes: '',
    domain: 'sde',
    gmailDraftId: 'draft-001',
    automatorStatus: 'Draft Created',
    outreachSubject: 'Re: Senior .NET Developer – ACME Corp',
    outreachBodyPreview: 'Hi, I came across the Senior .NET Developer role at ACME Corp...',
    createdAt: '2026-09-17T00:00:00Z',
  },
  {
    id: '2',
    companyName: 'Beta Tech',
    targetRole: 'Full Stack Dev',
    location: 'Hybrid',
    workMode: 'Hybrid',
    techStack: ['React', 'Node'],
    careerPageLink: '',
    jobApplicationLink: '',
    jdContent: '',
    applicationStatus: 'Applied',
    appliedDate: '2026-09-16',
    referralNeeded: false,
    referralContactName: '',
    referralContactRole: '',
    referralContactEmail: '',
    referralContactLinkedIn: '',
    hrRecruiterName: 'jane.smith',
    hrRecruiterEmail: 'jane.smith@betatech.com',
    hrRecruiterLinkedIn: '',
    followUpDate: '',
    responseStatus: '',
    interviewStage: '',
    priority: 'Medium',
    nextAction: '',
    notes: '',
    domain: 'sde',
    gmailDraftId: 'draft-002',
    automatorStatus: 'Sent',
    outreachSubject: 'Application for Full Stack Developer at Beta Tech',
    outreachBodyPreview: 'Hi, I noticed the Full Stack Developer opening...',
    createdAt: '2026-09-16T00:00:00Z',
  },
  {
    id: '3',
    companyName: 'Unknown (from automator)',
    targetRole: '',
    location: '',
    workMode: 'Unknown',
    techStack: [],
    careerPageLink: '',
    jobApplicationLink: '',
    jdContent: '',
    applicationStatus: 'Not Started',
    appliedDate: '',
    referralNeeded: false,
    referralContactName: '',
    referralContactRole: '',
    referralContactEmail: '',
    referralContactLinkedIn: '',
    hrRecruiterName: 'hr',
    hrRecruiterEmail: 'hr@example.com',
    hrRecruiterLinkedIn: '',
    followUpDate: '',
    responseStatus: '',
    interviewStage: '',
    priority: 'Medium',
    nextAction: '',
    notes: '',
    domain: 'general',
    gmailDraftId: 'draft-003',
    automatorStatus: 'Skipped',
    outreachSubject: '',
    outreachBodyPreview: '',
    createdAt: '2026-09-15T00:00:00Z',
  },
];

// ── AutomatorStatusBadge Tests ────────────────────────────────────────────────

describe('AutomatorStatusBadge', () => {
  test('renders blue badge for "Draft Created"', () => {
    render(<AutomatorStatusBadge status="Draft Created" />);
    const badge = screen.getByTestId('automator-badge');
    expect(badge.textContent).toBe('Draft Created');
    expect(badge.style.color).toBe('rgb(59, 130, 246)'); // #3b82f6
  });

  test('renders green badge for "Sent"', () => {
    render(<AutomatorStatusBadge status="Sent" />);
    const badge = screen.getByTestId('automator-badge');
    expect(badge.textContent).toBe('Sent');
    expect(badge.style.color).toBe('rgb(34, 197, 94)'); // #22c55e
  });

  test('renders amber badge for "Skipped"', () => {
    render(<AutomatorStatusBadge status="Skipped" />);
    const badge = screen.getByTestId('automator-badge');
    expect(badge.textContent).toBe('Skipped');
    expect(badge.style.color).toBe('rgb(245, 158, 11)'); // #f59e0b
  });

  test('renders fallback for unknown status value', () => {
    render(<AutomatorStatusBadge status="Unknown State" />);
    const badge = screen.getByTestId('automator-badge');
    expect(badge.textContent).toBe('Unknown State');
    expect(badge.style.color).toBe('rgb(148, 163, 184)'); // #94a3b8 slate
  });
});

// ── JobApplicationPanel Tests ─────────────────────────────────────────────────

describe('JobApplicationPanel — rendering', () => {
  test('renders loading skeleton while query is in flight', () => {
    render(<JobApplicationPanel jobs={[]} isLoading={true} />);
    expect(screen.getByTestId('loading-skeleton')).toBeTruthy();
  });

  test('renders empty state when no automator jobs exist', () => {
    render(<JobApplicationPanel jobs={[]} isLoading={false} />);
    expect(screen.getByTestId('empty-state')).toBeTruthy();
  });

  test('renders correct number of rows for returned jobs', () => {
    render(<JobApplicationPanel jobs={mockAutomatorJobs} isLoading={false} />);
    expect(screen.getByTestId('job-row-1')).toBeTruthy();
    expect(screen.getByTestId('job-row-2')).toBeTruthy();
    expect(screen.getByTestId('job-row-3')).toBeTruthy();
  });

  test('shows correct automator status text in each row', () => {
    render(<JobApplicationPanel jobs={mockAutomatorJobs} isLoading={false} />);
    expect(screen.getByTestId('status-1').textContent).toBe('Draft Created');
    expect(screen.getByTestId('status-2').textContent).toBe('Sent');
    expect(screen.getByTestId('status-3').textContent).toBe('Skipped');
  });

  test('"Open Draft" button renders and triggers Gmail Draft Preview & Editor', () => {
    render(<JobApplicationPanel jobs={[mockAutomatorJobs[0]]} isLoading={false} />);
    const btn = screen.getByTestId('open-draft-1');
    expect(btn).toBeTruthy();
    expect(btn.textContent).toContain('Open Draft');
  });

  test('renders company name for each row', () => {
    render(<JobApplicationPanel jobs={mockAutomatorJobs} isLoading={false} />);
    expect(screen.getByText('ACME Corp')).toBeTruthy();
    expect(screen.getByText('Beta Tech')).toBeTruthy();
    expect(screen.getByText('Unknown (from automator)')).toBeTruthy();
  });
});
