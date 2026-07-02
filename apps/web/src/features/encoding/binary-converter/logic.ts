export function textToBinary(text: string): string {
  if (typeof text !== 'string') {
    throw new Error('Input must be a string');
  }
  if (!text) return '';
  const encoder = new TextEncoder();
  const bytes = encoder.encode(text);
  return Array.from(bytes).map(byte => byte.toString(2).padStart(8, '0')).join(' ');
}

export function binaryToText(binary: string): string {
  if (typeof binary !== 'string') {
    throw new Error('Input must be a string');
  }
  const trimmed = binary.trim();
  if (!trimmed) return '';

  // Check for invalid characters
  if (/[^01\s]/.test(trimmed)) {
    throw new Error('Input contains invalid characters. Only 0, 1, and spaces are allowed.');
  }

  let blocks: string[] = [];
  if (trimmed.includes(' ')) {
    blocks = trimmed.split(/\s+/);
  } else {
    if (trimmed.length % 8 !== 0) {
      throw new Error('Contiguous binary strings must be a multiple of 8 characters long.');
    }
    for (let i = 0; i < trimmed.length; i += 8) {
      blocks.push(trimmed.substring(i, i + 8));
    }
  }

  const bytes = new Uint8Array(blocks.length);
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    if (!block) continue;
    if (block.length > 8) {
      throw new Error(`Binary block '${block}' is too large (max 8 bits per byte).`);
    }
    const val = parseInt(block, 2);
    if (isNaN(val)) {
      throw new Error(`Invalid binary block: '${block}'`);
    }
    bytes[i] = val;
  }

  const decoder = new TextDecoder('utf-8', { fatal: true });
  try {
    return decoder.decode(bytes);
  } catch (e) {
    throw new Error('Invalid UTF-8 sequence in binary data.');
  }
}
