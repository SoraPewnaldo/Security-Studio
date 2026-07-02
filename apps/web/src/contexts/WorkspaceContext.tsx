import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { useWorkspace } from '@/hooks/useWorkspaces';
import type { Workspace } from '@security-studio/types';

const STORAGE_KEY = 'security-studio-active-workspace';

interface WorkspaceContextValue {
  activeWorkspaceId: number | null;
  setActiveWorkspace: (id: number | null) => void;
  activeWorkspace: Workspace | null;
  isLoading: boolean;
}

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

function getStoredId(): number | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = Number(stored);
      return Number.isNaN(parsed) ? null : parsed;
    }
  } catch {
    // ignore
  }
  return null;
}

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [activeWorkspaceId, setActiveWorkspaceIdState] = useState<number | null>(getStoredId);

  const setActiveWorkspace = useCallback((id: number | null) => {
    setActiveWorkspaceIdState(id);
    try {
      if (id !== null) {
        localStorage.setItem(STORAGE_KEY, String(id));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // ignore
    }
  }, []);

  const { data: activeWorkspace, isLoading } = useWorkspace(activeWorkspaceId);

  return (
    <WorkspaceContext.Provider
      value={{
        activeWorkspaceId,
        setActiveWorkspace,
        activeWorkspace: activeWorkspace ?? null,
        isLoading,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useActiveWorkspace() {
  const ctx = useContext(WorkspaceContext);
  if (!ctx) {
    throw new Error('useActiveWorkspace must be used within a WorkspaceProvider');
  }
  return ctx;
}
