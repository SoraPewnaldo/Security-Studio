import { useState, useMemo } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { manifest } from './manifest';
import { analyzePassword } from './logic';

const SCORE_COLORS = ['bg-danger', 'bg-warning', 'bg-warning', 'bg-success', 'bg-success'];
const SCORE_TEXT = ['text-danger', 'text-warning', 'text-warning', 'text-success', 'text-success'];

export default function PasswordStrengthTool() {
  const [password, setPassword] = useState('');

  const result = useMemo(() => {
    if (!password) return null;
    return analyzePassword(password);
  }, [password]);

  return (
    <ToolLayout manifest={manifest}>
      <div className="max-w-2xl space-y-6">
        <div className="space-y-2">
          <label className="text-xs text-text-secondary uppercase tracking-wider">Password</label>
          <input
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter a password to analyze..."
            className="w-full bg-bg border border-border rounded-md px-3 py-2.5 text-sm font-mono
              text-text placeholder:text-text-muted focus:border-primary focus:outline-none
              transition-colors duration-150"
            autoComplete="off"
          />
        </div>

        {result && (
          <>
            {/* Strength bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className={`text-sm font-medium ${SCORE_TEXT[result.score]}`}>
                  {result.label}
                </span>
                <span className="text-xs text-text-secondary">{result.entropy} bits</span>
              </div>
              <div className="h-2 bg-bg rounded-full overflow-hidden flex gap-1">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={`flex-1 rounded-full transition-colors duration-300 ${
                      i <= result.score ? SCORE_COLORS[result.score] : 'bg-border'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Crack time */}
            <div className="rounded-lg border border-border bg-surface p-4">
              <div className="text-xs text-text-secondary mb-1">Estimated Crack Time (10B guesses/sec)</div>
              <div className="text-lg font-semibold text-text">{result.crackTime}</div>
            </div>

            {/* Character analysis */}
            <div className="rounded-lg border border-border bg-surface p-4">
              <h3 className="text-xs font-medium text-text-secondary uppercase tracking-wider mb-3">
                Character Analysis
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Length', value: result.charAnalysis.length },
                  { label: 'Uppercase', value: result.charAnalysis.uppercase },
                  { label: 'Lowercase', value: result.charAnalysis.lowercase },
                  { label: 'Numbers', value: result.charAnalysis.numbers },
                  { label: 'Symbols', value: result.charAnalysis.symbols },
                  { label: 'Spaces', value: result.charAnalysis.spaces },
                ].map(({ label, value }) => (
                  <div key={label} className="text-center">
                    <div className="text-lg font-semibold text-text">{value}</div>
                    <div className="text-[10px] text-text-muted uppercase">{label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Suggestions */}
            {result.suggestions.length > 0 && (
              <div className="rounded-lg border border-warning/30 bg-warning-subtle p-4">
                <h3 className="text-xs font-medium text-warning uppercase tracking-wider mb-2">
                  Suggestions
                </h3>
                <ul className="space-y-1">
                  {result.suggestions.map((s, i) => (
                    <li key={i} className="text-sm text-text-secondary flex items-center gap-2">
                      <span className="text-warning">•</span> {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </div>
    </ToolLayout>
  );
}
