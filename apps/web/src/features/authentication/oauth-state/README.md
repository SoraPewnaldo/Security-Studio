# OAuth State Generator

## Overview

Generates secure random `state` parameters for OAuth 2.0 flows. The `state` parameter is used to prevent Cross-Site Request Forgery (CSRF) attacks by ensuring that the authorization response matches the original request.

## Features

- Generates cryptographically secure random values using `window.crypto.getRandomValues()`
- Configurable length (8 to 1024 characters)
- Multiple output formats: Alphanumeric, Hexadecimal, and Base64URL
- Instantly regenerates on change

## How it Works

The tool creates a `Uint8Array` of the requested length and fills it with random bytes using the Web Crypto API. Depending on the format selected:
- **Hex**: The bytes are converted directly to a hexadecimal string.
- **Base64URL**: The bytes are converted to Base64, then URL-safe characters are substituted (`+` to `-`, `/` to `_`) and padding (`=`) is removed.
- **Alphanumeric**: The bytes are used to index a fixed alphabet `[A-Za-z0-9]`.

## Examples

| Length | Format | Output (Example) |
|--------|--------|------------------|
| 32 | Alphanumeric | `r2XfB9kTvN8hQpY5wG6cM1jL4sZ7aD0v` |
| 16 | Hexadecimal | `f4a9b2c8d1e3f607a5c8d1e3f607a5c8` |
| 64 | Base64URL | `_3x8G... (64 chars)` |

## Limitations

- The tool generates purely random strings. It does not encode custom JSON payloads into the state (though this is sometimes done in practice, signed with a secret).
- Maximum length is capped at 1024 characters for performance.

## References

- [OAuth 2.0 Threat Model (RFC 6819)](https://datatracker.ietf.org/doc/html/rfc6819#section-4.4.1.8)
- [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)
