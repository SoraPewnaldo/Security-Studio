# RSA Key Generator

## Overview

Generates RSA cryptographic key pairs entirely in the browser using the Web Crypto API. The generated keys never leave your machine, ensuring complete privacy.

## Features

- Generates 1024, 2048, or 4096-bit key sizes.
- Exports keys into standard PEM formatted strings (`-----BEGIN PRIVATE KEY-----`).
- High performance native browser generation.

## How it Works

The tool utilizes `window.crypto.subtle.generateKey` specifying the `RSASSA-PKCS1-v1_5` algorithm and a standard public exponent of `65537`. After generation, it exports the public key as `spki` and the private key as `pkcs8`. Finally, it Base64 encodes these raw binary formats and wraps them with standard PEM headers.

## Security Considerations

- **2048-bit** is considered the current industry standard for typical applications.
- **4096-bit** provides an exceptionally high security margin but takes longer to generate and results in slower cryptographic operations.
- **1024-bit** is considered weak and should only be used for testing, backwards compatibility with legacy systems, or educational purposes.

## References

- [RSA (cryptosystem) on Wikipedia](https://en.wikipedia.org/wiki/RSA_(cryptosystem))
- [Web Crypto API (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/generateKey)
