import type { JobItem } from '../types/job';

export interface IDataProvider {
  loadJobs(): Promise<JobItem[]>;
  reload(): Promise<JobItem[]>;
  parseFile(file: File): Promise<JobItem[]>;
}
