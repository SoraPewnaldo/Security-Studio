import { useState } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import { ToolLayout } from '@/components/ToolLayout';
import { InputPanel } from '@/components/InputPanel';
import { OutputPanel } from '@/components/OutputPanel';
import { manifest } from './manifest';
import { formatJson, minifyJson, validateJson } from './logic';

export default function JsonFormatterTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const validation = input.trim() ? validateJson(input) : null;

  const handleFormat = () => {
    setError('');
    try { setOutput(formatJson(input)); } catch (e) { setError(e instanceof Error ? e.message : 'Invalid JSON'); }
  };

  const handleMinify = () => {
    setError('');
    try { setOutput(minifyJson(input)); } catch (e) { setError(e instanceof Error ? e.message : 'Invalid JSON'); }
  };

  return (
    <ToolLayout manifest={manifest} outputText={output}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <InputPanel title="Input">
          {validation && (
            <div className={`flex items-center gap-2 mb-2 text-xs ${validation.valid ? 'text-success' : 'text-danger'}`}>
              {validation.valid ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
              {validation.valid ? `Valid JSON • ${validation.lineCount} lines • ${validation.size} bytes` : validation.error}
            </div>
          )}
          <textarea value={input} onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); handleFormat(); }}}
            placeholder="Paste JSON here..."
            className="w-full h-64 bg-bg border border-border rounded-md p-3 text-sm font-mono
              text-text placeholder:text-text-muted resize-none focus:border-primary focus:outline-none" />
          <div className="flex gap-2 mt-2">
            <button onClick={handleFormat} className="px-4 py-2 text-sm font-medium rounded-md bg-primary text-bg hover:bg-primary-hover transition-colors cursor-pointer">Format</button>
            <button onClick={handleMinify} className="px-4 py-2 text-sm font-medium rounded-md border border-border text-text-secondary hover:bg-surface-hover transition-colors cursor-pointer">Minify</button>
          </div>
        </InputPanel>

        <OutputPanel title="Output" copyText={output} downloadFilename="formatted.json">
          {error ? (
            <div className="p-3 rounded-md bg-danger-subtle border border-danger/30 text-danger text-sm">{error}</div>
          ) : (
            <textarea value={output} readOnly placeholder="Formatted output..."
              className="w-full h-64 bg-bg border border-border rounded-md p-3 text-sm font-mono
                text-text placeholder:text-text-muted resize-none focus:outline-none" />
          )}
        </OutputPanel>
      </div>
    </ToolLayout>
  );
}
