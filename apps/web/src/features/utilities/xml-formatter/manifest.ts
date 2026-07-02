import type { ToolManifest } from '@security-studio/types';

export const manifest: ToolManifest = {
  id: 'xml-formatter',
  name: 'XML Formatter',
  description: 'Format, indent, and prettify XML documents',
  category: 'utilities',
  tags: ['xml', 'format', 'prettify', 'indent', 'minify'],
  keywords: ['xml', 'format', 'pretty print', 'indent', 'minify'],
  version: '1.0.0',
  author: 'Security Studio',
  icon: 'Code2',
  shortcuts: [
    { label: 'Format', keys: 'Ctrl+Enter', action: 'format' },
  ],
  examples: [
    {
      label: 'Simple XML',
      input: { xml: '<root><child>value</child><child>another</child></root>', indent: 2 },
      description: 'Format a simple unindented XML string'
    },
    {
      label: 'XML with Declaration',
      input: { xml: '<?xml version="1.0" encoding="UTF-8"?><catalog><book id="bk101"><author>Gambardella</author><title>XML Guide</title></book></catalog>', indent: 4 },
      description: 'Format XML with processing instruction and attributes'
    },
    {
      label: 'Invalid XML',
      input: { xml: '<root><child>value</root>', indent: 2 },
      description: 'Demonstrates error handling for malformed XML'
    },
  ],
};
