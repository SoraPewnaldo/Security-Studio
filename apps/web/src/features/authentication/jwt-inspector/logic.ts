export interface JwtDecoded {
  header: Record<string, unknown>;
  payload: Record<string, unknown>;
  signature: string;
  isExpired: boolean | null;
  expiresAt: string | null;
  issuedAt: string | null;
  algorithm: string;
  claims: ClaimInfo[];
}

export interface ClaimInfo {
  key: string;
  value: unknown;
  label: string;
  description: string;
}

const CLAIM_LABELS: Record<string, { label: string; description: string }> = {
  iss: { label: 'Issuer', description: 'Who issued this token' },
  sub: { label: 'Subject', description: 'Who this token is about' },
  aud: { label: 'Audience', description: 'Who this token is intended for' },
  exp: { label: 'Expiration', description: 'When this token expires' },
  nbf: { label: 'Not Before', description: 'Token is not valid before this time' },
  iat: { label: 'Issued At', description: 'When this token was issued' },
  jti: { label: 'JWT ID', description: 'Unique identifier for this token' },
};

function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) base64 += '=';
  return decodeURIComponent(
    atob(base64)
      .split('')
      .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  );
}

export function decodeJwt(token: string): JwtDecoded {
  const parts = token.trim().split('.');
  if (parts.length !== 3) {
    throw new Error('Invalid JWT: expected 3 parts separated by dots');
  }

  const header = JSON.parse(base64UrlDecode(parts[0]!)) as Record<string, unknown>;
  const payload = JSON.parse(base64UrlDecode(parts[1]!)) as Record<string, unknown>;
  const signature = parts[2]!;

  const algorithm = (header.alg as string) || 'Unknown';

  // Expiration
  const expValue = payload.exp as number | undefined;
  const iatValue = payload.iat as number | undefined;

  let isExpired: boolean | null = null;
  let expiresAt: string | null = null;

  if (expValue) {
    const expDate = new Date(expValue * 1000);
    isExpired = expDate.getTime() < Date.now();
    expiresAt = expDate.toISOString();
  }

  const issuedAt = iatValue ? new Date(iatValue * 1000).toISOString() : null;

  // Claims analysis
  const claims: ClaimInfo[] = Object.entries(payload).map(([key, value]) => {
    const meta = CLAIM_LABELS[key];
    let displayValue = value;
    if ((key === 'exp' || key === 'iat' || key === 'nbf') && typeof value === 'number') {
      displayValue = new Date(value * 1000).toLocaleString();
    }
    return {
      key,
      value: displayValue,
      label: meta?.label || key,
      description: meta?.description || 'Custom claim',
    };
  });

  return { header, payload, signature, isExpired, expiresAt, issuedAt, algorithm, claims };
}
