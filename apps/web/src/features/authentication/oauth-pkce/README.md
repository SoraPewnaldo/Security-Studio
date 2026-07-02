# OAuth PKCE Generator

## Overview
The OAuth PKCE Generator creates the necessary Code Verifier and Code Challenge required for the Proof Key for Code Exchange (PKCE) flow in OAuth 2.0. PKCE enhances security by mitigating authorization code interception attacks, especially in mobile, native, and single-page applications.

## Features
- **Code Verifier Generation:** Generates a random cryptographic string of customizable length (43-128 characters) following RFC 7636.
- **Code Challenge Generation:** Calculates the Base64URL encoded SHA-256 hash (S256) of the Code Verifier.
- **Custom Verifiers:** Allows manual entry of a Code Verifier to instantly compute its corresponding Code Challenge.
- **One-Click Copy:** Easily copy both the verifier and challenge to your clipboard.

## How it Works
1. Select the desired length for the Code Verifier (between 43 and 128 characters) and click **Generate**, or manually enter your own Code Verifier.
2. The tool securely generates a cryptographically random sequence of characters from the allowed charset `[A-Z] / [a-z] / [0-9] / - / . / _ / ~`.
3. It performs a SHA-256 hash of the generated or provided Code Verifier.
4. Finally, the hash is encoded in a Base64URL format (stripping any padding) to yield the Code Challenge.

## Examples
- **Default Length (43):** Produces a standard 43-character verifier and its corresponding 43-character challenge.
- **Max Length (128):** Generates a maximum security 128-character verifier.
- **Custom Verifier:** Input `dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk` to verify its resulting challenge is `E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM`.

## Limitations
- Only supports the **S256** (SHA-256) transformation method, as the `plain` method is widely discouraged for security reasons.

## References
- [RFC 7636: Proof Key for Code Exchange by OAuth Public Clients](https://datatracker.ietf.org/doc/html/rfc7636)
- [OAuth 2.0 Security Best Current Practice](https://datatracker.ietf.org/doc/html/draft-ietf-oauth-security-topics)
