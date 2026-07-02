import { useState, useMemo } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { InputPanel } from '@/components/InputPanel';
import { manifest } from './manifest';
import { executeRegex } from './logic';
import readme from './README.md?raw';

const FLAG_OPTIONS = [
  { key: 'g', label: 'Global' },
  { key: 'i', label: 'Case insensitive' },
  { key: 'm', label: 'Multiline' },
  { key: 's', label: 'Dot all' },
  { key: 'u', label: 'Unicode' },
];

export default function RegexPlaygroundTool() {
  const handleLoadExample = (example: any) => {
    if (example.input?.pattern !== undefined) setPattern(example.input.pattern);
    if (example.input?.flags !== undefined) setFlags(example.input.flags);
    if (example.input?.testString !== undefined) setTestString(example.input.testString);
  };

  const [pattern, setPattern] = useState('');
  const [flags, setFlags] = useState('g');
  const [testString, setTestString] = useState('');

  const result = useMemo(() => {
    if (!pattern || !testString) return null;
    return executeRegex(pattern, flags, testString);
  }, [pattern, flags, testString]);

  const toggleFlag = (flag: string) => {
    setFlags(flags.includes(flag) ? flags.replace(flag, '') : flags + flag);
  };

  return (
    <ToolLayout onLoadExample={handleLoadExample} readme={readme} manifest={manifest}>
      <div className="space-y-4">
        <InputPanel title="Pattern">
          <div className="flex items-center gap-2">
            <span className="text-text-muted font-mono">/</span>
            <input type="text" value={pattern} onChange={(e) => setPattern(e.target.value)}
              placeholder="Enter regex pattern..."
              className="flex-1 bg-bg border border-border rounded-md px-3 py-2 text-sm font-mono
                text-text placeholder:text-text-muted focus:border-primary focus:outline-none" />
            <span className="text-text-muted font-mono">/{flags}</span>
          </div>
          <div className="flex gap-2 mt-2">
            {FLAG_OPTIONS.map(({ key, label }) => (
              <button key={key} onClick={() => toggleFlag(key)}
                className={`px-2 py-1 text-xs rounded border transition-colors cursor-pointer ${
                  flags.includes(key) ? 'bg-primary text-bg border-primary' : 'border-border text-text-secondary hover:bg-surface-hover'
                }`}>{key} <span className="text-[10px] opacity-70">{label}</span></button>
            ))}
          </div>
        </InputPanel>

        <InputPanel title="Test String">
          <textarea value={testString} onChange={(e) => setTestString(e.target.value)}
            placeholder="Enter text to test against..."
            className="w-full h-32 bg-bg border border-border rounded-md p-3 text-sm font-mono
              text-text placeholder:text-text-muted resize-none focus:border-primary focus:outline-none" />
        </InputPanel>

        {result?.error && (
          <div className="p-3 rounded-md bg-danger-subtle border border-danger/30 text-danger text-sm">{result.error}</div>
        )}

        {result && !result.error && (
          <div className="rounded-lg border border-border bg-surface p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-medium text-text-secondary uppercase tracking-wider">
                Matches ({result.matches.length})
              </h3>
            </div>
            {result.matches.length > 0 ? (
              <div className="space-y-2">
                {result.matches.map((m, i) => (
                  <div key={i} className="bg-bg border border-border rounded-md p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-text-muted">Match {i + 1} (index {m.index})</span>
                    </div>
                    <div className="text-sm font-mono text-primary">{m.match}</div>
                    {m.groups.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {m.groups.map((g, gi) => (
                          <div key={gi} className="text-xs">
                            <span className="text-text-muted">Group {gi + 1}:</span>{' '}
                            <span className="font-mono text-text-secondary">{g || '(empty)'}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-text-muted text-center py-4">No matches found</div>
            )}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
