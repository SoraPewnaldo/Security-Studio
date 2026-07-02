import { useState } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { InputPanel } from '@/components/InputPanel';
import { OutputPanel } from '@/components/OutputPanel';
import { manifest } from './manifest';
import { pemToDer, derToPem, type ConversionMode } from './logic';
import type { ToolExample } from '@security-studio/types';
import readme from './README.md?raw';

export default function PemDerTool() {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<ConversionMode>('pem-to-der');
  const [derLabel, setDerLabel] = useState('CERTIFICATE');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const handleConvert = () => {
    setError('');
    try {
      if (mode === 'pem-to-der') {
        const result = pemToDer(input);
        setOutput(result.output);
        // We could also show result.label somewhere if we wanted
      } else {
        const result = derToPem(input, derLabel);
        setOutput(result.output);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An error occurred');
      setOutput('');
    }
  };

  const handleClear = () => { setInput(''); setOutput(''); setError(''); };

  const handleLoadExample = (example: ToolExample) => {
    const inp = example.input as { inputStr?: string; mode?: string };
    if (inp.inputStr !== undefined) setInput(String(inp.inputStr));
    if (inp.mode !== undefined) setMode(inp.mode as ConversionMode);
    setOutput('');
    setError('');
  };

  return (
    <ToolLayout manifest={manifest} outputText={output} readme={readme} onLoadExample={handleLoadExample}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <InputPanel title="Input Data" onClear={handleClear}>
          <div className="space-y-4">
            <div className="flex gap-2">
              <button
                onClick={() => setMode('pem-to-der')}
                className={`flex-1 py-1.5 text-xs font-medium rounded-md border transition-colors cursor-pointer ${mode === 'pem-to-der' ? 'bg-primary text-bg border-primary' : 'border-border text-text-secondary hover:bg-surface-hover'}`}
              >
                PEM → DER (Hex)
              </button>
              <button
                onClick={() => setMode('der-to-pem')}
                className={`flex-1 py-1.5 text-xs font-medium rounded-md border transition-colors cursor-pointer ${mode === 'der-to-pem' ? 'bg-primary text-bg border-primary' : 'border-border text-text-secondary hover:bg-surface-hover'}`}
              >
                DER (Hex) → PEM
              </button>
            </div>

            {mode === 'der-to-pem' && (
              <div>
                <label className="text-[12px] text-text-muted uppercase tracking-wider mb-2 block">PEM Label</label>
                <input
                  type="text"
                  value={derLabel}
                  onChange={(e) => setDerLabel(e.target.value)}
                  placeholder="CERTIFICATE"
                  className="w-full bg-bg border border-border rounded-md px-3 py-2 text-sm text-text focus:border-primary focus:outline-none transition-colors"
                />
              </div>
            )}

            <div>
              <label className="text-[12px] text-text-muted uppercase tracking-wider mb-2 block">
                {mode === 'pem-to-der' ? 'PEM Encoded Text' : 'DER Encoded Hex (Spaces optional)'}
              </label>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); handleConvert(); } }}
                placeholder={mode === 'pem-to-der' ? "-----BEGIN CERTIFICATE-----\nMII...\n-----END CERTIFICATE-----" : "30 82 01 0A 02 82 01 01 ..."}
                className="w-full h-48 bg-bg border border-border rounded-md p-3 text-sm font-mono text-text placeholder:text-text-muted resize-none focus:border-primary focus:outline-none transition-colors"
              />
            </div>
          </div>
          <button
            onClick={handleConvert}
            className="mt-4 w-full px-4 py-2 text-sm font-medium rounded-md bg-primary text-bg hover:bg-primary-hover transition-colors cursor-pointer"
          >
            Convert Format
          </button>
        </InputPanel>

        <OutputPanel title={mode === 'pem-to-der' ? 'DER Output (Hex)' : 'PEM Output'} copyText={output} onClear={() => setOutput('')}>
          {error ? (
             <div className="p-3 rounded-md bg-danger-subtle border border-danger/30 text-danger text-sm">{error}</div>
          ) : (
            <textarea
              value={output}
              readOnly
              placeholder="Conversion result will appear here..."
              className="w-full h-full min-h-[300px] bg-bg border border-border rounded-md p-3 text-sm font-mono text-text placeholder:text-text-muted resize-none focus:outline-none"
            />
          )}
        </OutputPanel>
      </div>
    </ToolLayout>
  );
}
