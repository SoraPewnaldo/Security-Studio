export interface DnsResponse {
  Status: number;
  TC: boolean;
  RD: boolean;
  RA: boolean;
  AD: boolean;
  CD: boolean;
  Question: Array<{ name: string; type: number }>;
  Answer?: Array<{ name: string; type: number; TTL: number; data: string }>;
  Authority?: Array<{ name: string; type: number; TTL: number; data: string }>;
}

export type DnsRecordType = 'A' | 'AAAA' | 'CNAME' | 'MX' | 'NS' | 'TXT' | 'SOA' | 'ANY';

export async function resolveDns(domain: string, recordType: DnsRecordType): Promise<DnsResponse> {
  const cleanDomain = domain.trim().replace(/^https?:\/\//, '').split('/')[0];
  if (!cleanDomain) throw new Error('Valid domain is required');

  const url = `/api/networking/dns?domain=${encodeURIComponent(cleanDomain)}&type=${recordType}`;
  
  const response = await fetch(url, {
    headers: {
      'Accept': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`DNS resolution failed: ${response.status} ${response.statusText}`);
  }

  const json = await response.json();
  if (!json.success) throw new Error(json.error || 'DNS resolution failed');
  return json.data;
}
