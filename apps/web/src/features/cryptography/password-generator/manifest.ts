import type { ToolManifest } from '@security-studio/types';

export const manifest: ToolManifest = {
  id: 'password-generator',
  name: 'Password Generator',
  description: 'Generate secure, configurable passwords',
  category: 'cryptography',
  tags: ['password', 'generator', 'secure', 'random'],
  keywords: ['password', 'generate', 'random', 'secure', 'entropy', 'strong'],
  version: '1.0.0',
  author: 'Security Studio',
  icon: 'KeyRound',
  shortcuts: [
    { label: 'Generate', keys: 'Ctrl+Enter', action: 'generate' },
  ],
  examples: [
    { label: 'Strong Password', input: { length: 20, uppercase: true, lowercase: true, numbers: true, symbols: true }, description: 'Generate a strong 20-character password' },
  ],
};
