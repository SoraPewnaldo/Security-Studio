import { useState } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { InputPanel } from '@/components/InputPanel';
import { OutputPanel } from '@/components/OutputPanel';
import { manifest } from './manifest';
import { computeHeaderDiff, type DiffResult } from './logic';
import type { ToolExample } from '@security-studio/types';
import readme from './README.md?raw';

export default function HttpHeaderDiffTool() {
  const [headers1, setHeaders1] = useState('');
  const [headers2, setHeaders2] = useState('');
  const [result, setResult] = useState<DiffResult | null>(null);

  const handleDiff = () => {
    setResult(computeHeaderDiff(headers1, headers2));
  };

  const handleClear = () => { setHeaders1(''); setHeaders2(''); setResult(null); };

  const handleLoadExample = (example: ToolExample) => {
    const inp = example.input as { headers1?: string; headers2?: string };
    if (inp.headers1 !== undefined) setHeaders1(String(inp.headers1));
    if (inp.headers2 !== undefined) setHeaders2(String(inp.headers2));
    setResult(null);
  };

  const diffText = result
    ? result.changes
        .map((c) => (c.added ? `+ ${c.value}` : c.removed ? `- ${c.value}` : `  ${c.value}`))
        .join('')
    : '';

  return (
    <ToolLayout manifest={manifest} outputText={diffText} readme={readme} onLoadExample={handleLoadExample}>
      <div className="space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <InputPanel title="Original Headers" onClear={() => { setHeaders1(''); setResult(null); }}>
            <textarea
              value={headers1}
              onChange={(e) => setHeaders1(e.target.value)}
              placeholder="HTTP/1.1 200 OK\nContent-Type: application/json"
              className="w-full h-64 bg-bg border border-border rounded-md p-3 text-sm font-mono text-text placeholder:text-text-muted resize-none focus:border-primary focus:outline-none transition-colors"
            />
          </InputPanel>
          <InputPanel title="Modified Headers" onClear={() => { setHeaders2(''); setResult(null); }}>
            <textarea
              value={headers2}
              onChange={(e) => setHeaders2(e.target.value)}
              placeholder="HTTP/1.1 200 OK\nContent-Type: application/json\nX-Frame-Options: DENY"
              className="w-full h-64 bg-bg border border-border rounded-md p-3 text-sm font-mono text-text placeholder:text-text-muted resize-none focus:border-primary focus:outline-none transition-colors"
            />
          </InputPanel>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleDiff}
            className="px-4 py-2 text-sm font-medium rounded-md bg-primary text-bg hover:bg-primary-hover transition-colors cursor-pointer"
          >
            Compare Headers
          </button>
          <button
            onClick={handleClear}
            className="px-4 py-2 text-sm font-medium rounded-md border border-border text-text-secondary hover:text-text hover:bg-surface-hover transition-colors cursor-pointer"
          >
            Clear All
          </button>
        </div>

        {result && (
          <OutputPanel title="Comparison Result" copyText={diffText}>
            {result.changes.length === 0 ? (
              <div className="text-success text-sm p-4 text-center border-2 border-dashed border-success/30 rounded-md bg-success-subtle">
                ✓ No differences found — the HTTP headers are identical.
              </div>
            ) : (
              <div className="space-y-1 font-mono text-sm bg-bg border border-border rounded-md p-4">
                {result.changes.map((change, i) => {
                  const lines = change.value.split('\n').filter(Boolean);
                  return lines.map((line, j) => (
                    <div
                      key={`${i}-${j}`}
                      className={`px-2 py-0.5 rounded text-[12px] break-all ${
                        change.added
                          ? 'bg-success/10 text-success border-l-2 border-success'
                          : change.removed
                          ? 'bg-danger/10 text-danger border-l-2 border-danger'
                          : 'text-text-secondary'
                      }`}
                    >
                      {change.added ? '+ ' : change.removed ? '- ' : '  '}
                      {line}
                    </div>
                  ));
                })}
              </div>
            )}
          </OutputPanel>
        )}
      </div>
    </ToolLayout>
  );
}
