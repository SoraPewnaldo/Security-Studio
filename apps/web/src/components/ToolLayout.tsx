import { useState } from 'react';
import { useMatchRoute, Outlet, useNavigate } from '@tanstack/react-router';
import { Download, Star, Copy, Play, Check } from 'lucide-react';
import * as Icons from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toolRegistry } from '@security-studio/tool-sdk';
import { useFavorites } from '@/hooks/useFavorites';
import { useAddHistory } from '@/hooks/useHistory';
import { useEffect } from 'react';

type LucideIcon = React.ComponentType<{ size?: number; className?: string }>;
function getIcon(name: string): LucideIcon {
  return (Icons as unknown as Record<string, LucideIcon>)[name] || Icons.Wrench;
}

function downloadAsFile(filename: string, content: string) {
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function CopyButton({ text, label = 'Copy' }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium
        rounded-md border border-border text-text-secondary hover:text-text hover:border-[#444]
        transition-colors duration-150 cursor-pointer"
    >
      {copied ? <Check size={12} className="text-success" /> : <Copy size={12} />}
      <span>{copied ? 'Copied' : label}</span>
    </button>
  );
}

export function ToolLayout({ children, manifest: passedManifest, outputText: passedOutputText }: { children?: React.ReactNode, manifest?: any, outputText?: string }) {
  const matchRoute = useMatchRoute();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: favorites = [] } = useFavorites();
  const addHistory = useAddHistory();

  const match = matchRoute({ to: '/tools/$toolId' });
  const toolId = match ? (match as any).toolId : null;
  const tool = toolId ? toolRegistry.getById(toolId) : null;
  
  const manifest = passedManifest || (tool ? tool.manifest : null);
  const outputText = passedOutputText || '';

  useEffect(() => {
    if (manifest) {
      addHistory.mutate({
        toolId: manifest.id,
        toolName: manifest.name,
        action: 'Opened Tool'
      });
    }
  }, [manifest?.id]);

  const [activeTab, setActiveTab] = useState('tool');

  const toggleFavorite = useMutation({
    mutationFn: async ({ id, isFavorited }: { id: string; isFavorited: boolean }) => {
      if (isFavorited) {
        return fetch(`/api/favorites/${id}`, { method: 'DELETE' });
      } else {
        return fetch('/api/favorites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ toolId: id })
        });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    }
  });

  if (!manifest) {
    return <div className="p-8 text-text-muted text-[13px]">Tool not found.</div>;
  }

  const IconComponent = getIcon(manifest.icon);
  const isFavorite = favorites.some((f) => f.toolId === manifest.id);

  const tabs = [
    { id: 'tool', label: 'Tool', icon: <Play size={12} /> },
    { id: 'examples', label: 'Examples', icon: <Copy size={12} /> },
    { id: 'docs', label: 'Documentation', icon: <Icons.FileText size={12} /> }
  ];

  return (
    <div className="h-full flex flex-col bg-bg">
      {/* Header */}
      <div className="flex-shrink-0 border-b border-border px-8 pt-8 pb-0">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-md border border-border bg-surface flex items-center justify-center">
              <IconComponent size={20} className="text-text" />
            </div>
            <div>
              <h1 className="text-lg font-medium text-text">{manifest.name}</h1>
              <p className="text-[13px] text-text-secondary mt-0.5">{manifest.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {outputText && (
              <button
                onClick={() => downloadAsFile(`${manifest.id}-output.txt`, outputText)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium
                  rounded-md border border-border text-text-secondary hover:text-text hover:border-[#444]
                  transition-colors duration-150 cursor-pointer"
              >
                <Download size={12} />
                <span>Download</span>
              </button>
            )}
            {outputText && (
              <CopyButton text={outputText} />
            )}
            <button
              onClick={() => toggleFavorite.mutate({ id: manifest.id, isFavorited: isFavorite })}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium
                rounded-md border transition-colors duration-150 cursor-pointer
                ${isFavorite
                  ? 'border-warning/30 text-warning bg-warning/5 hover:bg-warning/10'
                  : 'border-border text-text bg-surface-hover hover:border-[#444]'
                }`}
            >
              <Star size={12} fill={isFavorite ? 'currentColor' : 'none'} />
              <span>{isFavorite ? 'Unpin' : 'Pin to Dashboard'}</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 pb-3 text-[13px] font-medium border-b-2 transition-colors cursor-pointer
                ${activeTab === tab.id
                  ? 'border-text text-text'
                  : 'border-transparent text-text-secondary hover:text-text'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-8 bg-bg">
        <div className="max-w-4xl">
          {activeTab === 'tool' && children}
          {activeTab === 'examples' && (
            <div className="text-sm text-text-secondary">Examples for {manifest.name} will be added here.</div>
          )}
          {activeTab === 'docs' && (
            <div className="text-sm text-text-secondary">Documentation for {manifest.name} will be available here.</div>
          )}
        </div>
      </div>
    </div>
  );
}
