# Session Cookie Analyzer

## Overview

Inspects HTTP `Set-Cookie` headers or raw cookie strings to parse their attributes (Domain, Path, Max-Age, Expires, Secure, HttpOnly, SameSite) and analyzes them for common security misconfigurations.

## Features

- Parses one or multiple cookie strings simultaneously
- Extracts and formats all standard cookie attributes
- Automatically highlights security risks (missing `Secure`, missing `HttpOnly`, weak `SameSite` policies)
- Handles both `Set-Cookie: ...` headers and raw strings

## How it Works

The tool splits the input into individual lines. For each line, it strips the optional `Set-Cookie:` prefix and splits by semicolons (`;`). It extracts the first segment as the `name=value` pair and loops over the remaining segments to identify standard attributes like `Secure`, `HttpOnly`, `Domain`, `Path`, etc.

It then runs a small heuristic engine to flag:
- Absence of `Secure` (risk of transmission over HTTP)
- Absence of `HttpOnly` (risk of XSS stealing the cookie)
- Missing or weak `SameSite` settings (risk of CSRF)

## Examples

| Input | Warnings |
|-------|----------|
| `session=123; Secure; HttpOnly; SameSite=Strict` | None |
| `session=123; HttpOnly` | Missing Secure, Missing SameSite |
| `session=123; SameSite=None` | SameSite=None requires Secure |

## Limitations

- Security analysis assumes the cookie is meant to be a sensitive session identifier. For non-sensitive tracking or preference cookies, these warnings might be false positives.
- Does not validate date formats in the `Expires` attribute.

## References

- [HTTP Cookies (MDN)](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies)
- [SameSite cookies (web.dev)](https://web.dev/samesite-cookies-explained/)
- [RFC 6265 - HTTP State Management Mechanism](https://tools.ietf.org/html/rfc6265)
