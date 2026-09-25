// @vitest-environment jsdom
import { describe, test, expect } from 'vitest';
import { 
  getJobReadinessScore, 
  isJobFullyEnriched, 
  isApplicationLinkValid, 
  isJdReady, 
  isDraftReady 
} from '../../frontend/src/state/useJobStore';
import type { JobItem } from '../../frontend/src/types/job';

describe('Job Readiness Scoring & Priority Sorting Engine', () => {
  const fullyEnrichedTekion: JobItem = {
    id: 'tekion-1',
    companyName: 'Tekion',
    targetRole: 'Software Engineer',
    location: 'Bengaluru',
    workMode: 'Hybrid',
    techStack: ['C#', '.NET Core', 'React', 'TypeScript'],
    careerPageLink: 'https://www.tekion.com/careers',
    jobApplicationLink: 'https://tekion.com/careers/open-positions?location=Bengaluru',
    jdContent: '### About Tekion\nTekion is a unicorn cloud-native SaaS enterprise transforming automotive retail with modern microservices. Requires 3+ years experience with C# .NET and React.',
    applicationStatus: 'Not Started',
    appliedDate: '',
    referralNeeded: false,
    referralContactName: '',
    referralContactRole: '',
    referralContactEmail: '',
    referralContactLinkedIn: '',
    hrRecruiterName: 'recruiter@tekion.com',
    hrRecruiterEmail: 'recruiter@tekion.com',
    hrRecruiterLinkedIn: '',
    followUpDate: '',
    responseStatus: '',
    interviewStage: '',
    priority: 'High',
    nextAction: 'Ready to Apply — Review Outreach Draft',
    notes: 'Pilot candidate for SDE',
    domain: 'sde',
    outreachSubject: 'Software Engineer Application – Praveen Kashyap (3+ YoE | .NET Core & React)',
    outreachBodyPreview: 'Hi Tekion Recruiting Team, With 3+ years of full-stack engineering experience...'
  };

  const incompleteHighPrioJob: JobItem = {
    id: 'mindtree-legacy',
    companyName: 'Mindtree (Unfilled)',
    targetRole: 'Software Engineer',
    location: 'Bengaluru',
    workMode: 'Hybrid',
    techStack: ['Java', 'SQL'],
    careerPageLink: '',
    jobApplicationLink: '',
    jdContent: 'Find application link',
    applicationStatus: 'Not Started',
    appliedDate: '',
    referralNeeded: false,
    referralContactName: '',
    referralContactRole: '',
    referralContactEmail: '',
    referralContactLinkedIn: '',
    hrRecruiterName: '',
    hrRecruiterEmail: '',
    hrRecruiterLinkedIn: '',
    followUpDate: '',
    responseStatus: '',
    interviewStage: '',
    priority: 'High',
    nextAction: 'Find application link',
    notes: '',
    domain: 'sde'
  };

  const mediumPrioEnriched: JobItem = {
    ...fullyEnrichedTekion,
    id: 'medium-enriched',
    companyName: 'Medium Co Enriched',
    priority: 'Medium'
  };

  test('validates direct application link correctly', () => {
    expect(isApplicationLinkValid('https://tekion.com/apply')).toBe(true);
    expect(isApplicationLinkValid('http://tekion.com/apply')).toBe(true);
    expect(isApplicationLinkValid('')).toBe(false);
    expect(isApplicationLinkValid('#')).toBe(false);
    expect(isApplicationLinkValid('Find application link')).toBe(false);
    expect(isApplicationLinkValid(undefined)).toBe(false);
  });

  test('validates structured JD content correctly', () => {
    expect(isJdReady(fullyEnrichedTekion.jdContent)).toBe(true);
    expect(isJdReady('Too short')).toBe(false);
    expect(isJdReady('Find application link')).toBe(false);
    expect(isJdReady('')).toBe(false);
  });

  test('validates cold outreach draft materials correctly', () => {
    expect(isDraftReady(fullyEnrichedTekion)).toBe(true);
    expect(isDraftReady(incompleteHighPrioJob)).toBe(false);
  });

  test('calculates accurate readiness score', () => {
    // App link (+4) + JD (+3) + Draft (+2) + Career portal (+1) = 10
    expect(getJobReadinessScore(fullyEnrichedTekion)).toBe(10);
    expect(isJobFullyEnriched(fullyEnrichedTekion)).toBe(true);

    // Unfilled job: 0
    expect(getJobReadinessScore(incompleteHighPrioJob)).toBe(0);
    expect(isJobFullyEnriched(incompleteHighPrioJob)).toBe(false);
  });

  test('sorts fully enriched companies to the top within the same priority tier', () => {
    const list = [incompleteHighPrioJob, fullyEnrichedTekion];
    
    // Sort simulating Priority descending with readiness score tiebreaker
    list.sort((a, b) => {
      const rank = (p: string) => (p === 'High' ? 3 : p === 'Medium' ? 2 : p === 'Low' ? 1 : 0);
      const prioDiff = (rank(a.priority) - rank(b.priority)) * -1; // desc
      if (prioDiff !== 0) return prioDiff;

      const scoreDiff = getJobReadinessScore(b) - getJobReadinessScore(a);
      if (scoreDiff !== 0) return scoreDiff;

      return a.companyName.localeCompare(b.companyName);
    });

    expect(list[0].companyName).toBe('Tekion');
    expect(list[1].companyName).toBe('Mindtree (Unfilled)');
  });

  test('preserves priority tiers while floating ready jobs to top of each tier', () => {
    const list = [incompleteHighPrioJob, mediumPrioEnriched, fullyEnrichedTekion];

    list.sort((a, b) => {
      const rank = (p: string) => (p === 'High' ? 3 : p === 'Medium' ? 2 : p === 'Low' ? 1 : 0);
      const prioDiff = (rank(a.priority) - rank(b.priority)) * -1;
      if (prioDiff !== 0) return prioDiff;

      const scoreDiff = getJobReadinessScore(b) - getJobReadinessScore(a);
      if (scoreDiff !== 0) return scoreDiff;

      return a.companyName.localeCompare(b.companyName);
    });

    // High Priority Ready (Tekion) first
    expect(list[0].companyName).toBe('Tekion');
    // High Priority Unfilled second
    expect(list[1].companyName).toBe('Mindtree (Unfilled)');
    // Medium Priority third
    expect(list[2].companyName).toBe('Medium Co Enriched');
  });
});
