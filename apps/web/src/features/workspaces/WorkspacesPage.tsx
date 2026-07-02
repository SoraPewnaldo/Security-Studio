import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Plus, Trash2, FolderOpen, Wrench, X } from 'lucide-react';
import * as Icons from 'lucide-react';
import { useWorkspaces, useCreateWorkspace, useDeleteWorkspace } from '@/hooks/useWorkspaces';
import toast from 'react-hot-toast';

type LucideIcon = React.ComponentType<{ size?: number; className?: string }>;
function getIcon(name: string): LucideIcon {
  return (Icons as unknown as Record<string, LucideIcon>)[name] || Icons.FolderOpen;
}

const WORKSPACE_ICONS = [
  'FolderOpen', 'Shield', 'Lock', 'Bug', 'Globe', 'Network',
  'Terminal', 'Code', 'Database', 'Server', 'Cpu', 'Layers',
];

function relativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function WorkspacesPage() {
  const navigate = useNavigate();
  const { data: workspaces = [], isLoading } = useWorkspaces();
  const createWorkspace = useCreateWorkspace();
  const deleteWorkspace = useDeleteWorkspace();
  const [showCreate, setShowCreate] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [form, setForm] = useState({ name: '', description: '', icon: 'FolderOpen' });

  const handleCreate = () => {
    if (!form.name.trim()) return;
    createWorkspace.mutate(
      { name: form.name.trim(), description: form.description.trim(), icon: form.icon },
      {
        onSuccess: () => {
          setShowCreate(false);
          setForm({ name: '', description: '', icon: 'FolderOpen' });
          toast.success('Workspace created');
        },
        onError: (err) => toast.error(err.message),
      },
    );
  };

  const handleDelete = (id: number) => {
    deleteWorkspace.mutate(id, {
      onSuccess: () => {
        setDeleteConfirm(null);
        toast.success('Workspace deleted');
      },
      onError: (err) => toast.error(err.message),
    });
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-[1400px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-medium text-text tracking-tight">Workspaces</h1>
          <p className="text-sm text-text-secondary mt-1.5">
            Organize your tools into focused workspaces.
          </p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-3 py-2 text-[13px] font-medium rounded-md
            bg-text text-bg hover:bg-text/90 transition-colors cursor-pointer"
        >
          <Plus size={14} />
          Create Workspace
        </button>
      </div>

      {/* Create Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowCreate(false)}>
          <div
            className="w-full max-w-md rounded-lg border border-border bg-bg p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-[15px] font-medium text-text">New Workspace</h2>
              <button onClick={() => setShowCreate(false)} className="text-text-muted hover:text-text cursor-pointer">
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] text-text-muted uppercase tracking-wider mb-1.5 block">Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Web App Pentest"
                  className="w-full bg-bg border border-border rounded-md px-3 py-2 text-[13px] text-text
                    placeholder:text-text-muted focus:border-text focus:outline-none transition-colors"
                  autoFocus
                />
              </div>
              <div>
                <label className="text-[11px] text-text-muted uppercase tracking-wider mb-1.5 block">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="What is this workspace for?"
                  rows={3}
                  className="w-full bg-bg border border-border rounded-md px-3 py-2 text-[13px] text-text
                    placeholder:text-text-muted focus:border-text focus:outline-none transition-colors resize-none"
                />
              </div>
              <div>
                <label className="text-[11px] text-text-muted uppercase tracking-wider mb-1.5 block">Icon</label>
                <div className="flex gap-2 flex-wrap">
                  {WORKSPACE_ICONS.map((iconName) => {
                    const Icon = getIcon(iconName);
                    return (
                      <button
                        key={iconName}
                        onClick={() => setForm({ ...form, icon: iconName })}
                        className={`w-8 h-8 rounded-md flex items-center justify-center border transition-colors cursor-pointer ${
                          form.icon === iconName
                            ? 'border-text bg-surface-hover text-text'
                            : 'border-border text-text-muted hover:text-text hover:border-text-muted'
                        }`}
                      >
                        <Icon size={14} />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowCreate(false)}
                className="px-3 py-2 text-[13px] rounded-md border border-border text-text-secondary
                  hover:text-text transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={!form.name.trim() || createWorkspace.isPending}
                className="px-3 py-2 text-[13px] font-medium rounded-md bg-text text-bg
                  hover:bg-text/90 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {createWorkspace.isPending ? 'Creating...' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm !== null && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setDeleteConfirm(null)}>
          <div
            className="w-full max-w-sm rounded-lg border border-border bg-bg p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-[15px] font-medium text-text">Delete Workspace</h2>
            <p className="text-[13px] text-text-secondary">
              Are you sure? This will remove the workspace and all tool associations. This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-3 py-2 text-[13px] rounded-md border border-border text-text-secondary
                  hover:text-text transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="px-3 py-2 text-[13px] font-medium rounded-md bg-danger text-white
                  hover:bg-danger/90 transition-colors cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="text-center py-16">
          <div className="text-text-muted text-[13px]">Loading workspaces...</div>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && workspaces.length === 0 && (
        <div className="text-center py-16 border border-dashed border-border/50 rounded-xl bg-surface/20">
          <FolderOpen size={32} className="mx-auto text-text-muted mb-3" />
          <div className="text-text-muted text-[13px] mb-1">No workspaces yet</div>
          <div className="text-text-muted text-[12px]">Create a workspace to organize your tools.</div>
        </div>
      )}

      {/* Workspace Grid */}
      {!isLoading && workspaces.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {workspaces.map((ws) => {
            const WsIcon = getIcon(ws.icon);
            return (
              <div
                key={ws.id}
                className="rounded-lg border border-border bg-bg hover:bg-surface-hover
                  transition-colors duration-150 cursor-pointer group relative"
              >
                <button
                  onClick={() => navigate({ to: '/workspaces/$workspaceId', params: { workspaceId: String(ws.id) } })}
                  className="w-full text-left p-5 cursor-pointer"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-surface-hover border border-border/50
                      flex items-center justify-center flex-shrink-0 text-text-secondary">
                      <WsIcon size={18} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[14px] font-medium text-text truncate">{ws.name}</div>
                      <div className="text-[12px] text-text-secondary mt-1 line-clamp-2 leading-relaxed">
                        {ws.description || 'No description'}
                      </div>
                      <div className="flex items-center gap-3 mt-3">
                        <span className="flex items-center gap-1 text-[11px] text-text-muted">
                          <Wrench size={10} />
                          {ws.tools?.length ?? 0} tools
                        </span>
                        <span className="text-[11px] text-text-muted">
                          Updated {relativeTime(ws.updatedAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>

                {/* Delete Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteConfirm(ws.id);
                  }}
                  className="absolute top-3 right-3 p-1.5 rounded-md text-text-muted
                    hover:text-danger hover:bg-danger/10 transition-colors
                    opacity-0 group-hover:opacity-100 cursor-pointer"
                  title="Delete workspace"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
