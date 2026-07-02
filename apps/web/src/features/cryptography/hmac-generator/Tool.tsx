import { useState } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { InputPanel } from '@/components/InputPanel';
import { OutputPanel } from '@/components/OutputPanel';
import { manifest } from './manifest';
import { generateHmac, type HashAlgorithm, type OutputEncoding } from './logic';
import readme from './README.md?raw';

const ALGORITHMS: HashAlgorithm[] = ['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512'];
const ENCODINGS: OutputEncoding[] = ['hex', 'base64'];

export default function HmacGeneratorTool() {
  const handleLoadExample = (example: any) => {
    if (example.input?.text !== undefined) setText(example.input.text);
    if (example.input?.secret !== undefined) setSecret(example.input.secret);
    if (example.input?.algorithm !== undefined) setAlgorithm(example.input.algorithm);
    if (example.input?.encoding !== undefined) setEncoding(example.input.encoding);
    if (example.input?.output !== undefined) setOutput(example.input.output);
    if (example.input?.error !== undefined) setError(example.input.error);
  };

  const [text, setText] = useState('');
  const [secret, setSecret] = useState('');
  const [algorithm, setAlgorithm] = useState<HashAlgorithm>('SHA-256');
  const [encoding, setEncoding] = useState<OutputEncoding>('hex');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    setError('');
    setOutput('');
    if (!text) {
      setError('Text input cannot be empty.');
      return;
    }
    if (!secret) {
      setError('Secret key cannot be empty.');
      return;
    }
    try {
      const hmac = await generateHmac(text, secret, algorithm, encoding);
      setOutput(hmac);
    } catch (e: any) {
      setError(e.message || 'An error occurred while generating HMAC');
    }
  };

  const handleClear = () => {
    setText('');
    setSecret('');
    setAlgorithm('SHA-256');
    setEncoding('hex');
    setOutput('');
    setError('');
  };

  return (
    <ToolLayout 
      manifest={manifest} 
      outputText={output}
      readme={readme}
      onLoadExample={(example) => {
        const inp = example.input as { text?: string; secret?: string; algorithm?: string; encoding?: string; };
        setText(inp.text || '');
        setSecret(inp.secret || '');
        setAlgorithm((inp.algorithm as any) || 'SHA-256');
        setEncoding((inp.encoding as any) || 'hex');
        setOutput('');
        setError('');
      }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <InputPanel title="Input" onClear={handleClear}>
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">Hash Algorithm</label>
              <div className="flex items-center gap-2">
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
            </div>

            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">Output Encoding</label>
              <div className="flex items-center gap-2">
                {ENCODINGS.map((enc) => (
                  <button
                    key={enc}
                    onClick={() => setEncoding(enc)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-colors duration-150 cursor-pointer
                      ${encoding === enc
                        ? 'bg-primary text-bg border-primary'
                        : 'border-border text-text-secondary hover:bg-surface-hover'
                      }`}
                  >
                    {enc.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">Secret Key</label>
              <input
                type="text"
                value={secret}
                onChange={(e) => setSecret(e.target.value)}
                placeholder="Enter secret key..."
                className="w-full bg-bg border border-border rounded-md p-2 text-sm font-mono text-text placeholder:text-text-muted focus:border-primary focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">Text to Hash</label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter text..."
                className="w-full h-32 bg-bg border border-border rounded-md p-3 text-sm font-mono text-text placeholder:text-text-muted resize-none focus:border-primary focus:outline-none transition-colors"
              />
            </div>
            
            <button
              onClick={() => void handleGenerate()}
              className="mt-2 px-4 py-2 text-sm font-medium rounded-md bg-primary text-bg hover:bg-primary-hover transition-colors duration-150 cursor-pointer"
            >
              Generate HMAC
            </button>
          </div>
        </InputPanel>

        <OutputPanel 
          title="Output" 
          copyText={output} 
          downloadFilename="hmac-output.txt" 
          onClear={() => { setOutput(''); setError(''); }}
        >
          {error ? (
            <div className="text-sm text-red-500 font-medium p-3 bg-red-500/10 border border-red-500/20 rounded-md">
              {error}
            </div>
          ) : output ? (
            <div className="bg-bg border border-border rounded-md p-3">
              <div className="text-xs text-text-secondary mb-1">{algorithm} HMAC ({encoding})</div>
              <div className="text-sm font-mono text-text break-all select-all">{output}</div>
            </div>
          ) : (
            <div className="text-sm text-text-muted text-center py-8">
              HMAC output will appear here...
            </div>
          )}
        </OutputPanel>
      </div>
    </ToolLayout>
  );
}
