import type { ToolManifest } from '@security-studio/types';

export const manifest: ToolManifest = {
  id: 'rot13',
  name: 'ROT13 / ROT-N',
  description: 'Apply ROT13 or a generic ROT-N substitution cipher to encode or decode text.',
  category: 'encoding',
  tags: ['rot13', 'rotn', 'caesar', 'cipher', 'encoding', 'substitution'],
  keywords: ['rot13', 'rot', 'caesar', 'shift', 'cipher'],
  version: '1.0.0',
  author: 'Security Studio',
  icon: 'RefreshCw',
  shortcuts: [
    { label: 'Apply', keys: 'Ctrl+Enter', action: 'apply' },
  ],
  examples: [
    { 
      label: 'Simple ROT13', 
      input: { text: 'Hello, World!', shift: 13 }, 
      description: 'Standard ROT13 encoding.' 
    },
    { 
      label: 'ROT-47 Style (Letters only)', 
      input: { text: 'This is an example', shift: 47 }, 
      description: 'Using ROT with 47 shift for letters.' 
    },
    { 
      label: 'Negative Shift', 
      input: { text: 'Veni, vidi, vici', shift: -1 }, 
      description: 'Using a negative shift (-1) which acts as ROT25.' 
    }
  ]
};
