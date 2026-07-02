import { useNavigate } from '@tanstack/react-router';
import { ArrowRight, Star, Clock, Layout, Wrench, CheckCircle2, ChevronRight, Activity, BarChart3, LineChart } from 'lucide-react';
import * as Icons from 'lucide-react';
import { toolRegistry } from '@security-studio/tool-sdk';
import { useFavorites } from '@/hooks/useFavorites';
import { useHistory } from '@/hooks/useHistory';
import { getGreeting, relativeTime } from '@security-studio/utils';
import logo from '@/assets/logo.png';
import DotField from '@/components/ui/DotField';

import { useActiveWorkspace } from '@/contexts/WorkspaceContext';

type LucideIcon = React.ComponentType<{ size?: number; className?: string }>;
function getIcon(name: string): LucideIcon {
  return (Icons as unknown as Record<string, LucideIcon>)[name] || Icons.Wrench;
}

export function Dashboard() {
  const navigate = useNavigate();
  const { data: favorites = [] } = useFavorites();
  const { data: history = [] } = useHistory();
  const { activeWorkspace } = useActiveWorkspace();

  const allTools = toolRegistry.getAll();
  
  const workspaceTools = activeWorkspace?.tools 
    ? allTools.filter(t => activeWorkspace.tools?.some(wt => wt.toolId === t.manifest.id))
    : allTools;
    
  const favoriteTools = workspaceTools.filter((t) => favorites.some((f) => f.toolId === t.manifest.id));
  const workspaceHistory = activeWorkspace 
    ? history.filter(h => workspaceTools.some(t => t.manifest.id === h.toolId))
    : history;

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-[1400px] mx-auto space-y-6">
      
      {/* Top Banner / Deployment style */}
      <section className="rounded-lg border border-border bg-bg overflow-hidden flex flex-col">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <h2 className="text-[13px] font-medium text-text">Workspace Overview</h2>
        </div>
        <div className="p-5 flex flex-col md:flex-row gap-8 items-center md:items-start">
          {/* Visual Left */}
          <div className="w-full md:w-[400px] aspect-[16/9] rounded-md border border-border bg-surface-hover flex flex-col items-center justify-center p-6 text-center relative overflow-hidden group cursor-pointer">
            <div className="absolute inset-0 z-0">
              <DotField
                dotRadius={1.5}
                dotSpacing={14}
                bulgeStrength={67}
                glowRadius={160}
                sparkle={true}
                waveAmplitude={0}
                gradientFrom="#3b82f6"
                gradientTo="#8b5cf6"
                glowColor="rgba(59, 130, 246, 0.2)"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none" />
            <div className="mb-8 mt-4 z-10">
              <img src={logo} alt="Security Studio" className="w-20 h-20 object-contain brightness-0 invert opacity-90 transition-transform group-hover:scale-110 drop-shadow-xl" />
            </div>
            <h3 className="text-xl font-semibold text-text z-10 drop-shadow-md">
              {activeWorkspace ? activeWorkspace.name : 'Global Workspace'}
            </h3>
            <p className="text-xs text-text-secondary mt-2 z-10 drop-shadow-md">
              {activeWorkspace ? activeWorkspace.description : 'Ready to secure the environment.'}
            </p>
          </div>
          
          {/* Details Right */}
          <div className="flex-1 space-y-6 w-full">
            <div>
              <div className="text-[11px] text-text-muted mb-1">Status</div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-success" />
                <span className="text-[13px] text-text font-medium">Ready</span>
                <span className="text-[13px] text-text-secondary ml-2">Active Session</span>
              </div>
            </div>
            <div>
              <div className="text-[11px] text-text-muted mb-1">Available Tools</div>
              <div className="text-[13px] font-mono text-text">{workspaceTools.length} <span className="text-text-secondary font-sans">modules loaded</span></div>
            </div>
            <div>
              <div className="text-[11px] text-text-muted mb-1">Recent Activity Count</div>
              <div className="text-[13px] font-mono text-text">{workspaceHistory.length} <span className="text-text-secondary font-sans">events logged today</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* Grid Layout (Checklist | Observability | Analytics) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Col 1: Pinned Tools (like Production Checklist) */}
        <section className="rounded-lg border border-border bg-bg flex flex-col">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <h2 className="text-[13px] font-medium text-text flex items-center gap-2">
              Pinned Tools <span className="bg-surface-hover text-text-secondary px-1.5 rounded-full text-[10px]">{favoriteTools.length}/{allTools.length}</span>
            </h2>
          </div>
          <div className="p-4 flex-1">
            <div className="space-y-2">
              {(favoriteTools.length > 0 ? favoriteTools : workspaceTools).slice(0, 5).map((tool) => {
                const ToolIcon = getIcon(tool.manifest.icon);
                return (
                  <button key={tool.manifest.id}
                    onClick={() => navigate({ to: '/tools/$toolId', params: { toolId: tool.manifest.id } })}
                    className="w-full flex items-center justify-between p-3 rounded-md bg-[#0A1931] border border-[#1A3B7E] text-info hover:bg-[#0D2247] transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <ToolIcon size={14} className="opacity-80" />
                      <span className="text-[13px] font-medium">{tool.manifest.name}</span>
                    </div>
                    <CheckCircle2 size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                );
              })}
              <button onClick={() => navigate({ to: '/tools' })}
                className="w-full flex items-center justify-between p-3 rounded-md bg-transparent border border-border text-text-secondary hover:text-text hover:border-text-muted transition-colors cursor-pointer mt-2"
              >
                <div className="flex items-center gap-3">
                  <Wrench size={14} className="opacity-80" />
                  <span className="text-[13px] font-medium">Browse all tools</span>
                </div>
              </button>
            </div>
          </div>
        </section>

        {/* Col 2: Recent Activity (like Observability) */}
        <section className="rounded-lg border border-border bg-bg flex flex-col">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between group cursor-pointer hover:bg-surface-hover transition-colors">
            <h2 className="text-[13px] font-medium text-text">Activity Log</h2>
            <ChevronRight size={14} className="text-text-muted group-hover:text-text" />
          </div>
          <div className="p-5 flex-1 space-y-6">
            <div>
              <div className="text-[11px] text-text-muted mb-2">Event Frequency</div>
              <div className="flex items-end gap-2 h-10 border-b border-border/50 pb-1">
                {[12, 35, 20, 45, 30, 60, 25, 40].map((h, i) => (
                  <div key={i} className="flex-1 bg-info hover:bg-info/80 transition-colors" style={{ height: `${h}%` }} />
                ))}
              </div>
            </div>
            
            <div className="space-y-4">
              {workspaceHistory.length > 0 ? workspaceHistory.slice(0, 3).map((entry) => {
                const tool = toolRegistry.getById(entry.toolId);
                const EntryIcon = tool ? getIcon(tool.manifest.icon) : Activity;
                return (
                  <div key={entry.id} className="flex items-center justify-between pb-3 border-b border-border/50 last:border-0 last:pb-0">
                    <div className="flex items-center gap-3">
                      <EntryIcon size={14} className="text-text-muted" />
                      <div>
                        <div className="text-[13px] text-text">{entry.action}</div>
                      </div>
                    </div>
                    <span className="text-[11px] font-mono text-text-muted">{relativeTime(entry.createdAt)}</span>
                  </div>
                );
              }) : (
                <div className="text-[12px] text-text-muted text-center py-4">No activity recorded yet.</div>
              )}
            </div>
          </div>
        </section>

        {/* Col 3: Statistics (Real Data instead of mock Analytics) */}
        <section className="rounded-lg border border-border bg-bg flex flex-col">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between group cursor-pointer hover:bg-surface-hover transition-colors">
            <h2 className="text-[13px] font-medium text-text">Workspace Stats</h2>
            <ChevronRight size={14} className="text-text-muted group-hover:text-text" />
          </div>
          <div className="p-5 flex-1 flex flex-col justify-center gap-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-surface-hover border border-border flex items-center justify-center">
                  <Wrench size={14} className="text-text-secondary" />
                </div>
                <span className="text-[13px] font-medium text-text">Total Tools</span>
              </div>
              <span className="text-[14px] font-mono font-medium text-text">{workspaceTools.length}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-surface-hover border border-border flex items-center justify-center">
                  <Star size={14} className="text-text-secondary" />
                </div>
                <span className="text-[13px] font-medium text-text">Pinned Tools</span>
              </div>
              <span className="text-[14px] font-mono font-medium text-text">{favoriteTools.length}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-surface-hover border border-border flex items-center justify-center">
                  <Clock size={14} className="text-text-secondary" />
                </div>
                <span className="text-[13px] font-medium text-text">History Events</span>
              </div>
              <span className="text-[14px] font-mono font-medium text-text">{workspaceHistory.length}</span>
            </div>

            <button onClick={() => navigate({ to: '/history' })} className="mt-4 px-4 py-2 w-full text-[12px] font-medium text-text border border-border rounded-md hover:bg-surface-hover transition-colors cursor-pointer">
              View Complete History
            </button>
          </div>
        </section>

      </div>
    </div>
  );
}
