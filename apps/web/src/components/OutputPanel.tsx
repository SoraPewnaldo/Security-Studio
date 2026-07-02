import type { ReactNode } from 'react';
import { CopyButton } from './CopyButton';
import { Trash2, Download } from 'lucide-react';
import { downloadAsFile } from '@security-studio/utils';

interface OutputPanelProps {
  children: ReactNode;
  title?: string;
  copyText?: string;
  downloadFilename?: string;
  className?: string;
  onClear?: () => void;
}

export function OutputPanel({ children, title, copyText, downloadFilename, className = '', onClear }: OutputPanelProps) {
  return (
    <div className={`rounded-lg border border-border bg-surface p-4 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        {title && (
          <h3 className="text-sm font-medium text-text-secondary uppercase tracking-wider">
            {title}
          </h3>
        )}
        <div className="flex items-center gap-2 ml-auto">
          {onClear && (
            <button
              onClick={onClear}
              className="flex items-center gap-1.5 px-2 py-1 text-[11px] font-medium text-text-muted hover:text-text hover:bg-surface-hover rounded transition-colors mr-1"
            >
              <Trash2 size={12} />
              Clear
            </button>
          )}
          {copyText && <CopyButton text={copyText} label="Copy" />}
          {downloadFilename && copyText && (
            <button
              onClick={() => downloadAsFile(copyText, downloadFilename)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium
                rounded-md border border-border text-text-secondary
                hover:bg-surface-hover hover:text-text
                transition-colors duration-150 cursor-pointer"
              title="Download"
            >
              <Download size={16} />
              <span>Download</span>
            </button>
          )}
        </div>
      </div>
      {children}
    </div>
  );
}
