import type { ReactNode } from 'react';

interface InputPanelProps {
  children: ReactNode;
  title?: string;
  className?: string;
}

export function InputPanel({ children, title, className = '' }: InputPanelProps) {
  return (
    <div className={`rounded-lg border border-border bg-surface p-4 ${className}`}>
      {title && (
        <h3 className="text-sm font-medium text-text-secondary mb-3 uppercase tracking-wider">
          {title}
        </h3>
      )}
      {children}
    </div>
  );
}
