export interface CookieData {
  raw: string;
  name: string;
  value: string;
  domain?: string;
  path?: string;
  expires?: string;
  maxAge?: string;
  secure: boolean;
  httpOnly: boolean;
  sameSite?: string;
  warnings: string[];
}

export function parseCookies(input: string): CookieData[] {
  if (!input.trim()) return [];

  const lines = input.split(/\r?\n/).filter(line => line.trim());
  
  return lines.map(line => {
    const cookieString = line.replace(/^Set-Cookie:\s*/i, '').trim();
    const parts = cookieString.split(';').map(p => p.trim());
    
    // First part is always name=value
    const [nameVal, ...attrs] = parts;
    const eqIdx = nameVal ? nameVal.indexOf('=') : -1;
    let name = nameVal || '';
    let value = '';
    if (eqIdx !== -1 && nameVal) {
      name = nameVal.substring(0, eqIdx);
      value = nameVal.substring(eqIdx + 1);
    }

    const data: CookieData = {
      raw: line,
      name,
      value,
      secure: false,
      httpOnly: false,
      warnings: []
    };

    attrs.forEach(attr => {
      const lower = attr.toLowerCase();
      if (lower === 'secure') data.secure = true;
      else if (lower === 'httponly') data.httpOnly = true;
      else if (lower.startsWith('domain=')) data.domain = attr.substring(7);
      else if (lower.startsWith('path=')) data.path = attr.substring(5);
      else if (lower.startsWith('expires=')) data.expires = attr.substring(8);
      else if (lower.startsWith('max-age=')) data.maxAge = attr.substring(8);
      else if (lower.startsWith('samesite=')) data.sameSite = attr.substring(9);
    });

    // Security Analysis
    if (!data.secure) data.warnings.push("Missing 'Secure' flag. Cookie can be transmitted over plain HTTP.");
    if (!data.httpOnly) data.warnings.push("Missing 'HttpOnly' flag. Cookie is accessible to JavaScript (XSS risk).");
    if (!data.sameSite || data.sameSite.toLowerCase() === 'none') {
      if (!data.secure) {
        data.warnings.push("'SameSite=None' requires the 'Secure' flag to be accepted by modern browsers.");
      }
      data.warnings.push("Lacks 'SameSite=Lax' or 'Strict'. May be vulnerable to CSRF.");
    }
    
    return data;
  });
}
