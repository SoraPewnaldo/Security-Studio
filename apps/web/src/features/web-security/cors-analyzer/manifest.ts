import type { ToolManifest } from '@security-studio/types';

export const manifest: ToolManifest = {
  id: 'cors-analyzer',
  name: 'CORS Analyzer',
  description: 'Analyze Cross-Origin Resource Sharing (CORS) HTTP headers for security risks.',
  category: 'web-security',
  tags: ['cors', 'security', 'headers', 'web', 'cross-origin'],
  keywords: ['cors', 'access-control', 'security', 'headers', 'cross-origin'],
  version: '1.0.0',
  author: 'Security Studio',
  icon: 'Network',
  shortcuts: [
    { label: 'Analyze', keys: 'Ctrl+Enter', action: 'analyze' },
  ],
  examples: [
    {
      label: 'Dangerous Configuration',
      input: { 
        headers: 'HTTP/1.1 200 OK\nAccess-Control-Allow-Origin: *\nAccess-Control-Allow-Credentials: true' 
      },
      description: 'Analyze a highly permissive and dangerous CORS setup.'
    },
    {
      label: 'Secure Configuration',
      input: { 
        headers: 'HTTP/1.1 200 OK\nAccess-Control-Allow-Origin: https://app.example.com\nAccess-Control-Allow-Methods: GET, POST\nAccess-Control-Allow-Credentials: true' 
      },
      description: 'Analyze a properly restricted CORS setup.'
    }
  ]
};
