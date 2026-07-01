import { useState } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { InputPanel } from '@/components/InputPanel';
import { manifest } from './manifest';
import { analyzeIp, type IpAnalysis } from './logic';

export default function IpUtilsTool() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<IpAnalysis | null>(null);
  const [error, setError] = useState('');

  const handleAnalyze = () => {
    setError('');
    try { setResult(analyzeIp(input)); } catch (e) { setError(e instanceof Error ? e.message : 'Invalid IP'); setResult(null); }
  };

  return (
    <ToolLayout manifest={manifest}>
      <div className="space-y-4">
        <InputPanel title="IP Address">
          <div className="flex gap-2">
            <input type="text" value={input} onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleAnalyze(); }}
              placeholder="192.168.1.1 or 2001:db8::1"
              className="flex-1 bg-bg border border-border rounded-md px-3 py-2 text-sm font-mono
                text-text placeholder:text-text-muted focus:border-primary focus:outline-none" />
            <button onClick={handleAnalyze}
              className="px-4 py-2 text-sm font-medium rounded-md bg-primary text-bg
                hover:bg-primary-hover transition-colors cursor-pointer">Analyze</button>
          </div>
        </InputPanel>
        {error && <div className="p-3 rounded-md bg-danger-subtle border border-danger/30 text-danger text-sm">{error}</div>}
        {result && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { label: 'Version', value: `IPv${result.version}` },
              { label: 'Valid', value: result.isValid ? '✓ Valid' : '✗ Invalid' },
              { label: 'Class', value: result.ipClass },
              { label: 'Network Type', value: result.networkType },
              { label: 'Decimal', value: result.decimal },
              { label: 'Hex', value: result.hex },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-lg border border-border bg-surface p-3">
                <div className="text-[10px] text-text-muted uppercase tracking-wider">{label}</div>
                <div className="text-sm font-mono text-text mt-1 break-all">{value}</div>
              </div>
            ))}
            <div className="col-span-full rounded-lg border border-border bg-surface p-3">
              <div className="text-[10px] text-text-muted uppercase tracking-wider">Binary</div>
              <div className="text-xs font-mono text-text-secondary mt-1 break-all">{result.binary}</div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
