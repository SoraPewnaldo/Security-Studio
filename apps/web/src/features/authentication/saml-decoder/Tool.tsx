import { useState } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { InputPanel } from '@/components/InputPanel';
import { OutputPanel } from '@/components/OutputPanel';
import { manifest } from './manifest';
import { decodeSaml } from './logic';
import type { ToolExample } from '@security-studio/types';
import readme from './README.md?raw';

export default function SamlDecoderTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDecode = async () => {
    setError('');
    setLoading(true);
    try {
      if (!input.trim()) throw new Error('Input is required.');
      const result = await decodeSaml(input);
      setOutput(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An error occurred');
      setOutput('');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => { setInput(''); setOutput(''); setError(''); };

  const handleLoadExample = (example: ToolExample) => {
    const inp = example.input as { saml?: string };
    if (inp.saml !== undefined) setInput(String(inp.saml));
    setOutput(''); setError('');
  };

  return (
    <ToolLayout manifest={manifest} outputText={output} readme={readme} onLoadExample={handleLoadExample}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <InputPanel title="SAML Input" onClear={handleClear}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); handleDecode(); } }}
            placeholder="Paste SAMLRequest or SAMLResponse (Base64 or URL-encoded)..."
            className="w-full h-64 bg-bg border border-border rounded-md p-3 text-sm font-mono text-text placeholder:text-text-muted resize-none focus:border-primary focus:outline-none transition-colors"
          />
          <button
            onClick={handleDecode}
            disabled={loading}
            className="mt-3 w-full px-4 py-2 text-sm font-medium rounded-md bg-primary text-bg hover:bg-primary-hover disabled:opacity-50 transition-colors cursor-pointer"
          >
            {loading ? 'Decoding...' : 'Decode and Format'}
          </button>
        </InputPanel>

        <OutputPanel title="Decoded XML" copyText={output} downloadFilename="decoded-saml.xml" onClear={() => setOutput('')}>
          {error ? (
            <div className="p-3 rounded-md bg-danger-subtle border border-danger/30 text-danger text-sm">{error}</div>
          ) : (
            <textarea
              value={output}
              readOnly
              placeholder="Decoded and formatted XML will appear here..."
              className="w-full h-64 bg-bg border border-border rounded-md p-3 text-sm font-mono text-text placeholder:text-text-muted resize-none focus:outline-none"
            />
          )}
        </OutputPanel>
      </div>
    </ToolLayout>
  );
}
