import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/app/api-client';
import type { Favorite } from '@security-studio/types';

const FAVORITES_KEY = ['favorites'] as const;

export function useFavorites() {
  return useQuery<Favorite[]>({
    queryKey: FAVORITES_KEY,
    queryFn: () => apiClient.get<Favorite[]>('/favorites'),
    staleTime: 30_000,
    retry: 1,
    placeholderData: [],
  });
}

export function useIsFavorite(toolId: string) {
  const { data: favorites = [] } = useFavorites();
  return favorites.some((f) => f.toolId === toolId);
}

export function useToggleFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ toolId, isFavorited }: { toolId: string; isFavorited: boolean }) => {
      if (isFavorited) {
        return apiClient.delete(`/favorites/${toolId}`);
      }
      return apiClient.post('/favorites', { toolId });
    },
    onMutate: async ({ toolId, isFavorited }) => {
      await queryClient.cancelQueries({ queryKey: FAVORITES_KEY });
      const previous = queryClient.getQueryData<Favorite[]>(FAVORITES_KEY);

      queryClient.setQueryData<Favorite[]>(FAVORITES_KEY, (old = []) => {
        if (isFavorited) {
          return old.filter((f) => f.toolId !== toolId);
        }
        return [...old, { id: Date.now(), toolId, createdAt: new Date().toISOString() }];
      });

      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(FAVORITES_KEY, context.previous);
      }
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: FAVORITES_KEY });
    },
  });
}
