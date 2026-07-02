import { useState } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { InputPanel } from '@/components/InputPanel';
import { OutputPanel } from '@/components/OutputPanel';
import { manifest } from './manifest';
import { parseCookies, type CookieData } from './logic';
import type { ToolExample } from '@security-studio/types';
import readme from './README.md?raw';

export default function SessionCookieTool() {
  const [input, setInput] = useState('');
  const [cookies, setCookies] = useState<CookieData[]>([]);

  const handleAnalyze = () => {
    setCookies(parseCookies(input));
  };

  const handleClear = () => { setInput(''); setCookies([]); };

  const handleLoadExample = (example: ToolExample) => {
    const inp = example.input as { cookie?: string };
    if (inp.cookie !== undefined) setInput(String(inp.cookie));
    setCookies([]);
  };

  return (
    <ToolLayout manifest={manifest} outputText={JSON.stringify(cookies, null, 2)} readme={readme} onLoadExample={handleLoadExample}>
      <div className="space-y-4">
        <InputPanel title="Cookie Strings" onClear={handleClear}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); handleAnalyze(); } }}
            placeholder="Paste Set-Cookie headers or raw cookie strings (one per line)..."
            className="w-full h-32 bg-bg border border-border rounded-md p-3 text-sm font-mono text-text placeholder:text-text-muted resize-none focus:border-primary focus:outline-none transition-colors"
          />
          <button
            onClick={handleAnalyze}
            className="mt-3 w-full px-4 py-2 text-sm font-medium rounded-md bg-primary text-bg hover:bg-primary-hover transition-colors cursor-pointer"
          >
            Analyze Cookies
          </button>
        </InputPanel>

        {cookies.length > 0 && (
          <OutputPanel title="Analysis Results">
            <div className="space-y-6">
              {cookies.map((cookie, idx) => (
                <div key={idx} className="rounded-lg border border-border bg-bg overflow-hidden">
                  <div className="px-4 py-3 bg-surface border-b border-border flex items-center justify-between">
                    <div className="font-mono text-sm font-bold text-primary truncate max-w-[70%]">
                      {cookie.name || '(empty)'}
                    </div>
                    <div className="flex gap-2">
                      {cookie.secure && <span className="px-1.5 py-0.5 rounded text-[10px] bg-success/20 text-success font-medium">Secure</span>}
                      {cookie.httpOnly && <span className="px-1.5 py-0.5 rounded text-[10px] bg-success/20 text-success font-medium">HttpOnly</span>}
                    </div>
                  </div>
                  <div className="p-4 space-y-4">
                    <div>
                      <h4 className="text-[11px] text-text-muted uppercase tracking-wider mb-1">Value</h4>
                      <div className="font-mono text-sm break-all text-text bg-surface p-2 rounded border border-border/50">
                        {cookie.value}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <h4 className="text-[11px] text-text-muted uppercase tracking-wider mb-1">Domain</h4>
                        <div className="text-[13px] text-text-secondary">{cookie.domain || '—'}</div>
                      </div>
                      <div>
                        <h4 className="text-[11px] text-text-muted uppercase tracking-wider mb-1">Path</h4>
                        <div className="text-[13px] text-text-secondary">{cookie.path || '—'}</div>
                      </div>
                      <div>
                        <h4 className="text-[11px] text-text-muted uppercase tracking-wider mb-1">SameSite</h4>
                        <div className="text-[13px] text-text-secondary">{cookie.sameSite || '—'}</div>
                      </div>
                      <div>
                        <h4 className="text-[11px] text-text-muted uppercase tracking-wider mb-1">Max-Age / Expires</h4>
                        <div className="text-[13px] text-text-secondary line-clamp-1">{cookie.maxAge || cookie.expires || 'Session'}</div>
                      </div>
                    </div>

                    {cookie.warnings.length > 0 && (
                      <div className="mt-4 p-3 rounded-md bg-warning-subtle border border-warning/30 space-y-1">
                        {cookie.warnings.map((warn, i) => (
                          <div key={i} className="text-[13px] text-warning flex items-start gap-2">
                            <span className="mt-0.5">⚠️</span>
                            <span>{warn}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </OutputPanel>
        )}
      </div>
    </ToolLayout>
  );
}
