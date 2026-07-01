import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/app/api-client';
import type { Setting } from '@security-studio/types';

const SETTINGS_KEY = ['settings'] as const;

export function useSettings() {
  return useQuery<Setting[]>({
    queryKey: SETTINGS_KEY,
    queryFn: () => apiClient.get<Setting[]>('/settings'),
    staleTime: 60_000,
    retry: 1,
    placeholderData: [],
  });
}

export function useSetting(key: string) {
  const { data: settings = [] } = useSettings();
  return settings.find((s) => s.key === key)?.value;
}

export function useUpdateSetting() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ key, value }: { key: string; value: string }) =>
      apiClient.put(`/settings/${key}`, { value }),
    onMutate: async ({ key, value }) => {
      await queryClient.cancelQueries({ queryKey: SETTINGS_KEY });
      const previous = queryClient.getQueryData<Setting[]>(SETTINGS_KEY);

      queryClient.setQueryData<Setting[]>(SETTINGS_KEY, (old = []) => {
        const existing = old.findIndex((s) => s.key === key);
        if (existing >= 0) {
          const updated = [...old];
          updated[existing] = { ...old[existing]!, key, value, updatedAt: new Date().toISOString() };
          return updated;
        }
        return [...old, { id: Date.now(), key, value, updatedAt: new Date().toISOString() }];
      });

      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(SETTINGS_KEY, context.previous);
      }
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: SETTINGS_KEY });
    },
  });
}
