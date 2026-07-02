import { useState } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { InputPanel } from '@/components/InputPanel';
import { OutputPanel } from '@/components/OutputPanel';
import { manifest } from './manifest';
import { rotN } from './logic';
import type { ToolExample } from '@security-studio/types';
import readme from './README.md?raw';

export default function Rot13Tool() {
  const [text, setText] = useState('');
  const [shift, setShift] = useState(13);
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const handleApply = () => {
    setError('');
    try {
      if (!text.trim()) throw new Error('Input text is required.');
      setOutput(rotN(text, { shift }));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An error occurred');
      setOutput('');
    }
  };

  const handleClear = () => { setText(''); setOutput(''); setError(''); };

  const handleLoadExample = (example: ToolExample) => {
    const inp = example.input as { text?: string; shift?: number };
    if (inp.text !== undefined) setText(String(inp.text));
    if (inp.shift !== undefined) setShift(Number(inp.shift));
    setOutput(''); setError('');
  };

  return (
    <ToolLayout manifest={manifest} outputText={output} readme={readme} onLoadExample={handleLoadExample}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <InputPanel title="Input" onClear={handleClear}>
          <div className="flex items-center gap-3 mb-3">
            <label className="text-[12px] text-text-muted uppercase tracking-wider">Shift</label>
            <input
              type="number"
              value={shift}
              onChange={(e) => setShift(parseInt(e.target.value) || 0)}
              min={-25} max={25}
              className="w-20 bg-bg border border-border rounded-md px-2 py-1 text-sm text-text focus:border-primary focus:outline-none"
            />
            <button
              onClick={() => setShift(13)}
              className="px-2 py-1 text-xs text-text-secondary border border-border rounded hover:bg-surface-hover transition-colors"
            >
              Reset ROT13
            </button>
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); handleApply(); } }}
            placeholder="Enter text to encode/decode..."
            className="w-full h-48 bg-bg border border-border rounded-md p-3 text-sm font-mono text-text placeholder:text-text-muted resize-none focus:border-primary focus:outline-none transition-colors"
          />
          <button
            onClick={handleApply}
            className="mt-3 px-4 py-2 text-sm font-medium rounded-md bg-primary text-bg hover:bg-primary-hover transition-colors cursor-pointer"
          >
            Apply ROT-{shift}
          </button>
        </InputPanel>

        <OutputPanel title="Output" copyText={output} downloadFilename="rot13-output.txt" onClear={() => setOutput('')}>
          {error ? (
            <div className="p-3 rounded-md bg-danger-subtle border border-danger/30 text-danger text-sm">{error}</div>
          ) : (
            <textarea
              value={output}
              readOnly
              placeholder="Output will appear here..."
              className="w-full h-48 bg-bg border border-border rounded-md p-3 text-sm font-mono text-text placeholder:text-text-muted resize-none focus:outline-none"
            />
          )}
        </OutputPanel>
      </div>
    </ToolLayout>
  );
}
