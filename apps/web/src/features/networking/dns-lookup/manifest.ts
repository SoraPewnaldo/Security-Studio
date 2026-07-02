import type { ToolManifest } from '@security-studio/types';

export const manifest: ToolManifest = {
  id: 'dns-lookup',
  name: 'DNS Lookup',
  description: 'Perform DNS queries (A, AAAA, MX, TXT, NS, CNAME) directly from the browser.',
  category: 'networking',
  tags: ['dns', 'lookup', 'network', 'records', 'domain'],
  keywords: ['dns', 'lookup', 'records', 'domain', 'resolve'],
  version: '1.0.0',
  author: 'Security Studio',
  icon: 'Globe2',
  shortcuts: [
    { label: 'Lookup', keys: 'Ctrl+Enter', action: 'lookup' },
  ],
  examples: [
    {
      label: 'Google TXT Records',
      input: { domain: 'google.com', recordType: 'TXT' },
      description: 'Fetch TXT records (often used for SPF/verification) for google.com.'
    },
    {
      label: 'Cloudflare AAAA',
      input: { domain: 'cloudflare.com', recordType: 'AAAA' },
      description: 'Fetch IPv6 addresses for cloudflare.com.'
    }
  ]
};
