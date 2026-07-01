import { useNavigate } from '@tanstack/react-router';
import * as Icons from 'lucide-react';
import type { ToolManifest } from '@security-studio/types';

interface ToolCardProps {
  manifest: ToolManifest;
  compact?: boolean;
}

type LucideIconComponent = React.ComponentType<{ size?: number; className?: string }>;

function getIcon(name: string): LucideIconComponent {
  const icon = (Icons as unknown as Record<string, LucideIconComponent>)[name];
  return icon || Icons.Wrench;
}

export function ToolCard({ manifest, compact = false }: ToolCardProps) {
  const navigate = useNavigate();
  const IconComponent = getIcon(manifest.icon);

  return (
    <button
      onClick={() => navigate({ to: '/tools/$toolId', params: { toolId: manifest.id } })}
      className={`text-left w-full rounded-lg border border-border bg-surface
        hover:bg-surface-hover hover:border-primary/30
        transition-all duration-150 cursor-pointer group
        ${compact ? 'p-3' : 'p-4'}`}
    >
      <div className="flex items-start gap-3">
        <div className={`flex-shrink-0 rounded-md bg-primary/10 text-primary flex items-center justify-center
          ${compact ? 'w-8 h-8' : 'w-10 h-10'}`}>
          <IconComponent size={compact ? 16 : 20} />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className={`font-medium text-text group-hover:text-primary transition-colors duration-150
            ${compact ? 'text-sm' : 'text-sm'}`}>
            {manifest.name}
          </h3>
          {!compact && (
            <p className="text-xs text-text-secondary mt-1 line-clamp-2">
              {manifest.description}
            </p>
          )}
        </div>
      </div>
    </button>
  );
}
