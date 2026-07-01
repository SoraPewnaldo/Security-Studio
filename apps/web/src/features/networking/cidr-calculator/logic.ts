export interface CidrResult {
  network: string;
  broadcast: string;
  subnetMask: string;
  wildcardMask: string;
  firstHost: string;
  lastHost: string;
  totalHosts: number;
  usableHosts: number;
  prefix: number;
  binary: string;
  ipClass: string;
  isPrivate: boolean;
}

export function parseCidr(input: string): CidrResult {
  const match = input.trim().match(/^(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})\/(\d{1,2})$/);
  if (!match) throw new Error('Invalid CIDR notation. Expected format: x.x.x.x/y');

  const ip = match[1]!;
  const prefix = parseInt(match[2]!, 10);
  if (prefix < 0 || prefix > 32) throw new Error('Prefix must be between 0 and 32');

  const ipNum = ipToNum(ip);
  const mask = prefix === 0 ? 0 : (~0 << (32 - prefix)) >>> 0;
  const networkNum = (ipNum & mask) >>> 0;
  const broadcastNum = (networkNum | ~mask) >>> 0;

  const totalHosts = Math.pow(2, 32 - prefix);
  const usableHosts = prefix <= 30 ? totalHosts - 2 : prefix === 31 ? 2 : 1;

  const firstOctet = (ipNum >>> 24) & 0xff;
  let ipClass = 'E';
  if (firstOctet < 128) ipClass = 'A';
  else if (firstOctet < 192) ipClass = 'B';
  else if (firstOctet < 224) ipClass = 'C';
  else if (firstOctet < 240) ipClass = 'D';

  const isPrivate =
    (firstOctet === 10) ||
    (firstOctet === 172 && ((ipNum >>> 16) & 0xff) >= 16 && ((ipNum >>> 16) & 0xff) <= 31) ||
    (firstOctet === 192 && ((ipNum >>> 16) & 0xff) === 168);

  return {
    network: numToIp(networkNum),
    broadcast: numToIp(broadcastNum),
    subnetMask: numToIp(mask),
    wildcardMask: numToIp(~mask >>> 0),
    firstHost: numToIp(networkNum + 1),
    lastHost: numToIp(broadcastNum - 1),
    totalHosts,
    usableHosts: Math.max(usableHosts, 0),
    prefix,
    binary: ipToBinary(ip),
    ipClass,
    isPrivate,
  };
}

function ipToNum(ip: string): number {
  const parts = ip.split('.').map(Number);
  if (parts.length !== 4 || parts.some((p) => isNaN(p!) || p! < 0 || p! > 255)) {
    throw new Error('Invalid IP address');
  }
  return ((parts[0]! << 24) | (parts[1]! << 16) | (parts[2]! << 8) | parts[3]!) >>> 0;
}

function numToIp(num: number): string {
  return [(num >>> 24) & 0xff, (num >>> 16) & 0xff, (num >>> 8) & 0xff, num & 0xff].join('.');
}

function ipToBinary(ip: string): string {
  return ip.split('.').map((octet) => parseInt(octet, 10).toString(2).padStart(8, '0')).join('.');
}
