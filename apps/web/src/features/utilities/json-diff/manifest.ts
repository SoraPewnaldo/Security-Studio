import type { ToolManifest } from '@security-studio/types';

export const manifest: ToolManifest = {
  id: 'json-diff',
  name: 'JSON Diff',
  description: 'Compare two JSON objects side-by-side to highlight additions, removals, and changes',
  category: 'utilities',
  tags: ['json', 'diff', 'compare', 'delta'],
  keywords: ['json', 'diff', 'compare', 'delta', 'changes'],
  version: '1.0.0',
  author: 'Security Studio',
  icon: 'GitCompare',
  shortcuts: [],
  examples: [
    {
      label: 'Simple Change',
      input: {
        json1: '{\n  "version": "1.0.0",\n  "name": "myapp"\n}',
        json2: '{\n  "version": "1.0.1",\n  "name": "myapp"\n}'
      },
      description: 'Compare two JSON objects with a single modified value'
    },
    {
      label: 'Nested Structural Changes',
      input: {
        json1: '{\n  "user": {\n    "id": 123,\n    "profile": {\n      "active": true,\n      "role": "admin"\n    }\n  }\n}',
        json2: '{\n  "user": {\n    "id": 123,\n    "profile": {\n      "active": false,\n      "tags": ["beta"]\n    }\n  }\n}'
      },
      description: 'Compare nested objects showing additions and removals'
    },
    {
      label: 'Invalid JSON',
      input: {
        json1: '{\n  "valid": true\n}',
        json2: '{\n  "valid": true,\n  "broken": \n}'
      },
      description: 'Shows error handling for malformed JSON'
    },
  ],
};
