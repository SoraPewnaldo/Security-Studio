import type { ToolManifest } from '@security-studio/types';

export const manifest: ToolManifest = {
  id: 'rsa-generator',
  name: 'RSA Key Generator',
  description: 'Generate RSA key pairs (Public/Private) for encryption or digital signatures.',
  category: 'cryptography',
  tags: ['rsa', 'key', 'generator', 'crypto', 'pem'],
  keywords: ['rsa', 'key', 'generator', 'public key', 'private key', 'pem'],
  version: '1.0.0',
  author: 'Security Studio',
  icon: 'KeyRound',
  shortcuts: [
    { label: 'Generate', keys: 'Ctrl+Enter', action: 'generate' },
  ],
  examples: [
    {
      label: 'Standard 2048-bit Key',
      input: { modulusLength: 2048, format: 'pkcs8' },
      description: 'Generate a standard 2048-bit RSA key pair in PKCS#8 format.'
    }
  ]
};
