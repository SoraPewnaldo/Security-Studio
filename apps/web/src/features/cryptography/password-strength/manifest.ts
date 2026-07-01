import type { ToolManifest } from '@security-studio/types';
export const manifest: ToolManifest = {
  id: 'password-strength', name: 'Password Strength Checker', description: 'Analyze password entropy and estimated crack time',
  category: 'cryptography', tags: ['password', 'strength', 'entropy', 'security'],
  keywords: ['password', 'strength', 'check', 'analyze', 'entropy', 'crack', 'time'],
  version: '1.0.0', author: 'Security Studio', icon: 'ShieldCheck',
  shortcuts: [{ label: 'Analyze', keys: 'Ctrl+Enter', action: 'analyze' }],
  examples: [
    { label: 'Weak Password', input: { password: 'password123' }, description: 'Analyze a common weak password' },
    { label: 'Strong Password', input: { password: 'Kj$8mP!qR2vN@xL5' }, description: 'Analyze a strong password' },
  ],
};
