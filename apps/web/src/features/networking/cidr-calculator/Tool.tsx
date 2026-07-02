import { useState } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { InputPanel } from '@/components/InputPanel';
import { manifest } from './manifest';
import { parseCidr, type CidrResult } from './logic';
import readme from './README.md?raw';

export default function CidrCalculatorTool() {
  const handleLoadExample = (example: any) => {
    if (example.input?.input !== undefined) setInput(example.input.input);
    if (example.input?.result !== undefined) setResult(example.input.result);
    if (example.input?.error !== undefined) setError(example.input.error);
  };

  const [input, setInput] = useState('');
  const [result, setResult] = useState<CidrResult | null>(null);
  const [error, setError] = useState('');

  const handleCalculate = () => {
    setError('');
    try { setResult(parseCidr(input)); } catch (e) { setError(e instanceof Error ? e.message : 'Invalid input'); setResult(null); }
  };

  const outputText = result ? Object.entries(result).map(([k, v]) => `${k}: ${v}`).join('\n') : '';

  return (
    <ToolLayout onLoadExample={handleLoadExample} readme={readme} manifest={manifest} outputText={outputText}>
      <div className="space-y-4">
        <InputPanel title="CIDR Notation">
          <div className="flex gap-2">
            <input type="text" value={input} onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleCalculate(); }}
              placeholder="192.168.1.0/24"
              className="flex-1 bg-bg border border-border rounded-md px-3 py-2 text-sm font-mono
                text-text placeholder:text-text-muted focus:border-primary focus:outline-none" />
            <button onClick={handleCalculate}
              className="px-4 py-2 text-sm font-medium rounded-md bg-primary text-bg
                hover:bg-primary-hover transition-colors cursor-pointer">
              Calculate
            </button>
          </div>
        </InputPanel>

        {error && <div className="p-3 rounded-md bg-danger-subtle border border-danger/30 text-danger text-sm">{error}</div>}

        {result && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: 'Network Address', value: result.network },
              { label: 'Broadcast Address', value: result.broadcast },
              { label: 'Subnet Mask', value: result.subnetMask },
              { label: 'Wildcard Mask', value: result.wildcardMask },
              { label: 'First Host', value: result.firstHost },
              { label: 'Last Host', value: result.lastHost },
              { label: 'Total Hosts', value: result.totalHosts.toLocaleString() },
              { label: 'Usable Hosts', value: result.usableHosts.toLocaleString() },
              { label: 'Prefix Length', value: `/${result.prefix}` },
              { label: 'IP Class', value: `Class ${result.ipClass}` },
              { label: 'Network Type', value: result.isPrivate ? 'Private' : 'Public' },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-lg border border-border bg-surface p-3">
                <div className="text-[10px] text-text-muted uppercase tracking-wider">{label}</div>
                <div className="text-sm font-mono text-text mt-1">{value}</div>
              </div>
            ))}
            <div className="md:col-span-2 rounded-lg border border-border bg-surface p-3">
              <div className="text-[10px] text-text-muted uppercase tracking-wider">Binary</div>
              <div className="text-xs font-mono text-text-secondary mt-1 break-all">{result.binary}</div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
