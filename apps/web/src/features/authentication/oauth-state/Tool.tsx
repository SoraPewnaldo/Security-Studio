import { useState, useEffect } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { InputPanel } from '@/components/InputPanel';
import { OutputPanel } from '@/components/OutputPanel';
import { manifest } from './manifest';
import { generateOAuthState, type StateFormat } from './logic';
import type { ToolExample } from '@security-studio/types';
import readme from './README.md?raw';

export default function OAuthStateTool() {
  const [length, setLength] = useState(32);
  const [format, setFormat] = useState<StateFormat>('alphanumeric');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const handleGenerate = () => {
    setError('');
    try {
      setOutput(generateOAuthState(length, format));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An error occurred');
      setOutput('');
    }
  };

  useEffect(() => {
    handleGenerate();
  }, [length, format]);

  const handleLoadExample = (example: ToolExample) => {
    const inp = example.input as { length?: number; format?: string };
    if (inp.length !== undefined) setLength(Number(inp.length));
    if (inp.format !== undefined) setFormat(inp.format as StateFormat);
    setError('');
  };

  return (
    <ToolLayout manifest={manifest} outputText={output} readme={readme} onLoadExample={handleLoadExample}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <InputPanel title="Configuration">
          <div className="space-y-4">
            <div>
              <label className="text-[12px] text-text-muted uppercase tracking-wider mb-2 block">Length</label>
              <input
                type="number"
                value={length}
                onChange={(e) => setLength(parseInt(e.target.value) || 8)}
                min={8} max={1024}
                className="w-full bg-bg border border-border rounded-md px-3 py-2 text-sm text-text focus:border-primary focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="text-[12px] text-text-muted uppercase tracking-wider mb-2 block">Format</label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value as StateFormat)}
                className="w-full bg-bg border border-border rounded-md px-3 py-2 text-sm text-text focus:border-primary focus:outline-none transition-colors"
              >
                <option value="alphanumeric">Alphanumeric (A-Z, a-z, 0-9)</option>
                <option value="hex">Hexadecimal</option>
                <option value="base64url">Base64URL</option>
              </select>
            </div>
          </div>
          <button
            onClick={handleGenerate}
            className="mt-6 w-full px-4 py-2 text-sm font-medium rounded-md bg-primary text-bg hover:bg-primary-hover transition-colors cursor-pointer"
          >
            Generate New State
          </button>
        </InputPanel>

        <OutputPanel title="Generated State" copyText={output}>
          {error ? (
            <div className="p-3 rounded-md bg-danger-subtle border border-danger/30 text-danger text-sm">{error}</div>
          ) : (
            <div className="flex items-center justify-center min-h-[150px] bg-bg border border-border rounded-md p-6 text-center break-all">
              <span className="text-xl font-mono text-text">{output}</span>
            </div>
          )}
        </OutputPanel>
      </div>
    </ToolLayout>
  );
}
