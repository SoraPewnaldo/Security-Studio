import type { ReactNode } from 'react';

import { Trash2 } from 'lucide-react';

interface InputPanelProps {
  children: ReactNode;
  title?: string;
  className?: string;
  onClear?: () => void;
}

export function InputPanel({ children, title, className = '', onClear }: InputPanelProps) {
  return (
    <div className={`rounded-lg border border-border bg-surface p-4 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        {title && (
          <h3 className="text-sm font-medium text-text-secondary uppercase tracking-wider">
            {title}
          </h3>
        )}
        {onClear && (
          <button
            onClick={onClear}
            className="flex items-center gap-1.5 px-2 py-1 text-[11px] font-medium text-text-muted hover:text-text hover:bg-surface-hover rounded transition-colors"
          >
            <Trash2 size={12} />
            Clear
          </button>
        )}
      </div>
      {children}
    </div>
  );
}
