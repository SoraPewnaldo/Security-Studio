import { useState } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { InputPanel } from '@/components/InputPanel';
import { OutputPanel } from '@/components/OutputPanel';
import { manifest } from './manifest';
import { encodeUrl, decodeUrl, encodeFullUrl, decodeFullUrl } from './logic';
import readme from './README.md?raw';

export default function UrlEncoderTool() {
  const handleLoadExample = (example: any) => {
    if (example.input?.input !== undefined) setInput(example.input.input);
    if (example.input?.output !== undefined) setOutput(example.input.output);
    if (example.input?.mode !== undefined) setMode(example.input.mode);
    if (example.input?.type !== undefined) setType(example.input.type);
    if (example.input?.error !== undefined) setError(example.input.error);
  };

  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [type, setType] = useState<'component' | 'full'>('component');
  const [error, setError] = useState('');

  const handleProcess = () => {
    setError('');
    try {
      let result: string;
      if (mode === 'encode') {
        result = type === 'component' ? encodeUrl(input) : encodeFullUrl(input);
      } else {
        result = type === 'component' ? decodeUrl(input) : decodeFullUrl(input);
      }
      setOutput(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An error occurred');
      setOutput('');
    }
  };

  return (
    <ToolLayout onLoadExample={handleLoadExample} readme={readme} manifest={manifest} outputText={output}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <InputPanel title="Input">
          <div className="flex items-center gap-2 mb-3">
            <button onClick={() => setMode('encode')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-colors duration-150 cursor-pointer
                ${mode === 'encode' ? 'bg-primary text-bg border-primary' : 'border-border text-text-secondary hover:bg-surface-hover'}`}>
              Encode
            </button>
            <button onClick={() => setMode('decode')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-colors duration-150 cursor-pointer
                ${mode === 'decode' ? 'bg-primary text-bg border-primary' : 'border-border text-text-secondary hover:bg-surface-hover'}`}>
              Decode
            </button>
            <div className="w-px h-5 bg-border mx-1" />
            <button onClick={() => setType('component')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-colors duration-150 cursor-pointer
                ${type === 'component' ? 'bg-surface-hover text-text border-border' : 'border-border text-text-muted hover:bg-surface-hover'}`}>
              Component
            </button>
            <button onClick={() => setType('full')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-colors duration-150 cursor-pointer
                ${type === 'full' ? 'bg-surface-hover text-text border-border' : 'border-border text-text-muted hover:bg-surface-hover'}`}>
              Full URL
            </button>
          </div>
          <textarea value={input} onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); handleProcess(); } }}
            placeholder={mode === 'encode' ? 'Enter text to URL-encode...' : 'Enter URL-encoded text to decode...'}
            className="w-full h-48 bg-bg border border-border rounded-md p-3 text-sm font-mono text-text placeholder:text-text-muted resize-none focus:border-primary focus:outline-none transition-colors duration-150" />
          <button onClick={handleProcess}
            className="mt-3 px-4 py-2 text-sm font-medium rounded-md bg-primary text-bg hover:bg-primary-hover transition-colors duration-150 cursor-pointer">
            {mode === 'encode' ? 'Encode' : 'Decode'}
          </button>
        </InputPanel>

        <OutputPanel title="Output" copyText={output} downloadFilename="url-encoded-output.txt">
          {error ? (
            <div className="p-3 rounded-md bg-danger-subtle border border-danger/30 text-danger text-sm">{error}</div>
          ) : (
            <textarea value={output} readOnly placeholder="Output will appear here..."
              className="w-full h-48 bg-bg border border-border rounded-md p-3 text-sm font-mono text-text placeholder:text-text-muted resize-none focus:outline-none" />
          )}
        </OutputPanel>
      </div>
    </ToolLayout>
  );
}
