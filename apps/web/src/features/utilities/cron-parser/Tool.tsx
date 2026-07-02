import { useState } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { InputPanel } from '@/components/InputPanel';
import { OutputPanel } from '@/components/OutputPanel';
import { manifest } from './manifest';
import { parseCron } from './logic';
import type { ToolExample } from '@security-studio/types';
import readme from './README.md?raw';

export default function CronParserTool() {
  const [cron, setCron] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const handleParse = () => {
    setError('');
    try {
      if (!cron.trim()) throw new Error('Cron expression is required.');
      setOutput(parseCron(cron));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An error occurred');
      setOutput('');
    }
  };

  const handleClear = () => { setCron(''); setOutput(''); setError(''); };

  const handleLoadExample = (example: ToolExample) => {
    const inp = example.input as { cron?: string };
    if (inp.cron !== undefined) setCron(String(inp.cron));
    setOutput(''); setError('');
  };

  return (
    <ToolLayout manifest={manifest} outputText={output} readme={readme} onLoadExample={handleLoadExample}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <InputPanel title="Cron Expression" onClear={handleClear}>
          <input
            type="text"
            value={cron}
            onChange={(e) => setCron(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleParse(); }}
            placeholder="* * * * *"
            className="w-full bg-bg border border-border rounded-md p-3 text-lg font-mono text-center text-text placeholder:text-text-muted focus:border-primary focus:outline-none transition-colors"
          />
          <button
            onClick={handleParse}
            className="mt-4 w-full px-4 py-2 text-sm font-medium rounded-md bg-primary text-bg hover:bg-primary-hover transition-colors cursor-pointer"
          >
            Parse
          </button>
        </InputPanel>

        <OutputPanel title="Description" copyText={output} onClear={() => setOutput('')}>
          {error ? (
            <div className="p-3 rounded-md bg-danger-subtle border border-danger/30 text-danger text-sm">{error}</div>
          ) : (
            <div className="flex items-center justify-center h-32 bg-bg border border-border rounded-md p-4 text-center">
              {output ? (
                <span className="text-lg font-medium text-text">{output}</span>
              ) : (
                <span className="text-text-muted text-sm">Description will appear here...</span>
              )}
            </div>
          )}
        </OutputPanel>
      </div>
    </ToolLayout>
  );
}
