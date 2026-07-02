import { useState, useMemo } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Search } from 'lucide-react';
import * as Icons from 'lucide-react';
import { toolRegistry } from '@security-studio/tool-sdk';
import { searchIndex } from '@security-studio/core';

type LucideIcon = React.ComponentType<{ size?: number; className?: string; strokeWidth?: number }>;
function getIcon(name: string): LucideIcon {
  return (Icons as unknown as Record<string, LucideIcon>)[name] || Icons.Wrench;
}

export function AllTools() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const results = useMemo(() => {
    if (query) return searchIndex.search(query).map((r) => r.item);
    const all = toolRegistry.getAllManifests();
    if (activeCategory) return all.filter((t) => t.category === activeCategory);
    return all;
  }, [query, activeCategory]);

  const categoryCounts = useMemo(() => toolRegistry.getCategoryCounts(), []);
  
  const activeCategories = useMemo(() => {
    const counts = categoryCounts;
    const catMap = new Map<string, { id: string, label: string }>();
    
    for (const manifest of toolRegistry.getAllManifests()) {
      if ((counts.get(manifest.category) ?? 0) > 0 && !catMap.has(manifest.category)) {
        catMap.set(manifest.category, {
          id: manifest.category,
          label: manifest.category.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
        });
      }
    }
    
    return Array.from(catMap.values()).sort((a, b) => a.label.localeCompare(b.label));
  }, [categoryCounts]);

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-medium text-text tracking-tight">All Tools</h1>
        <p className="text-sm text-text-secondary mt-1.5">Browse and search all available security tools.</p>
      </div>

      {/* Search */}
      <div className="relative max-w-xl">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
        <input type="text" value={query} onChange={(e) => { setQuery(e.target.value); setActiveCategory(null); }}
          placeholder="Search tools..."
          className="w-full bg-bg border border-border rounded-md pl-10 pr-4 py-2.5 text-[13px] text-text
            placeholder:text-text-muted focus:border-text focus:outline-none transition-colors" />
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 flex-wrap">
        <button onClick={() => setActiveCategory(null)}
          className={`px-3 py-1.5 text-[13px] font-medium rounded-md border transition-colors cursor-pointer ${
            !activeCategory
              ? 'bg-text text-bg border-text'
              : 'border-border text-text-secondary bg-bg hover:text-text'
          }`}>All ({toolRegistry.size})</button>
        {activeCategories.map((cat) => (
          <button key={cat.id} onClick={() => { setActiveCategory(cat.id); setQuery(''); }}
            className={`px-3 py-1.5 text-[13px] font-medium rounded-md border transition-colors cursor-pointer ${
              activeCategory === cat.id
                ? 'bg-text text-bg border-text'
                : 'border-border text-text-secondary bg-bg hover:text-text'
            }`}>{cat.label} ({categoryCounts.get(cat.id)})</button>
        ))}
      </div>

      {/* Tool grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {results.map((tool) => {
          const ToolIcon = getIcon(tool.icon);
          return (
            <button key={tool.id}
              onClick={() => navigate({ to: '/tools/$toolId', params: { toolId: tool.id } })}
              className="rounded-md border border-border bg-bg p-4 text-left
                hover:bg-surface-hover transition-colors duration-150 cursor-pointer flex items-start gap-4"
            >
              <div className="w-10 h-10 rounded-lg bg-surface border border-border/50 text-primary flex items-center justify-center flex-shrink-0
                group-hover:bg-primary/10 transition-colors">
                <ToolIcon size={18} strokeWidth={2} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[14px] font-medium text-text truncate">{tool.name}</div>
                <div className="text-[12px] text-text-secondary mt-1 line-clamp-2 leading-relaxed">{tool.description}</div>
                <div className="flex gap-2 mt-3">
                  {tool.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-surface border border-border/30 text-text-muted">{tag}</span>
                  ))}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {results.length === 0 && (
        <div className="text-center py-16 border border-dashed border-border/50 rounded-xl bg-surface/20">
          <div className="text-text-muted text-[13px]">No tools found matching "{query}"</div>
        </div>
      )}
    </div>
  );
}
