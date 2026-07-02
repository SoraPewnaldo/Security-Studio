export interface ParsedAsn {
  asn: string;
  name: string;
  country: string;
  registry: string;
  registrationDate: string;
  lastChangedDate: string;
  raw: any;
}

export async function lookupAsn(query: string): Promise<ParsedAsn> {
  const cleanAsn = query.trim().toUpperCase().replace(/^AS/, '');
  if (!/^\d+$/.test(cleanAsn)) throw new Error('Valid ASN number is required (e.g., 15169 or AS15169)');

  const url = `/api/networking/asn?asn=${cleanAsn}`;

  const response = await fetch(url, {
    headers: {
      'Accept': 'application/rdap+json'
    }
  });

  if (!response.ok) {
    if (response.status === 404) throw new Error('ASN not found or not allocated.');
    throw new Error(`RDAP Lookup failed: ${response.status} ${response.statusText}`);
  }

  const json = await response.json();
  if (!json.success) throw new Error(json.error || 'ASN lookup failed');
  const data = json.data;
  
  const parsed: ParsedAsn = {
    asn: `AS${data.handle || cleanAsn}`,
    name: data.name || 'Unknown',
    country: data.country || 'Unknown',
    registry: data.port43 || 'Unknown',
    registrationDate: 'Unknown',
    lastChangedDate: 'Unknown',
    raw: data
  };

  // Clean up port43 string to act as registry identifier
  if (parsed.registry && parsed.registry.includes('whois.')) {
    parsed.registry = parsed.registry.replace('whois.', '').replace('.net', '').toUpperCase();
  } else if (!parsed.registry && url.includes('ripe')) {
    parsed.registry = 'RIPE';
  } else if (!parsed.registry && url.includes('arin')) {
    parsed.registry = 'ARIN';
  }

  // Extract Dates
  if (data.events) {
    for (const event of data.events) {
      if (event.eventAction === 'registration') parsed.registrationDate = event.eventDate;
      if (event.eventAction === 'last changed') parsed.lastChangedDate = event.eventDate;
    }
  }

  return parsed;
}
