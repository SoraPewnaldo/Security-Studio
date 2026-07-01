import type { ToolManifest } from '@security-studio/types';
export const manifest: ToolManifest = {
  id: 'security-headers', name: 'Security Header Analyzer', description: 'Analyze HTTP security headers and get a security grade',
  category: 'web-security', tags: ['headers', 'security', 'http', 'analyze'],
  keywords: ['headers', 'security', 'http', 'hsts', 'csp', 'x-frame-options', 'grade'],
  version: '1.0.0', author: 'Security Studio', icon: 'ShieldCheck',
  shortcuts: [{ label: 'Analyze', keys: 'Ctrl+Enter', action: 'analyze' }],
  examples: [{ label: 'Good Headers', input: { headers: 'X-Content-Type-Options: nosniff\nStrict-Transport-Security: max-age=31536000; includeSubDomains\nX-Frame-Options: DENY\nContent-Security-Policy: default-src \'self\'\nReferrer-Policy: strict-origin-when-cross-origin\nPermissions-Policy: camera=(), microphone=()' }, description: 'Analyze a well-configured set of headers' }],
};
