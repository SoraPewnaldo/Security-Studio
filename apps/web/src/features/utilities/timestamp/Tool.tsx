import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { ToolLayout } from '@/components/ToolLayout';
import { InputPanel } from '@/components/InputPanel';
import { manifest } from './manifest';
import { convertTimestamp, getCurrentTimestamp, type TimestampResult } from './logic';
import readme from './README.md?raw';

export default function TimestampTool() {
  const handleLoadExample = (example: any) => {
    if (example.input?.input !== undefined) setInput(example.input.input);
    if (example.input?.result !== undefined) setResult(example.input.result);
    if (example.input?.error !== undefined) setError(example.input.error);
    if (example.input?.liveTimestamp !== undefined) setLiveTimestamp(example.input.liveTimestamp);
  };

  const [input, setInput] = useState('');
  const [result, setResult] = useState<TimestampResult | null>(null);
  const [error, setError] = useState('');
  const [liveTimestamp, setLiveTimestamp] = useState(getCurrentTimestamp());

  useEffect(() => {
    const interval = setInterval(() => setLiveTimestamp(getCurrentTimestamp()), 1000);
    return () => clearInterval(interval);
  }, []);

  const handleConvert = (value?: string) => {
    setError('');
    try { setResult(convertTimestamp(value ?? input)); } catch (e) { setError(e instanceof Error ? e.message : 'Invalid input'); setResult(null); }
  };

  const handleNow = () => { setInput('now'); handleConvert('now'); };

  return (
    <ToolLayout onLoadExample={handleLoadExample} readme={readme} manifest={manifest}>
      <div className="space-y-4">
        {/* Live clock */}
        <div className="flex items-center gap-3 rounded-lg border border-border bg-surface p-4">
          <Clock size={16} className="text-primary" />
          <div>
            <div className="text-xs text-text-muted">Current Unix Timestamp</div>
            <div className="text-lg font-mono text-text">{liveTimestamp.unix}</div>
          </div>
          <div className="ml-auto">
            <div className="text-xs text-text-muted">Milliseconds</div>
            <div className="text-sm font-mono text-text-secondary">{liveTimestamp.unixMs}</div>
          </div>
        </div>

        <InputPanel title="Input">
          <div className="flex gap-2">
            <input type="text" value={input} onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleConvert(); }}
              placeholder="Unix timestamp, date string, or 'now'"
              className="flex-1 bg-bg border border-border rounded-md px-3 py-2 text-sm font-mono
                text-text placeholder:text-text-muted focus:border-primary focus:outline-none" />
            <button onClick={() => handleConvert()}
              className="px-4 py-2 text-sm font-medium rounded-md bg-primary text-bg hover:bg-primary-hover transition-colors cursor-pointer">Convert</button>
            <button onClick={handleNow}
              className="px-3 py-2 text-sm font-medium rounded-md border border-border text-text-secondary hover:bg-surface-hover transition-colors cursor-pointer">Now</button>
          </div>
          <div className="text-[10px] text-text-muted mt-1">Accepts: Unix seconds (10 digits), Unix ms (13 digits), date strings, ISO 8601</div>
        </InputPanel>

        {error && <div className="p-3 rounded-md bg-danger-subtle border border-danger/30 text-danger text-sm">{error}</div>}

        {result && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { label: 'Unix (seconds)', value: result.unix.toString() },
              { label: 'Unix (ms)', value: result.unixMs.toString() },
              { label: 'UTC', value: result.utc },
              { label: 'Local Time', value: result.local },
              { label: 'ISO 8601', value: result.iso },
              { label: 'Relative', value: result.relative },
              { label: 'Day of Week', value: result.dayOfWeek },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-lg border border-border bg-surface p-3">
                <div className="text-[10px] text-text-muted uppercase tracking-wider">{label}</div>
                <div className="text-sm font-mono text-text mt-1 break-all select-all">{value}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
