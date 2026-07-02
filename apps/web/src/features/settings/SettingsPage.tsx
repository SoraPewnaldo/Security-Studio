import { useState } from 'react';
import { Settings, Database } from 'lucide-react';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';

export function SettingsPage() {
  const [exporting, setExporting] = useState(false);
  const [resetting, setResetting] = useState(false);
  const queryClient = useQueryClient();

  const handleExport = async () => {
    setExporting(true);
    try {
      const res = await fetch('/api/settings/export');
      const json = await res.json();
      const blob = new Blob([JSON.stringify(json, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `security-studio-export-${Date.now()}.json`;
      a.click();
      toast.success('Database and settings exported successfully');
    } catch {
      toast.error('Failed to export settings');
    } finally {
      setExporting(false);
    }
  };

  const handleReset = async () => {
    if (!confirm('Are you absolutely sure? This will delete all history, workspaces, and reset all settings.')) return;
    setResetting(true);
    try {
      await fetch('/api/settings/reset', { method: 'POST' });
      queryClient.clear();
      toast.success('Database and workspaces reset successfully');
    } catch {
      toast.error('Failed to reset database');
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
