import type { ToolManifest } from '@security-studio/types';

export const manifest: ToolManifest = {
  id: 'base64',
  name: 'Base64 Encoder/Decoder',
  description: 'Encode and decode Base64 strings',
  category: 'encoding',
  tags: ['base64', 'encode', 'decode'],
  keywords: ['base64', 'encoding', 'decoding', 'convert', 'binary'],
  version: '1.0.0',
  author: 'Security Studio',
  icon: 'FileCode',
  shortcuts: [
    { label: 'Encode', keys: 'Ctrl+Enter', action: 'encode' },
    { label: 'Decode', keys: 'Ctrl+Shift+Enter', action: 'decode' },
  ],
  examples: [
    { label: 'Hello World', input: { text: 'Hello, World!', mode: 'encode' }, description: 'Encode a simple string' },
    { label: 'Decode Base64', input: { text: 'SGVsbG8sIFdvcmxkIQ==', mode: 'decode' }, description: 'Decode a Base64 string' },
  ],
};
