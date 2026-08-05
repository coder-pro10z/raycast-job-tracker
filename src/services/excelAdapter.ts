import * as XLSX from 'xlsx';
import type { JobItem, WorkMode, Priority, ApplicationStatus } from '../types/job';
import type { IDataProvider } from './dataProvider';

export class ExcelAdapter implements IDataProvider {
  private filePath: string;

  constructor(filePath: string = '/Jobs-sheet.xlsx') {
    this.filePath = filePath;
  }

  public async loadJobs(): Promise<JobItem[]> {
    try {
      const response = await fetch(this.filePath, { cache: 'no-cache' });
      if (!response.ok) {
        throw new Error(`Failed to fetch workbook: ${response.statusText}`);
      }
      const arrayBuffer = await response.arrayBuffer();
      return this.parseArrayBuffer(arrayBuffer);
    } catch (error) {
      console.error('Error loading jobs from Excel:', error);
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
            const jobs = this.parseArrayBuffer(data);
            resolve(jobs);
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

  private parseArrayBuffer(buffer: ArrayBuffer): JobItem[] {
    const workbook = XLSX.read(buffer, { type: 'array' });
    const firstSheetName = workbook.SheetNames[0];
    if (!firstSheetName) {
      throw new Error('Workbook contains no sheets.');
    }

    const worksheet = workbook.Sheets[firstSheetName];
    const rawRows: Record<string, any>[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

    return rawRows.map((row, index) => {
      const company = String(row['Company Name'] || '').trim();
      const role = String(row['Target Role'] || '').trim();
      const id = `job-${index}-${company.toLowerCase().replace(/[^a-z0-9]/g, '')}`;

      // Clean Tech Stack into an array of skills
      const techStackRaw = String(row['Tech Stack'] || '');
      const techStack = techStackRaw
        .split(/[,/;|]/)
        .map((s) => s.trim())
        .filter(Boolean);

      const appLink = String(row['Job Application Link'] || '').trim();
      const jdField = String(row['JD'] || row['Job Description'] || '').trim();

      return {
        id,
        companyName: company || 'Unnamed Company',
        targetRole: role || 'Open Position',
        location: String(row['Location'] || '').trim() || 'Unspecified',
        workMode: this.normalizeWorkMode(String(row['Work Mode'] || '')),
        techStack,
        careerPageLink: String(row['Career Page Link'] || '').trim(),
        jobApplicationLink: appLink,
        jdContent: jdField || appLink,
        applicationStatus: this.normalizeStatus(String(row['Application Status'] || '')),
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
        priority: this.normalizePriority(String(row['Priority'] || '')),
        nextAction: String(row['Next Action'] || '').trim() || 'Review opening',
        notes: String(row['Notes'] || '').trim(),
      };
    });
  }

  private normalizeWorkMode(mode: string): WorkMode {
    const cleaned = mode.trim().toLowerCase();
    if (cleaned.includes('hybrid')) return 'Hybrid';
    if (cleaned.includes('remote')) return 'Remote';
    if (cleaned.includes('onsite') || cleaned.includes('office')) return 'Onsite';
    return 'Unknown';
  }

  private normalizePriority(prio: string): Priority {
    const cleaned = prio.trim().toLowerCase();
    if (cleaned.includes('high') || cleaned === '1' || cleaned.includes('urgent')) return 'High';
    if (cleaned.includes('med') || cleaned === '2') return 'Medium';
    if (cleaned.includes('low') || cleaned === '3') return 'Low';
    return 'Normal';
  }

  private normalizeStatus(status: string): ApplicationStatus {
    const cleaned = status.trim().toLowerCase();
    if (cleaned === '' || cleaned.includes('not started') || cleaned.includes('to apply')) return 'Not Started';
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
