# SAML Decoder

## Overview

A robust tool to decode and inspect Security Assertion Markup Language (SAML) requests and responses. It handles various encoding bindings used in enterprise Single Sign-On (SSO) flows.

## Features

- URL Decoding (for `HTTP-Redirect` binding)
- Base64 Decoding (for both `HTTP-Redirect` and `HTTP-POST` bindings)
- Deflate Decompression (automatically detects and inflates compressed SAML payload)
- XML Formatting (Prettifies the final XML output for readability)

## How it Works

1. The tool first checks if the input is URL encoded (e.g., contains `%2B` instead of `+`) and decodes it.
2. It then performs a standard Base64 decode.
3. It uses the browser's native `DecompressionStream('deflate-raw')` to attempt to inflate the payload. If inflation fails (which happens if the payload was never compressed, such as in standard `HTTP-POST` bindings), it falls back to parsing the raw Base64-decoded bytes.
4. Finally, the XML is passed through a DOM parser to pretty-print the structure.

## Examples

| Flow | Encodings Applied | Output |
|------|-------------------|--------|
| HTTP-POST | Base64 | Formatted `<samlp:Response>` |
| HTTP-Redirect | URL + Base64 + Deflate | Formatted `<samlp:AuthnRequest>` |

## Limitations

- This tool only decodes. It does not verify XML Signatures or decrypt encrypted assertions.
- Depends on the browser's native `DecompressionStream` API for deflating.

## References

- [SAML V2.0 Core Specification](http://docs.oasis-open.org/security/saml/v2.0/saml-core-2.0-os.pdf)
- [SAML V2.0 Bindings](http://docs.oasis-open.org/security/saml/v2.0/saml-bindings-2.0-os.pdf)
