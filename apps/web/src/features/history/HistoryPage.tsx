import { useNavigate } from '@tanstack/react-router';
import { Clock, Trash2, Wrench } from 'lucide-react';
import * as Icons from 'lucide-react';
import { toolRegistry } from '@security-studio/tool-sdk';
import { useHistory, useClearHistory } from '@/hooks/useHistory';
import { relativeTime } from '@security-studio/utils';

type LucideIcon = React.ComponentType<{ size?: number; className?: string }>;
function getIcon(name: string): LucideIcon {
  return (Icons as unknown as Record<string, LucideIcon>)[name] || Icons.Wrench;
}

export function HistoryPage() {
  const navigate = useNavigate();
  const { data: history = [] } = useHistory();
  const clearHistory = useClearHistory();

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-medium text-text tracking-tight flex items-center gap-3">
            <Clock size={24} className="text-text-secondary" /> Activity History
          </h1>
          <p className="text-sm text-text-secondary mt-1.5">View your recent tool usage across the workspace.</p>
        </div>
        {history.length > 0 && (
          <button onClick={() => clearHistory.mutate()}
            className="flex items-center gap-2 px-3 py-1.5 text-[13px] font-medium rounded-md
              border border-danger/20 text-danger bg-danger/5 hover:bg-danger/10 hover:border-danger/30 transition-all cursor-pointer shadow-sm">
            <Trash2 size={14} /> Clear History
          </button>
        )}
      </div>

      {history.length > 0 ? (
        <div className="rounded-md border border-border bg-bg overflow-hidden">
          {history.map((entry, idx) => {
            const tool = toolRegistry.getById(entry.toolId);
            const EntryIcon = tool ? getIcon(tool.manifest.icon) : Wrench;
            return (
              <button key={entry.id}
                onClick={() => navigate({ to: '/tools/$toolId', params: { toolId: entry.toolId } })}
                className={`w-full flex items-center gap-4 px-5 py-3 hover:bg-surface-hover transition-colors cursor-pointer text-left
                  ${idx !== 0 ? 'border-t border-border/50' : ''}`}
              >
                <div className="w-8 h-8 rounded-full bg-bg border border-border flex items-center justify-center flex-shrink-0">
                  <EntryIcon size={14} className="text-text-secondary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-medium text-text truncate">{entry.action}</div>
                  {entry.toolName !== entry.action && <div className="text-[11px] text-text-muted mt-0.5">{entry.toolName}</div>}
                </div>
                <span className="text-[11px] text-text-muted flex-shrink-0 font-medium">{relativeTime(entry.createdAt)}</span>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 border border-dashed border-border/50 rounded-xl bg-surface/20">
          <div className="w-12 h-12 rounded-full bg-surface/50 border border-border/50 text-text-muted flex items-center justify-center mx-auto mb-4">
            <Clock size={20} />
          </div>
          <h2 className="text-[14px] font-medium text-text mb-1">No history available</h2>
          <p className="text-[13px] text-text-secondary max-w-sm mx-auto">
            Your activity history will appear here once you start using tools.
          </p>
        </div>
      )}
    </div>
  );
}
