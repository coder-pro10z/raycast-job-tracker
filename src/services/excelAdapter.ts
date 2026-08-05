import * as XLSX from 'xlsx';
import type { JobItem, WorkMode, Priority, ApplicationStatus, JobDomain } from '../types/job';
import type { IDataProvider } from './dataProvider';

export class ExcelAdapter implements IDataProvider {
  private filePaths: string[];

  constructor(filePaths: string[] = ['/Jobs-sheet.xlsx', '/Cloud_DevOps_Jobs_Tracker.xlsx']) {
    this.filePaths = filePaths;
  }

  public async loadJobs(): Promise<JobItem[]> {
    try {
      const allJobs: JobItem[] = [];

      for (const filePath of this.filePaths) {
        try {
          const response = await fetch(filePath, { cache: 'no-cache' });
          if (response.ok) {
            const arrayBuffer = await response.arrayBuffer();
            const jobs = this.parseArrayBuffer(arrayBuffer, filePath);
            allJobs.push(...jobs);
          } else {
            console.warn(`Could not load workbook at ${filePath}: ${response.statusText}`);
          }
        } catch (fileError) {
          console.warn(`Error loading workbook at ${filePath}:`, fileError);
        }
      }

      if (allJobs.length === 0) {
        throw new Error('Failed to load any job opportunities from Excel workbooks.');
      }

      return this.deduplicateJobs(allJobs);
    } catch (error) {
      console.error('Error loading jobs from Excel workbooks:', error);
      throw error;
    }
  }

  public async reload(): Promise<JobItem[]> {
    return this.loadJobs();
  }

