export const CSP_DIRECTIVES = [
  'default-src', 'script-src', 'style-src', 'img-src', 'connect-src',
  'font-src', 'frame-src', 'media-src', 'object-src', 'worker-src',
  'child-src', 'form-action', 'frame-ancestors', 'base-uri', 'manifest-src',
] as const;

export type CspDirective = typeof CSP_DIRECTIVES[number];

export const COMMON_VALUES = ["'self'", "'none'", "'unsafe-inline'", "'unsafe-eval'", "'strict-dynamic'", '*', 'https:', 'data:', 'blob:'];

export type CspPolicy = Partial<Record<CspDirective, string[]>>;

export function buildCspString(policy: CspPolicy): string {
  return Object.entries(policy)
    .filter(([, values]) => values && values.length > 0)
    .map(([directive, values]) => `${directive} ${values!.join(' ')}`)
    .join('; ');
}

export function parseCspString(csp: string): CspPolicy {
  const policy: CspPolicy = {};
  csp.split(';').forEach((part) => {
    const trimmed = part.trim();
    if (!trimmed) return;
    const [directive, ...values] = trimmed.split(/\s+/);
    if (directive && CSP_DIRECTIVES.includes(directive as CspDirective)) {
      policy[directive as CspDirective] = values;
    }
  });
  return policy;
}
