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

export async function parseCertificate(pem: string): Promise<CertDetails> {
  if (!pem.trim()) throw new Error('Certificate PEM is required');
  
  try {
    const cert = new X509Certificate(pem);
    
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
    throw new Error(`Failed to parse certificate: ${e.message}`);
  }
}
