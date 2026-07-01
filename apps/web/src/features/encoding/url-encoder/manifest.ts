import type { ToolManifest } from '@security-studio/types';

export const manifest: ToolManifest = {
  id: 'url-encoder',
  name: 'URL Encoder/Decoder',
  description: 'Encode and decode URL components',
  category: 'encoding',
  tags: ['url', 'encode', 'decode', 'percent-encoding'],
  keywords: ['url', 'uri', 'percent', 'encoding', 'query', 'parameter'],
  version: '1.0.0',
  author: 'Security Studio',
  icon: 'Link',
  shortcuts: [
    { label: 'Encode', keys: 'Ctrl+Enter', action: 'encode' },
  ],
  examples: [
    { label: 'URL with spaces', input: { text: 'hello world & foo=bar', mode: 'encode' }, description: 'Encode special characters' },
    { label: 'Encoded URL', input: { text: 'hello%20world%20%26%20foo%3Dbar', mode: 'decode' }, description: 'Decode percent-encoded string' },
  ],
};
