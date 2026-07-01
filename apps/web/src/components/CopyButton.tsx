import { useState, useCallback } from 'react';
import { Check, Copy } from 'lucide-react';
import { copyToClipboard } from '@security-studio/utils';
import toast from 'react-hot-toast';

interface CopyButtonProps {
  text: string;
  label?: string;
  className?: string;
  size?: number;
}

export function CopyButton({ text, label, className = '', size = 16 }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopied(true);
      toast.success('Copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } else {
      toast.error('Failed to copy');
    }
  }, [text]);

  return (
    <button
      onClick={handleCopy}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium
        rounded-md border border-border text-text-secondary
        hover:bg-surface-hover hover:text-text
        transition-colors duration-150 cursor-pointer ${className}`}
      title="Copy to clipboard"
    >
      {copied ? (
        <Check size={size} className="text-success" />
      ) : (
        <Copy size={size} />
      )}
      {label && <span>{copied ? 'Copied' : label}</span>}
    </button>
  );
}
