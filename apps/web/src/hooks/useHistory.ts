import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/app/api-client';
import type { HistoryEntry } from '@security-studio/types';

const HISTORY_KEY = ['history'] as const;

export function useHistory(limit = 50) {
  return useQuery<HistoryEntry[]>({
    queryKey: [...HISTORY_KEY, limit],
    queryFn: () => apiClient.get<HistoryEntry[]>(`/history?limit=${limit}`),
    staleTime: 10_000,
    retry: 1,
    placeholderData: [],
  });
}

export function useAddHistory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (entry: Omit<HistoryEntry, 'id' | 'createdAt'>) =>
      apiClient.post('/history', entry),
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: HISTORY_KEY });
    },
  });
}

export function useClearHistory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => apiClient.delete('/history'),
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: HISTORY_KEY });
    },
  });
}
