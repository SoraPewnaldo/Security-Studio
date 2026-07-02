export type ConversionMode = 'pem-to-der' | 'der-to-pem';

export interface PemDerResult {
  output: string;
  label?: string; // e.g. "PUBLIC KEY" extracted from PEM, or used for DER to PEM
}

// Convert PEM to DER (Hex representation for easier viewing/copying)
export function pemToDer(pem: string): PemDerResult {
  if (!pem.trim()) throw new Error('Input is required');
  
  // A PEM file contains lines between -----BEGIN X----- and -----END X-----
  const match = pem.match(/-----BEGIN ([A-Z0-9 ]+)-----\r?\n([a-zA-Z0-9+/=\r\n]+)\r?\n-----END \1-----/);
  if (!match) {
    throw new Error('Input is not a valid PEM format. Missing BEGIN/END headers or invalid Base64.');
  }

  const label = match[1];
  const base64Data = match[2]?.replace(/\s+/g, '') || '';
  
  try {
    const binaryStr = window.atob(base64Data);
    const bytes = new Uint8Array(binaryStr.length);
    for (let i = 0; i < binaryStr.length; i++) {
      bytes[i] = binaryStr.charCodeAt(i);
    }
    
    // Format bytes to Hex for DER output
    const hex = Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join(' ');
    return { output: hex.toUpperCase(), label };
  } catch (e) {
    throw new Error('Failed to decode Base64 data from PEM block.');
  }
}

// Convert DER (Hex string) to PEM
export function derToPem(hexStr: string, label: string = 'CERTIFICATE'): PemDerResult {
  if (!hexStr.trim()) throw new Error('Input is required');
  
  const cleanedHex = hexStr.replace(/\s+/g, '').replace(/0x/g, '');
  if (!/^[0-9a-fA-F]+$/.test(cleanedHex)) {
    throw new Error('DER input must be valid hexadecimal characters.');
  }
  if (cleanedHex.length % 2 !== 0) {
    throw new Error('Hex string must have an even number of characters.');
  }

  const bytes = new Uint8Array(cleanedHex.length / 2);
  for (let i = 0; i < cleanedHex.length; i += 2) {
    bytes[i / 2] = parseInt(cleanedHex.substring(i, i + 2), 16);
  }

  const binaryStr = String.fromCharCode(...bytes);
  const base64Data = window.btoa(binaryStr);
  
  // Wrap at 64 chars
  const lines = base64Data.match(/.{1,64}/g) || [];
  const pem = `-----BEGIN ${label}-----\n${lines.join('\n')}\n-----END ${label}-----`;

  return { output: pem, label };
}
