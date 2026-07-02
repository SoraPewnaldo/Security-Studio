# HTTP Header Diff

## Overview

Compare two sets of HTTP headers to identify additions, removals, and modifications. Useful for validating Web Application Firewall (WAF) configurations, API gateway changes, or checking if security headers were properly applied after a deployment.

## Features

- **Order Independent**: Automatically sorts headers alphabetically before diffing so that reordering doesn't show up as a massive diff block.
- **Case Insensitive Keys**: Normalizes header keys to lowercase for accurate comparison (e.g., `Content-Type` vs `content-type` are treated as identical keys, though values are case-sensitive).
- **Status Line Preservation**: Keeps `HTTP/1.1 200 OK` or `GET / HTTP/2` lines at the top of the comparison.

## How it Works

The tool parses the raw text into individual lines, identifies the key-value pairs separated by colons (`:`), lowercases the keys, and sorts them alphabetically (except for status lines which are pinned to the top). It then uses a line-based diffing algorithm to compute the delta between the two normalized sets.

## Examples

If you upgrade an API and want to ensure no caching headers were accidentally dropped:
1. Paste the old `curl -I` output in the left panel.
2. Paste the new `curl -I` output in the right panel.
3. Red lines immediately indicate headers that are missing in the new version.

## Limitations

- Does not semantically compare complex multi-value headers (e.g., it compares `Cache-Control: no-cache, no-store` as a single string, rather than parsing the directives).
- Duplicate headers with the exact same key are preserved but might be sorted unpredictably relative to each other.

## References

- [HTTP Headers (MDN)](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers)
- [diff npm package](https://www.npmjs.com/package/diff)
