import { formatXml } from '../../utilities/xml-formatter/logic';

// Helper to base64 decode with fallback for standard vs URL-safe base64
function decodeBase64(str: string): Uint8Array {
  // Try standard base64 decode
  const binaryString = window.atob(str.replace(/-/g, '+').replace(/_/g, '/'));
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export async function decodeSaml(input: string): Promise<string> {
  if (!input.trim()) return '';

  // 1. URL Decode (in case it's from a query param)
  let processed = input.trim();
  try {
    if (processed.includes('%')) {
      processed = decodeURIComponent(processed);
    }
  } catch {
    // Ignore URL decode errors
  }

  // 2. Base64 Decode
  let bytes: Uint8Array;
  try {
    bytes = decodeBase64(processed);
  } catch (e) {
    throw new Error('Input is not valid Base64');
  }

  // 3. Decompress if Deflated (SAML HTTP-Redirect binding uses Deflate)
  let xmlString = '';
  try {
    // Try to inflate assuming raw DEFLATE (RFC 1951)
    const ds = new DecompressionStream('deflate-raw');
    const writer = ds.writable.getWriter();
    writer.write(bytes as any);
    writer.close();
    
    const reader = ds.readable.getReader();
    const chunks: Uint8Array[] = [];
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value) chunks.push(value);
    }
    
    // Concat chunks
    const totalLength = chunks.reduce((acc, c) => acc + c.length, 0);
    const result = new Uint8Array(totalLength);
    let offset = 0;
    for (const chunk of chunks) {
      result.set(chunk, offset);
      offset += chunk.length;
    }
    xmlString = new TextDecoder().decode(result);
  } catch (e) {
    // If inflate fails, assume it was uncompressed (SAML HTTP-POST binding)
    xmlString = new TextDecoder().decode(bytes);
  }

  // 4. Validate and Format XML
  if (!xmlString.includes('<')) {
    throw new Error('Decoded output does not appear to be XML');
  }

  try {
    return formatXml(xmlString, 2);
  } catch (e) {
    // Return unformatted if parsing fails
    return xmlString;
  }
}
