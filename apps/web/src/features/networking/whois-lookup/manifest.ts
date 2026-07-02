import type { ToolManifest } from '@security-studio/types';

export const manifest: ToolManifest = {
  id: 'whois-lookup',
  name: 'WHOIS Lookup',
  description: 'Query domain registration data (RDAP) to find registrars, statuses, and registration dates.',
  category: 'networking',
  tags: ['whois', 'rdap', 'domain', 'lookup', 'registration', 'network'],
  keywords: ['whois', 'rdap', 'domain', 'registrar', 'lookup', 'registration'],
  version: '1.0.0',
  author: 'Security Studio',
  icon: 'Search',
  shortcuts: [
    { label: 'Lookup', keys: 'Ctrl+Enter', action: 'lookup' },
  ],
  examples: [
    {
      label: 'Google Domain Info',
      input: { query: 'google.com' },
      description: 'Look up registration details for google.com.'
    }
  ]
};
