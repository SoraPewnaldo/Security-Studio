import type { ToolManifest } from '@security-studio/types';

export const manifest: ToolManifest = {
  id: 'hash-generator',
  name: 'Hash Generator',
  description: 'Generate SHA-256, SHA-512, MD5, and SHA-1 hashes',
  category: 'cryptography',
  tags: ['hash', 'sha256', 'sha512', 'md5', 'sha1'],
  keywords: ['hash', 'digest', 'checksum', 'fingerprint', 'integrity'],
  version: '1.0.0',
  author: 'Security Studio',
  icon: 'Hash',
  shortcuts: [
    { label: 'Generate Hash', keys: 'Ctrl+Enter', action: 'hash' },
  ],
  examples: [
    { label: 'Hello World', input: { text: 'Hello, World!', algorithm: 'SHA-256' }, description: 'SHA-256 hash of a string' },
    { label: 'Empty String', input: { text: '', algorithm: 'MD5' }, description: 'MD5 of empty string' },
  ],
};
