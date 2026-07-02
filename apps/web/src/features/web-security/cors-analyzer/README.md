# CORS Analyzer

## Overview

Analyze Cross-Origin Resource Sharing (CORS) HTTP headers to identify misconfigurations that could expose web applications to data theft or Cross-Site Request Forgery (CSRF).

## Features

- Extracts all `Access-Control-Allow-*` headers from raw HTTP response dumps.
- Identifies critical misconfigurations, such as combining `Origin: *` with `Credentials: true` (which is technically invalid in modern browsers, but points to a severely flawed security posture).
- Warns about overly permissive methods (`*`) and headers (`*`).
- Warns about the dangerous use of `Origin: null`.

## How it Works

The tool statically parses the headers block, extracts the CORS directives, and runs them through a heuristic engine that checks against known bad combinations.

## Examples

If you analyze the following headers:
```text
HTTP/1.1 200 OK
Access-Control-Allow-Origin: *
Access-Control-Allow-Credentials: true
```
The tool will immediately flag this as a **High Severity** misconfiguration because allowing any origin to make authenticated requests is a massive security risk.

## Limitations

- The tool operates statically on the provided headers. It cannot determine if the backend dynamically reflects the `Origin` header (which is another common misconfiguration).
- It does not actively send HTTP requests to test a live endpoint.

## References

- [CORS (MDN)](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [PortSwigger - CORS Vulnerabilities](https://portswigger.net/web-security/cors)
