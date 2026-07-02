import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/app/api-client';
import type { PluginListItem, PluginManifest, PluginExecutionResult } from '@security-studio/types';

const PLUGINS_KEY = ['plugins'] as const;

function pluginKey(id: string) {
  return ['plugins', id] as const;
}

export function usePlugins() {
  return useQuery<PluginListItem[]>({
    queryKey: PLUGINS_KEY,
    queryFn: () => apiClient.get<PluginListItem[]>('/plugins'),
    staleTime: 30_000,
    retry: 1,
    placeholderData: [],
  });
}

export function usePlugin(id: string) {
  return useQuery<PluginManifest>({
    queryKey: pluginKey(id),
    queryFn: () => apiClient.get<PluginManifest>(`/plugins/${id}/manifest`),
    enabled: !!id,
    staleTime: 30_000,
    retry: 1,
  });
}

export function useExecutePlugin() {
  return useMutation({
    mutationFn: ({ id, inputs }: { id: string; inputs: Record<string, unknown> }) =>
      apiClient.post<PluginExecutionResult>(`/plugins/${id}/execute`, inputs),
  });
}

export function useReloadPlugins() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => apiClient.post('/plugins/reload'),
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: PLUGINS_KEY });
    },
  });
}

export function useReloadSinglePlugin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiClient.post(`/plugins/${id}/reload`),
    onSettled: () => void queryClient.invalidateQueries({ queryKey: PLUGINS_KEY }),
  });
}

export function useDisablePlugin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiClient.post(`/plugins/${id}/disable`),
    onSettled: () => void queryClient.invalidateQueries({ queryKey: PLUGINS_KEY }),
  });
}

export function useEnablePlugin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiClient.post(`/plugins/${id}/enable`),
    onSettled: () => void queryClient.invalidateQueries({ queryKey: PLUGINS_KEY }),
  });
}

export function useUninstallPlugin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiClient.delete(`/plugins/${id}`),
    onSettled: () => void queryClient.invalidateQueries({ queryKey: PLUGINS_KEY }),
  });
}

export function usePluginLogs(id: string) {
  return useQuery<{ level: string; message: string; timestamp: string }[]>({
    queryKey: ['plugins', id, 'logs'],
    queryFn: () => apiClient.get(`/plugins/${id}/logs`),
    enabled: !!id,
    refetchInterval: 2000, // auto-refresh logs every 2 seconds
  });
}

