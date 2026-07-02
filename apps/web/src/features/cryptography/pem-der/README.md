# PEM/DER Converter

## Overview

Convert X.509 Certificates and RSA/ECC Cryptographic Keys between PEM and DER formats.

## Features

- **PEM to DER**: Extracts the Base64 payload between the `-----BEGIN...-----` and `-----END...-----` headers and decodes it to a hexadecimal representation of the raw DER binary format.
- **DER to PEM**: Takes a raw hexadecimal string (which represents DER binary data), converts it to Base64, formats it to 64-character lines, and wraps it in specified PEM headers.

## How it Works

**PEM (Privacy-Enhanced Mail)** is simply a Base64 encoded string of the DER-encoded binary data, wrapped in ASCII headers indicating the type of data (e.g. `CERTIFICATE` or `PUBLIC KEY`).

**DER (Distinguished Encoding Rules)** is a binary format. To make it human-readable in this tool, the DER output is displayed as a spaced hexadecimal string (e.g. `30 82 01 0A...`).

## Examples

If you have a PEM certificate:
```text
-----BEGIN CERTIFICATE-----
MIIDdTCCAl2gAwIBAgILBAAAAAABRE7wQQAwDQYJKoZIhvcNAQELBQAwVzELMAkG
...
-----END CERTIFICATE-----
```
Converting it to DER will give you the raw hex bytes:
`30 82 03 75 30 82 02 5D A0 03 02 01 02 ...`

## Limitations

- The tool does not parse the ASN.1 structure of the DER payload. It performs strict format conversion.
- For DER input, the tool expects a hexadecimal string representation of the binary data (spaces are optional and ignored).

## References

- [X.509 on Wikipedia](https://en.wikipedia.org/wiki/X.509)
- [Privacy-Enhanced Mail (PEM) on Wikipedia](https://en.wikipedia.org/wiki/Privacy-Enhanced_Mail)
