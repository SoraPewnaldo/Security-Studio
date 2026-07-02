import { useState } from 'react';
import { ShieldCheck, ShieldX, Clock } from 'lucide-react';
import { ToolLayout } from '@/components/ToolLayout';
import { CopyButton } from '@/components/CopyButton';
import { manifest } from './manifest';
import { decodeJwt, type JwtDecoded } from './logic';
import readme from './README.md?raw';

export default function JwtInspectorTool() {
  const handleLoadExample = (example: any) => {
    if (example.input?.token !== undefined) setToken(example.input.token);
    if (example.input?.result !== undefined) setResult(example.input.result);
    if (example.input?.error !== undefined) setError(example.input.error);
  };

  const [token, setToken] = useState('');
  const [result, setResult] = useState<JwtDecoded | null>(null);
  const [error, setError] = useState('');

  const handleDecode = () => {
    setError('');
    try {
      setResult(decodeJwt(token));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to decode JWT');
      setResult(null);
    }
  };

  return (
    <ToolLayout onLoadExample={handleLoadExample} readme={readme} manifest={manifest} outputText={result ? JSON.stringify(result.payload, null, 2) : ''}>
      <div className="space-y-4">
        {/* Input */}
        <div className="rounded-lg border border-border bg-surface p-4">
          <label className="text-xs text-text-secondary uppercase tracking-wider mb-2 block">
            Paste your JWT token below
          </label>
          <textarea
            value={token}
            onChange={(e) => setToken(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                handleDecode();
              }
            }}
            placeholder="eyJhbGciOiJIUzI1NiIs..."
            className="w-full h-24 bg-bg border border-border rounded-md p-3 text-sm font-mono
              text-text placeholder:text-text-muted resize-none focus:border-primary
              focus:outline-none transition-colors duration-150"
          />
          <button
            onClick={handleDecode}
            className="mt-2 px-4 py-2 text-sm font-medium rounded-md bg-primary text-bg
              hover:bg-primary-hover transition-colors duration-150 cursor-pointer"
          >
            Decode
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-md bg-danger-subtle border border-danger/30 text-danger text-sm">
            {error}
          </div>
        )}

        {result && (
          <>
            {/* Expiration status */}
            <div className={`flex items-center gap-3 rounded-lg border p-4 ${
              result.isExpired === null
                ? 'border-border bg-surface'
                : result.isExpired
                  ? 'border-danger/30 bg-danger-subtle'
                  : 'border-success/30 bg-success-subtle'
            }`}>
              {result.isExpired === null ? (
                <Clock size={20} className="text-text-secondary" />
              ) : result.isExpired ? (
                <ShieldX size={20} className="text-danger" />
              ) : (
                <ShieldCheck size={20} className="text-success" />
              )}
              <div>
                <div className={`text-sm font-medium ${
                  result.isExpired === null ? 'text-text-secondary' :
                  result.isExpired ? 'text-danger' : 'text-success'
                }`}>
                  {result.isExpired === null ? 'No Expiration Set' :
                   result.isExpired ? 'Token Expired' : 'Token Valid'}
                </div>
                {result.expiresAt && (
                  <div className="text-xs text-text-secondary mt-0.5">
                    Expires: {new Date(result.expiresAt).toLocaleString()}
                  </div>
                )}
              </div>
              <div className="ml-auto text-right">
                <div className="text-xs text-text-muted">Algorithm</div>
                <div className="text-sm font-mono font-medium text-text">{result.algorithm}</div>
              </div>
              {result.issuedAt && (
                <div className="text-right">
                  <div className="text-xs text-text-muted">Issued At</div>
                  <div className="text-xs text-text-secondary">{new Date(result.issuedAt).toLocaleString()}</div>
                </div>
              )}
            </div>

            {/* Decoded sections */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Header */}
              <div className="rounded-lg border border-info/30 bg-surface p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-semibold text-info uppercase tracking-wider">Header</h3>
                  <CopyButton text={JSON.stringify(result.header, null, 2)} />
                </div>
                <pre className="text-xs font-mono text-text bg-bg rounded-md p-3 overflow-auto max-h-48">
                  {JSON.stringify(result.header, null, 2)}
                </pre>
              </div>

              {/* Payload */}
              <div className="rounded-lg border border-success/30 bg-surface p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-semibold text-success uppercase tracking-wider">Payload</h3>
                  <CopyButton text={JSON.stringify(result.payload, null, 2)} />
                </div>
                <pre className="text-xs font-mono text-text bg-bg rounded-md p-3 overflow-auto max-h-48">
                  {JSON.stringify(result.payload, null, 2)}
                </pre>
              </div>

              {/* Signature */}
              <div className="rounded-lg border border-danger/30 bg-surface p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-semibold text-danger uppercase tracking-wider">Signature</h3>
                  <CopyButton text={result.signature} />
                </div>
                <pre className="text-xs font-mono text-text-secondary bg-bg rounded-md p-3 overflow-auto max-h-48 break-all">
                  {result.signature}
                </pre>
              </div>
            </div>

            {/* Claims */}
            <div className="rounded-lg border border-border bg-surface p-4">
              <h3 className="text-xs font-medium text-text-secondary uppercase tracking-wider mb-3">
                Claims Analysis
              </h3>
              <div className="space-y-2">
                {result.claims.map((claim) => (
                  <div key={claim.key} className="flex items-start justify-between py-1.5 border-b border-border last:border-0">
                    <div>
                      <span className="text-sm font-medium text-text">{claim.label}</span>
                      <span className="text-xs text-text-muted ml-2 font-mono">({claim.key})</span>
                      <div className="text-xs text-text-secondary mt-0.5">{claim.description}</div>
                    </div>
                    <div className="text-sm font-mono text-text-secondary text-right max-w-[50%] break-all">
                      {typeof claim.value === 'object'
                        ? JSON.stringify(claim.value)
                        : String(claim.value)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </ToolLayout>
  );
}
