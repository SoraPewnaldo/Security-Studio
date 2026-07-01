export function encodeUrl(input: string): string {
  return encodeURIComponent(input);
}

export function decodeUrl(input: string): string {
  try {
    return decodeURIComponent(input.trim());
  } catch {
    throw new Error('Failed to decode: Input is not valid URL-encoded text');
  }
}

export function encodeFullUrl(input: string): string {
  return encodeURI(input);
}

export function decodeFullUrl(input: string): string {
  try {
    return decodeURI(input.trim());
  } catch {
    throw new Error('Failed to decode: Input is not a valid encoded URI');
  }
}
