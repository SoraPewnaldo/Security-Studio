import { useState } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { InputPanel } from '@/components/InputPanel';
import { OutputPanel } from '@/components/OutputPanel';
import { manifest } from './manifest';
import { generateRsaKeyPair } from './logic';
import type { ToolExample } from '@security-studio/types';
import readme from './README.md?raw';

export default function RsaGeneratorTool() {
  const [modulusLength, setModulusLength] = useState(2048);
  const [keys, setKeys] = useState<{ publicKey: string, privateKey: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    setError('');
    setLoading(true);
    try {
      const res = await generateRsaKeyPair(modulusLength);
      setKeys(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => { setKeys(null); setError(''); };

  const handleLoadExample = (example: ToolExample) => {
    const inp = example.input as { modulusLength?: number };
    if (inp.modulusLength) setModulusLength(Number(inp.modulusLength));
    setKeys(null);
    setError('');
  };

  return (
    <ToolLayout manifest={manifest} outputText={keys ? `${keys.privateKey}\n\n${keys.publicKey}` : ''} readme={readme} onLoadExample={handleLoadExample}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-4">
          <InputPanel title="Configuration" onClear={handleClear}>
            <div className="space-y-4">
              <div>
                <label className="text-[12px] text-text-muted uppercase tracking-wider mb-2 block">Key Size (Modulus Length)</label>
                <select
                  value={modulusLength}
                  onChange={(e) => setModulusLength(Number(e.target.value))}
                  className="w-full bg-bg border border-border rounded-md px-3 py-2 text-sm text-text focus:border-primary focus:outline-none transition-colors"
                >
                  <option value={1024}>1024-bit (Insecure - Do not use for production)</option>
                  <option value={2048}>2048-bit (Standard)</option>
                  <option value={4096}>4096-bit (High Security)</option>
                </select>
              </div>
            </div>
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="mt-6 w-full px-4 py-2 text-sm font-medium rounded-md bg-primary text-bg hover:bg-primary-hover transition-colors cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Generating...' : 'Generate Key Pair'}
            </button>
          </InputPanel>
        </div>

        <div className="space-y-4">
          <OutputPanel title="Private Key" copyText={keys?.privateKey || ''} downloadFilename="private.pem" onClear={() => setKeys(null)}>
            {error ? (
              <div className="p-3 rounded-md bg-danger-subtle border border-danger/30 text-danger text-sm">{error}</div>
            ) : keys ? (
              <textarea
                value={keys.privateKey}
                readOnly
                className="w-full h-48 bg-bg border border-border rounded-md p-3 text-xs font-mono text-text resize-none focus:outline-none"
              />
            ) : (
              <div className="flex items-center justify-center h-48 text-text-muted text-sm border-2 border-dashed border-border rounded-md">
                Private key will appear here...
              </div>
            )}
          </OutputPanel>

          <OutputPanel title="Public Key" copyText={keys?.publicKey || ''} downloadFilename="public.pem" onClear={() => setKeys(null)}>
             {keys ? (
              <textarea
                value={keys.publicKey}
                readOnly
                className="w-full h-40 bg-bg border border-border rounded-md p-3 text-xs font-mono text-text resize-none focus:outline-none"
              />
            ) : (
              <div className="flex items-center justify-center h-40 text-text-muted text-sm border-2 border-dashed border-border rounded-md">
                Public key will appear here...
              </div>
            )}
          </OutputPanel>
        </div>
      </div>
    </ToolLayout>
  );
}
