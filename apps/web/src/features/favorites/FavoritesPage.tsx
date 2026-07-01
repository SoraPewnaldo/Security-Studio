import { useNavigate } from '@tanstack/react-router';
import { Star } from 'lucide-react';
import * as Icons from 'lucide-react';
import { toolRegistry } from '@security-studio/tool-sdk';
import { useFavorites } from '@/hooks/useFavorites';

type LucideIcon = React.ComponentType<{ size?: number; className?: string }>;
function getIcon(name: string): LucideIcon {
  return (Icons as unknown as Record<string, LucideIcon>)[name] || Icons.Wrench;
}

export function FavoritesPage() {
  const navigate = useNavigate();
  const { data: favorites = [] } = useFavorites();

  const tools = favorites.map((f) => toolRegistry.getById(f.toolId)).filter(Boolean);

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-medium text-text tracking-tight flex items-center gap-3">
          <Star size={24} className="text-warning" /> Pinned Tools
        </h1>
        <p className="text-sm text-text-secondary mt-1.5">Your most frequently used security tools.</p>
      </div>

      {tools.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.map((tool) => {
            if (!tool) return null;
            const ToolIcon = getIcon(tool.manifest.icon);
            return (
              <div key={tool.manifest.id}
                onClick={() => navigate({ to: '/tools/$toolId', params: { toolId: tool.manifest.id } })}
                className="rounded-md border border-border bg-bg p-4 text-left
                  hover:bg-surface-hover transition-colors duration-150 cursor-pointer group flex flex-col justify-between"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-md bg-bg border border-border text-text flex items-center justify-center flex-shrink-0">
                    <ToolIcon size={18} strokeWidth={2} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[14px] font-medium text-text truncate">{tool.manifest.name}</div>
                    <div className="text-[12px] text-text-secondary mt-1 line-clamp-2 leading-relaxed">{tool.manifest.description}</div>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    fetch(`/api/favorites/${tool.manifest.id}`, { method: 'DELETE' }).then(() => {
                      window.location.reload();
                    });
                  }}
                  className="mt-4 pt-3 border-t border-border/50 text-[11px] font-medium text-text-muted hover:text-danger z-10 relative flex items-center gap-1.5 transition-colors"
                >
                  <Star size={12} fill="currentColor" /> Unpin Tool
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 border border-dashed border-border/50 rounded-xl bg-surface/20">
          <div className="w-12 h-12 rounded-full bg-surface/50 border border-border/50 text-text-muted flex items-center justify-center mx-auto mb-4">
            <Star size={20} />
          </div>
          <h2 className="text-[14px] font-medium text-text mb-1">No pinned tools yet</h2>
          <p className="text-[13px] text-text-secondary max-w-sm mx-auto">
            Star your favorite tools to pin them here for quick access.
          </p>
        </div>
      )}
    </div>
  );
}
