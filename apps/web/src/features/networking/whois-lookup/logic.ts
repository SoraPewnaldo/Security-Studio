export interface RdapResponse {
  ldhName?: string;
  status?: string[];
  events?: Array<{ eventAction: string; eventDate: string }>;
  entities?: Array<{
    roles?: string[];
    vcardArray?: any[];
    entities?: any[];
  }>;
  nameservers?: Array<{ ldhName: string }>;
  [key: string]: any; // Allow other properties for full dump
}

export interface ParsedWhois {
  domain: string;
  registrar: string;
  status: string[];
  creationDate: string;
  expirationDate: string;
  updatedDate: string;
  nameservers: string[];
  raw: any;
}

export async function lookupRdap(domain: string): Promise<ParsedWhois> {
  const cleanDomain = domain.trim().replace(/^https?:\/\//, '').split('/')[0];
  if (!cleanDomain) throw new Error('Valid domain is required');

  const url = `/api/networking/whois?domain=${encodeURIComponent(cleanDomain)}`;

  const response = await fetch(url, {
    headers: {
      'Accept': 'application/rdap+json'
    }
  });

  if (!response.ok) {
    if (response.status === 404) throw new Error('Domain not found or not registered.');
    throw new Error(`RDAP Lookup failed: ${response.status} ${response.statusText}`);
  }

  const json = await response.json();
  if (!json.success) throw new Error(json.error || 'RDAP Lookup failed');
  const data: RdapResponse = json.data;
  
  // Extract common fields
  const parsed: ParsedWhois = {
    domain: data.ldhName || cleanDomain,
    registrar: 'Unknown',
    status: data.status || [],
    creationDate: 'Unknown',
    expirationDate: 'Unknown',
    updatedDate: 'Unknown',
    nameservers: (data.nameservers || []).map(ns => ns.ldhName),
    raw: data
  };

  // Extract Dates
  if (data.events) {
    for (const event of data.events) {
      if (event.eventAction === 'registration') parsed.creationDate = event.eventDate;
      if (event.eventAction === 'expiration') parsed.expirationDate = event.eventDate;
      if (event.eventAction === 'last changed') parsed.updatedDate = event.eventDate;
    }
  }

  // Extract Registrar
  if (data.entities) {
    const registrarEntity = data.entities.find(e => e.roles && e.roles.includes('registrar'));
    if (registrarEntity && registrarEntity.vcardArray && registrarEntity.vcardArray.length > 1) {
      const vcards = registrarEntity.vcardArray[1];
      const fnEntry = vcards.find((v: any) => v[0] === 'fn');
      if (fnEntry && fnEntry[3]) {
        parsed.registrar = fnEntry[3];
      }
    }
  }

  return parsed;
}
