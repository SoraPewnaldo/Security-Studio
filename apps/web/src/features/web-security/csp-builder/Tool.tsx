import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { ToolLayout } from '@/components/ToolLayout';
import { OutputPanel } from '@/components/OutputPanel';
import { manifest } from './manifest';
import { CSP_DIRECTIVES, COMMON_VALUES, buildCspString, type CspPolicy, type CspDirective } from './logic';
import readme from './README.md?raw';

export default function CspBuilderTool() {
  const handleLoadExample = (example: any) => {
    if (example.input?.policy !== undefined) setPolicy(example.input.policy);
    if (example.input?.activeDirectives !== undefined) setActiveDirectives(example.input.activeDirectives);
  };

  const [policy, setPolicy] = useState<CspPolicy>({ 'default-src': ["'self'"] });
  const [activeDirectives, setActiveDirectives] = useState<CspDirective[]>(['default-src']);

  const cspString = buildCspString(policy);

  const addDirective = (directive: CspDirective) => {
    if (!activeDirectives.includes(directive)) {
      setActiveDirectives([...activeDirectives, directive]);
      setPolicy({ ...policy, [directive]: [] });
    }
  };

  const removeDirective = (directive: CspDirective) => {
    setActiveDirectives(activeDirectives.filter((d) => d !== directive));
    const newPolicy = { ...policy };
    delete newPolicy[directive];
    setPolicy(newPolicy);
  };

  const addValue = (directive: CspDirective, value: string) => {
    const current = policy[directive] || [];
    if (!current.includes(value)) {
      setPolicy({ ...policy, [directive]: [...current, value] });
    }
  };

  const removeValue = (directive: CspDirective, value: string) => {
    setPolicy({ ...policy, [directive]: (policy[directive] || []).filter((v) => v !== value) });
  };

  const addCustomValue = (directive: CspDirective, value: string) => {
    const trimmed = value.trim();
    if (trimmed) addValue(directive, trimmed);
  };

  return (
    <ToolLayout onLoadExample={handleLoadExample} readme={readme} manifest={manifest} outputText={cspString}>
      <div className="space-y-4">
        {/* Add directive */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-text-secondary">Add directive:</span>
          <select
            onChange={(e) => { addDirective(e.target.value as CspDirective); e.target.value = ''; }}
            className="bg-bg border border-border rounded-md px-2 py-1 text-xs text-text focus:border-primary focus:outline-none"
            defaultValue=""
          >
            <option value="" disabled>Select...</option>
            {CSP_DIRECTIVES.filter((d) => !activeDirectives.includes(d)).map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        {/* Directive editors */}
        <div className="space-y-3">
          {activeDirectives.map((directive) => (
            <div key={directive} className="rounded-lg border border-border bg-surface p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium font-mono text-primary">{directive}</h3>
                <button
                  onClick={() => removeDirective(directive)}
                  className="p-1 text-text-muted hover:text-danger transition-colors cursor-pointer"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Current values */}
              <div className="flex flex-wrap gap-1.5 mb-3">
                {(policy[directive] || []).map((value) => (
                  <span
                    key={value}
                    className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-mono
                      rounded-md bg-primary/10 text-primary"
                  >
                    {value}
                    <button
                      onClick={() => removeValue(directive, value)}
                      className="hover:text-danger transition-colors cursor-pointer"
                    >
                      <X size={10} />
                    </button>
                  </span>
                ))}
              </div>

              {/* Quick add */}
              <div className="flex flex-wrap gap-1 mb-2">
                {COMMON_VALUES.filter((v) => !(policy[directive] || []).includes(v)).map((value) => (
                  <button
                    key={value}
                    onClick={() => addValue(directive, value)}
                    className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono
                      rounded border border-border text-text-secondary hover:bg-surface-hover
                      transition-colors cursor-pointer"
                  >
                    <Plus size={8} /> {value}
                  </button>
                ))}
              </div>

              {/* Custom value */}
              <input
                type="text"
                placeholder="Add custom value..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    addCustomValue(directive, (e.target as HTMLInputElement).value);
                    (e.target as HTMLInputElement).value = '';
                  }
                }}
                className="w-full bg-bg border border-border rounded-md px-2.5 py-1.5 text-xs font-mono
                  text-text placeholder:text-text-muted focus:border-primary focus:outline-none"
              />
            </div>
          ))}
        </div>

        {/* Output */}
        <OutputPanel title="Generated CSP Header" copyText={cspString} downloadFilename="csp-header.txt">
          {cspString ? (
            <pre className="text-sm font-mono text-text bg-bg rounded-md p-3 whitespace-pre-wrap break-all">
              {cspString}
            </pre>
          ) : (
            <div className="text-sm text-text-muted text-center py-4">
              Add directives to generate a CSP header
            </div>
          )}
        </OutputPanel>
      </div>
    </ToolLayout>
  );
}
