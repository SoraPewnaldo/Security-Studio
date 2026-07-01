import type { ToolManifest } from '@security-studio/types';
export const manifest: ToolManifest = {
  id: 'cidr-calculator', name: 'CIDR Calculator', description: 'Calculate network ranges, broadcast, and host counts',
  category: 'networking', tags: ['cidr', 'subnet', 'network', 'ip'],
  keywords: ['cidr', 'subnet', 'network', 'mask', 'broadcast', 'ip', 'range', 'hosts'],
  version: '1.0.0', author: 'Security Studio', icon: 'Network',
  shortcuts: [{ label: 'Calculate', keys: 'Ctrl+Enter', action: 'calculate' }],
  examples: [
    { label: 'Class C', input: { cidr: '192.168.1.0/24' }, description: 'A /24 subnet with 254 usable hosts' },
    { label: 'Small Subnet', input: { cidr: '10.0.0.0/28' }, description: 'A /28 subnet with 14 usable hosts' },
  ],
};
