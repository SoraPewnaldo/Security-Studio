import type { ToolManifest } from '@security-studio/types';

export const manifest: ToolManifest = {
  id: 'yaml-json',
  name: 'YAML ↔ JSON',
  description: 'Convert between YAML and JSON formats',
  category: 'utilities',
  tags: ['yaml', 'json', 'convert', 'format'],
  keywords: ['yaml', 'json', 'converter', 'format'],
  version: '1.0.0',
  author: 'Security Studio',
  icon: 'FileCode2',
  shortcuts: [
    { label: 'Convert', keys: 'Ctrl+Enter', action: 'convert' },
  ],
  examples: [
    {
      label: 'JSON to YAML',
      input: { text: '{\n  "name": "Security Studio",\n  "version": "1.0.0"\n}', mode: 'json-to-yaml' },
      description: 'Convert JSON to YAML'
    },
    {
      label: 'YAML to JSON',
      input: { text: 'name: Security Studio\nversion: 1.0.0', mode: 'yaml-to-json' },
      description: 'Convert YAML to JSON'
    },
    {
      label: 'Invalid Input',
      input: { text: 'name: Security Studio\n  version: 1.0.0\n    invalid', mode: 'yaml-to-json' },
      description: 'Demonstrate error on invalid YAML'
    }
  ]
};
