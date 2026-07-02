import { useState } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { InputPanel } from '@/components/InputPanel';
import { OutputPanel } from '@/components/OutputPanel';
import { manifest } from './manifest';
import { verifyJwt } from './logic';
import type { ToolExample } from '@security-studio/types';
import readme from './README.md?raw';

export default function JwtVerifierTool() {
  const [token, setToken] = useState('');
  const [key, setKey] = useState('');
  const [alg, setAlg] = useState('HS256');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    setError('');
    setResult(null);
    setLoading(true);
    try {
      const res = await verifyJwt(token, key, alg);
      setResult(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => { setToken(''); setKey(''); setResult(null); setError(''); };

  const handleLoadExample = (example: ToolExample) => {
    const inp = example.input as { token?: string; key?: string; alg?: string };
    if (inp.token !== undefined) setToken(String(inp.token));
    if (inp.key !== undefined) setKey(String(inp.key));
    if (inp.alg !== undefined) setAlg(String(inp.alg));
    setResult(null); setError('');
  };

  return (
    <ToolLayout manifest={manifest} outputText={result ? JSON.stringify(result, null, 2) : ''} readme={readme} onLoadExample={handleLoadExample}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <InputPanel title="JWT & Key" onClear={handleClear}>
          <div className="space-y-4">
            <div>
              <label className="text-[12px] text-text-muted uppercase tracking-wider mb-2 block">Algorithm</label>
              <select
                value={alg}
                onChange={(e) => setAlg(e.target.value)}
                className="w-full bg-bg border border-border rounded-md px-3 py-2 text-sm text-text focus:border-primary focus:outline-none transition-colors"
              >
                <optgroup label="Symmetric (HMAC)">
                  <option value="HS256">HS256</option>
                  <option value="HS384">HS384</option>
                  <option value="HS512">HS512</option>
                </optgroup>
                <optgroup label="Asymmetric (RSA/ECDSA)">
                  <option value="RS256">RS256</option>
                  <option value="RS384">RS384</option>
                  <option value="RS512">RS512</option>
                  <option value="ES256">ES256</option>
                </optgroup>
              </select>
            </div>
            
            <div>
              <label className="text-[12px] text-text-muted uppercase tracking-wider mb-2 block">Token</label>
              <textarea
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="eyJhbGciOi..."
                className="w-full h-24 bg-bg border border-border rounded-md p-3 text-sm font-mono text-text placeholder:text-text-muted resize-none focus:border-primary focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="text-[12px] text-text-muted uppercase tracking-wider mb-2 block">
                {alg.startsWith('HS') ? 'Secret Key (String)' : 'Public Key (PEM)'}
              </label>
              <textarea
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder={alg.startsWith('HS') ? 'your-256-bit-secret' : '-----BEGIN PUBLIC KEY-----\n...'}
                className="w-full h-32 bg-bg border border-border rounded-md p-3 text-sm font-mono text-text placeholder:text-text-muted resize-none focus:border-primary focus:outline-none transition-colors"
              />
            </div>
          </div>
          <button
            onClick={handleVerify}
            disabled={loading}
            className="mt-4 w-full px-4 py-2 text-sm font-medium rounded-md bg-primary text-bg hover:bg-primary-hover transition-colors cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Verifying...' : 'Verify Signature'}
          </button>
        </InputPanel>

        <OutputPanel title="Verification Result" copyText={result ? JSON.stringify(result, null, 2) : ''}>
          {error ? (
            <div className="p-4 rounded-md bg-danger-subtle border border-danger/30 text-danger text-sm flex items-start gap-2">
              <span>❌</span>
              <span className="font-medium">Verification Failed: {error}</span>
            </div>
          ) : result ? (
            <div className="space-y-4">
              <div className="p-4 rounded-md bg-success-subtle border border-success/30 text-success text-sm flex items-start gap-2">
                <span>✅</span>
                <span className="font-medium">Signature Verified Successfully</span>
              </div>
              <div>
                <h4 className="text-[12px] text-text-muted uppercase tracking-wider mb-2">Header</h4>
                <pre className="p-3 bg-bg border border-border rounded-md text-xs font-mono overflow-auto text-text-secondary">
                  {JSON.stringify(result.protectedHeader, null, 2)}
                </pre>
              </div>
              <div>
                <h4 className="text-[12px] text-text-muted uppercase tracking-wider mb-2">Payload</h4>
                <pre className="p-3 bg-bg border border-border rounded-md text-xs font-mono overflow-auto text-text">
                  {JSON.stringify(result.payload, null, 2)}
                </pre>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full min-h-[200px] text-text-muted text-sm border-2 border-dashed border-border rounded-md">
              Waiting for verification...
            </div>
          )}
        </OutputPanel>
      </div>
    </ToolLayout>
  );
}
