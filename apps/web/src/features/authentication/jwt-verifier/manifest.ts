import type { ToolManifest } from '@security-studio/types';

export const manifest: ToolManifest = {
  id: 'jwt-verifier',
  name: 'JWT Signature Verifier',
  description: 'Verify JWT signatures (HS256, RS256, etc.) using symmetric keys or public certificates.',
  category: 'authentication',
  tags: ['jwt', 'signature', 'verify', 'crypto', 'token'],
  keywords: ['jwt', 'signature', 'verify', 'hs256', 'rs256', 'public key'],
  version: '1.0.0',
  author: 'Security Studio',
  icon: 'ShieldCheck',
  shortcuts: [
    { label: 'Verify', keys: 'Ctrl+Enter', action: 'verify' },
  ],
  examples: [
    {
      label: 'Valid HS256',
      input: {
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
        key: 'your-256-bit-secret',
        alg: 'HS256'
      },
      description: 'Verify a standard HMAC-SHA256 JWT using a symmetric secret.'
    }
  ]
};
