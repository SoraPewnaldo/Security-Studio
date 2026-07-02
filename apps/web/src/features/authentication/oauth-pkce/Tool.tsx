import React, { useState } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { InputPanel } from '@/components/InputPanel';
import { OutputPanel } from '@/components/OutputPanel';
import { manifest } from './manifest';
import readme from './README.md?raw';
import { generateVerifier, generateChallenge } from './logic';

export default function OAuthPKCETool() {
  const handleLoadExample = (example: any) => {
    if (example.input?.length !== undefined) setLength(example.input.length);
    if (example.input?.customVerifier !== undefined) setCustomVerifier(example.input.customVerifier);
    if (example.input?.outputVerifier !== undefined) setOutputVerifier(example.input.outputVerifier);
    if (example.input?.outputChallenge !== undefined) setOutputChallenge(example.input.outputChallenge);
    if (example.input?.error !== undefined) setError(example.input.error);
  };

  const [length, setLength] = useState<number>(43);
  const [customVerifier, setCustomVerifier] = useState<string>('');
  
  const [outputVerifier, setOutputVerifier] = useState<string>('');
  const [outputChallenge, setOutputChallenge] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleGenerate = async () => {
    setError('');
    setOutputVerifier('');
    setOutputChallenge('');
    
    try {
      let verifierToUse = customVerifier;
      if (!verifierToUse) {
        verifierToUse = generateVerifier(length);
      }
      
      const challenge = await generateChallenge(verifierToUse);
      setOutputVerifier(verifierToUse);
      setOutputChallenge(challenge);
    } catch (err: any) {
      setError(err.message || 'An error occurred during generation.');
    }
  };

  const onLoadExample = (example: any) => {
    setLength(example.input.length || 43);
    setCustomVerifier(example.input.customVerifier || '');
    setOutputVerifier('');
    setOutputChallenge('');
    setError('');
  };

  const onClearInput = () => {
    setLength(43);
    setCustomVerifier('');
  };

  const onClearOutput = () => {
    setOutputVerifier('');
    setOutputChallenge('');
    setError('');
  };

  // The text to copy when clicking copy on the ToolLayout top right or output panel
  const combinedOutput = outputVerifier && outputChallenge 
    ? `Code Verifier: ${outputVerifier}\nCode Challenge: ${outputChallenge}`
    : '';

  return (
    <ToolLayout 
      manifest={manifest} 
      outputText={combinedOutput}
      readme={readme}
      onLoadExample={onLoadExample}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <InputPanel title="Configuration" onClear={onClearInput}>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">
                Verifier Length (43-128)
              </label>
              <input
                type="number"
                min="43"
                max="128"
                value={length}
                onChange={(e) => setLength(parseInt(e.target.value) || 43)}
                disabled={customVerifier.length > 0}
                className="w-full bg-bg border border-border rounded-md p-2 text-sm text-text focus:border-primary focus:outline-none transition-colors disabled:opacity-50"
              />
              <p className="text-[11px] text-text-muted mt-1">
                Length of the random verifier. Ignored if a custom verifier is provided.
              </p>
            </div>
            
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">
                Custom Verifier (Optional)
              </label>
              <input
                type="text"
                value={customVerifier}
                onChange={(e) => setCustomVerifier(e.target.value)}
                placeholder="e.g. dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk"
                className="w-full bg-bg border border-border rounded-md p-2 text-sm text-text focus:border-primary focus:outline-none transition-colors font-mono"
              />
              <p className="text-[11px] text-text-muted mt-1">
                Provide a custom string to compute its S256 challenge.
              </p>
            </div>

            <button
              onClick={() => void handleGenerate()}
              className="px-4 py-2 text-sm font-medium rounded-md bg-primary text-bg
                hover:bg-primary-hover transition-colors duration-150 cursor-pointer w-full mt-2"
            >
              Generate PKCE Pair
            </button>
            
            {error && (
              <div className="p-3 bg-error/10 border border-error/20 rounded-md text-error text-sm">
                {error}
              </div>
            )}
          </div>
        </InputPanel>

        <OutputPanel 
          title="Generated Output" 
          copyText={combinedOutput} 
          downloadFilename="pkce-output.txt"
          onClear={onClearOutput}
        >
          {outputVerifier && outputChallenge ? (
            <div className="space-y-4">
              <div className="bg-bg border border-border rounded-md p-3">
                <div className="text-xs text-text-secondary mb-1">Code Verifier</div>
                <div className="text-sm font-mono text-text break-all select-all">
                  {outputVerifier}
                </div>
              </div>
              <div className="bg-bg border border-border rounded-md p-3">
                <div className="text-xs text-text-secondary mb-1">Code Challenge (S256)</div>
                <div className="text-sm font-mono text-text break-all select-all">
                  {outputChallenge}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-sm text-text-muted text-center py-8">
              Outputs will appear here after generation...
            </div>
          )}
        </OutputPanel>
      </div>
    </ToolLayout>
  );
}
