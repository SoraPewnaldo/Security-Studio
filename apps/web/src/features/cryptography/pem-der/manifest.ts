import type { ToolManifest } from '@security-studio/types';

export const manifest: ToolManifest = {
  id: 'pem-der',
  name: 'PEM/DER Converter',
  description: 'Convert cryptographic keys and certificates between PEM (Base64) and DER (Binary) formats.',
  category: 'cryptography',
  tags: ['pem', 'der', 'certificate', 'key', 'convert', 'crypto'],
  keywords: ['pem', 'der', 'converter', 'certificate', 'x509', 'rsa'],
  version: '1.0.0',
  author: 'Security Studio',
  icon: 'RefreshCw',
  shortcuts: [
    { label: 'Convert', keys: 'Ctrl+Enter', action: 'convert' },
  ],
  examples: [
    {
      label: 'PEM to DER',
      input: { mode: 'pem-to-der', inputStr: '-----BEGIN PUBLIC KEY-----\nMFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEEVs/o5+uQbTjL3chynL4wXgUg2R9\nq9UU8I5mEovUf86QZ7kKjCE/l3oG2jKqzO1yK+Hk9J2aQ8v3yQ==\n-----END PUBLIC KEY-----' },
      description: 'Convert a PEM encoded public key to DER Hex format.'
    }
  ]
};
