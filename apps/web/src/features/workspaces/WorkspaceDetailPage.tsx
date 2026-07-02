import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import {
  ArrowLeft, Pencil, Trash2, Plus, X, Wrench, CheckCircle2, Search,
} from 'lucide-react';
import * as Icons from 'lucide-react';
import { toolRegistry } from '@security-studio/tool-sdk';
import {
  useWorkspace, useUpdateWorkspace, useDeleteWorkspace,
  useAddToolToWorkspace, useRemoveToolFromWorkspace,
} from '@/hooks/useWorkspaces';
import { useActiveWorkspace } from '@/contexts/WorkspaceContext';
import toast from 'react-hot-toast';

type LucideIcon = React.ComponentType<{ size?: number; className?: string }>;
function getIcon(name: string): LucideIcon {
  return (Icons as unknown as Record<string, LucideIcon>)[name] || Icons.Wrench;
}

export function WorkspaceDetailPage({ workspaceId }: { workspaceId: string }) {
  const navigate = useNavigate();
  const id = Number(workspaceId);
  const { data: workspace, isLoading } = useWorkspace(id);
  const updateWorkspace = useUpdateWorkspace();
  const deleteWorkspace = useDeleteWorkspace();
  const addTool = useAddToolToWorkspace();
  const removeTool = useRemoveToolFromWorkspace();
  const { activeWorkspaceId, setActiveWorkspace } = useActiveWorkspace();

  const [showAddTool, setShowAddTool] = useState(false);
  const [toolSearch, setToolSearch] = useState('');
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', description: '' });
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const isActive = activeWorkspaceId === id;

  const workspaceToolIds = new Set(workspace?.tools?.map((t) => t.toolId) ?? []);
  const allTools = toolRegistry.getAllManifests();
  const availableTools = allTools.filter(
    (t) => !workspaceToolIds.has(t.id) && (
      !toolSearch || t.name.toLowerCase().includes(toolSearch.toLowerCase())
    ),
  );
  const workspaceTools = allTools.filter((t) => workspaceToolIds.has(t.id));

  const handleStartEdit = () => {
    if (!workspace) return;
    setEditForm({ name: workspace.name, description: workspace.description });
    setEditing(true);
  };

  const handleSaveEdit = () => {
    if (!editForm.name.trim()) return;
    updateWorkspace.mutate(
      { id, name: editForm.name.trim(), description: editForm.description.trim() },
      {
        onSuccess: () => {
          setEditing(false);
          toast.success('Workspace updated');
        },
        onError: (err) => toast.error(err.message),
      },
    );
  };

  const handleDelete = () => {
    deleteWorkspace.mutate(id, {
      onSuccess: () => {
        if (isActive) setActiveWorkspace(null);
        toast.success('Workspace deleted');
        navigate({ to: '/workspaces' });
      },
      onError: (err) => toast.error(err.message),
    });
  };

  const handleAddTool = (toolId: string) => {
    addTool.mutate(
      { workspaceId: id, toolId },
      {
        onSuccess: () => toast.success('Tool added'),
        onError: (err) => toast.error(err.message),
      },
    );
  };

  const handleRemoveTool = (toolId: string) => {
    removeTool.mutate(
      { workspaceId: id, toolId },
      {
        onSuccess: () => toast.success('Tool removed'),
        onError: (err) => toast.error(err.message),
      },
    );
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <div className="text-text-muted text-[13px]">Loading workspace...</div>
      </div>
    );
  }

  if (!workspace) {
    return (
      <div className="p-8 text-center">
        <div className="text-text-muted text-[13px]">Workspace not found.</div>
      </div>
    );
  }

  const WsIcon = getIcon(workspace.icon);

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-[1400px] mx-auto space-y-6">
      {/* Back button */}
      <button
        onClick={() => navigate({ to: '/workspaces' })}
        className="flex items-center gap-1.5 text-[13px] text-text-secondary hover:text-text transition-colors cursor-pointer"
      >
        <ArrowLeft size={14} />
        All Workspaces
      </button>

      {/* Header */}
      <div className="rounded-lg border border-border bg-bg p-5">
        {editing ? (
          <div className="space-y-3">
            <input
              type="text"
              value={editForm.name}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              className="w-full bg-bg border border-border rounded-md px-3 py-2 text-[15px] font-medium text-text
                focus:border-text focus:outline-none transition-colors"
              autoFocus
            />
            <textarea
              value={editForm.description}
              onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
              rows={2}
              className="w-full bg-bg border border-border rounded-md px-3 py-2 text-[13px] text-text
                focus:border-text focus:outline-none transition-colors resize-none"
            />
            <div className="flex gap-2">
              <button
                onClick={handleSaveEdit}
                disabled={updateWorkspace.isPending}
                className="px-3 py-1.5 text-[13px] font-medium rounded-md bg-text text-bg
                  hover:bg-text/90 transition-colors cursor-pointer"
              >
                Save
              </button>
              <button
                onClick={() => setEditing(false)}
                className="px-3 py-1.5 text-[13px] rounded-md border border-border text-text-secondary
                  hover:text-text transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-surface-hover border border-border/50
                flex items-center justify-center flex-shrink-0 text-text-secondary">
                <WsIcon size={22} />
              </div>
              <div>
                <h1 className="text-xl font-medium text-text">{workspace.name}</h1>
                <p className="text-[13px] text-text-secondary mt-1">
                  {workspace.description || 'No description'}
                </p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="flex items-center gap-1 text-[11px] text-text-muted">
                    <Wrench size={10} />
                    {workspaceTools.length} tools
                  </span>
                  {isActive && (
                    <span className="flex items-center gap-1 text-[11px] text-success">
                      <CheckCircle2 size={10} />
                      Active
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveWorkspace(isActive ? null : id)}
                className={`px-3 py-1.5 text-[13px] rounded-md border transition-colors cursor-pointer ${
                  isActive
                    ? 'border-success/30 text-success bg-success/10 hover:bg-success/20'
                    : 'border-border text-text-secondary hover:text-text'
                }`}
              >
                {isActive ? 'Active' : 'Set Active'}
              </button>
              <button
                onClick={handleStartEdit}
                className="p-1.5 rounded-md text-text-muted hover:text-text
                  border border-border hover:border-text-muted transition-colors cursor-pointer"
                title="Edit"
              >
                <Pencil size={13} />
              </button>
              <button
                onClick={() => setDeleteConfirm(true)}
                className="p-1.5 rounded-md text-text-muted hover:text-danger
                  border border-border hover:border-danger/30 transition-colors cursor-pointer"
                title="Delete"
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setDeleteConfirm(false)}>
          <div className="w-full max-w-sm rounded-lg border border-border bg-bg p-6 space-y-4" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-[15px] font-medium text-text">Delete Workspace</h2>
            <p className="text-[13px] text-text-secondary">
              Are you sure you want to delete "{workspace.name}"? This cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleteConfirm(false)}
                className="px-3 py-2 text-[13px] rounded-md border border-border text-text-secondary hover:text-text transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-3 py-2 text-[13px] font-medium rounded-md bg-danger text-white hover:bg-danger/90 transition-colors cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tools Section */}
      <div className="flex items-center justify-between">
        <h2 className="text-[15px] font-medium text-text">Tools</h2>
        <button
          onClick={() => setShowAddTool(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-[13px] rounded-md
            border border-border text-text-secondary hover:text-text transition-colors cursor-pointer"
        >
          <Plus size={14} />
          Add Tool
        </button>
      </div>

      {/* Add Tool Modal */}
      {showAddTool && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowAddTool(false)}>
          <div
            className="w-full max-w-lg rounded-lg border border-border bg-bg flex flex-col max-h-[70vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h2 className="text-[15px] font-medium text-text">Add Tool</h2>
              <button onClick={() => setShowAddTool(false)} className="text-text-muted hover:text-text cursor-pointer">
                <X size={16} />
              </button>
            </div>
            <div className="px-5 py-3 border-b border-border">
              <div className="relative">
                <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  type="text"
                  value={toolSearch}
                  onChange={(e) => setToolSearch(e.target.value)}
                  placeholder="Search tools..."
                  className="w-full bg-bg border border-border rounded-md pl-8 pr-3 py-2 text-[13px] text-text
                    placeholder:text-text-muted focus:border-text focus:outline-none transition-colors"
                  autoFocus
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-1">
              {availableTools.length === 0 && (
                <div className="text-center py-8 text-[13px] text-text-muted">
                  {toolSearch ? 'No matching tools found.' : 'All tools have been added.'}
                </div>
              )}
              {availableTools.map((tool) => {
                const ToolIcon = getIcon(tool.icon);
                return (
                  <button
                    key={tool.id}
                    onClick={() => handleAddTool(tool.id)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md
                      hover:bg-surface-hover transition-colors cursor-pointer text-left"
                  >
                    <div className="w-8 h-8 rounded-md bg-surface-hover border border-border/50
                      flex items-center justify-center flex-shrink-0 text-text-secondary">
                      <ToolIcon size={14} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[13px] font-medium text-text truncate">{tool.name}</div>
                      <div className="text-[11px] text-text-muted truncate">{tool.description}</div>
                    </div>
                    <Plus size={14} className="text-text-muted flex-shrink-0" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Tool Grid */}
      {workspaceTools.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-border/50 rounded-xl bg-surface/20">
          <Wrench size={32} className="mx-auto text-text-muted mb-3" />
          <div className="text-text-muted text-[13px] mb-1">No tools in this workspace</div>
          <div className="text-text-muted text-[12px]">
            Click "Add Tool" to start building your workspace.
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {workspaceTools.map((tool) => {
            const ToolIcon = getIcon(tool.icon);
            return (
              <div
                key={tool.id}
                className="rounded-lg border border-border bg-bg hover:bg-surface-hover
                  transition-colors duration-150 group relative"
              >
                <button
                  onClick={() => navigate({ to: '/tools/$toolId', params: { toolId: tool.id } })}
                  className="w-full text-left p-4 cursor-pointer flex items-start gap-4"
                >
                  <div className="w-10 h-10 rounded-lg bg-surface-hover border border-border/50
                    flex items-center justify-center flex-shrink-0 text-text-secondary">
                    <ToolIcon size={18} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[14px] font-medium text-text truncate">{tool.name}</div>
                    <div className="text-[12px] text-text-secondary mt-1 line-clamp-2 leading-relaxed">
                      {tool.description}
                    </div>
                  </div>
                </button>
                <button
                  onClick={() => handleRemoveTool(tool.id)}
                  className="absolute top-3 right-3 p-1.5 rounded-md text-text-muted
                    hover:text-danger hover:bg-danger/10 transition-colors
                    opacity-0 group-hover:opacity-100 cursor-pointer"
                  title="Remove from workspace"
                >
                  <X size={13} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
