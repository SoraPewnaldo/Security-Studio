import { useState } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { InputPanel } from '@/components/InputPanel';
import { OutputPanel } from '@/components/OutputPanel';
import { manifest } from './manifest';
import { parseCertificate, type CertDetails } from './logic';
import type { ToolExample } from '@security-studio/types';
import readme from './README.md?raw';

export default function CertViewerTool() {
  const [certInput, setCertInput] = useState('');
  const [details, setDetails] = useState<CertDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleParse = async () => {
    setError('');
    setLoading(true);
    try {
      const res = await parseCertificate(certInput);
      setDetails(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An error occurred');
      setDetails(null);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => { setCertInput(''); setDetails(null); setError(''); };

  const handleLoadExample = (example: ToolExample) => {
    const inp = example.input as { cert?: string };
    if (inp.cert !== undefined) setCertInput(String(inp.cert));
    setDetails(null); setError('');
  };

  return (
    <ToolLayout manifest={manifest} outputText={details ? JSON.stringify(details, null, 2) : ''} readme={readme} onLoadExample={handleLoadExample}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <InputPanel title="Certificate (PEM)" onClear={handleClear}>
          <textarea
            value={certInput}
            onChange={(e) => setCertInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); handleParse(); } }}
            placeholder="-----BEGIN CERTIFICATE-----\nMIIDzTCCArWgAwIBAgIQCX..."
            className="w-full h-[400px] bg-bg border border-border rounded-md p-3 text-sm font-mono text-text placeholder:text-text-muted resize-none focus:border-primary focus:outline-none transition-colors"
          />
          <button
            onClick={handleParse}
            disabled={loading}
            className="mt-4 w-full px-4 py-2 text-sm font-medium rounded-md bg-primary text-bg hover:bg-primary-hover transition-colors cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Parsing...' : 'Parse Certificate'}
          </button>
        </InputPanel>

        <OutputPanel title="Certificate Details" copyText={details ? JSON.stringify(details, null, 2) : ''} onClear={() => setDetails(null)}>
          {error ? (
             <div className="p-3 rounded-md bg-danger-subtle border border-danger/30 text-danger text-sm">{error}</div>
          ) : details ? (
            <div className="space-y-4 max-h-[400px] overflow-auto pr-2">
              <div className="p-4 rounded-lg border border-border bg-surface space-y-3">
                <h3 className="font-medium text-text border-b border-border pb-2">Subject</h3>
                <div className="font-mono text-sm text-text-secondary break-all">{details.subject}</div>
              </div>
              
              <div className="p-4 rounded-lg border border-border bg-surface space-y-3">
                <h3 className="font-medium text-text border-b border-border pb-2">Issuer</h3>
                <div className="font-mono text-sm text-text-secondary break-all">{details.issuer}</div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg border border-border bg-surface">
                  <h3 className="text-[12px] text-text-muted uppercase tracking-wider mb-2">Validity</h3>
                  <div className="text-sm space-y-1">
                    <div><span className="text-text-muted">Not Before:</span> {new Date(details.validFrom).toLocaleDateString()}</div>
                    <div><span className="text-text-muted">Not After:</span> {new Date(details.validTo).toLocaleDateString()}</div>
                    {details.isExpired ? (
                      <div className="text-danger font-medium text-xs mt-2 bg-danger/10 px-2 py-1 rounded inline-block">EXPIRED</div>
                    ) : (
                      <div className="text-success font-medium text-xs mt-2 bg-success/10 px-2 py-1 rounded inline-block">VALID</div>
                    )}
                  </div>
                </div>

                <div className="p-4 rounded-lg border border-border bg-surface">
                  <h3 className="text-[12px] text-text-muted uppercase tracking-wider mb-2">Algorithms</h3>
                  <div className="text-sm space-y-1 text-text-secondary font-mono">
                    <div>{details.publicKeyAlgorithm}</div>
                    <div>{details.signatureAlgorithm}</div>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg border border-border bg-surface space-y-3">
                <h3 className="text-[12px] text-text-muted uppercase tracking-wider mb-2">Subject Alternative Names</h3>
                {details.sans.length > 0 ? (
                  <ul className="list-disc list-inside text-sm font-mono text-text-secondary space-y-1 break-all">
                    {details.sans.map((san, i) => <li key={i}>{san}</li>)}
                  </ul>
                ) : (
                  <div className="text-sm text-text-muted">No SANs present</div>
                )}
              </div>

              <div className="p-4 rounded-lg border border-border bg-surface space-y-3">
                <h3 className="text-[12px] text-text-muted uppercase tracking-wider mb-2">Fingerprint (SHA-256)</h3>
                <div className="font-mono text-xs text-text-secondary break-all">{details.thumbprintHex}</div>
              </div>

            </div>
          ) : (
            <div className="flex items-center justify-center h-[400px] text-text-muted text-sm border-2 border-dashed border-border rounded-md">
              Parsed details will appear here...
            </div>
          )}
        </OutputPanel>
      </div>
    </ToolLayout>
  );
}
