import { useState } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { InputPanel } from '@/components/InputPanel';
import { OutputPanel } from '@/components/OutputPanel';
import { manifest } from './manifest';
import { lookupRdap, type ParsedWhois } from './logic';
import type { ToolExample } from '@security-studio/types';
import readme from './README.md?raw';

export default function WhoisLookupTool() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<ParsedWhois | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLookup = async () => {
    setError('');
    setResult(null);
    setLoading(true);
    try {
      const res = await lookupRdap(query);
      setResult(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => { setQuery(''); setResult(null); setError(''); };

  const handleLoadExample = (example: ToolExample) => {
    const inp = example.input as { query?: string };
    if (inp.query !== undefined) setQuery(String(inp.query));
    setResult(null); setError('');
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr || dateStr === 'Unknown') return 'Unknown';
    try {
      return new Date(dateStr).toLocaleString();
    } catch {
      return dateStr;
    }
  };

  return (
    <ToolLayout manifest={manifest} outputText={result ? JSON.stringify(result, null, 2) : ''} readme={readme} onLoadExample={handleLoadExample}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <InputPanel title="Domain Lookup" onClear={handleClear}>
          <div className="space-y-4">
            <div>
              <label className="text-[12px] text-text-muted uppercase tracking-wider mb-2 block">Domain Name</label>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleLookup(); }}
                placeholder="example.com"
                className="w-full bg-bg border border-border rounded-md px-3 py-2 text-sm text-text focus:border-primary focus:outline-none transition-colors"
              />
            </div>
            <div className="text-xs text-text-muted">
              Note: WHOIS lookup uses the modern RDAP protocol, which relies on public registry APIs. Some registries may rate limit requests.
            </div>
          </div>
          <button
            onClick={handleLookup}
            disabled={loading}
            className="mt-6 w-full px-4 py-2 text-sm font-medium rounded-md bg-primary text-bg hover:bg-primary-hover transition-colors cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Searching...' : 'Lookup Domain'}
          </button>
        </InputPanel>

        <OutputPanel title="WHOIS / RDAP Data" copyText={result ? JSON.stringify(result, null, 2) : ''} onClear={() => setResult(null)}>
          {error ? (
             <div className="p-3 rounded-md bg-danger-subtle border border-danger/30 text-danger text-sm">{error}</div>
          ) : result ? (
            <div className="space-y-4 h-[400px] overflow-auto pr-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg border border-border bg-surface">
                  <h3 className="text-[11px] text-text-muted uppercase tracking-wider mb-1">Domain</h3>
                  <div className="font-mono text-sm font-medium text-text truncate">{result.domain}</div>
                </div>
                <div className="p-4 rounded-lg border border-border bg-surface">
                  <h3 className="text-[11px] text-text-muted uppercase tracking-wider mb-1">Registrar</h3>
                  <div className="text-sm font-medium text-text truncate">{result.registrar}</div>
                </div>
              </div>

              <div className="p-4 rounded-lg border border-border bg-surface space-y-3">
                <h3 className="text-[12px] text-text-muted uppercase tracking-wider mb-2 border-b border-border pb-2">Important Dates</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="text-text-muted mb-1 text-[11px] uppercase">Created On</div>
                    <div className="text-text-secondary">{formatDate(result.creationDate)}</div>
                  </div>
                  <div>
                    <div className="text-text-muted mb-1 text-[11px] uppercase">Expires On</div>
                    <div className="text-text-secondary">{formatDate(result.expirationDate)}</div>
                  </div>
                  <div>
                    <div className="text-text-muted mb-1 text-[11px] uppercase">Last Updated</div>
                    <div className="text-text-secondary">{formatDate(result.updatedDate)}</div>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg border border-border bg-surface">
                <h3 className="text-[12px] text-text-muted uppercase tracking-wider mb-2 border-b border-border pb-2">Nameservers</h3>
                {result.nameservers.length > 0 ? (
                  <ul className="list-disc list-inside text-sm font-mono text-text-secondary space-y-1">
                    {result.nameservers.map((ns, i) => <li key={i}>{ns}</li>)}
                  </ul>
                ) : (
                  <div className="text-sm text-text-muted">No Nameservers Found</div>
                )}
              </div>

              <div className="p-4 rounded-lg border border-border bg-surface">
                <h3 className="text-[12px] text-text-muted uppercase tracking-wider mb-2 border-b border-border pb-2">Domain Status</h3>
                {result.status.length > 0 ? (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {result.status.map((s, i) => (
                      <span key={i} className="px-2 py-1 rounded-md text-[11px] font-mono bg-bg border border-border text-text-secondary">
                        {s}
                      </span>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-text-muted">No Status Flags</div>
                )}
              </div>

              <details className="mt-4">
                <summary className="cursor-pointer text-sm font-medium text-primary hover:text-primary-hover mb-2">
                  {result.raw?.rawText ? 'View Raw WHOIS Text' : 'View Raw RDAP JSON'}
                </summary>
                <textarea
                  readOnly
                  value={result.raw?.rawText || JSON.stringify(result.raw, null, 2)}
                  className="w-full h-[300px] bg-bg border border-border rounded-md p-3 text-xs font-mono text-text-secondary resize-none"
                />
              </details>
            </div>
          ) : (
            <div className="flex items-center justify-center h-[400px] text-text-muted text-sm border-2 border-dashed border-border rounded-md">
              Results will appear here...
            </div>
          )}
        </OutputPanel>
      </div>
    </ToolLayout>
  );
}
