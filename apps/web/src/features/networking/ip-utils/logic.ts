export interface IpAnalysis {
  ip: string;
  version: 4 | 6;
  isValid: boolean;
  binary: string;
  decimal: string;
  hex: string;
  ipClass: string;
  isPrivate: boolean;
  isLoopback: boolean;
  isMulticast: boolean;
  networkType: string;
}

const IPV4_REGEX = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
const IPV6_REGEX = /^([0-9a-fA-F]{0,4}:){2,7}[0-9a-fA-F]{0,4}$/;

export function analyzeIp(ip: string): IpAnalysis {
  const trimmed = ip.trim();

  if (IPV4_REGEX.test(trimmed)) return analyzeIpv4(trimmed);
  if (IPV6_REGEX.test(trimmed) || trimmed.includes(':')) return analyzeIpv6(trimmed);
  throw new Error('Invalid IP address format');
}

function analyzeIpv4(ip: string): IpAnalysis {
  const parts = ip.split('.').map(Number);
  if (parts.some((p) => p! < 0 || p! > 255)) throw new Error('IPv4 octets must be 0-255');
  const first = parts[0]!;

  const num = ((parts[0]! << 24) | (parts[1]! << 16) | (parts[2]! << 8) | parts[3]!) >>> 0;
  const binary = parts.map((p) => p!.toString(2).padStart(8, '0')).join('.');
  const decimal = num.toString();
  const hex = '0x' + num.toString(16).padStart(8, '0').toUpperCase();

  let ipClass = 'E';
  if (first < 128) ipClass = 'A';
  else if (first < 192) ipClass = 'B';
  else if (first < 224) ipClass = 'C';
  else if (first < 240) ipClass = 'D';

  const isPrivate = first === 10 || (first === 172 && parts[1]! >= 16 && parts[1]! <= 31) || (first === 192 && parts[1] === 168);
  const isLoopback = first === 127;
  const isMulticast = first >= 224 && first <= 239;

  let networkType = 'Public';
  if (isPrivate) networkType = 'Private (RFC 1918)';
  else if (isLoopback) networkType = 'Loopback';
  else if (isMulticast) networkType = 'Multicast';
  else if (first === 169 && parts[1] === 254) networkType = 'Link-Local';

  return { ip, version: 4, isValid: true, binary, decimal, hex, ipClass, isPrivate, isLoopback, isMulticast, networkType };
}

function analyzeIpv6(ip: string): IpAnalysis {
  const expanded = expandIpv6(ip);
  const binary = expanded.split(':').map((g) => parseInt(g, 16).toString(2).padStart(16, '0')).join(':');
  const isLoopback = expanded === '0000:0000:0000:0000:0000:0000:0000:0001';
  const isMulticast = expanded.startsWith('ff');
  const isPrivate = expanded.startsWith('fc') || expanded.startsWith('fd');

  let networkType = 'Global Unicast';
  if (isLoopback) networkType = 'Loopback';
  else if (isMulticast) networkType = 'Multicast';
  else if (isPrivate) networkType = 'Unique Local';
  else if (expanded.startsWith('fe80')) networkType = 'Link-Local';

  return { ip, version: 6, isValid: true, binary, decimal: 'N/A', hex: expanded, ipClass: 'N/A', isPrivate, isLoopback, isMulticast, networkType };
}

function expandIpv6(ip: string): string {
  let groups = ip.split(':');
  const emptyIndex = groups.indexOf('');
  if (emptyIndex !== -1) {
    const before = groups.slice(0, emptyIndex);
    const after = groups.slice(emptyIndex + 1).filter(Boolean);
    const missing = 8 - before.length - after.length;
    groups = [...before, ...Array(missing).fill('0'), ...after];
  }
  return groups.map((g) => g.padStart(4, '0')).join(':');
}
