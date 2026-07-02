import { Router } from 'express';
import https from 'node:https';
import http from 'node:http';
import net from 'node:net';
import type { ApiResponse } from '@security-studio/types';

const router = Router();

/**
 * Robust HTTP/HTTPS GET client that explicitly follows redirects
 * and uses standard Node.js resolver.
 */
function httpsGet(
  urlStr: string,
  headers: Record<string, string> = {},
  redirectCount = 0
): Promise<{ status: number; body: string }> {
  if (redirectCount > 5) {
    return Promise.reject(new Error('Too many redirects'));
  }
  return new Promise((resolve, reject) => {
    try {
      const url = new URL(urlStr);
      const client = url.protocol === 'https:' ? https : http;
      
      const req = client.get(url, { headers }, (res) => {
        if (
          res.statusCode &&
          res.statusCode >= 300 &&
          res.statusCode < 400 &&
          res.headers.location
        ) {
          const redirectUrl = new URL(res.headers.location, urlStr).toString();
          httpsGet(redirectUrl, headers, redirectCount + 1)
            .then(resolve)
            .catch(reject);
          return;
        }

        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          resolve({
            status: res.statusCode || 200,
            body: data,
          });
        });
      });

      req.on('error', (err) => {
        reject(err);
      });
      req.end();
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Query WHOIS server over TCP Port 43
 */
function queryWhoisPort43(server: string, query: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const socket = net.createConnection(43, server, () => {
      socket.write(query + '\r\n');
    });

    let buffer = '';
    socket.on('data', (chunk) => {
      buffer += chunk.toString();
    });

    socket.on('end', () => {
      resolve(buffer);
    });

    socket.on('error', (err) => {
      reject(err);
    });
  });
}

/**
 * Find the authoritative WHOIS server for a TLD by querying IANA
 */
async function getAuthoritativeWhoisServer(tld: string): Promise<string | null> {
  try {
    const res = await queryWhoisPort43('whois.iana.org', tld);
    const lines = res.split(/\r?\n/);
    for (const line of lines) {
      if (line.toLowerCase().startsWith('whois:')) {
        return line.split(':')[1]?.trim() || null;
      }
    }
  } catch (e) {
    console.error(`[API Error] Failed to get WHOIS server from IANA for TLD ${tld}:`, e);
  }
  return null;
}

/**
 * Parse raw text WHOIS output into a pseudo-RDAP JSON structure
 */
function parseRawWhois(rawText: string, domain: string): any {
  const lines = rawText.split(/\r?\n/);
  const data: any = {
    ldhName: domain,
    status: [] as string[],
    events: [] as any[],
    entities: [] as any[],
    nameservers: [] as any[],
    rawText: rawText,
  };

  for (const line of lines) {
    const parts = line.split(':');
    if (parts.length < 2) continue;
    const key = parts[0]?.trim().toLowerCase();
    const val = parts.slice(1).join(':').trim();

    if (key === 'domain name') {
      data.ldhName = val;
    } else if (key === 'creation date' || key === 'created') {
      data.events.push({ eventAction: 'registration', eventDate: val });
    } else if (key === 'registry expiry date' || key === 'expiration date' || key === 'expires') {
      data.events.push({ eventAction: 'expiration', eventDate: val });
    } else if (key === 'updated date' || key === 'changed') {
      data.events.push({ eventAction: 'last changed', eventDate: val });
    } else if (key === 'registrar') {
      data.entities.push({
        roles: ['registrar'],
        vcardArray: [
          'vcard',
          [
            ['fn', {}, 'text', val],
          ],
        ],
      });
    } else if (key === 'name server' || key === 'nserver') {
      data.nameservers.push({ ldhName: val.toLowerCase() });
    } else if (key === 'domain status') {
      data.status.push(val.split(' ')[0]);
    }
  }

  return data;
}

// GET /api/networking/dns — Query DNS records (proxied to google dns)
router.get('/dns', async (req, res, next) => {
  try {
    const domain = req.query['domain'] as string;
    const type = (req.query['type'] as string) || 'A';

    if (!domain) {
      res.status(400).json({ success: false, error: 'Domain query parameter is required' });
      return;
    }

    const url = `https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=${type}`;
    const headers = {
      'Accept': 'application/json',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) SecurityStudio/1.0.0',
    };

    const { status, body } = await httpsGet(url, headers);
    if (status !== 200) {
      throw new Error(`DNS resolution failed with status: ${status}`);
    }

    const data = JSON.parse(body);
    const responseBody: ApiResponse<any> = {
      success: true,
      data,
    };
    res.json(responseBody);
  } catch (error) {
    next(error);
  }
});

// GET /api/networking/whois — RDAP domain query (proxied to rdap.org with TCP fallback)
router.get('/whois', async (req, res, next) => {
  try {
    const domain = req.query['domain'] as string;

    if (!domain) {
      res.status(400).json({ success: false, error: 'Domain query parameter is required' });
      return;
    }

    const cleanDomain = domain.trim().replace(/^https?:\/\//, '').split('/')[0] || '';
    const url = `https://rdap.org/domain/${encodeURIComponent(cleanDomain)}`;
    const headers = {
      'Accept': 'application/rdap+json',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) SecurityStudio/1.0.0',
    };

    try {
      const { status, body } = await httpsGet(url, headers);
      if (status === 200) {
        const data = JSON.parse(body);
        const responseBody: ApiResponse<any> = {
          success: true,
          data,
        };
        res.json(responseBody);
        return;
      }
      
      console.warn(`[API Warning] RDAP failed with status ${status}, attempting TCP WHOIS fallback...`);
    } catch (e) {
      console.warn('[API Warning] RDAP fetch errored, attempting TCP WHOIS fallback...', e);
    }

    // Fallback: Query via Port 43 TCP WHOIS
    const tld = cleanDomain.split('.').pop() || '';
    const whoisServer = await getAuthoritativeWhoisServer(tld);
    
    if (!whoisServer) {
      throw new Error('Could not resolve authoritative WHOIS server for TLD');
    }

    const rawWhoisText = await queryWhoisPort43(whoisServer, cleanDomain);
    const parsedData = parseRawWhois(rawWhoisText, cleanDomain);

    const responseBody: ApiResponse<any> = {
      success: true,
      data: parsedData,
    };
    res.json(responseBody);
  } catch (error) {
    next(error);
  }
});

// GET /api/networking/asn — RDAP ASN query (proxied to rdap.org)
router.get('/asn', async (req, res, next) => {
  try {
    const asn = req.query['asn'] as string;

    if (!asn) {
      res.status(400).json({ success: false, error: 'ASN query parameter is required' });
      return;
    }

    const cleanAsn = asn.trim().toUpperCase().replace(/^AS/, '');
    const url = `https://rdap.org/autnum/${cleanAsn}`;
    const headers = {
      'Accept': 'application/rdap+json',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) SecurityStudio/1.0.0',
    };

    const { status, body } = await httpsGet(url, headers);
    if (status === 404) {
      res.status(404).json({ success: false, error: 'ASN not found or not allocated.' });
      return;
    } else if (status !== 200) {
      throw new Error(`RDAP Lookup failed with status: ${status}`);
    }

    const data = JSON.parse(body);
    const responseBody: ApiResponse<any> = {
      success: true,
      data,
    };
    res.json(responseBody);
  } catch (error) {
    next(error);
  }
});

export default router;
