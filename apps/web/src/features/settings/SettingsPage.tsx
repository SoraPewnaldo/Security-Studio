import { useState } from 'react';
import { Settings, Keyboard, Database } from 'lucide-react';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';

const SHORTCUTS = [
  { keys: 'Ctrl+K', action: 'Open Command Palette' },
  { keys: '/', action: 'Focus Search' },
  { keys: 'Ctrl+Shift+C', action: 'Copy Output' },
  { keys: 'Esc', action: 'Close Modal / Palette' },
  { keys: 'Ctrl+S', action: 'Save Snippet' },
  { keys: 'Ctrl+H', action: 'Open History' },
  { keys: 'Ctrl+,', action: 'Open Settings' },
];

export function SettingsPage() {
  const [exporting, setExporting] = useState(false);
  const [resetting, setResetting] = useState(false);
  const queryClient = useQueryClient();

  const handleExport = async () => {
    setExporting(true);
    try {
      const res = await fetch('/api/settings/export');
      const json = await res.json();
      if (!json.success) throw new Error(json.error || 'Export failed');

      const blob = new Blob([JSON.stringify(json.data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `security-studio-export-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success('Data exported successfully');
    } catch (e: any) {
      toast.error(`Export failed: ${e.message}`);
    } finally {
      setExporting(false);
    }
  };

  const handleReset = async () => {
    if (!window.confirm('Are you absolutely sure you want to delete all local data? This cannot be undone.')) return;
    
    setResetting(true);
    try {
      const res = await fetch('/api/settings/reset', { method: 'POST' });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || 'Reset failed');

      await queryClient.invalidateQueries();
      toast.success('All data has been reset');
    } catch (e: any) {
      toast.error(`Reset failed: ${e.message}`);
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-10">
      <div>
        <h1 className="text-2xl font-medium text-text tracking-tight flex items-center gap-3">
          <Settings size={24} className="text-text-secondary" /> Settings
        </h1>
        <p className="text-sm text-text-secondary mt-1.5">Manage your workspace preferences and data.</p>
      </div>

      {/* Keyboard Shortcuts */}
      <section>
        <h2 className="text-xs font-semibold text-text-muted uppercase tracking-widest flex items-center gap-2 mb-4">
          <Keyboard size={14} /> Keyboard Shortcuts
        </h2>
        <div className="rounded-md border border-border bg-bg divide-y divide-border">
          {SHORTCUTS.map(({ keys, action }) => (
            <div key={keys} className="flex items-center justify-between px-5 py-3">
              <span className="text-[13px] font-medium text-text-secondary">{action}</span>
              <kbd className="px-2 py-1 text-[11px] font-mono font-medium tracking-wide bg-surface border border-border rounded text-text-muted">
                {keys}
              </kbd>
            </div>
          ))}
        </div>
      </section>

      {/* Data Management */}
      <section>
        <h2 className="text-xs font-semibold text-text-muted uppercase tracking-widest flex items-center gap-2 mb-4">
          <Database size={14} /> Data Management
        </h2>
        <div className="rounded-md border border-border bg-bg p-6">
          <p className="text-[13px] text-text-secondary mb-6 leading-relaxed">
            All your data is stored locally using SQLite. No sensitive information ever leaves your machine unless you explicitly export it.
          </p>
          <div className="flex gap-3">
            <button 
              onClick={handleExport}
              disabled={exporting}
              className="px-4 py-2 text-[13px] font-medium rounded-md border border-border text-text bg-surface-hover hover:border-[#444] transition-colors cursor-pointer disabled:opacity-50">
              {exporting ? 'Exporting...' : 'Export Data'}
            </button>
            <button 
              onClick={handleReset}
              disabled={resetting}
              className="px-4 py-2 text-[13px] font-medium rounded-md border border-danger/30 text-danger bg-danger/10 hover:bg-danger/20 hover:border-danger/50 transition-colors cursor-pointer disabled:opacity-50">
              {resetting ? 'Resetting...' : 'Reset All Data'}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
