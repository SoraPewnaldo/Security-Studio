import { X509Certificate } from '@peculiar/x509';

export interface CertDetails {
  subject: string;
  issuer: string;
  serialNumber: string;
  validFrom: string;
  validTo: string;
  isExpired: boolean;
  signatureAlgorithm: string;
  publicKeyAlgorithm: string;
  sans: string[];
  thumbprintHex: string;
}

// Convert bytes to Hex (for thumbprint)
function bufToHex(buffer: ArrayBuffer): string {
  return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join(':').toUpperCase();
}

/**
 * Normalise a PEM string:
 * - Accept raw base64 without headers (we wrap them)
 * - Strip any whitespace / line-feed corruption from the body
 * - Re-wrap the base64 body at 64 chars per line
 */
export function normalizePem(raw: string): string {
  const input = raw.trim();

  // Extract header/footer if present
  const headerMatch = input.match(/-----BEGIN ([^-]+)-----/);
  const footerMatch = input.match(/-----END ([^-]+)-----/);

  let label = headerMatch ? headerMatch[1] : 'CERTIFICATE';
  let body: string;

  if (headerMatch && footerMatch) {
    // Slice out the body between header and footer
    const start = input.indexOf(headerMatch[0]) + headerMatch[0].length;
    const end = input.indexOf(footerMatch[0]);
    body = input.slice(start, end);
  } else {
    // Treat the entire input as raw base64
    body = input;
  }

  // Strip everything that isn't valid base64 (A-Z a-z 0-9 + / =)
  body = body.replace(/[^A-Za-z0-9+/=]/g, '');

  if (!body) throw new Error('No valid base64 certificate data found. Make sure you paste a complete PEM certificate.');

  // Re-wrap at 64 chars per line (standard PEM)
  const wrapped = body.match(/.{1,64}/g)?.join('\n') ?? body;

  return `-----BEGIN ${label}-----\n${wrapped}\n-----END ${label}-----`;
}

export async function parseCertificate(pem: string): Promise<CertDetails> {
  if (!pem.trim()) throw new Error('Certificate PEM is required');
  
  try {
    const normalized = normalizePem(pem);
    const cert = new X509Certificate(normalized);
    
    // Compute thumbprint (SHA-256)
    const thumbprintBuffer = await cert.getThumbprint("SHA-256");
    const thumbprintHex = bufToHex(thumbprintBuffer);

    // Get Subject Alternative Names (Extension OID: 2.5.29.17)
    const sans: string[] = [];
    const sanExt = cert.extensions.find(e => e.type === "2.5.29.17");
    if (sanExt && 'names' in sanExt) {
      const names = (sanExt as any).names;
      if (Array.isArray(names)) {
        names.forEach(n => {
          if (n.type === 'dNSName') sans.push(`DNS: ${n.value}`);
          else if (n.type === 'iPAddress') sans.push(`IP: ${n.value}`);
          else if (n.type === 'rfc822Name') sans.push(`Email: ${n.value}`);
          else sans.push(`${n.type}: ${n.value}`);
        });
      }
    }

    const now = new Date();

    return {
      subject: cert.subject,
      issuer: cert.issuer,
      serialNumber: cert.serialNumber,
      validFrom: cert.notBefore.toISOString(),
      validTo: cert.notAfter.toISOString(),
      isExpired: now > cert.notAfter,
      signatureAlgorithm: cert.signatureAlgorithm.name || (cert.signatureAlgorithm as any).algorithm,
      publicKeyAlgorithm: cert.publicKey.algorithm.name,
      sans,
      thumbprintHex
    };
  } catch (e: any) {
    // Re-throw with a cleaner message — strip internal library noise
    const msg: string = e.message ?? '';
    if (msg.includes('inconsistent offset') || msg.includes('End of input') || msg.includes('length values')) {
      throw new Error('The certificate data appears to be corrupted or incomplete. Try fetching it fresh from the server, or ensure the PEM was copied in full without extra characters.');
    }
    throw new Error(`Failed to parse certificate: ${msg}`);
  }
}
