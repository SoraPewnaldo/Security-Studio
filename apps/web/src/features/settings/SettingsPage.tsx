import { Settings, Keyboard, Database } from 'lucide-react';

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
            <button className="px-4 py-2 text-[13px] font-medium rounded-md border border-border text-text bg-surface-hover
              hover:border-[#444] transition-colors cursor-pointer">
              Export Data
            </button>
            <button className="px-4 py-2 text-[13px] font-medium rounded-md border border-danger/30 text-danger bg-danger/10
              hover:bg-danger/20 hover:border-danger/50 transition-colors cursor-pointer">
              Reset All Data
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
