import type { ToolManifest } from '@security-studio/types';

export const manifest: ToolManifest = {
  id: 'cert-viewer',
  name: 'Certificate Viewer',
  description: 'Parse and inspect X.509 certificates to view issuer, subject, validity dates, and SANs.',
  category: 'cryptography',
  tags: ['certificate', 'x509', 'ssl', 'tls', 'pem', 'parse', 'crypto'],
  keywords: ['certificate', 'x509', 'ssl', 'tls', 'pem', 'viewer', 'decoder'],
  version: '1.0.0',
  author: 'Security Studio',
  icon: 'BadgeCheck',
  shortcuts: [
    { label: 'Parse', keys: 'Ctrl+Enter', action: 'parse' },
  ],
  examples: [
    {
      label: 'Sample Certificate',
      input: { cert: '-----BEGIN CERTIFICATE-----\nMIIDzTCCArWgAwIBAgIQCX8Z9yUAAAEAAAAAAAB/mTANBgkqhkiG9w0BAQsFADBh\nMQswCQYDVQQGEwJVUzEVMBMGA1UEChMMRGlnaUNlcnQgSW5jMRkwFwYDVQQLExB3\nd3cuZGlnaWNlcnQuY29tMSAwHgYDVQQDExdEaWdpQ2VydCBHbG9iYWwgUm9vdCBD\nQTAeFw0wNjExMTAwMDAwMDBaFw0zMTExMTAwMDAwMDBaMGExCzAJBgNVBAYTAlVT\nMRUwEwYDVQQKEwxEaWdpQ2VydCBJbmMxGTAXBgNVBAsTEHd3dy5kaWdpY2VydC5j\nb20xIDAeBgNVBAMTF0RpZ2lDZXJ0IEdsb2JhbCBSb290IENBMIIBIjANBgkqhkiG\n9w0BAQEFAAOCAQ8AMIIBCgKCAQEA4jvhEXLeqKTTo1eqUKKPC3eQyaKl7hLOllsB\nCSDMAZOnTjC3U/dDxGkAV53ijSLdhwZAAIEJzs4Bg7/FZvFdJqZbbQzZ0yZ0yZ0y\nZ0yZ0yZ0yZ0yZ0yZ0yZ0yZ0yZ0yZ0yZ0yZ0yZ0yZ0yZ0yZ0yZ0yZ0yZ0yZ0yZ0yZ\n0yZ0yZ0yZ0yZ0yZ0yZ0yZ0yZ0yZ0yZ0yZ0yZ0yZ0yZ0yZ0yZ0yZ0yZ0yZ0yZ0yZ0\nyZ0yZ0yZ0yZ0yZ0yZ0yZ0yZ0yZ0yZ0yZ0yZ0yZ0yZ0yZ0yZ0yZ0yZ0yZ0yZ0yZ0y\nZ0yZ0yZ0yZ0yZ0yZ0yZ0yZ0yZ0yZ0yZ0yZ0yZ0yZ0yZ0yZ0yZwIDAQABo2MwYTAO\nBgNVHQ8BAf8EBAMCAYYwDwYDVR0TAQH/BAUwAwEB/zAdBgNVHQ4EFgQUA+1n5q1O\nm2W1MhYk2C1Xk8Zk8YwwHwYDVR0jBBgwFoAUA+1n5q1Om2W1MhYk2C1Xk8Zk8Yww\nDQYJKoZIhvcNAQELBQADggEBAO3m3aG9/7/7/7/7/7/7/7/7/7/7/7/7/7/7/7/7\n/7/7/7/7/7/7/7/7/7/7/7/7/7/7/7/7/7/7/7/7/7/7/7/7/7/7/7/7/7/7/7/7\n/7/7/7/7/7/7/7/7/7/7/7/7/7/7/7/7/7/7/7/7/7/7/7/7/7/7/7/7/7/7/7/7\n/7/7/7/7/7/7/7/7/7/7/7/7/7/7/7/7/7/7/7/7/7/7/7/7/7/7/7/7/7/7/7/7\n/7/7/7/7/7/7/7/7/7/7/7/7/7/7/7/7/7/7/7/7/7/7/7/7\n-----END CERTIFICATE-----' },
      description: 'Parse a sample Base64 PEM encoded X.509 Certificate'
    }
  ]
};
