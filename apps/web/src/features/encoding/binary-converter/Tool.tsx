import { useState } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { InputPanel } from '@/components/InputPanel';
import { OutputPanel } from '@/components/OutputPanel';
import { manifest } from './manifest';
import { textToBinary, binaryToText } from './logic';
import type { ToolExample } from '@security-studio/types';
import readme from './README.md?raw';

type Mode = 'text-to-binary' | 'binary-to-text';

export default function BinaryConverterTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<Mode>('text-to-binary');
  const [error, setError] = useState('');

  const handleProcess = () => {
    setError('');
    try {
      if (!input.trim()) throw new Error('Input is required.');
      const result = mode === 'text-to-binary' ? textToBinary(input) : binaryToText(input);
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
          <div className="flex items-center gap-2 mb-3">
            {(['text-to-binary', 'binary-to-text'] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-colors cursor-pointer
                  ${mode === m ? 'bg-primary text-bg border-primary' : 'border-border text-text-secondary hover:bg-surface-hover'}`}
              >
                {m === 'text-to-binary' ? 'Text → Binary' : 'Binary → Text'}
              </button>
            ))}
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); handleProcess(); } }}
            placeholder={mode === 'text-to-binary' ? 'Enter text to convert...' : 'Enter binary (e.g. 01001000 01101001)...'}
            className="w-full h-48 bg-bg border border-border rounded-md p-3 text-sm font-mono text-text placeholder:text-text-muted resize-none focus:border-primary focus:outline-none transition-colors"
          />
          <button
            onClick={handleProcess}
            className="mt-3 px-4 py-2 text-sm font-medium rounded-md bg-primary text-bg hover:bg-primary-hover transition-colors cursor-pointer"
          >
            Convert
          </button>
        </InputPanel>

        <OutputPanel title="Output" copyText={output} downloadFilename="binary-output.txt" onClear={() => setOutput('')}>
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
