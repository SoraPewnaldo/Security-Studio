import { useState } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { InputPanel } from '@/components/InputPanel';
import { OutputPanel } from '@/components/OutputPanel';
import { manifest } from './manifest';
import { processAes, type AesAlgorithm, type ProcessMode } from './logic';
import type { ToolExample } from '@security-studio/types';
import readme from './README.md?raw';

export default function AesEncryptTool() {
  const [text, setText] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<ProcessMode>('encrypt');
  const [alg, setAlg] = useState<AesAlgorithm>('AES-GCM');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleProcess = async () => {
    setError('');
    setLoading(true);
    try {
      const res = await processAes(mode, alg, text, password);
      setOutput(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An error occurred');
      setOutput('');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => { setText(''); setPassword(''); setOutput(''); setError(''); };

  const handleLoadExample = (example: ToolExample) => {
    const inp = example.input as { text?: string; password?: string; mode?: string; algorithm?: string };
    if (inp.text !== undefined) setText(String(inp.text));
    if (inp.password !== undefined) setPassword(String(inp.password));
    if (inp.mode !== undefined) setMode(inp.mode as ProcessMode);
    if (inp.algorithm !== undefined) setAlg(inp.algorithm as AesAlgorithm);
    setOutput('');
    setError('');
  };

  return (
    <ToolLayout manifest={manifest} outputText={output} readme={readme} onLoadExample={handleLoadExample}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <InputPanel title="Input Configuration" onClear={handleClear}>
          <div className="space-y-4">
            <div className="flex gap-2">
              <button
                onClick={() => setMode('encrypt')}
                className={`flex-1 py-1.5 text-xs font-medium rounded-md border transition-colors cursor-pointer ${mode === 'encrypt' ? 'bg-primary text-bg border-primary' : 'border-border text-text-secondary hover:bg-surface-hover'}`}
              >
                Encrypt
              </button>
              <button
                onClick={() => setMode('decrypt')}
                className={`flex-1 py-1.5 text-xs font-medium rounded-md border transition-colors cursor-pointer ${mode === 'decrypt' ? 'bg-primary text-bg border-primary' : 'border-border text-text-secondary hover:bg-surface-hover'}`}
              >
                Decrypt
              </button>
            </div>

            <div>
              <label className="text-[12px] text-text-muted uppercase tracking-wider mb-2 block">Algorithm</label>
              <select
                value={alg}
                onChange={(e) => setAlg(e.target.value as AesAlgorithm)}
                className="w-full bg-bg border border-border rounded-md px-3 py-2 text-sm text-text focus:border-primary focus:outline-none transition-colors"
              >
                <option value="AES-GCM">AES-GCM (Recommended - Authenticated)</option>
                <option value="AES-CBC">AES-CBC</option>
              </select>
            </div>

            <div>
              <label className="text-[12px] text-text-muted uppercase tracking-wider mb-2 block">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="SuperSecretPassword"
                className="w-full bg-bg border border-border rounded-md px-3 py-2 text-sm text-text focus:border-primary focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="text-[12px] text-text-muted uppercase tracking-wider mb-2 block">
                {mode === 'encrypt' ? 'Plaintext' : 'Ciphertext (Base64)'}
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={mode === 'encrypt' ? "Message to encrypt..." : "Base64 encoded ciphertext..."}
                className="w-full h-32 bg-bg border border-border rounded-md p-3 text-sm font-mono text-text placeholder:text-text-muted resize-none focus:border-primary focus:outline-none transition-colors"
              />
            </div>
          </div>
          <button
            onClick={handleProcess}
            disabled={loading}
            className="mt-4 w-full px-4 py-2 text-sm font-medium rounded-md bg-primary text-bg hover:bg-primary-hover transition-colors cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Processing...' : mode === 'encrypt' ? 'Encrypt Data' : 'Decrypt Data'}
          </button>
        </InputPanel>

        <OutputPanel title={mode === 'encrypt' ? 'Ciphertext (Base64)' : 'Decrypted Plaintext'} copyText={output} onClear={() => setOutput('')}>
          {error ? (
             <div className="p-3 rounded-md bg-danger-subtle border border-danger/30 text-danger text-sm">{error}</div>
          ) : (
            <textarea
              value={output}
              readOnly
              placeholder="Result will appear here..."
              className="w-full h-full min-h-[300px] bg-bg border border-border rounded-md p-3 text-sm font-mono text-text placeholder:text-text-muted resize-none focus:outline-none"
            />
          )}
        </OutputPanel>
      </div>
    </ToolLayout>
  );
}
