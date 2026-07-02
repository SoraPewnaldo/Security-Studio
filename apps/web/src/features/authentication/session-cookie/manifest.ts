import type { ToolManifest } from '@security-studio/types';

export const manifest: ToolManifest = {
  id: 'session-cookie',
  name: 'Session Cookie Analyzer',
  description: 'Parse, inspect, and analyze HTTP Set-Cookie headers for security misconfigurations.',
  category: 'authentication',
  tags: ['cookie', 'session', 'auth', 'headers', 'security'],
  keywords: ['cookie', 'session', 'httponly', 'secure', 'samesite', 'set-cookie'],
  version: '1.0.0',
  author: 'Security Studio',
  icon: 'Cookie',
  shortcuts: [
    { label: 'Analyze', keys: 'Ctrl+Enter', action: 'analyze' },
  ],
  examples: [
    {
      label: 'Secure Session Cookie',
      input: { cookie: 'session_id=12345; Secure; HttpOnly; SameSite=Strict; Path=/; Domain=example.com' },
      description: 'A well-configured session cookie.'
    },
    {
      label: 'Insecure Cookie',
      input: { cookie: 'tracking=abcde; Path=/' },
      description: 'A cookie missing critical security flags.'
    },
    {
      label: 'Multiple Cookies',
      input: { cookie: 'user=admin; Secure; HttpOnly\ntheme=dark; Path=/' },
      description: 'Analyze multiple Set-Cookie headers at once.'
    }
  ]
};
