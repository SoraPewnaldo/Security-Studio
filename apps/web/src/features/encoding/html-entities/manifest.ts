import type { ToolManifest } from '@security-studio/types';

export const manifest: ToolManifest = {
  id: 'html-entities',
  name: 'HTML Entity Encoder/Decoder',
  description: 'Encode and decode HTML entities',
  category: 'encoding',
  tags: ['html', 'entities', 'encode', 'decode', 'xss'],
  keywords: ['html', 'entity', 'escape', 'unescape', 'xss', 'sanitize', 'ampersand'],
  version: '1.0.0',
  author: 'Security Studio',
  icon: 'Code',
  shortcuts: [
    { label: 'Encode', keys: 'Ctrl+Enter', action: 'encode' },
  ],
  examples: [
    { label: 'Script tag', input: { text: '<script>alert("xss")</script>', mode: 'encode' }, description: 'Encode HTML with script tags' },
    { label: 'Encoded HTML', input: { text: '&lt;div&gt;Hello&lt;/div&gt;', mode: 'decode' }, description: 'Decode HTML entities' },
  ],
};
