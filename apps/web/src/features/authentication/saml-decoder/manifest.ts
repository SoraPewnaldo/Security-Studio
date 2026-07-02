import type { ToolManifest } from '@security-studio/types';

export const manifest: ToolManifest = {
  id: 'saml-decoder',
  name: 'SAML Decoder',
  description: 'Decode Base64 and URL-encoded SAML requests and responses',
  category: 'authentication',
  tags: ['saml', 'sso', 'decode', 'xml', 'auth'],
  keywords: ['saml', 'sso', 'decode', 'samlrequest', 'samlresponse'],
  version: '1.0.0',
  author: 'Security Studio',
  icon: 'FileKey',
  shortcuts: [
    { label: 'Decode', keys: 'Ctrl+Enter', action: 'decode' },
  ],
  examples: [
    {
      label: 'Simple Base64 SAML',
      input: { saml: 'PHNhbWxwOkF1dGhuUmVxdWVzdCB4bWxuczpzYW1scD0idXJuOm9hc2lzOm5hbWVzOnRjOlNBTUw6Mi4wOnByb3RvY29sIiB4bWxuczpzYW1sPSJ1cm46b2FzaXM6bmFtZXM6dGM6U0FNTDoyLjA6YXNzZXJ0aW9uIiBJRD0iX2FiYzEyMyIgVmVyc2lvbj0iMi4wIiBJc3N1ZUluc3RhbnQ9IjIwMjMtMDEtMDFUMDA6MDA6MDBaIj48c2FtbDpJc3N1ZXI+aHR0cHM6Ly9zcC5leGFtcGxlLmNvbTwvc2FtbDpJc3N1ZXI+PC9zYW1scDpBdXRoblJlcXVlc3Q+' },
      description: 'Decode a standard Base64-encoded SAML XML snippet'
    },
    {
      label: 'URL Encoded SAML',
      input: { saml: 'PHNhbWxwOkF1dGhuUmVxdWVzdCB4bWxuczpzYW1scD0idXJuOm9hc2lzOm5hbWVzOnRjOlNBTUw6Mi4wOnByb3RvY29sIiB4bWxuczpzYW1sPSJ1cm46b2FzaXM6bmFtZXM6dGM6U0FNTDoyLjA6YXNzZXJ0aW9uIiBJRD0iX2FiYzEyMyIgVmVyc2lvbj0iMi4wIiBJc3N1ZUluc3RhbnQ9IjIwMjMtMDEtMDFUMDA6MDA6MDBaIj48c2FtbDpJc3N1ZXI%2BaHR0cHM6Ly9zcC5leGFtcGxlLmNvbTwvc2FtbDpJc3N1ZXI%2BPC9zYW1scDpBdXRoblJlcXVlc3Q%2B' },
      description: 'Decode a URL-encoded Base64 string'
    }
  ]
};
