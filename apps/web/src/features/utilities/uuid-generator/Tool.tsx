import { useState } from 'react';
import { Copy, RefreshCw } from 'lucide-react';
import { ToolLayout } from '@/components/ToolLayout';
import { manifest } from './manifest';
import { generateBulk, formatUuid } from './logic';
import { copyToClipboard } from '@security-studio/utils';
import toast from 'react-hot-toast';

export default function UuidGeneratorTool() {
  const [count, setCount] = useState(5);
  const [uppercase, setUppercase] = useState(false);
  const [hyphens, setHyphens] = useState(true);
  const [uuids, setUuids] = useState<string[]>([]);

  const handleGenerate = () => setUuids(generateBulk(count));

  const formatted = uuids.map((u) => formatUuid(u, uppercase, hyphens));

  const handleCopy = async (text: string) => { await copyToClipboard(text); toast.success('Copied!'); };
  const handleCopyAll = async () => { await copyToClipboard(formatted.join('\n')); toast.success('All copied!'); };

  return (
    <ToolLayout manifest={manifest} outputText={formatted.join('\n')}>
      <div className="space-y-4">
        <div className="rounded-lg border border-border bg-surface p-4">
          <div className="flex items-end gap-4 flex-wrap">
            <div>
              <label className="text-xs text-text-secondary block mb-1">Count</label>
              <input type="number" min={1} max={100} value={count} onChange={(e) => setCount(Number(e.target.value))}
                className="w-20 bg-bg border border-border rounded-md px-2.5 py-1.5 text-sm text-text focus:border-primary focus:outline-none" />
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={uppercase} onChange={(e) => setUppercase(e.target.checked)} className="accent-primary" />
              <span className="text-sm text-text">Uppercase</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={hyphens} onChange={(e) => setHyphens(e.target.checked)} className="accent-primary" />
              <span className="text-sm text-text">Hyphens</span>
            </label>
            <button onClick={handleGenerate}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md bg-primary text-bg hover:bg-primary-hover transition-colors cursor-pointer">
              <RefreshCw size={14} /> Generate
            </button>
            {formatted.length > 0 && (
              <button onClick={() => void handleCopyAll()}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md border border-border text-text-secondary hover:bg-surface-hover transition-colors cursor-pointer">
                <Copy size={14} /> Copy All
              </button>
            )}
          </div>
        </div>

        {formatted.length > 0 && (
          <div className="space-y-1">
            {formatted.map((uuid, i) => (
              <div key={i} className="flex items-center justify-between bg-surface border border-border rounded-md px-3 py-2 group">
                <span className="text-sm font-mono text-text select-all">{uuid}</span>
                <button onClick={() => void handleCopy(uuid)}
                  className="flex-shrink-0 ml-2 p-1 text-text-muted hover:text-text opacity-0 group-hover:opacity-100 transition-all cursor-pointer">
                  <Copy size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
