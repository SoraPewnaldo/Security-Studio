import { Info, Github, ExternalLink } from 'lucide-react';
import { toolRegistry } from '@security-studio/tool-sdk';

const TECH_STACK = [
  { name: 'React 19', role: 'Frontend' },
  { name: 'TypeScript', role: 'Language' },
  { name: 'Vite', role: 'Build Tool' },
  { name: 'Tailwind CSS v4', role: 'Styling' },
  { name: 'TanStack Router', role: 'Routing' },
  { name: 'TanStack Query', role: 'Data Fetching' },
  { name: 'Express 5', role: 'Backend' },
  { name: 'Prisma', role: 'ORM' },
  { name: 'SQLite', role: 'Database' },
  { name: 'Fuse.js', role: 'Search' },
  { name: 'Framer Motion', role: 'Animations' },
  { name: 'Docker', role: 'Deployment' },
];

export function AboutPage() {
  return (
    <div className="p-6 max-w-3xl mx-auto space-y-8">
      <div className="text-center">
        <div className="w-16 h-16 rounded-xl bg-primary flex items-center justify-center mx-auto mb-4">
          <Info size={28} className="text-bg" />
        </div>
        <h1 className="text-2xl font-semibold text-text">Security Studio</h1>
        <p className="text-text-secondary mt-1">The modern open-source workspace for security engineers</p>
        <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface border border-border text-xs text-text-secondary">
          v1.2.0 • {toolRegistry.size} tools
        </div>
      </div>

      <section className="rounded-lg border border-border bg-surface p-6">
        <h2 className="text-sm font-medium text-text mb-4">Tech Stack</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {TECH_STACK.map(({ name, role }) => (
            <div key={name} className="rounded-md bg-bg border border-border px-3 py-2">
              <div className="text-sm font-medium text-text">{name}</div>
              <div className="text-[10px] text-text-muted">{role}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-border bg-surface p-6">
        <h2 className="text-sm font-medium text-text mb-4">Links</h2>
        <div className="space-y-2">
          <a href="https://github.com/SoraPewnaldo/Security-Studio" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-primary hover:text-primary-hover transition-colors">
            <Github size={14} /> GitHub Repository <ExternalLink size={10} />
          </a>
          <a href="https://github.com/SoraPewnaldo/Security-Studio/issues" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-primary hover:text-primary-hover transition-colors">
            <ExternalLink size={14} /> Report an Issue <ExternalLink size={10} />
          </a>
        </div>
      </section>

      <section className="rounded-lg border border-border bg-surface p-6 text-center">
        <p className="text-xs text-text-muted">
          Open source • Self-hosted • Privacy-first • No telemetry
        </p>
        <p className="text-xs text-text-muted mt-1">MIT License</p>
      </section>
    </div>
  );
}
