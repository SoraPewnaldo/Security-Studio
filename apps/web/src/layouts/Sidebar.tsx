import { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate, useMatchRoute } from '@tanstack/react-router';
import {
  Search,
  Home, Star, Clock, Settings, Info, ChevronDown, ChevronRight,
  FolderOpen, Puzzle, ArrowLeftRight, Check, BookMarked,
} from 'lucide-react';
import * as Icons from 'lucide-react';
import { toolRegistry } from '@security-studio/tool-sdk';
import { type CategoryInfo } from '@security-studio/types';
import { useActiveWorkspace } from '@/contexts/WorkspaceContext';
import { useWorkspaces } from '@/hooks/useWorkspaces';
import { usePlugins } from '@/hooks/usePlugins';
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
  badge?: number;
}

function NavItem({ icon, label, to, active, onClick, badge }: NavItemProps) {
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
      <span className="truncate flex-1 text-left">{label}</span>
      {badge !== undefined && badge > 0 && (
        <span className="flex-shrink-0 px-1.5 py-0.5 text-[10px] rounded-full bg-surface-hover text-text-muted border border-border">
          {badge}
        </span>
      )}
    </button>
  );
}

interface CategoryGroupProps {
  category: CategoryInfo;
  count: number;
  filterToolIds?: Set<string> | null;
}

