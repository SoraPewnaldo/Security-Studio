import type { ToolManifest } from '@security-studio/types';

export const manifest: ToolManifest = {
  id: 'oauth-pkce',
  name: 'OAuth PKCE Generator',
  description: 'Generate Code Verifier and Code Challenge for OAuth 2.0 PKCE',
  category: 'authentication',
  tags: ['oauth', 'pkce', 'generator', 's256', 'auth'],
  keywords: ['oauth2', 'code', 'verifier', 'challenge', 'pkce', 's256', 'authorization'],
  version: '1.0.0',
  author: 'Security Studio',
  icon: 'KeyRound',
  shortcuts: [
    { label: 'Generate PKCE', keys: 'Ctrl+Enter', action: 'generate' },
  ],
  examples: [
    { label: 'Default Length (43)', input: { length: 43 }, description: 'Standard 43-character code verifier.' },
    { label: 'Max Length (128)', input: { length: 128 }, description: 'Maximum length 128-character code verifier.' },
    { label: 'Custom Verifier', input: { customVerifier: 'dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk', length: 43 }, description: 'Using a specific verifier string.' },
  ],
};
