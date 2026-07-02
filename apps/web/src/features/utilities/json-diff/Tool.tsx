import { useState } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { manifest } from './manifest';
import { computeJsonDiff } from './logic';
import type { ToolExample } from '@security-studio/types';
import readme from './README.md?raw';

export default function JsonDiffTool() {
  const [json1, setJson1] = useState('');
  const [json2, setJson2] = useState('');
  const [result, setResult] = useState<ReturnType<typeof computeJsonDiff> | null>(null);

  const handleDiff = () => {
    setResult(computeJsonDiff(json1, json2));
  };

  const handleClear = () => { setJson1(''); setJson2(''); setResult(null); };

  const handleLoadExample = (example: ToolExample) => {
    const inp = example.input as { json1?: string; json2?: string };
    if (inp.json1 !== undefined) setJson1(String(inp.json1));
    if (inp.json2 !== undefined) setJson2(String(inp.json2));
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
          <div className="rounded-lg border border-border bg-surface p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-text-secondary uppercase tracking-wider">Original</h3>
              <button
                onClick={() => { setJson1(''); setResult(null); }}
                className="text-[11px] text-text-muted hover:text-text transition-colors"
              >
                Clear
              </button>
            </div>
            <textarea
              value={json1}
              onChange={(e) => setJson1(e.target.value)}
              placeholder='{ "version": "1.0.0" }'
              className="w-full h-64 bg-bg border border-border rounded-md p-3 text-sm font-mono text-text placeholder:text-text-muted resize-none focus:border-primary focus:outline-none transition-colors"
            />
          </div>
          <div className="rounded-lg border border-border bg-surface p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-text-secondary uppercase tracking-wider">Modified</h3>
              <button
                onClick={() => { setJson2(''); setResult(null); }}
                className="text-[11px] text-text-muted hover:text-text transition-colors"
              >
                Clear
              </button>
            </div>
            <textarea
              value={json2}
              onChange={(e) => setJson2(e.target.value)}
              placeholder='{ "version": "1.0.1" }'
              className="w-full h-64 bg-bg border border-border rounded-md p-3 text-sm font-mono text-text placeholder:text-text-muted resize-none focus:border-primary focus:outline-none transition-colors"
            />
          </div>
        </div>

        <button
          onClick={handleDiff}
          className="px-4 py-2 text-sm font-medium rounded-md bg-primary text-bg hover:bg-primary-hover transition-colors cursor-pointer"
        >
          Compare
        </button>
        <button
          onClick={handleClear}
          className="ml-2 px-4 py-2 text-sm font-medium rounded-md border border-border text-text-secondary hover:text-text hover:bg-surface-hover transition-colors cursor-pointer"
        >
          Clear All
        </button>

        {result && (
          <div className="rounded-lg border border-border bg-surface p-4">
            {result.error ? (
              <div className="p-3 rounded-md bg-danger-subtle border border-danger/30 text-danger text-sm">{result.error}</div>
            ) : result.changes.length === 0 ? (
              <div className="text-success text-sm">✓ No differences found — the JSON objects are identical.</div>
            ) : (
              <div className="space-y-1 font-mono text-sm">
                {result.changes.map((change, i) => {
                  const lines = change.value.split('\n').filter(Boolean);
                  return lines.map((line, j) => (
                    <div
                      key={`${i}-${j}`}
                      className={`px-2 py-0.5 rounded text-[12px] ${
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
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
