import type { ToolManifest } from '@security-studio/types';

export const manifest: ToolManifest = {
  id: 'hex-encoder',
  name: 'Hex Encoder/Decoder',
  description: 'Encode text to hexadecimal and decode hex back to text',
  category: 'encoding',
  tags: ['hex', 'hexadecimal', 'encode', 'decode', 'convert'],
  keywords: ['hex', 'hexadecimal', 'encoding', 'decoding', 'convert'],
  version: '1.0.0',
  author: 'Security Studio',
  icon: 'Hash',
  shortcuts: [
    { label: 'Process', keys: 'Ctrl+Enter', action: 'process' },
  ],
  examples: [
    { label: 'Text to Hex', input: { text: 'Hello, World!', mode: 'encode' }, description: 'Convert text to hexadecimal representation' },
    { label: 'Hex to Text', input: { text: '48 65 6c 6c 6f 2c 20 57 6f 72 6c 64 21', mode: 'decode' }, description: 'Decode hex bytes back to ASCII text' },
    { label: 'Invalid Hex', input: { text: 'ZZ YY GG', mode: 'decode' }, description: 'See error handling for invalid hex characters' },
  ],
};
