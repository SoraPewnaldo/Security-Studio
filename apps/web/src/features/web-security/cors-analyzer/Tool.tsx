import { useState } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { InputPanel } from '@/components/InputPanel';
import { OutputPanel } from '@/components/OutputPanel';
import { manifest } from './manifest';
import { analyzeCors, type CorsAnalysis } from './logic';
import type { ToolExample } from '@security-studio/types';
import readme from './README.md?raw';

export default function CorsAnalyzerTool() {
  const [headers, setHeaders] = useState('');
  const [analysis, setAnalysis] = useState<CorsAnalysis | null>(null);

  const handleAnalyze = () => {
    setAnalysis(analyzeCors(headers));
  };

  const handleClear = () => { setHeaders(''); setAnalysis(null); };

  const handleLoadExample = (example: ToolExample) => {
    const inp = example.input as { headers?: string };
    if (inp.headers !== undefined) setHeaders(String(inp.headers));
    setAnalysis(null);
  };

  return (
    <ToolLayout manifest={manifest} outputText={analysis ? JSON.stringify(analysis, null, 2) : ''} readme={readme} onLoadExample={handleLoadExample}>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <InputPanel title="HTTP Response Headers" onClear={handleClear}>
          <textarea
            value={headers}
            onChange={(e) => setHeaders(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); handleAnalyze(); } }}
            placeholder="HTTP/1.1 200 OK\nAccess-Control-Allow-Origin: *\n..."
            className="w-full h-[400px] bg-bg border border-border rounded-md p-3 text-sm font-mono text-text placeholder:text-text-muted resize-none focus:border-primary focus:outline-none transition-colors"
          />
          <button
            onClick={handleAnalyze}
            className="mt-4 w-full px-4 py-2 text-sm font-medium rounded-md bg-primary text-bg hover:bg-primary-hover transition-colors cursor-pointer"
          >
            Analyze CORS Security
          </button>
        </InputPanel>

        <OutputPanel title="Analysis Results" copyText={analysis ? JSON.stringify(analysis, null, 2) : ''} onClear={() => setAnalysis(null)}>
          {analysis ? (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-surface border border-border rounded-lg">
                  <div className="text-[11px] text-text-muted uppercase tracking-wider mb-1">Origin</div>
                  <div className="font-mono text-sm text-text truncate">{analysis.origin || 'Not Set'}</div>
                </div>
                <div className="p-3 bg-surface border border-border rounded-lg">
                  <div className="text-[11px] text-text-muted uppercase tracking-wider mb-1">Credentials</div>
                  <div className="font-mono text-sm text-text truncate">{analysis.credentials ? 'true' : 'false (or unset)'}</div>
                </div>
                <div className="p-3 bg-surface border border-border rounded-lg">
                  <div className="text-[11px] text-text-muted uppercase tracking-wider mb-1">Methods</div>
                  <div className="font-mono text-sm text-text truncate">{analysis.methods || 'Not Set'}</div>
                </div>
                <div className="p-3 bg-surface border border-border rounded-lg">
                  <div className="text-[11px] text-text-muted uppercase tracking-wider mb-1">Headers</div>
                  <div className="font-mono text-sm text-text truncate">{analysis.headers || 'Not Set'}</div>
                </div>
                <div className="p-3 bg-surface border border-border rounded-lg">
                  <div className="text-[11px] text-text-muted uppercase tracking-wider mb-1">Expose Headers</div>
                  <div className="font-mono text-sm text-text truncate">{analysis.expose || 'Not Set'}</div>
                </div>
                <div className="p-3 bg-surface border border-border rounded-lg">
                  <div className="text-[11px] text-text-muted uppercase tracking-wider mb-1">Max Age</div>
                  <div className="font-mono text-sm text-text truncate">{analysis.maxAge || 'Not Set'}</div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-text mb-3">Security Findings</h3>
                <div className="space-y-2">
                  {analysis.findings.map((finding, idx) => {
                    let bg = 'bg-surface';
                    let text = 'text-text-secondary';
                    let border = 'border-border';
                    if (finding.severity === 'high') { bg = 'bg-danger-subtle'; text = 'text-danger'; border = 'border-danger/30'; }
                    else if (finding.severity === 'medium') { bg = 'bg-warning-subtle'; text = 'text-warning'; border = 'border-warning/30'; }
                    else if (finding.severity === 'info') { bg = 'bg-success-subtle'; text = 'text-success'; border = 'border-success/30'; }

                    return (
                      <div key={idx} className={`p-3 rounded-md border ${border} ${bg} ${text} text-sm flex gap-2 items-start`}>
                        <span className="mt-0.5">
                          {finding.severity === 'high' ? '🚨' : finding.severity === 'medium' ? '⚠️' : finding.severity === 'low' ? 'ℹ️' : '✅'}
                        </span>
                        <span>{finding.message}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-[400px] text-text-muted text-sm border-2 border-dashed border-border rounded-md">
              Analysis will appear here...
            </div>
          )}
        </OutputPanel>
      </div>
    </ToolLayout>
  );
}
