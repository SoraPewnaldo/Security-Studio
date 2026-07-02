export type AesAlgorithm = 'AES-GCM' | 'AES-CBC';
export type ProcessMode = 'encrypt' | 'decrypt';

// Helper to derive a 256-bit key from a password using PBKDF2
async function deriveKey(password: string, salt: Uint8Array, alg: AesAlgorithm): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
  );
  
  return window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt as any,
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: alg, length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

// Convert bytes to Base64
function bytesToBase64(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i] || 0);
  }
  return window.btoa(binary);
}

// Convert Base64 to bytes
function base64ToBytes(base64: string): Uint8Array {
  const binary = window.atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

export async function processAes(mode: ProcessMode, alg: AesAlgorithm, text: string, password: string): Promise<string> {
  if (!text.trim()) throw new Error('Input text is required');
  if (!password.trim()) throw new Error('Password is required');

  const enc = new TextEncoder();
  const dec = new TextDecoder();

  if (mode === 'encrypt') {
    // Generate random salt and IV
    const salt = window.crypto.getRandomValues(new Uint8Array(16));
    const iv = window.crypto.getRandomValues(new Uint8Array(alg === 'AES-GCM' ? 12 : 16));
    
    const key = await deriveKey(password, salt, alg);
    
    const encryptedBuffer = await window.crypto.subtle.encrypt(
      { name: alg, iv: iv },
      key,
      enc.encode(text)
    );
    
    // Combine Salt + IV + Ciphertext into a single buffer
    const encryptedBytes = new Uint8Array(encryptedBuffer);
    const combined = new Uint8Array(salt.length + iv.length + encryptedBytes.length);
    combined.set(salt, 0);
    combined.set(iv, salt.length);
    combined.set(encryptedBytes, salt.length + iv.length);
    
    return bytesToBase64(combined);
  } else {
    // Decrypt
    let combined: Uint8Array;
    try {
      combined = base64ToBytes(text.trim());
    } catch {
      throw new Error('Input must be a valid Base64 string');
    }

    const ivLength = alg === 'AES-GCM' ? 12 : 16;
    if (combined.length < 16 + ivLength) {
      throw new Error('Ciphertext is too short (missing salt or IV)');
    }

    const salt = combined.slice(0, 16);
    const iv = combined.slice(16, 16 + ivLength);
    const ciphertext = combined.slice(16 + ivLength);

    const key = await deriveKey(password, salt, alg);
    
    try {
      const decryptedBuffer = await window.crypto.subtle.decrypt(
        { name: alg, iv: iv },
        key,
        ciphertext
      );
      return dec.decode(decryptedBuffer);
    } catch {
      throw new Error('Decryption failed (incorrect password or corrupted data)');
    }
  }
}
