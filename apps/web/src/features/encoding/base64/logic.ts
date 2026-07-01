export function encodeBase64(input: string): string {
  try {
    return btoa(unescape(encodeURIComponent(input)));
  } catch {
    throw new Error('Failed to encode: Input contains invalid characters');
  }
}

export function decodeBase64(input: string): string {
  try {
    return decodeURIComponent(escape(atob(input.trim())));
  } catch {
    throw new Error('Failed to decode: Input is not valid Base64');
  }
}
