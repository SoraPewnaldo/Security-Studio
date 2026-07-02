import type { ToolManifest } from '@security-studio/types';

export const manifest: ToolManifest = {
  id: 'unicode-converter',
  name: 'Unicode Converter',
  description: 'Convert text to Unicode escape sequences and vice versa',
  category: 'encoding',
  tags: ['unicode', 'escape', 'utf', 'encode', 'decode'],
  keywords: ['unicode', 'escape', 'utf16', 'code point', 'convert'],
  version: '1.0.0',
  author: 'Security Studio',
  icon: 'Globe',
  shortcuts: [
    { label: 'Convert', keys: 'Ctrl+Enter', action: 'convert' },
  ],
  examples: [
    { label: 'Text to Unicode', input: { text: 'Hello 👋', mode: 'encode' }, description: 'Convert text including emoji to Unicode escapes' },
    { label: 'Unicode to Text', input: { text: '\\u0048\\u0065\\u006c\\u006c\\u006f', mode: 'decode' }, description: 'Decode Unicode escape sequences back to text' },
    { label: 'Mixed CJK Characters', input: { text: '日本語テスト', mode: 'encode' }, description: 'Convert Japanese characters to Unicode code points' },
  ],
};
