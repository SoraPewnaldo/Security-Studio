import { useState, useMemo } from 'react';
import { useNavigate, useMatchRoute } from '@tanstack/react-router';
import {
  Search,
  Home, Star, Clock, Settings, Info, ChevronDown, ChevronRight,
  FolderOpen, Puzzle, Github, ArrowLeftRight
} from 'lucide-react';
import * as Icons from 'lucide-react';
import { toolRegistry } from '@security-studio/tool-sdk';
import { CATEGORIES, type ToolCategory, type CategoryInfo } from '@security-studio/types';
import logo from '@/assets/logo.png';

type LucideIconComponent = React.ComponentType<{ size?: number; className?: string }>;

function getIcon(name: string): LucideIconComponent {
  const icon = (Icons as unknown as Record<string, LucideIconComponent>)[name];
  return icon || Icons.Wrench;
}

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  to: string;
  active?: boolean;
  onClick?: () => void;
}

function NavItem({ icon, label, to, active, onClick }: NavItemProps) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => {
        onClick?.();
        navigate({ to });
      }}
      className={`w-full flex items-center gap-2.5 px-3 py-1.5 text-[13px] rounded-md
        transition-colors duration-150 cursor-pointer
        ${active
          ? 'text-text font-medium'
          : 'text-text-secondary hover:text-text'
        }`}
    >
      <span className="flex-shrink-0 w-4 h-4 flex items-center justify-center opacity-80">{icon}</span>
      <span className="truncate">{label}</span>
    </button>
  );
}

interface CategoryGroupProps {
  category: CategoryInfo;
  count: number;
}

function CategoryGroup({ category, count }: CategoryGroupProps) {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();
  const matchRoute = useMatchRoute();
  const tools = toolRegistry.getByCategory(category.id as ToolCategory);
  const CategoryIcon = getIcon(category.icon);

  return (
    <div>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-2.5 px-3 py-1.5 text-[13px] rounded-md
          text-text-secondary hover:text-text
          transition-colors duration-150 cursor-pointer group"
      >
        <span className="flex-shrink-0 w-4 h-4 flex items-center justify-center opacity-80">
          <CategoryIcon size={14} />
        </span>
        <span className="truncate flex-1 text-left">{category.label}</span>
        <span className="flex-shrink-0 text-text-muted opacity-50 group-hover:opacity-100 transition-opacity">
          {expanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
        </span>
      </button>
      {expanded && (
        <div className="ml-4 mt-0.5 space-y-0.5 border-l border-border/50 pl-3">
          {tools.map((tool) => {
            const isActive = !!matchRoute({ to: '/tools/$toolId', params: { toolId: tool.manifest.id } });
            const ToolIcon = getIcon(tool.manifest.icon);
            return (
              <button
                key={tool.manifest.id}
                onClick={() => navigate({ to: '/tools/$toolId', params: { toolId: tool.manifest.id } })}
                className={`w-full flex items-center gap-2 px-2.5 py-1 text-[13px] rounded-md
                  transition-colors duration-150 cursor-pointer
                  ${isActive
                    ? 'text-text font-medium'
                    : 'text-text-secondary hover:text-text'
                  }`}
              >
                <span className="opacity-80"><ToolIcon size={12} /></span>
                <span className="truncate">{tool.manifest.name}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function Sidebar() {
  const matchRoute = useMatchRoute();
  const categoryCounts = useMemo(() => toolRegistry.getCategoryCounts(), []);
  const activeCategories = CATEGORIES.filter((cat) => (categoryCounts.get(cat.id) ?? 0) > 0);

  return (
    <aside className="w-[260px] h-screen flex flex-col border-r border-border bg-bg flex-shrink-0 overflow-hidden">
      
      {/* Workspace Selector */}
      <div className="px-3 pt-4 pb-2 flex-shrink-0">
        <button className="w-full flex items-center justify-between px-2 py-1.5 hover:bg-surface-hover rounded-md transition-colors cursor-pointer group">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded flex items-center justify-center">
              <img src={logo} alt="Security Studio" className="w-7 h-7 object-contain brightness-0 invert opacity-90" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[13px] font-medium text-text">Workspace</span>
              <span className="px-1.5 py-0.5 text-[10px] bg-border rounded-full text-text-secondary border border-border">Hobby</span>
            </div>
          </div>
          <ArrowLeftRight size={12} className="text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
      </div>

      {/* Inline Search */}
      <div className="px-4 py-2 mb-2 flex-shrink-0">
        <div className="relative">
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted" />
          <input 
            type="text" 
            placeholder="Find..." 
            className="w-full bg-surface-hover border-none rounded-md pl-8 pr-6 py-1.5 text-[13px] text-text
              placeholder:text-text-muted focus:ring-1 focus:ring-border outline-none transition-all"
          />
          <kbd className="absolute right-2 top-1/2 -translate-y-1/2 px-1 text-[10px] font-mono rounded bg-bg text-text-muted border border-border">
            F
          </kbd>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 space-y-0.5">
        <NavItem
          icon={<Home size={14} />}
          label="Overview"
          to="/"
          active={!!matchRoute({ to: '/' })}
        />
        <NavItem
          icon={<Star size={14} />}
          label="Favorites"
          to="/favorites"
          active={!!matchRoute({ to: '/favorites' })}
        />
        <NavItem
          icon={<Clock size={14} />}
          label="History"
          to="/history"
          active={!!matchRoute({ to: '/history' })}
        />

        {/* Separator */}
        <div className="h-px bg-border my-4 mx-2" />

        {/* Tools */}
        <div className="space-y-0.5">
          {activeCategories.map((cat) => (
            <CategoryGroup
              key={cat.id}
              category={cat}
              count={categoryCounts.get(cat.id) ?? 0}
            />
          ))}
        </div>

        {/* Separator */}
        <div className="h-px bg-border my-4 mx-2" />

        <NavItem
          icon={<Settings size={14} />}
          label="Settings"
          to="/settings"
          active={!!matchRoute({ to: '/settings' })}
        />
        <NavItem
          icon={<Info size={14} />}
          label="Support"
          to="/about"
          active={!!matchRoute({ to: '/about' })}
        />
      </nav>

      {/* Footer */}
      <div className="flex-shrink-0 px-4 py-4 mt-auto">
        <button className="flex items-center gap-2 w-full px-2 py-1.5 text-[13px] text-text-secondary hover:text-text transition-colors cursor-pointer">
          <div className="w-5 h-5 rounded-full bg-border flex items-center justify-center">
            <span className="text-[10px] font-medium text-text">AY</span>
          </div>
          <span>ayush</span>
        </button>
      </div>
    </aside>
  );
}
