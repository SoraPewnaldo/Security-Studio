import { useState } from 'react';
import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import { ToolLayout } from '@/components/ToolLayout';
import { InputPanel } from '@/components/InputPanel';
import { manifest } from './manifest';
import { analyzeHeaders, type AnalysisResult } from './logic';

const STATUS_ICON = { pass: CheckCircle2, warn: AlertTriangle, fail: XCircle };
const STATUS_COLOR = { pass: 'text-success', warn: 'text-warning', fail: 'text-danger' };
const GRADE_COLOR: Record<string, string> = { A: 'text-success', B: 'text-success', C: 'text-warning', D: 'text-warning', F: 'text-danger' };

export default function SecurityHeadersTool() {
  const [headers, setHeaders] = useState('');
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleAnalyze = () => {
    if (!headers.trim()) return;
    setResult(analyzeHeaders(headers));
  };

  return (
    <ToolLayout manifest={manifest}>
      <div className="space-y-4">
        <InputPanel title="Paste HTTP Response Headers">
          <textarea
            value={headers}
            onChange={(e) => setHeaders(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); handleAnalyze(); }
            }}
            placeholder={'X-Content-Type-Options: nosniff\nStrict-Transport-Security: max-age=31536000\nX-Frame-Options: DENY\n...'}
            className="w-full h-40 bg-bg border border-border rounded-md p-3 text-sm font-mono
              text-text placeholder:text-text-muted resize-none focus:border-primary focus:outline-none"
          />
          <button onClick={handleAnalyze}
            className="mt-2 px-4 py-2 text-sm font-medium rounded-md bg-primary text-bg
              hover:bg-primary-hover transition-colors duration-150 cursor-pointer">
            Analyze Headers
          </button>
        </InputPanel>

        {result && (
          <>
            {/* Grade */}
            <div className="flex items-center gap-6 rounded-lg border border-border bg-surface p-6">
              <div className={`text-6xl font-bold ${GRADE_COLOR[result.grade] || 'text-text'}`}>
                {result.grade}
              </div>
              <div>
                <div className="text-sm text-text-secondary">Security Score</div>
                <div className="text-2xl font-semibold text-text">{result.score}%</div>
                <div className="text-xs text-text-muted mt-1">
                  {result.checks.filter((c) => c.status === 'pass').length}/{result.checks.length} headers configured correctly
                </div>
              </div>
            </div>

            {/* Checks */}
            <div className="space-y-2">
              {result.checks.map((check) => {
                const Icon = STATUS_ICON[check.status];
                return (
                  <div key={check.name} className="rounded-lg border border-border bg-surface p-4">
                    <div className="flex items-start gap-3">
                      <Icon size={18} className={`flex-shrink-0 mt-0.5 ${STATUS_COLOR[check.status]}`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium font-mono text-text">{check.name}</span>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                            check.present ? 'bg-success/20 text-success' : 'bg-danger/20 text-danger'
                          }`}>
                            {check.present ? 'Present' : 'Missing'}
                          </span>
                        </div>
                        <p className="text-xs text-text-secondary mt-0.5">{check.description}</p>
                        {check.value && (
                          <pre className="text-xs font-mono text-text-muted mt-1.5 bg-bg rounded px-2 py-1 overflow-auto">
                            {check.value}
                          </pre>
                        )}
                        {check.status !== 'pass' && (
                          <p className="text-xs text-warning mt-1.5">{check.recommendation}</p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </ToolLayout>
  );
}
