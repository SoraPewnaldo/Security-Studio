export type HashAlgorithm = 'SHA-1' | 'SHA-256' | 'SHA-384' | 'SHA-512';
export type OutputEncoding = 'hex' | 'base64';

export async function generateHmac(
  text: string,
  secret: string,
  algorithm: HashAlgorithm,
  encoding: OutputEncoding
): Promise<string> {
  if (!text) {
    throw new Error('Text input cannot be empty.');
  }
  if (!secret) {
    throw new Error('Secret key cannot be empty.');
  }

  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const textData = encoder.encode(text);

  const cryptoSubtle = typeof crypto !== 'undefined' ? crypto.subtle : (globalThis as any).crypto?.subtle;
  if (!cryptoSubtle) {
    throw new Error('Web Crypto API is not supported in this environment.');
  }

  const key = await cryptoSubtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: { name: algorithm } },
    false,
    ['sign']
  );

  const signature = await cryptoSubtle.sign('HMAC', key, textData);

  if (encoding === 'hex') {
    return Array.from(new Uint8Array(signature))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  } else if (encoding === 'base64') {
    return btoa(String.fromCharCode(...new Uint8Array(signature)));
  }

  throw new Error('Invalid output encoding.');
}
