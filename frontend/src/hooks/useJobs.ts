import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../services/apiClient';
import type { JobItem } from '../types/job';

export function useJobs() {
  return useQuery({
    queryKey: ['jobs'],
    queryFn: () => apiClient.getJobs(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useUpdateJob() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Partial<JobItem> }) =>
      apiClient.updateJob(id, patch),

    onMutate: async ({ id, patch }) => {
      await qc.cancelQueries({ queryKey: ['jobs'] });
      const previous = qc.getQueryData<JobItem[]>(['jobs']);
      
      qc.setQueryData<JobItem[]>(['jobs'], (old) => {
        if (!old) return [];
        return old.map(j => (j.id === id ? { ...j, ...patch } : j));
      });
      
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        qc.setQueryData(['jobs'], context.previous);
      }
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ['jobs'] });
    }
  });
}

export function useCreateJob() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (job: Partial<JobItem>) => apiClient.createJob(job),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['jobs'] });
    }
  });
}

export function useAddNote() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ jobId, content, type }: { jobId: string; content: string; type: 'General' | 'JD' | 'Link' }) => 
      apiClient.addNote(jobId, content, type),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['jobs'] });
    }
  });
}

export function useCloneJob() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiClient.cloneJob(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['jobs'] });
    }
  });
}

export function useCheckDuplicateJob(companyName: string, targetRole: string) {
  return useQuery({
    queryKey: ['check-duplicate', companyName, targetRole],
    queryFn: () => apiClient.checkDuplicateJob(companyName, targetRole),
    enabled: Boolean(companyName && targetRole && companyName.trim() !== '' && targetRole.trim() !== ''),
    staleTime: 60 * 1000,
  });
}
