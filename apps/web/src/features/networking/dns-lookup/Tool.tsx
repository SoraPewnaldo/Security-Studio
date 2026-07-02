import { useState } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { InputPanel } from '@/components/InputPanel';
import { OutputPanel } from '@/components/OutputPanel';
import { manifest } from './manifest';
import { resolveDns, type DnsResponse, type DnsRecordType } from './logic';
import type { ToolExample } from '@security-studio/types';
import readme from './README.md?raw';

export default function DnsLookupTool() {
  const [domain, setDomain] = useState('');
  const [recordType, setRecordType] = useState<DnsRecordType>('A');
  const [result, setResult] = useState<DnsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLookup = async () => {
    setError('');
    setResult(null);
    setLoading(true);
    try {
      const res = await resolveDns(domain, recordType);
      if (res.Status !== 0) {
        let msg = 'Unknown Error';
        if (res.Status === 3) msg = 'NXDOMAIN (Domain does not exist)';
        else if (res.Status === 2) msg = 'SERVFAIL (Server failed to complete request)';
        throw new Error(`DNS Error: ${msg} (Status Code ${res.Status})`);
      }
      setResult(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => { setDomain(''); setResult(null); setError(''); };

  const handleLoadExample = (example: ToolExample) => {
    const inp = example.input as { domain?: string; recordType?: string };
    if (inp.domain !== undefined) setDomain(String(inp.domain));
    if (inp.recordType !== undefined) setRecordType(inp.recordType as DnsRecordType);
    setResult(null); setError('');
  };

  const getTypeName = (type: number) => {
    const map: Record<number, string> = { 1: 'A', 2: 'NS', 5: 'CNAME', 6: 'SOA', 15: 'MX', 16: 'TXT', 28: 'AAAA' };
    return map[type] || `TYPE${type}`;
  };

  return (
    <ToolLayout manifest={manifest} outputText={result ? JSON.stringify(result, null, 2) : ''} readme={readme} onLoadExample={handleLoadExample}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <InputPanel title="Query Configuration" onClear={handleClear}>
          <div className="space-y-4">
            <div>
              <label className="text-[12px] text-text-muted uppercase tracking-wider mb-2 block">Domain Name</label>
              <input
                type="text"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleLookup(); }}
                placeholder="example.com"
                className="w-full bg-bg border border-border rounded-md px-3 py-2 text-sm text-text focus:border-primary focus:outline-none transition-colors"
              />
            </div>
            
            <div>
              <label className="text-[12px] text-text-muted uppercase tracking-wider mb-2 block">Record Type</label>
              <select
                value={recordType}
                onChange={(e) => setRecordType(e.target.value as DnsRecordType)}
                className="w-full bg-bg border border-border rounded-md px-3 py-2 text-sm text-text focus:border-primary focus:outline-none transition-colors"
              >
                <option value="A">A (IPv4)</option>
                <option value="AAAA">AAAA (IPv6)</option>
                <option value="CNAME">CNAME (Alias)</option>
                <option value="MX">MX (Mail Exchange)</option>
                <option value="TXT">TXT (Text Records)</option>
                <option value="NS">NS (Name Servers)</option>
                <option value="SOA">SOA (Start of Authority)</option>
                <option value="ANY">ANY (All Records)</option>
              </select>
            </div>
          </div>
          <button
            onClick={handleLookup}
            disabled={loading}
            className="mt-6 w-full px-4 py-2 text-sm font-medium rounded-md bg-primary text-bg hover:bg-primary-hover transition-colors cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Resolving...' : 'Resolve DNS'}
          </button>
        </InputPanel>

        <OutputPanel title="DNS Records" copyText={result ? JSON.stringify(result, null, 2) : ''} onClear={() => setResult(null)}>
          {error ? (
             <div className="p-3 rounded-md bg-danger-subtle border border-danger/30 text-danger text-sm">{error}</div>
          ) : result ? (
            <div className="space-y-4 h-[300px] overflow-auto pr-2">
              {result.Answer && result.Answer.length > 0 ? (
                result.Answer.map((ans, i) => (
                  <div key={i} className="p-4 rounded-lg border border-border bg-surface flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-sm text-text font-medium">{ans.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-bg border border-border text-text-secondary">
                          {getTypeName(ans.type)}
                        </span>
                        <span className="text-[11px] text-text-muted">TTL: {ans.TTL}</span>
                      </div>
                    </div>
                    <div className="font-mono text-sm text-text-secondary break-all bg-bg p-2 rounded border border-border/50">
                      {ans.data}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 rounded-lg border border-border bg-surface text-center">
                  <div className="text-text-secondary text-sm">No {recordType !== 'ANY' ? recordType : ''} records found.</div>
                </div>
              )}

              {result.Authority && result.Authority.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-xs font-medium text-text-muted uppercase tracking-wider mb-3">Authority Records</h3>
                  <div className="space-y-2">
                    {result.Authority.map((auth, i) => (
                      <div key={i} className="p-3 rounded-md border border-border bg-bg flex justify-between items-center">
                        <div className="font-mono text-xs text-text-secondary truncate pr-4">{auth.data}</div>
                        <span className="text-[10px] text-text-muted">TTL: {auth.TTL}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-text-muted text-sm border-2 border-dashed border-border rounded-md">
              Results will appear here...
            </div>
          )}
        </OutputPanel>
      </div>
    </ToolLayout>
  );
}
