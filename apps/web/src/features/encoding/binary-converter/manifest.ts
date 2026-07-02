import type { ToolManifest } from '@security-studio/types';

export const manifest: ToolManifest = {
  id: 'binary-converter',
  name: 'Binary Converter',
  description: 'Convert text to binary and binary back to text',
  category: 'encoding',
  tags: ['binary', 'encode', 'decode', 'text', 'convert'],
  keywords: ['binary', 'encoding', 'decoding', 'convert', 'text-to-binary'],
  version: '1.0.0',
  author: 'Security Studio',
  icon: 'Binary',
  shortcuts: [
    { label: 'Process', keys: 'Ctrl+Enter', action: 'process' },
  ],
  examples: [
    { label: 'Simple Text to Binary', input: { text: 'Hello', mode: 'text-to-binary' }, description: 'Convert a simple string to binary' },
    { label: 'Binary to Text with Emojis', input: { text: '11110000 10011111 10010001 10001101', mode: 'binary-to-text' }, description: 'Convert a binary sequence representing an emoji back to text' },
    { label: 'Invalid Binary Input', input: { text: '01001000 01100101 2', mode: 'binary-to-text' }, description: 'Demonstrate error on invalid binary input' },
  ],
};