function CategoryGroup({ category, count, filterToolIds }: CategoryGroupProps) {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();
  const matchRoute = useMatchRoute();
  const allCategoryTools = toolRegistry.getByCategory(category.id);
  const tools = filterToolIds
    ? allCategoryTools.filter((t) => filterToolIds.has(t.manifest.id))
    : allCategoryTools;
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
  const navigate = useNavigate();
  const { activeWorkspaceId, activeWorkspace, setActiveWorkspace } = useActiveWorkspace();
  const { data: workspaces = [] } = useWorkspaces();
  const { data: plugins = [] } = usePlugins();
  const [wsDropdownOpen, setWsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setWsDropdownOpen(false);
      }
    }
    if (wsDropdownOpen) {
      document.addEventListener('mousedown', handleClick);
      return () => document.removeEventListener('mousedown', handleClick);
    }
  }, [wsDropdownOpen]);

  // Workspace-aware tool filtering
  const workspaceToolIds = useMemo(() => {
    if (!activeWorkspace?.tools) return null;
    return new Set(activeWorkspace.tools.map((t) => t.toolId));
  }, [activeWorkspace]);

  const categoryCounts = useMemo(() => {
    if (!workspaceToolIds) return toolRegistry.getCategoryCounts();
    // Filter counts to only workspace tools
    const counts = new Map<string, number>();
    for (const manifest of toolRegistry.getAllManifests()) {
      if (workspaceToolIds.has(manifest.id)) {
        counts.set(manifest.category, (counts.get(manifest.category) ?? 0) + 1);
      }
    }
    return counts;
  }, [workspaceToolIds]);

  const activeCategories = useMemo(() => {
    const counts = categoryCounts;
    const catMap = new Map<string, CategoryInfo>();
    
    // Default icons for known categories
    const iconMap: Record<string, string> = {
      'authentication': 'KeyRound',
      'encoding': 'Binary',
      'cryptography': 'Lock',
      'networking': 'Network',
      'web-security': 'Shield',
      'utilities': 'Wrench',
      'file-analysis': 'FileSearch',
      'pentesting': 'Target'
    };

    for (const manifest of toolRegistry.getAllManifests()) {
      if ((counts.get(manifest.category) ?? 0) > 0 && !catMap.has(manifest.category)) {
        const catId = manifest.category;
        catMap.set(catId, {
          id: catId,
          label: catId.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
          icon: iconMap[catId] || 'Folder',
          description: ''
        });
      }
    }
    
    return Array.from(catMap.values()).sort((a, b) => a.label.localeCompare(b.label));
  }, [categoryCounts]);

  const loadedPluginCount = plugins.filter((p) => p.status === 'loaded').length;

  return (
    <aside className="w-[260px] h-screen flex flex-col border-r border-border bg-bg flex-shrink-0 overflow-hidden relative z-10">
      
      {/* Workspace Selector */}
      <div className="px-3 pt-4 pb-2 flex-shrink-0" ref={dropdownRef}>
        <button
          onClick={() => setWsDropdownOpen(!wsDropdownOpen)}
          className="w-full flex items-center justify-between px-2 py-1.5 hover:bg-surface-hover rounded-md transition-colors cursor-pointer group"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded flex items-center justify-center">
              <img src={logo} alt="Security Studio" className="w-7 h-7 object-contain brightness-0 invert opacity-90" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[13px] font-medium text-text truncate max-w-[120px]">
                {activeWorkspace ? activeWorkspace.name : 'All Tools'}
              </span>
              <span className="px-1.5 py-0.5 text-[10px] bg-border rounded-full text-text-secondary border border-border">
                {activeWorkspace ? `${activeWorkspace.tools?.length ?? 0} tools` : 'Default'}
              </span>
            </div>
          </div>
          <ChevronDown size={12} className={`text-text-muted transition-transform ${wsDropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Dropdown */}
        {wsDropdownOpen && (
          <div className="absolute left-3 right-3 mt-1 rounded-lg border border-border bg-bg shadow-xl z-50 overflow-hidden">
            <div className="p-1">
              {/* All Tools option */}
              <button
                onClick={() => {
                  setActiveWorkspace(null);
                  setWsDropdownOpen(false);
                }}
                className="w-full flex items-center justify-between px-3 py-2 text-[13px] rounded-md
                  hover:bg-surface-hover transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <FolderOpen size={14} className="text-text-muted" />
                  <span className={activeWorkspaceId === null ? 'text-text font-medium' : 'text-text-secondary'}>
                    All Tools
                  </span>
                </div>
                {activeWorkspaceId === null && <Check size={12} className="text-success" />}
              </button>

              {workspaces.length > 0 && (
                <div className="h-px bg-border my-1 mx-2" />
              )}

              {/* Workspace list */}
              {workspaces.map((ws) => {
                const WsIcon = getIcon(ws.icon);
                return (
                  <button
                    key={ws.id}
                    onClick={() => {
                      setActiveWorkspace(ws.id);
                      setWsDropdownOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 text-[13px] rounded-md
                      hover:bg-surface-hover transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <WsIcon size={14} className="text-text-muted" />
                      <span className={activeWorkspaceId === ws.id ? 'text-text font-medium' : 'text-text-secondary'}>
                        {ws.name}
                      </span>
                    </div>
                    {activeWorkspaceId === ws.id && <Check size={12} className="text-success" />}
                  </button>
                );
              })}

              <div className="h-px bg-border my-1 mx-2" />

              {/* Manage link */}
              <button
                onClick={() => {
                  setWsDropdownOpen(false);
                  navigate({ to: '/workspaces' });
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] text-text-secondary
                  hover:text-text rounded-md hover:bg-surface-hover transition-colors cursor-pointer"
              >
                <Settings size={14} className="text-text-muted" />
                Manage Workspaces
              </button>
            </div>
          </div>
        )}
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
              filterToolIds={workspaceToolIds}
            />
          ))}
        </div>

        {/* Separator */}
        <div className="h-px bg-border my-4 mx-2" />

        {/* Playbooks */}
        <NavItem
          icon={<BookMarked size={14} />}
          label="Playbooks"
          to="/playbooks"
          active={!!matchRoute({ to: '/playbooks', fuzzy: true })}
        />

        {/* Plugins */}
        <NavItem
          icon={<Puzzle size={14} />}
          label="Plugins"
          to="/plugins"
          active={!!matchRoute({ to: '/plugins' })}
          badge={loadedPluginCount > 0 ? loadedPluginCount : undefined}
        />

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
            <span className="text-[10px] font-medium text-text">U</span>
          </div>
          <span>User</span>
        </button>
      </div>
    </aside>
  );
}
