# JWT Signature Verifier

## Overview

A client-side tool to cryptographically verify JSON Web Tokens (JWT). Unlike the JWT Inspector which only decodes the Base64 payload, this tool actually checks if the token's signature is valid for a given secret or public key.

## Features

- Supports Symmetric Algorithms: `HS256`, `HS384`, `HS512`
- Supports Asymmetric Algorithms: `RS256`, `RS384`, `RS512`, `ES256`
- Clear success/failure indications
- Displays verified header and payload

## How it Works

Powered by the `jose` library, the tool performs standard cryptographic verification using the Web Crypto API. For symmetric algorithms (HMAC), the provided string is encoded to a Uint8Array. For asymmetric algorithms, the provided PEM certificate is imported as an SPKI key object before verification.

## Examples

| Alg | Key Type | Input |
|-----|----------|-------|
| HS256 | Secret String | `my-secret-key` |
| RS256 | Public Key | `-----BEGIN PUBLIC KEY-----...` |

## Limitations

- Only verifies the signature. It does not validate `exp`, `nbf`, `iss`, or `aud` claims automatically in the UI output (though `jose` does validate standard date claims by default).
- For asymmetric keys, only standard PEM formats (SPKI/PKCS8) are currently supported.

## References

- [JWT.io](https://jwt.io/)
- [RFC 7519 - JSON Web Token (JWT)](https://datatracker.ietf.org/doc/html/rfc7519)
- [jose npm package](https://github.com/panva/jose)
