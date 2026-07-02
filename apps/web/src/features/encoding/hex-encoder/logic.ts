export function textToHex(text: string, separator = ' '): string {
  if (!text && text !== '') throw new Error('Input must be a string');
  const encoder = new TextEncoder();
  const bytes = encoder.encode(text);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join(separator);
}

export function hexToText(hex: string): string {
  const cleaned = hex.replace(/\s+/g, '');
  if (!cleaned) return '';

  if (!/^[0-9a-fA-F]*$/.test(cleaned)) {
    throw new Error('Input contains invalid hex characters. Only 0-9 and A-F are allowed.');
  }

  if (cleaned.length % 2 !== 0) {
    throw new Error('Hex string must have an even number of characters (each byte = 2 hex digits).');
  }

  const bytes = new Uint8Array(cleaned.length / 2);
  for (let i = 0; i < cleaned.length; i += 2) {
    bytes[i / 2] = parseInt(cleaned.substring(i, i + 2), 16);
  }

  const decoder = new TextDecoder('utf-8', { fatal: true });
  try {
    return decoder.decode(bytes);
  } catch {
    throw new Error('Invalid UTF-8 sequence in hex data.');
  }
}
