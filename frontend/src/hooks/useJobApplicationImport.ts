import { useMemo } from 'react';
import { useJobs, useUpdateJob } from './useJobs';

export function useJobApplicationImport() {
  const { data: allJobs = [], isLoading, error, refetch } = useJobs();
  const { mutate: updateJob, isPending: isUpdating } = useUpdateJob();

  // Filter jobs that originated from the Gmail JD Automator
  const automatorJobs = useMemo(() => {
    return allJobs.filter((job) => Boolean(job.gmailDraftId));
  }, [allJobs]);

  const metrics = useMemo(() => {
    const total = automatorJobs.length;
    const drafts = automatorJobs.filter((j) => j.automatorStatus === 'Draft Created').length;
    const sent = automatorJobs.filter((j) => j.automatorStatus === 'Sent').length;
    const skipped = automatorJobs.filter((j) => j.automatorStatus === 'Skipped').length;
    const markedApplied = automatorJobs.filter((j) => j.applicationStatus === 'Applied').length;

    return {
      total,
      drafts,
      sent,
      skipped,
      markedApplied,
    };
  }, [automatorJobs]);

  const markAsApplied = (jobId: string) => {
    updateJob({
      id: jobId,
      patch: {
        applicationStatus: 'Applied',
        appliedDate: new Date().toISOString().slice(0, 10),
      },
    });
  };

  return {
    automatorJobs,
    isLoading,
    error,
    metrics,
    markAsApplied,
    isUpdating,
    refetch,
  };
}