  public async parseFile(file: File): Promise<JobItem[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          if (data instanceof ArrayBuffer) {
            const jobs = this.parseArrayBuffer(data, file.name);
            resolve(this.deduplicateJobs(jobs));
          } else {
            reject(new Error('Invalid file format loaded'));
          }
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = (err) => reject(err);
      reader.readAsArrayBuffer(file);
    });
  }

  private deduplicateJobs(jobs: JobItem[]): JobItem[] {
    const jobGroups = new Map<string, JobItem[]>();

    for (const job of jobs) {
      // Group by domain and normalized company name to prevent recurring company entries
      const key = `${job.domain}|${job.companyName.toLowerCase().trim()}`;
      if (!jobGroups.has(key)) {
        jobGroups.set(key, []);
      }
      jobGroups.get(key)!.push(job);
    }

    const deduplicated: JobItem[] = [];

    for (const group of jobGroups.values()) {
      if (group.length === 1) {
        // Exclude rows that are completely blank/garbage with no valid role or company
        const item = group[0];
        if (item.companyName !== 'Unnamed Company' || item.targetRole !== 'Open Position') {
          deduplicated.push(item);
        }
        continue;
      }

      // If multiple recurring rows exist for the same company in the same domain, keep the most complete opening
      const scored = group.map((job) => {
        let score = 0;
        if (job.targetRole !== 'Open Position' && job.targetRole !== '') score += 50;
        if (job.location !== 'Unspecified' && job.location !== '') score += 25;
        if (job.priority !== 'Normal' && job.priority !== 'Unknown') score += 20;
        if (job.jdContent && job.jdContent.trim() !== '') score += 30;
        if (job.techStack.length > 0) score += job.techStack.length * 5;
        if (job.notes && job.notes.trim() !== '') score += 15;
        if (job.careerPageLink || job.jobApplicationLink) score += 20;
        return { job, score };
      });

      scored.sort((a, b) => b.score - a.score);
      deduplicated.push(scored[0].job);
    }

    return deduplicated;
  }

  private parseArrayBuffer(buffer: ArrayBuffer, sourceHint: string = ''): JobItem[] {
    const workbook = XLSX.read(buffer, { type: 'array' });
    const firstSheetName = workbook.SheetNames[0];
    if (!firstSheetName) {
      throw new Error('Workbook contains no sheets.');
    }

    const worksheet = workbook.Sheets[firstSheetName];
    const rawRows: Record<string, any>[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

    return rawRows
      .map((row, index) => {
        const company = String(row['Company Name'] || row['Company'] || row['Organization'] || '').trim();
        const role = String(row['Target Role'] || row['Role'] || row['Job Title'] || '').trim();
        const prefix = sourceHint.toLowerCase().includes('cloud') || sourceHint.toLowerCase().includes('devops') ? 'cloud' : 'sde';
        const id = `job-${prefix}-${index}-${company.toLowerCase().replace(/[^a-z0-9]/g, '')}`;

        // Clean Tech Stack into an array of skills
        const techStackRaw = String(row['Tech Stack'] || row['Skills'] || row['Stack'] || '');
        const techStack = techStackRaw
          .split(/[,/;|]/)
          .map((s) => s.trim())
          .filter(Boolean);

        // Handle merged Location (Work Mode) vs separate Location and Work Mode columns
        let locationRaw = String(row['Location'] || '').trim();
        let workModeRaw = String(row['Work Mode'] || '').trim();
        const locModeMerged = String(row['Location (Work Mode)'] || row['Location / Mode'] || '').trim();

        if (!locationRaw && locModeMerged) {
          if (locModeMerged.toLowerCase() === 'remote' || locModeMerged.toLowerCase().includes('remote only')) {
            locationRaw = 'Remote';
            workModeRaw = 'Remote';
          } else if (locModeMerged.includes('(')) {
            const parts = locModeMerged.split('(');
            locationRaw = parts[0].trim();
            workModeRaw = parts[1].replace(')', '').trim();
          } else {
            locationRaw = locModeMerged;
            if (locModeMerged.toLowerCase().includes('hybrid')) workModeRaw = 'Hybrid';
            else if (locModeMerged.toLowerCase().includes('remote')) workModeRaw = 'Remote';
            else if (locModeMerged.toLowerCase().includes('onsite') || locModeMerged.toLowerCase().includes('office')) workModeRaw = 'Onsite';
          }
        }

        // Handle Application Link variations
        const appLink = String(row['Application Link'] || row['Job Application Link'] || row['Application URL'] || row['Link'] || '').trim();
        const jdField = String(row['JD'] || row['Job Description'] || row['Description'] || '').trim();
        const notes = String(row['Notes'] || row['Comments'] || row['Remarks'] || '').trim();

        const domain = this.classifyDomain(row, role, sourceHint);
        const priorityRaw = String(row['Priority'] || '');
        const statusRaw = String(row['Status'] || row['Application Status'] || '');

        return {
          id,
          companyName: company || 'Unnamed Company',
          targetRole: role || 'Open Position',
          location: locationRaw || 'Unspecified',
          workMode: this.normalizeWorkMode(workModeRaw || locationRaw || locModeMerged),
          techStack,
          careerPageLink: String(row['Career Page Link'] || '').trim(),
          jobApplicationLink: appLink,
          jdContent: jdField || appLink,
          applicationStatus: this.normalizeStatus(statusRaw),
          appliedDate: String(row['Applied Date'] || '').trim(),
          referralNeeded: String(row['Referral Needed'] || '').trim().toLowerCase() === 'yes',
          referralContactName: String(row['Referral Contact Name'] || '').trim(),
          referralContactRole: String(row['Referral Contact Role'] || '').trim(),
          referralContactEmail: String(row['Referral Contact Email'] || '').trim(),
          referralContactLinkedIn: String(row['Referral Contact LinkedIn'] || '').trim(),
          hrRecruiterName: String(row['HR/Recruiter Name'] || '').trim(),
          hrRecruiterEmail: String(row['HR/Recruiter Email'] || '').trim(),
          hrRecruiterLinkedIn: String(row['HR/Recruiter LinkedIn'] || '').trim(),
          followUpDate: String(row['Follow-up Date'] || '').trim(),
          responseStatus: String(row['Response Status'] || '').trim() || 'No Response',
          interviewStage: String(row['Interview Stage'] || '').trim() || 'Not Started',
          priority: this.normalizePriority(priorityRaw),
          nextAction: String(row['Next Action'] || '').trim() || 'Review opening',
          notes,
          domain,
        };
      })
      .filter((job) => !(job.companyName === 'Unnamed Company' && job.targetRole === 'Open Position'));
  }

  private classifyDomain(row: Record<string, any>, role: string, sourceHint: string = ''): JobDomain {
    const override = String(row['Track'] || row['Domain'] || row['Job Domain'] || '').trim().toLowerCase();
    if (override.includes('dual') || override.includes('both')) return 'dual';
    if (override.includes('cloud') || override.includes('devops')) return 'cloud';
    if (override.includes('sde') || override.includes('developer') || override.includes('full stack') || override.includes('software')) return 'sde';

    // Strictly separate by workbook source hint or explicit title keywords
    if (sourceHint.toLowerCase().includes('cloud') || sourceHint.toLowerCase().includes('devops')) {
      return 'cloud';
    }
    if (sourceHint.toLowerCase().includes('jobs-sheet') || sourceHint.toLowerCase().includes('sde')) {
      return 'sde';
    }

    const roleLower = role.toLowerCase();
    const sdeTitles = ['.net', 'dotnet', 'full stack', 'fullstack', 'software engineer', 'developer', 'frontend', 'backend', 'angular', 'react', 'java', 'python', 'web'];
    if (sdeTitles.some((kw) => roleLower.includes(kw))) {
      return 'sde';
    }

    const cloudTitles = ['devops', 'cloud', 'azure engineer', 'aws engineer', 'sre', 'platform engineer', 'infrastructure', 'kubernetes'];
    if (cloudTitles.some((kw) => roleLower.includes(kw))) {
      return 'cloud';
    }

    return 'sde';
  }

  private normalizeWorkMode(mode: string): WorkMode {
    const cleaned = mode.trim().toLowerCase();
    if (cleaned.includes('hybrid')) return 'Hybrid';
    if (cleaned.includes('remote') || cleaned === 'remote') return 'Remote';
    if (cleaned.includes('onsite') || cleaned.includes('office') || cleaned === 'onsite') return 'Onsite';
    return 'Unknown';
  }

  private normalizePriority(prio: string): Priority {
    const cleaned = prio.trim().toLowerCase();
    if (cleaned.includes('high') || cleaned === '1' || cleaned.includes('urgent') || cleaned.includes('🟢')) return 'High';
    if (cleaned.includes('med') || cleaned === '2' || cleaned.includes('🟠')) return 'Medium';
    if (cleaned.includes('low') || cleaned === '3' || cleaned.includes('🟡')) return 'Low';
    return 'Normal';
  }

  private normalizeStatus(status: string): ApplicationStatus {
    const cleaned = status.trim().toLowerCase();
    if (cleaned === '' || cleaned.includes('not started') || cleaned.includes('to apply') || cleaned === 'not applied' || cleaned.includes('not applied')) return 'Not Started';
    if (cleaned.includes('applied')) return 'Applied';
    if (cleaned.includes('review')) return 'Under Review';
    if (cleaned.includes('interview')) return 'Interviewing';
    if (cleaned.includes('offer')) return 'Offered';
    if (cleaned.includes('reject')) return 'Rejected';
    if (cleaned.includes('archive') || cleaned.includes('close')) return 'Archived';
    return status.trim() || 'Not Started';
  }
}

export const excelAdapter = new ExcelAdapter();
