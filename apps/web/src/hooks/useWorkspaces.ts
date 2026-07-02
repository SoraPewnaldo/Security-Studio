import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/app/api-client';
import type { Workspace } from '@security-studio/types';

const WORKSPACES_KEY = ['workspaces'] as const;

function workspaceKey(id: number) {
  return ['workspaces', id] as const;
}

export function useWorkspaces() {
  return useQuery<Workspace[]>({
    queryKey: WORKSPACES_KEY,
    queryFn: () => apiClient.get<Workspace[]>('/workspaces'),
    staleTime: 30_000,
    retry: 1,
    placeholderData: [],
  });
}

export function useWorkspace(id: number | null) {
  return useQuery<Workspace>({
    queryKey: workspaceKey(id!),
    queryFn: () => apiClient.get<Workspace>(`/workspaces/${id}`),
    enabled: id !== null && id !== undefined,
    staleTime: 30_000,
    retry: 1,
  });
}

export function useCreateWorkspace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: { name: string; description: string; icon: string }) =>
      apiClient.post<Workspace>('/workspaces', body),
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: WORKSPACES_KEY });
    },
  });
}

export function useUpdateWorkspace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...body }: { id: number; name?: string; description?: string; icon?: string }) =>
      apiClient.put<Workspace>(`/workspaces/${id}`, body),
    onSettled: (_data, _err, vars) => {
      void queryClient.invalidateQueries({ queryKey: WORKSPACES_KEY });
      void queryClient.invalidateQueries({ queryKey: workspaceKey(vars.id) });
    },
  });
}

export function useDeleteWorkspace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => apiClient.delete(`/workspaces/${id}`),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: WORKSPACES_KEY });
      const previous = queryClient.getQueryData<Workspace[]>(WORKSPACES_KEY);

      queryClient.setQueryData<Workspace[]>(WORKSPACES_KEY, (old = []) =>
        old.filter((w) => w.id !== id),
      );

      return { previous };
    },
    onError: (_err, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(WORKSPACES_KEY, context.previous);
      }
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: WORKSPACES_KEY });
    },
  });
}

export function useAddToolToWorkspace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ workspaceId, toolId }: { workspaceId: number; toolId: string }) =>
      apiClient.post(`/workspaces/${workspaceId}/tools`, { toolId }),
    onSettled: (_data, _err, vars) => {
      void queryClient.invalidateQueries({ queryKey: WORKSPACES_KEY });
      void queryClient.invalidateQueries({ queryKey: workspaceKey(vars.workspaceId) });
    },
  });
}

export function useRemoveToolFromWorkspace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ workspaceId, toolId }: { workspaceId: number; toolId: string }) =>
      apiClient.delete(`/workspaces/${workspaceId}/tools/${toolId}`),
    onSettled: (_data, _err, vars) => {
      void queryClient.invalidateQueries({ queryKey: WORKSPACES_KEY });
      void queryClient.invalidateQueries({ queryKey: workspaceKey(vars.workspaceId) });
    },
  });
}
