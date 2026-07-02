import { useState } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { InputPanel } from '@/components/InputPanel';
import { OutputPanel } from '@/components/OutputPanel';
import { manifest } from './manifest';
import { textToUnicode, unicodeToText, textToCodePoints } from './logic';
import type { ToolExample } from '@security-studio/types';
import readme from './README.md?raw';

type Mode = 'encode' | 'decode';

export default function UnicodeConverterTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [codePoints, setCodePoints] = useState('');
  const [mode, setMode] = useState<Mode>('encode');
  const [error, setError] = useState('');

  const handleConvert = () => {
    setError('');
    try {
      if (!input.trim()) throw new Error('Input is required.');
      if (mode === 'encode') {
        setOutput(textToUnicode(input));
        setCodePoints(textToCodePoints(input));
      } else {
        setOutput(unicodeToText(input));
        setCodePoints('');
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An error occurred');
      setOutput('');
      setCodePoints('');
    }
  };

  const handleClear = () => { setInput(''); setOutput(''); setCodePoints(''); setError(''); };

  const handleLoadExample = (example: ToolExample) => {
    const inp = example.input as { text?: string; mode?: string };
    if (inp.text !== undefined) setInput(String(inp.text));
    if (inp.mode !== undefined) setMode(inp.mode as Mode);
    setOutput(''); setCodePoints(''); setError('');
  };

  return (
    <ToolLayout manifest={manifest} outputText={output} readme={readme} onLoadExample={handleLoadExample}>
      <div className="space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <InputPanel title="Input" onClear={handleClear}>
            <div className="flex items-center gap-2 mb-3">
              {(['encode', 'decode'] as Mode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-colors cursor-pointer
                    ${mode === m ? 'bg-primary text-bg border-primary' : 'border-border text-text-secondary hover:bg-surface-hover'}`}
                >
                  {m === 'encode' ? 'Text → Unicode' : 'Unicode → Text'}
                </button>
              ))}
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); handleConvert(); } }}
              placeholder={mode === 'encode' ? 'Enter text to convert...' : 'Enter \\uXXXX escapes...'}
              className="w-full h-36 bg-bg border border-border rounded-md p-3 text-sm font-mono text-text placeholder:text-text-muted resize-none focus:border-primary focus:outline-none transition-colors"
            />
            <button
              onClick={handleConvert}
              className="mt-3 px-4 py-2 text-sm font-medium rounded-md bg-primary text-bg hover:bg-primary-hover transition-colors cursor-pointer"
            >
              Convert
            </button>
          </InputPanel>

          <OutputPanel title="Unicode Escapes" copyText={output} downloadFilename="unicode-output.txt" onClear={() => { setOutput(''); setCodePoints(''); }}>
            {error ? (
              <div className="p-3 rounded-md bg-danger-subtle border border-danger/30 text-danger text-sm">{error}</div>
            ) : (
              <textarea
                value={output}
                readOnly
                placeholder="Output will appear here..."
                className="w-full h-36 bg-bg border border-border rounded-md p-3 text-sm font-mono text-text placeholder:text-text-muted resize-none focus:outline-none"
              />
            )}
          </OutputPanel>
        </div>

        {codePoints && (
          <OutputPanel title="Code Points" copyText={codePoints}>
            <div className="font-mono text-sm text-text-secondary break-all">{codePoints}</div>
          </OutputPanel>
        )}
      </div>
    </ToolLayout>
  );
}
