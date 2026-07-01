import type { ToolManifest } from '@security-studio/types';
export const manifest: ToolManifest = {
  id: 'csp-builder', name: 'CSP Builder', description: 'Build Content-Security-Policy headers interactively',
  category: 'web-security', tags: ['csp', 'content-security-policy', 'headers'],
  keywords: ['csp', 'content', 'security', 'policy', 'header', 'directive', 'xss'],
  version: '1.0.0', author: 'Security Studio', icon: 'Shield',
  shortcuts: [], examples: [{
    label: 'Strict CSP', input: { 'default-src': ["'self'"], 'script-src': ["'self'"], 'style-src': ["'self'", "'unsafe-inline'"] },
    description: 'A strict Content-Security-Policy',
  }],
};
