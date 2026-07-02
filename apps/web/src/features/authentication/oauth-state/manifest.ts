import type { ToolManifest } from '@security-studio/types';

export const manifest: ToolManifest = {
  id: 'oauth-state',
  name: 'OAuth State Generator',
  description: 'Generate secure random state parameters for OAuth 2.0 flows to prevent CSRF attacks.',
  category: 'authentication',
  tags: ['oauth', 'state', 'csrf', 'security', 'random'],
  keywords: ['oauth', 'state', 'csrf', 'generator', 'random'],
  version: '1.0.0',
  author: 'Security Studio',
  icon: 'ShieldQuestion',
  shortcuts: [
    { label: 'Generate', keys: 'Ctrl+Enter', action: 'generate' },
  ],
  examples: [
    {
      label: 'Standard Alphanumeric (32 chars)',
      input: { length: 32, format: 'alphanumeric' },
      description: 'A standard 32-character random string'
    },
    {
      label: 'High Entropy Base64',
      input: { length: 64, format: 'base64url' },
      description: 'A 64-byte random string encoded as Base64URL'
    },
    {
      label: 'Hexadecimal State',
      input: { length: 16, format: 'hex' },
      description: 'A 16-byte random string encoded as hex'
    }
  ]
};
