import type { ToolManifest } from '@security-studio/types';

export const manifest: ToolManifest = {
  id: 'http-header-diff',
  name: 'HTTP Header Diff',
  description: 'Compare two sets of HTTP headers to identify additions, removals, and changes.',
  category: 'web-security',
  tags: ['http', 'headers', 'diff', 'compare', 'api', 'web'],
  keywords: ['http', 'headers', 'diff', 'compare', 'api', 'web', 'security headers'],
  version: '1.0.0',
  author: 'Security Studio',
  icon: 'GitCompare',
  shortcuts: [
    { label: 'Compare', keys: 'Ctrl+Enter', action: 'compare' },
  ],
  examples: [
    {
      label: 'Security Header Updates',
      input: { 
        headers1: 'HTTP/1.1 200 OK\nServer: nginx\nContent-Type: text/html',
        headers2: 'HTTP/1.1 200 OK\nServer: nginx\nContent-Type: text/html\nStrict-Transport-Security: max-age=31536000\nX-Frame-Options: DENY' 
      },
      description: 'Compare standard response vs secure response.'
    }
  ]
};
