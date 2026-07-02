export type StateFormat = 'alphanumeric' | 'hex' | 'base64url';

export function generateOAuthState(length: number, format: StateFormat): string {
  if (length < 8) throw new Error('State length must be at least 8 characters for security');
  if (length > 1024) throw new Error('State length must be 1024 characters or less');

  const array = new Uint8Array(length);
  window.crypto.getRandomValues(array);

  if (format === 'hex') {
    return Array.from(array).map(b => b.toString(16).padStart(2, '0')).join('').substring(0, length);
  }

  if (format === 'base64url') {
    const base64 = btoa(String.fromCharCode(...array));
    const base64url = base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    return base64url.substring(0, length); // Approximate length, btoa will make it longer
  }

  // Alphanumeric
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars[(array[i] || 0) % chars.length];
  }
  return result;
}
