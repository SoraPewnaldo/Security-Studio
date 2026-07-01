import { useState } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { InputPanel } from '@/components/InputPanel';
import { OutputPanel } from '@/components/OutputPanel';
import { manifest } from './manifest';
import { encodeHtmlEntities, decodeHtmlEntities } from './logic';

export default function HtmlEntitiesTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');

  const handleProcess = () => {
    const result = mode === 'encode' ? encodeHtmlEntities(input) : decodeHtmlEntities(input);
    setOutput(result);
  };

  return (
    <ToolLayout manifest={manifest} outputText={output}>
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
          </div>
          <textarea value={input} onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); handleProcess(); } }}
            placeholder={mode === 'encode' ? 'Enter HTML to encode...' : 'Enter HTML entities to decode...'}
            className="w-full h-48 bg-bg border border-border rounded-md p-3 text-sm font-mono text-text placeholder:text-text-muted resize-none focus:border-primary focus:outline-none transition-colors duration-150" />
          <button onClick={handleProcess}
            className="mt-3 px-4 py-2 text-sm font-medium rounded-md bg-primary text-bg hover:bg-primary-hover transition-colors duration-150 cursor-pointer">
            {mode === 'encode' ? 'Encode' : 'Decode'}
          </button>
        </InputPanel>

        <OutputPanel title="Output" copyText={output} downloadFilename="html-entities-output.txt">
          <textarea value={output} readOnly placeholder="Output will appear here..."
            className="w-full h-48 bg-bg border border-border rounded-md p-3 text-sm font-mono text-text placeholder:text-text-muted resize-none focus:outline-none" />
        </OutputPanel>
      </div>
    </ToolLayout>
  );
}
