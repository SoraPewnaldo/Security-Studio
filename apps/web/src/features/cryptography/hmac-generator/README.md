## Overview
The HMAC Generator tool allows you to compute Hash-based Message Authentication Codes (HMAC) for any text using various hash algorithms and a secret key.

## Features
- Supports popular hash algorithms: SHA-1, SHA-256, SHA-384, and SHA-512.
- Outputs generated HMAC in Hexadecimal or Base64 encoding.
- Fast, secure, and purely client-side computation.

## How it Works
HMAC combines a cryptographic hash function with a secret cryptographic key. It is used to verify both the data integrity and the authentication of a message. The tool uses the Web Crypto API's `crypto.subtle.sign` method with the imported secret key and text.

## Examples
1. **Simple SHA-256**: Generates a standard SHA-256 HMAC for a simple string with a secret key.
2. **Base64 Output**: Demonstrates how generating an HMAC with Base64 encoding produces a different string representation.
3. **Invalid (Empty Secret)**: Shows the error when generating an HMAC without providing a secret key.

## Limitations
- Output relies on browser/environment support for Web Crypto API.
- Currently processes text inputs only (does not support arbitrary file hashing).

## References
- [Web Crypto API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)
- [RFC 2104 - HMAC](https://datatracker.ietf.org/doc/html/rfc2104)
