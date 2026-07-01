export interface HeaderCheck {
  name: string;
  present: boolean;
  value: string | null;
  status: 'pass' | 'warn' | 'fail';
  description: string;
  recommendation: string;
}

export interface AnalysisResult {
  grade: string;
  score: number;
  checks: HeaderCheck[];
}

const HEADER_CHECKS: { name: string; description: string; recommendation: string; validate: (value: string | null) => 'pass' | 'warn' | 'fail' }[] = [
  {
    name: 'Strict-Transport-Security',
    description: 'Enforces HTTPS connections',
    recommendation: 'Add: Strict-Transport-Security: max-age=31536000; includeSubDomains; preload',
    validate: (v) => {
      if (!v) return 'fail';
      const maxAge = v.match(/max-age=(\d+)/);
      if (!maxAge) return 'warn';
      return Number(maxAge[1]) >= 31536000 ? 'pass' : 'warn';
    },
  },
  {
    name: 'Content-Security-Policy',
    description: 'Prevents XSS, clickjacking, and injection attacks',
    recommendation: "Add: Content-Security-Policy: default-src 'self'",
    validate: (v) => v ? 'pass' : 'fail',
  },
  {
    name: 'X-Content-Type-Options',
    description: 'Prevents MIME-type sniffing',
    recommendation: 'Add: X-Content-Type-Options: nosniff',
    validate: (v) => v?.toLowerCase() === 'nosniff' ? 'pass' : v ? 'warn' : 'fail',
  },
  {
    name: 'X-Frame-Options',
    description: 'Prevents clickjacking attacks',
    recommendation: 'Add: X-Frame-Options: DENY or SAMEORIGIN',
    validate: (v) => {
      if (!v) return 'fail';
      return ['deny', 'sameorigin'].includes(v.toLowerCase()) ? 'pass' : 'warn';
    },
  },
  {
    name: 'X-XSS-Protection',
    description: 'Legacy XSS filter (deprecated but still useful)',
    recommendation: 'Add: X-XSS-Protection: 0 (if CSP is set) or 1; mode=block',
    validate: (v) => v ? 'pass' : 'warn',
  },
  {
    name: 'Referrer-Policy',
    description: 'Controls how much referrer information is sent',
    recommendation: 'Add: Referrer-Policy: strict-origin-when-cross-origin',
    validate: (v) => v ? 'pass' : 'warn',
  },
  {
    name: 'Permissions-Policy',
    description: 'Controls browser feature permissions',
    recommendation: 'Add: Permissions-Policy: camera=(), microphone=(), geolocation=()',
    validate: (v) => v ? 'pass' : 'warn',
  },
];

export function analyzeHeaders(rawHeaders: string): AnalysisResult {
  const headerMap = new Map<string, string>();
  rawHeaders.split('\n').forEach((line) => {
    const colonIndex = line.indexOf(':');
    if (colonIndex > 0) {
      const key = line.slice(0, colonIndex).trim().toLowerCase();
      const value = line.slice(colonIndex + 1).trim();
      headerMap.set(key, value);
    }
  });

  const checks: HeaderCheck[] = HEADER_CHECKS.map((check) => {
    const value = headerMap.get(check.name.toLowerCase()) ?? null;
    const status = check.validate(value);
    return {
      name: check.name,
      present: value !== null,
      value,
      status,
      description: check.description,
      recommendation: check.recommendation,
    };
  });

  const passCount = checks.filter((c) => c.status === 'pass').length;
  const total = checks.length;
  const score = Math.round((passCount / total) * 100);

  let grade: string;
  if (score >= 90) grade = 'A';
  else if (score >= 75) grade = 'B';
  else if (score >= 60) grade = 'C';
  else if (score >= 40) grade = 'D';
  else grade = 'F';

  return { grade, score, checks };
}
