import { useState } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { InputPanel } from '@/components/InputPanel';
import { OutputPanel } from '@/components/OutputPanel';
import { manifest } from './manifest';
import { formatXml, minifyXml } from './logic';
import type { ToolExample } from '@security-studio/types';
import readme from './README.md?raw';

export default function XmlFormatterTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [indent, setIndent] = useState(2);
  const [error, setError] = useState('');

  const handleFormat = () => {
    setError('');
    try {
      if (!input.trim()) throw new Error('XML input is required.');
      setOutput(formatXml(input, indent));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An error occurred');
      setOutput('');
    }
  };

  const handleMinify = () => {
    setError('');
    try {
      if (!input.trim()) throw new Error('XML input is required.');
      setOutput(minifyXml(input));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An error occurred');
      setOutput('');
    }
  };

  const handleClear = () => { setInput(''); setOutput(''); setError(''); };

  const handleLoadExample = (example: ToolExample) => {
    const inp = example.input as { xml?: string; indent?: number };
    if (inp.xml !== undefined) setInput(String(inp.xml));
    if (inp.indent !== undefined) setIndent(Number(inp.indent));
    setOutput(''); setError('');
  };

  return (
    <ToolLayout manifest={manifest} outputText={output} readme={readme} onLoadExample={handleLoadExample}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <InputPanel title="XML Input" onClear={handleClear}>
          <div className="flex items-center gap-3 mb-3">
            <label className="text-[11px] text-text-muted uppercase tracking-wider">Indent</label>
            <select
              value={indent}
              onChange={(e) => setIndent(Number(e.target.value))}
              className="bg-bg border border-border rounded px-2 py-1 text-xs text-text focus:border-primary focus:outline-none"
            >
              <option value={2}>2 spaces</option>
              <option value={4}>4 spaces</option>
              <option value={1}>1 space</option>
            </select>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); handleFormat(); } }}
            placeholder="Paste XML here..."
            className="w-full h-64 bg-bg border border-border rounded-md p-3 text-sm font-mono text-text placeholder:text-text-muted resize-none focus:border-primary focus:outline-none transition-colors"
          />
          <div className="flex gap-2 mt-3">
            <button
              onClick={handleFormat}
              className="px-4 py-2 text-sm font-medium rounded-md bg-primary text-bg hover:bg-primary-hover transition-colors cursor-pointer"
            >
              Format
            </button>
            <button
              onClick={handleMinify}
              className="px-4 py-2 text-sm font-medium rounded-md border border-border text-text-secondary hover:text-text hover:bg-surface-hover transition-colors cursor-pointer"
            >
              Minify
            </button>
          </div>
        </InputPanel>

        <OutputPanel title="Output" copyText={output} downloadFilename="formatted.xml" onClear={() => setOutput('')}>
          {error ? (
            <div className="p-3 rounded-md bg-danger-subtle border border-danger/30 text-danger text-sm">{error}</div>
          ) : (
            <textarea
              value={output}
              readOnly
              placeholder="Formatted XML will appear here..."
              className="w-full h-64 bg-bg border border-border rounded-md p-3 text-sm font-mono text-text placeholder:text-text-muted resize-none focus:outline-none"
            />
          )}
        </OutputPanel>
      </div>
    </ToolLayout>
  );
}
