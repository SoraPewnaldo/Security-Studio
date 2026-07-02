import type { Playbook } from '@security-studio/types';

// ============================================================
// Security Playbook Registry
// All built-in guided playbooks are defined here.
// ============================================================

export const PLAYBOOKS: Playbook[] = [
  // ----------------------------------------------------------
  // 1. Domain Investigation
  // ----------------------------------------------------------
  {
    id: 'domain-investigation',
    name: 'Domain Investigation',
    icon: '🌐',
    description: 'Perform a full authoritative investigation of any domain — registration records, DNS, ASN, and TLS certificate audit.',
    category: 'recon',
    difficulty: 'beginner',
    estimatedMinutes: 5,
    tags: ['domain', 'whois', 'dns', 'recon', 'osint'],
    steps: [
      {
        id: 'whois',
        title: 'WHOIS Lookup',
        toolId: 'whois-lookup',
        purpose: 'Retrieve the authoritative registration record for the domain from IANA registrar databases to identify its owner, registrar, and registration age.',
        suspiciousIndicators: [
          'Domain registered less than 30 days ago',
          'Registrar known for abuse (e.g. Namecheap, GoDaddy abuse cases)',
          'Privacy-masked WHOIS contacts (common in phishing infrastructure)',
          'Registrant country does not match expected organisation',
        ],
        estimatedSeconds: 15,
      },
      {
        id: 'dns',
        title: 'DNS Resolution',
        toolId: 'dns-lookup',
        purpose: 'Resolve all DNS zone records for this domain to understand its email infrastructure, hosting, and CDN configuration.',
        suspiciousIndicators: [
          'No MX records — possible phishing domain with no legitimate email',
          'No SPF/DMARC TXT records — email spoofing risk',
          'Multiple A records across different ASNs — possible fast-flux hosting',
          'Wildcard DNS entries (*) — could indicate bulletproof hosting',
        ],
        inputMapping: { domain: 'domain' },
        estimatedSeconds: 10,
      },
      {
        id: 'asn',
        title: 'ASN Lookup',
        toolId: 'asn-lookup',
        purpose: 'Identify the Autonomous System (AS) and hosting provider behind the domain\'s IP address to assess infrastructure reputation.',
        suspiciousIndicators: [
          'Hosted on residential ISP (not a datacenter) — possible C2 or VPS abuse',
          'Hosting provider known for bulletproof hosting (e.g. M247, Frantech, Serverius)',
          'AS is flagged in threat intelligence databases',
          'IP is in a Tor exit node range',
        ],
        inputMapping: { asn: 'asn' },
        estimatedSeconds: 10,
      },
      {
        id: 'certificate',
        title: 'TLS Certificate Viewer',
        toolId: 'cert-viewer',
        purpose: 'Parse the TLS certificate for the domain to verify its validity, issuer trust chain, and whether it covers expected hostnames.',
        suspiciousIndicators: [
          'Self-signed certificate — not trusted by browsers',
          'Let\'s Encrypt certificate on a suspicious domain — free and unverified',
          'Certificate expiry within 7 days',
          'Wildcard certificate (*.example.com) shared across many subdomains',
          'CN does not match the domain being investigated',
        ],
        estimatedSeconds: 15,
      },
    ],
  },

  // ----------------------------------------------------------
  // 2. JWT Security Audit
  // ----------------------------------------------------------
  {
    id: 'jwt-security-audit',
    name: 'JWT Security Audit',
    icon: '🔐',
    description: 'Inspect, verify, and audit a JWT token for algorithm weaknesses, expiry issues, and claim anomalies.',
    category: 'authentication',
    difficulty: 'intermediate',
    estimatedMinutes: 3,
    tags: ['jwt', 'auth', 'token', 'signature', 'claims'],
    steps: [
      {
        id: 'decode',
        title: 'Decode Token',
        toolId: 'jwt-inspector',
        purpose: 'Decode the JWT header and payload to inspect all claims without verifying the signature. This step reveals the algorithm used and the token\'s metadata.',
        suspiciousIndicators: [
          'Algorithm is "none" — no signature verification, trivially forgeable',
          'Algorithm is "HS256" with a weak or guessable secret',
          '"alg" in header is "RS256" but public key is not pinned',
          'Claims contain sensitive PII that should not be in a JWT',
          'Audience ("aud") claim is missing or overly broad',
        ],
        estimatedSeconds: 30,
      },
      {
        id: 'verify',
        title: 'Verify Signature',
        toolId: 'jwt-verifier',
        purpose: 'Verify the token\'s cryptographic signature against a known secret or public key to ensure it has not been tampered with.',
        suspiciousIndicators: [
          'Signature verification fails — token is forged or tampered',
          'Using symmetric key (HS256) shared across services — key leak = all tokens compromised',
          'Public key from JWT header "jku"/"x5u" claim — SSRF or JKU injection risk',
        ],
        estimatedSeconds: 30,
      },
    ],
  },

  // ----------------------------------------------------------
  // 3. Session Cookie Security Review
  // ----------------------------------------------------------
  {
    id: 'cookie-security-review',
    name: 'Session Cookie Review',
    icon: '🍪',
    description: 'Analyze session cookies for missing security flags, insecure expiry settings, and misconfigured SameSite policies.',
    category: 'web-security',
    difficulty: 'beginner',
    estimatedMinutes: 2,
    tags: ['cookie', 'session', 'csrf', 'httponly', 'secure', 'samesite'],
    steps: [
      {
        id: 'analyze-cookies',
        title: 'Cookie Security Analyzer',
        toolId: 'session-cookie',
        purpose: 'Parse the raw Set-Cookie header and audit each flag for security compliance. Missing flags are the most common source of session hijacking and CSRF vulnerabilities.',
        suspiciousIndicators: [
          'Missing Secure flag — cookie transmitted over HTTP (cleartext)',
          'Missing HttpOnly flag — cookie accessible to JavaScript (XSS risk)',
          'SameSite=None without Secure — cross-site request forgery risk',
          'Missing SameSite altogether — defaults to Lax in modern browsers, but unreliable in older ones',
          'Session cookie without Expires/Max-Age — persists until browser close, risky on shared machines',
          'Domain attribute too broad (e.g. .example.com) — shared across all subdomains',
        ],
        estimatedSeconds: 45,
      },
    ],
  },

  // ----------------------------------------------------------
  // 4. Web Application Recon
  // ----------------------------------------------------------
  {
    id: 'web-app-recon',
    name: 'Web Application Recon',
    icon: '🐞',
    description: 'Rapid bug bounty pre-assessment: domain ownership, DNS, security headers, and certificate audit in one guided workflow.',
    category: 'recon',
    difficulty: 'intermediate',
    estimatedMinutes: 8,
    tags: ['recon', 'bug-bounty', 'headers', 'csp', 'hsts', 'pentest'],
    steps: [
      {
        id: 'whois-recon',
        title: 'WHOIS Lookup',
        toolId: 'whois-lookup',
        purpose: 'Verify domain ownership and confirm the target is in scope. Newly registered domains or privacy-protected registrations can indicate malicious infrastructure.',
        suspiciousIndicators: [
          'Domain is less than 90 days old',
          'Registrant email does not match expected organisation',
        ],
        estimatedSeconds: 15,
      },
      {
        id: 'dns-recon',
        title: 'DNS Records',
        toolId: 'dns-lookup',
        purpose: 'Map out the full DNS footprint. MX, TXT (SPF/DMARC), and A records reveal the email setup and hosting providers.',
        suspiciousIndicators: [
          'Missing DMARC/SPF — possible email spoofing attack surface',
          'Multiple A records or CNAME chains — CDN configuration issues',
        ],
        inputMapping: { domain: 'domain' },
        estimatedSeconds: 10,
      },
      {
        id: 'headers-recon',
        title: 'Security Header Audit',
        toolId: 'security-headers',
        purpose: 'Analyze the HTTP response headers for missing security directives. HSTS, CSP, and X-Frame-Options are commonly absent on misconfigured servers.',
        suspiciousIndicators: [
          'No HSTS header — site vulnerable to SSL stripping attacks',
          'No CSP header — content injection risk',
          'X-Frame-Options missing — clickjacking attack surface',
          'Server header leaks version info (e.g. Apache/2.4.51)',
        ],
        estimatedSeconds: 20,
      },
      {
        id: 'cert-recon',
        title: 'TLS Certificate',
        toolId: 'cert-viewer',
        purpose: 'Inspect the TLS certificate to confirm validity and check for wildcard scopes that might indicate a broader attack surface.',
        suspiciousIndicators: [
          'Certificate issued to unexpected organisation',
          'Wildcard cert (*) — broad attack surface',
          'Certificate expires soon',
        ],
        estimatedSeconds: 10,
      },
    ],
  },
];

export function getPlaybookById(id: string): Playbook | undefined {
  return PLAYBOOKS.find((p) => p.id === id);
}

export function getPlaybooksByCategory(category: string): Playbook[] {
  return PLAYBOOKS.filter((p) => p.category === category);
}
