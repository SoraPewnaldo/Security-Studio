import { useState } from 'react';
import { Copy, RefreshCw } from 'lucide-react';
import { ToolLayout } from '@/components/ToolLayout';
import { InputPanel } from '@/components/InputPanel';
import { OutputPanel } from '@/components/OutputPanel';
import { manifest } from './manifest';
import { generateMultiple, calculateEntropy, type PasswordOptions } from './logic';
import { copyToClipboard } from '@security-studio/utils';
import toast from 'react-hot-toast';
import readme from './README.md?raw';

export default function PasswordGeneratorTool() {
  const handleLoadExample = (example: any) => {
    if (example.input?.options !== undefined) setOptions(example.input.options);
    if (example.input?.count !== undefined) setCount(example.input.count);
    if (example.input?.passwords !== undefined) setPasswords(example.input.passwords);
  };

  const [options, setOptions] = useState<PasswordOptions>({
    length: 20,
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
    excludeAmbiguous: false,
  });
  const [count, setCount] = useState(5);
  const [passwords, setPasswords] = useState<string[]>([]);

  const entropy = calculateEntropy(options);

  const handleGenerate = () => {
    setPasswords(generateMultiple(options, count));
  };

  const handleCopy = async (pw: string) => {
    await copyToClipboard(pw);
    toast.success('Copied!');
  };

  return (
    <ToolLayout onLoadExample={handleLoadExample} readme={readme} manifest={manifest} outputText={passwords.join('\n')}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <InputPanel title="Configuration">
          <div className="space-y-4">
            <div>
              <label className="text-xs text-text-secondary mb-1 block">
                Length: {options.length}
              </label>
              <input
                type="range"
                min={4}
                max={128}
                value={options.length}
                onChange={(e) => setOptions({ ...options, length: Number(e.target.value) })}
                className="w-full accent-primary"
              />
              <div className="flex justify-between text-[10px] text-text-muted">
                <span>4</span><span>128</span>
              </div>
            </div>

            {[
              { key: 'uppercase', label: 'Uppercase (A-Z)' },
              { key: 'lowercase', label: 'Lowercase (a-z)' },
              { key: 'numbers', label: 'Numbers (0-9)' },
              { key: 'symbols', label: 'Symbols (!@#$...)' },
              { key: 'excludeAmbiguous', label: 'Exclude Ambiguous (O0Il1)' },
            ].map(({ key, label }) => (
              <label key={key} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={options[key as keyof PasswordOptions] as boolean}
                  onChange={(e) => setOptions({ ...options, [key]: e.target.checked })}
                  className="accent-primary"
                />
                <span className="text-sm text-text">{label}</span>
              </label>
            ))}

            <div>
              <label className="text-xs text-text-secondary mb-1 block">Count</label>
              <input
                type="number"
                min={1}
                max={50}
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
                className="w-20 bg-bg border border-border rounded-md px-2.5 py-1.5 text-sm text-text
                  focus:border-primary focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-3 text-xs text-text-secondary">
              <span>Entropy: <strong className="text-text">{entropy} bits</strong></span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                entropy >= 80 ? 'bg-success/20 text-success' :
                entropy >= 60 ? 'bg-warning/20 text-warning' :
                'bg-danger/20 text-danger'
              }`}>
                {entropy >= 80 ? 'Very Strong' : entropy >= 60 ? 'Strong' : 'Weak'}
              </span>
            </div>

            <button
              onClick={handleGenerate}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md bg-primary text-bg
                hover:bg-primary-hover transition-colors duration-150 cursor-pointer"
            >
              <RefreshCw size={14} />
              Generate
            </button>
          </div>
        </InputPanel>

        <OutputPanel title="Generated Passwords" copyText={passwords.join('\n')} downloadFilename="passwords.txt">
          {passwords.length > 0 ? (
            <div className="space-y-1.5">
              {passwords.map((pw, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between bg-bg border border-border rounded-md px-3 py-2 group"
                >
                  <span className="text-sm font-mono text-text select-all break-all">{pw}</span>
                  <button
                    onClick={() => void handleCopy(pw)}
                    className="flex-shrink-0 ml-2 p-1 text-text-muted hover:text-text
                      opacity-0 group-hover:opacity-100 transition-all duration-150 cursor-pointer"
                    title="Copy"
                  >
                    <Copy size={14} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-text-muted text-center py-8">
              Click Generate to create passwords
            </div>
          )}
        </OutputPanel>
      </div>
    </ToolLayout>
  );
}
