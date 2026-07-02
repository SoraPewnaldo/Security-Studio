import * as jose from 'jose';

export async function verifyJwt(token: string, key: string, alg: string): Promise<any> {
  if (!token.trim()) throw new Error('Token is required');
  if (!key.trim()) throw new Error('Verification key/secret is required');

  try {
    if (alg.startsWith('HS')) {
      const secret = new TextEncoder().encode(key);
      const { payload, protectedHeader } = await jose.jwtVerify(token, secret);
      return { payload, protectedHeader };
    } else if (alg.startsWith('RS') || alg.startsWith('PS') || alg.startsWith('ES')) {
      const publicKey = await jose.importSPKI(key, alg);
      const { payload, protectedHeader } = await jose.jwtVerify(token, publicKey);
      return { payload, protectedHeader };
    } else {
      throw new Error(`Algorithm ${alg} is not supported by this tool yet`);
    }
  } catch (e: any) {
    throw new Error(e.message || 'Verification failed');
  }
}
