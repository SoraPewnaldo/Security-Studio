import type { ToolManifest } from '@security-studio/types';
export const manifest: ToolManifest = {
  id: 'jwt-inspector', name: 'JWT Inspector', description: 'Decode, inspect, and analyze JSON Web Tokens',
  category: 'authentication', tags: ['jwt', 'token', 'decode', 'inspect'],
  keywords: ['jwt', 'json', 'web', 'token', 'decode', 'header', 'payload', 'signature', 'claims', 'expiration'],
  version: '1.0.0', author: 'Security Studio', icon: 'KeyRound',
  shortcuts: [{ label: 'Decode', keys: 'Ctrl+Enter', action: 'decode' }],
  examples: [{
    label: 'Sample JWT',
    input: { token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c' },
    description: 'Decode a sample JWT token',
  }],
};
