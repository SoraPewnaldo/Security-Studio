import type { ToolManifest } from '@security-studio/types';

export const manifest: ToolManifest = {
  id: 'asn-lookup',
  name: 'ASN Lookup',
  description: 'Query Autonomous System Numbers (ASN) via RDAP to find network operators and routing policies.',
  category: 'networking',
  tags: ['asn', 'bgp', 'network', 'routing', 'lookup', 'rdap'],
  keywords: ['asn', 'bgp', 'network', 'operator', 'lookup', 'rdap', 'ip'],
  version: '1.0.0',
  author: 'Security Studio',
  icon: 'Router',
  shortcuts: [
    { label: 'Lookup', keys: 'Ctrl+Enter', action: 'lookup' },
  ],
  examples: [
    {
      label: 'Google AS15169',
      input: { query: '15169' },
      description: 'Look up the primary ASN used by Google.'
    },
    {
      label: 'Cloudflare AS13335',
      input: { query: 'AS13335' },
      description: 'Look up the primary ASN used by Cloudflare.'
    }
  ]
};
