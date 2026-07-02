import { useState } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { InputPanel } from '@/components/InputPanel';
import { OutputPanel } from '@/components/OutputPanel';
import { manifest } from './manifest';
import { textToHex, hexToText } from './logic';
import type { ToolExample } from '@security-studio/types';
import readme from './README.md?raw';

type Mode = 'encode' | 'decode';

export default function HexEncoderTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<Mode>('encode');
  const [separator, setSeparator] = useState(' ');
  const [error, setError] = useState('');

  const handleProcess = () => {
    setError('');
    try {
      if (!input.trim()) throw new Error('Input is required.');
      const result = mode === 'encode' ? textToHex(input, separator) : hexToText(input);
      setOutput(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An error occurred');
      setOutput('');
    }
  };

  const handleClear = () => { setInput(''); setOutput(''); setError(''); };

  const handleLoadExample = (example: ToolExample) => {
    const inp = example.input as { text?: string; mode?: string };
    if (inp.text !== undefined) setInput(String(inp.text));
    if (inp.mode !== undefined) setMode(inp.mode as Mode);
    setOutput(''); setError('');
  };

  return (
    <ToolLayout manifest={manifest} outputText={output} readme={readme} onLoadExample={handleLoadExample}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <InputPanel title="Input" onClear={handleClear}>
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            {(['encode', 'decode'] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-colors cursor-pointer
                  ${mode === m ? 'bg-primary text-bg border-primary' : 'border-border text-text-secondary hover:bg-surface-hover'}`}
              >
                {m === 'encode' ? 'Text → Hex' : 'Hex → Text'}
              </button>
            ))}
            {mode === 'encode' && (
              <div className="flex items-center gap-1.5 ml-auto">
                <label className="text-[11px] text-text-muted">Separator</label>
                <select
                  value={separator}
                  onChange={(e) => setSeparator(e.target.value)}
                  className="bg-bg border border-border rounded px-2 py-1 text-xs text-text focus:border-primary focus:outline-none"
                >
                  <option value=" ">Space</option>
                  <option value="">None</option>
                  <option value=":">Colon</option>
                </select>
              </div>
            )}
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); handleProcess(); } }}
            placeholder={mode === 'encode' ? 'Enter text to encode...' : 'Enter hex (e.g. 48 65 6c 6c 6f)...'}
            className="w-full h-48 bg-bg border border-border rounded-md p-3 text-sm font-mono text-text placeholder:text-text-muted resize-none focus:border-primary focus:outline-none transition-colors"
          />
          <button
            onClick={handleProcess}
            className="mt-3 px-4 py-2 text-sm font-medium rounded-md bg-primary text-bg hover:bg-primary-hover transition-colors cursor-pointer"
          >
            {mode === 'encode' ? 'Encode to Hex' : 'Decode to Text'}
          </button>
        </InputPanel>

        <OutputPanel title="Output" copyText={output} downloadFilename="hex-output.txt" onClear={() => setOutput('')}>
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
