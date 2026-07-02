import type { ToolManifest } from '@security-studio/types';

export const manifest: ToolManifest = {
  id: 'aes-encrypt',
  name: 'AES Encrypt/Decrypt',
  description: 'Encrypt and decrypt data using standard AES-GCM or AES-CBC algorithms.',
  category: 'cryptography',
  tags: ['aes', 'encrypt', 'decrypt', 'crypto', 'gcm', 'cbc'],
  keywords: ['aes', 'encryption', 'decryption', 'gcm', 'cbc'],
  version: '1.0.0',
  author: 'Security Studio',
  icon: 'Lock',
  shortcuts: [
    { label: 'Process', keys: 'Ctrl+Enter', action: 'process' },
  ],
  examples: [
    {
      label: 'AES-GCM Encryption',
      input: { mode: 'encrypt', algorithm: 'AES-GCM', text: 'Secret Message', key: 'my-secret-password' },
      description: 'Encrypt a message using AES-GCM (which provides authenticated encryption).'
    }
  ]
};
