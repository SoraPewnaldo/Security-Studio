import type { ToolManifest } from '@security-studio/types';

export const manifest: ToolManifest = {
  id: 'hmac-generator',
  name: 'HMAC Generator',
  description: 'Generate Hash-based Message Authentication Codes (HMAC) using various algorithms.',
  category: 'cryptography',
  tags: ['hmac', 'hash', 'cryptography', 'security', 'mac'],
  version: '1.0.0',
  author: 'Security Studio',
  keywords: ['hmac', 'hash'],
  shortcuts: [],
  icon: 'Shield',
  examples: [
    {
      label: 'Simple SHA-256',
      description: 'Generates a standard SHA-256 HMAC for a simple string with a secret key.',
      input: {
        text: 'Hello, World!',
        secret: 'supersecret',
        algorithm: 'SHA-256',
        encoding: 'hex'
      }
    },
    {
      label: 'Base64 Output',
      description: 'Generates a SHA-512 HMAC and outputs the result in Base64 encoding.',
      input: {
        text: 'Data integrity matters',
        secret: 'anothersecretkey',
        algorithm: 'SHA-512',
        encoding: 'base64'
      }
    },
    {
      label: 'Invalid (Empty Secret)',
      description: 'Attempts to generate an HMAC without a secret key, resulting in an error.',
      input: {
        text: 'Missing secret key',
        secret: '',
        algorithm: 'SHA-256',
        encoding: 'hex'
      }
    }
  ]
};
