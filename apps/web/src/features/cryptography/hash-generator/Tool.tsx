import { useState } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { InputPanel } from '@/components/InputPanel';
import { OutputPanel } from '@/components/OutputPanel';
import { manifest } from './manifest';
import { generateHash, type HashAlgorithm } from './logic';

const ALGORITHMS: HashAlgorithm[] = ['SHA-256', 'SHA-512', 'SHA-1', 'MD5'];

export default function HashGeneratorTool() {
  const [input, setInput] = useState('');
  const [algorithm, setAlgorithm] = useState<HashAlgorithm>('SHA-256');
  const [output, setOutput] = useState('');
  const [allHashes, setAllHashes] = useState<Record<string, string>>({});

  const handleHash = async () => {
    if (!input) return;
    const hash = await generateHash(input, algorithm);
    setOutput(hash);

    // Generate all hashes for comparison
    const results: Record<string, string> = {};
    for (const alg of ALGORITHMS) {
      results[alg] = await generateHash(input, alg);
    }
    setAllHashes(results);
  };

  return (
    <ToolLayout manifest={manifest} outputText={output}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <InputPanel title="Input">
          <div className="flex items-center gap-2 mb-3">
            {ALGORITHMS.map((alg) => (
              <button
                key={alg}
                onClick={() => setAlgorithm(alg)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-colors duration-150 cursor-pointer
                  ${algorithm === alg
                    ? 'bg-primary text-bg border-primary'
                    : 'border-border text-text-secondary hover:bg-surface-hover'
                  }`}
              >
                {alg}
              </button>
            ))}
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                void handleHash();
              }
            }}
            placeholder="Enter text to hash..."
            className="w-full h-48 bg-bg border border-border rounded-md p-3 text-sm font-mono
              text-text placeholder:text-text-muted resize-none focus:border-primary
              focus:outline-none transition-colors duration-150"
          />
          <button
            onClick={() => void handleHash()}
            className="mt-3 px-4 py-2 text-sm font-medium rounded-md bg-primary text-bg
              hover:bg-primary-hover transition-colors duration-150 cursor-pointer"
          >
            Generate Hash
          </button>
        </InputPanel>

        <OutputPanel title="Output" copyText={output} downloadFilename="hash-output.txt">
          {output ? (
            <div className="space-y-4">
              <div className="bg-bg border border-border rounded-md p-3">
                <div className="text-xs text-text-secondary mb-1">{algorithm}</div>
                <div className="text-sm font-mono text-text break-all select-all">{output}</div>
              </div>
              {Object.keys(allHashes).length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-medium text-text-secondary uppercase tracking-wider">All Algorithms</h4>
                  {ALGORITHMS.map((alg) => (
                    <div key={alg} className="bg-bg border border-border rounded-md p-3">
                      <div className="text-xs text-text-secondary mb-1">{alg}</div>
                      <div className="text-xs font-mono text-text-secondary break-all select-all">
                        {allHashes[alg]}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="text-sm text-text-muted text-center py-8">
              Hash output will appear here...
            </div>
          )}
        </OutputPanel>
      </div>
    </ToolLayout>
  );
}
