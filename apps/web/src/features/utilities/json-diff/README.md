# JSON Diff

## Overview

Compare two JSON documents side-by-side and view a line-by-line diff highlighting what was added, removed, or unchanged. Perfect for tracking configuration changes, API response changes, or debugging data mutations.

## Features

- Side-by-side input for original and modified JSON
- Color-coded diff output: green for additions, red for removals
- Both inputs are auto-formatted before diffing for clean comparison
- Handles JSON parse errors per-side with clear messages
- Copy the diff output to clipboard

## How it Works

Both JSON inputs are parsed and re-serialized with `JSON.stringify(…, null, 2)` to normalize formatting. The normalized strings are then compared using the `diff` library's `diffLines` function, which produces a list of changes with `added` and `removed` flags.

## Examples

**Simple version bump**:
- Original: `{ "version": "1.0.0" }`
- Modified: `{ "version": "1.0.1" }`
- Result: one red line (old version), one green line (new version)

**Nested structural changes**: Removing a key and adding a new one shows the exact paths affected.

**Invalid JSON**: If either side is invalid JSON, a parse error message is shown for that specific side.

## Limitations

- Very large JSON files may be slow to diff in the browser
- The diff is line-based, not key-based — reordering keys shows as a full change even if values are the same
- Does not show a recursive semantic diff (only string-level diff)

## References

- [diff npm package](https://www.npmjs.com/package/diff)
- [JSON specification (RFC 7159)](https://tools.ietf.org/html/rfc7159)
