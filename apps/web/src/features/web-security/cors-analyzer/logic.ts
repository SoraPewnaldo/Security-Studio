export interface CorsAnalysis {
  origin: string | null;
  methods: string | null;
  headers: string | null;
  credentials: boolean;
  expose: string | null;
  maxAge: string | null;
  findings: Array<{ severity: 'high' | 'medium' | 'low' | 'info'; message: string }>;
}

export function analyzeCors(headersText: string): CorsAnalysis {
  const result: CorsAnalysis = {
    origin: null,
    methods: null,
    headers: null,
    credentials: false,
    expose: null,
    maxAge: null,
    findings: []
  };

  if (!headersText.trim()) return result;

  const lines = headersText.split(/\r?\n/);
  for (const line of lines) {
    const idx = line.indexOf(':');
    if (idx === -1) continue;
    const key = line.substring(0, idx).trim().toLowerCase();
    const val = line.substring(idx + 1).trim();

    if (key === 'access-control-allow-origin') result.origin = val;
    else if (key === 'access-control-allow-methods') result.methods = val;
    else if (key === 'access-control-allow-headers') result.headers = val;
    else if (key === 'access-control-allow-credentials') result.credentials = val.toLowerCase() === 'true';
    else if (key === 'access-control-expose-headers') result.expose = val;
    else if (key === 'access-control-max-age') result.maxAge = val;
  }

  // Analyze
  if (!result.origin) {
    result.findings.push({ severity: 'info', message: 'No Access-Control-Allow-Origin header found. Browsers will block cross-origin requests.' });
    return result;
  }

  if (result.origin === '*') {
    if (result.credentials) {
      result.findings.push({ severity: 'high', message: 'CRITICAL: Origin is "*" and Credentials are true. This is an invalid combination that modern browsers block, but indicates a severe misconfiguration.' });
    } else {
      result.findings.push({ severity: 'low', message: 'Origin is "*". This allows any website to read responses. Ensure this endpoint does not serve sensitive user-specific data.' });
    }
  } else if (result.origin === 'null') {
    result.findings.push({ severity: 'high', message: 'Origin is "null". This is dangerous as local files or sandboxed iframes can easily forge a "null" origin, potentially bypassing restrictions.' });
  } else {
    // Check for overly broad origins (like a regex gone wrong returning the attacker's domain)
    // We can't know for sure statically, but we can warn if they are returning a specific domain with credentials
    if (result.credentials) {
      result.findings.push({ severity: 'info', message: 'Credentials allowed for a specific origin. Ensure this origin is dynamically validated against a strict whitelist, not just echoing the request Origin.' });
    }
  }

  if (result.methods && result.methods.includes('*')) {
    result.findings.push({ severity: 'medium', message: 'Methods includes "*". This is overly permissive. Explicitly specify allowed methods (e.g., GET, POST).' });
  }

  if (result.headers && result.headers.includes('*')) {
    result.findings.push({ severity: 'medium', message: 'Headers includes "*". Explicitly specify allowed headers to minimize attack surface.' });
  }

  if (result.maxAge) {
    const age = parseInt(result.maxAge, 10);
    if (isNaN(age)) {
      result.findings.push({ severity: 'low', message: 'Max-Age is not a valid number.' });
    } else if (age > 86400) {
      result.findings.push({ severity: 'info', message: 'Max-Age is longer than 24 hours. Some browsers (like Chromium) cap this at 2 hours (7200) or 24 hours (86400).' });
    }
  }

  if (result.findings.length === 0) {
    result.findings.push({ severity: 'info', message: 'CORS configuration appears properly scoped.' });
  }

  return result;
}
